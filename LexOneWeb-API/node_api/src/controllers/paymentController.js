const Setting = require('../models/settingModel');
const Booking = require('../models/bookingModel');
const BookingDetail = require('../models/bookingdetailModel');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel');
const path = require("path");
const { I18n } = require('i18n');

/**
 * create a new instance
 */
const i18n = new I18n()

/**
 * later in code configure
 */
i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: path.join(__dirname, 'locales'),
})

// email service
const mailerController = require('./mailController');

// fcm service
const fcmService = require('../controllers/fcmController');

// notification history
const logController = require("../controllers/logController");



exports.payBooking = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id | !req.body.payment_token || !req.body.total_amount) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let appSettings = await Setting.findOne({});

            let bookingDetails = await Booking.findById(req.body.booking_id);
            let tasker = await User.findById(bookingDetails.taskerId);
            let languageType = tasker.languageType;

            console.log(bookingDetails.userId.toString());
            console.log(userDetails._id.toString());

            if (bookingDetails.userId.toString() !== userDetails._id.toString())
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });

            Booking.findByIdAndUpdate(req.body.booking_id, { status: "paid" }, function (error, result) {
                if (!error) {
                    let paymentDetails = new Payment({ bookingId: bookingDetails._id, transactionId: req.body.payment_token, description: "booking", amount: req.body.total_amount });
                    paymentDetails.save(async function (error, result) {
                        if (!error) {
                            let servicelist = await BookingDetail.find({ bookingId: bookingDetails._id }).populate("serviceId").populate("bookingId");
                            let services = [];
                            servicelist.filter(function (eachService) {
                                let ser = {};
                                ser.services = eachService.serviceId.name;
                                ser.servicePrice = eachService.price;
                                ser.serviceCount = eachService.quantity;
                                ser.serviceTotal = eachService.total;
                                services.push(ser);
                            });
                            if (userDetails.paymentEmail === "true") {
                                let mailData = {};
                                mailData.to = userDetails.email;
                                mailData.subject = res.__("Payment Mail");
                                mailData.title = res.__("Hello") + " " + userDetails.name;
                                mailData.service = services;
                                mailData.tax = bookingDetails.tax;
                                mailData.commission = bookingDetails.commission;
                                mailData.totalAmount = bookingDetails.total;
                                mailData.message = res.__("Payment has been done successfully for booking no") + " " + bookingDetails.bookingId;
                                mailerController.sendMail(mailData);
                            }
                            let txtMsg = "Payment has been completed successfully..";
                            let logMessage = res.__({ phrase: txtMsg, locale: languageType });
                            logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", txtMsg);
                            console.log(bookingDetails)
                            console.log('stringgggg',bookingDetails._id.toString());
                            paymentNotification(req.body.user_id, { "name": appSettings.siteName, "message": { "booking_id": bookingDetails._id.toString(), "message": logMessage } });

                            if (bookingDetails.taskerId) {
                                let currency = "null";
                                logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg);
                                paymentNotification(bookingDetails.taskerId, { "name": appSettings.siteName, "message": { "booking_id": bookingDetails._id.toString(), "message": logMessage } });
                            }

                            return res.status(200).json({ status_code: 200, message: res.__("Payment done successfully") });
                        }
                        else {
                            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                        }
                    });
                }
                else {
                    return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                }
            });



        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

/*
    Create Payment Intent
*/
exports.createPaymentIntent = async function (req, res) {

    if (!req.body.amount || !req.body.currency || !req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }

    let appSettings = await Setting.findOne({});
    let stripe = require('stripe')(appSettings.stripePrivateKey);

    let amount = req.body.amount;
    let currency = req.body.currency;
    let user_id = req.body.user_id;

    //Get cusotmers
    const customer = await stripe.customers.create({
        description: 'User for stripe amount',
    });

    var currency_code = req.body.currency.toUpperCase();

    if (["BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF"].indexOf(currency_code) >= 0) {
        var values = amount;
    } else {
        var values = Math.round(amount * 100);
    }

    console.log("values "+values);

    

    //Create payment intents
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: values,
            currency: currency,
            payment_method_types: ['card'],
        });

        console.log("payment intent");
        //Create ephemeralkeys
        let stripe_version = '2020-08-27';
        const ephemeralkeys = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: stripe_version }
        );

        //Response
        return res.status(200).json({
            status_code: 200,
            ephemeralkey_id: res.__(ephemeralkeys.secret),
            customer_id: res.__(customer.id),
            paymentIntent_id: res.__(paymentIntent.client_secret)
        });
    }catch(err){
        console.log(err);
        return res.status(200).json({ status_code: 400, message: res.__(err.code) });
    }

    
};

exports.payReward = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id | !req.body.payment_token || !req.body.amount) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let appSettings = await Setting.findOne({});

            let bookingDetails = await Booking.findById(req.body.booking_id);
            let tasker = await User.findById(bookingDetails.taskerId);
            let languageType = tasker.languageType;

            if (bookingDetails.userId.toString() !== userDetails._id.toString() || bookingDetails.status != "completed")
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });

            Booking.findByIdAndUpdate(req.body.booking_id, { reward: req.body.amount }, function (error, result) {
                            if (!error) {
                                let paymentDetails = new Payment({ bookingId: bookingDetails._id, transactionId: req.body.payment_token, description: "reward", amount:  req.body.amount});
                                paymentDetails.save(function (error, result) {
                                    if (!error) {
                                        let logMessage = res.__({ phrase: "Tips amount", locale: languageType }) + " " + appSettings.currencySymbol + req.body.amount + " " + res.__({ phrase: "has been received", locale: languageType });
                                        let txtMsg = "Tips amount" + " " + "has been received";
                                        let currency = appSettings.currencySymbol + req.body.amount;
                                        logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg, currency);
                                        paymentNotification(bookingDetails.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                        return res.status(200).json({ status_code: 200, message: res.__("Payment done successfully") });
                                    }
                                    else {
                                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                                    }
                                });
                            }
                            else {
                                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                            }
            });
                    
                
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.refundBooking = async function (bookingId, req, res) {
    let appSettings = await Setting.findOne({});
    let stripe = require('stripe')(appSettings.stripePrivateKey);
    let paymentDetails = await Payment.findOne({ bookingId: bookingId, description: "booking" });
    if (paymentDetails) {
        await stripe.refunds.create({ charge: paymentDetails.transactionId }, (err, charge) => {
            if (!err) {
                if (charge.status === "succeeded") {
                    paymentDetails.description = "refunded";
                    paymentDetails.save();
                    Booking.findByIdAndUpdate(paymentDetails.bookingId, { status: "refunded" }, function (error, result) { });
                }
            }
        });
        let bookingDetails = await Booking.findById(bookingId);
        let appSettings = await Setting.findOne({});
        let userDetails = await User.findOne({ _id: bookingDetails.userId, role: "user" });
        let languageType = userDetails.languageType;
        let messageText = 'Your payment has been refunded';
        let logMessage = i18n.__({ phrase: messageText, locale: languageType });
        bookingNotification(userDetails._id, { "name": appSettings.siteName, "message": { "user_id": userDetails._id, "booking_id": bookingId, "message": logMessage } });
        logController.createLog(bookingDetails.userId, userDetails._id, bookingDetails._id, "booking", messageText);

        let servicelist = await BookingDetail.find({ bookingId: bookingDetails._id }).populate("serviceId").populate("bookingId");
        let services = [];
        servicelist.filter(function (eachService) {
            let ser = {};
            ser.services = eachService.serviceId.name;
            ser.servicePrice = eachService.price;
            ser.serviceCount = eachService.quantity;
            ser.serviceTotal = eachService.total;
            services.push(ser);
        });
        if (userDetails.bookingEmail === "true") {
            let mailData = {};
            mailData.to = userDetails.email;
            mailData.subject = i18n.__("Payment Refunded");
            mailData.title = i18n.__("Hello") + " " + userDetails.name;
            mailData.message = i18n.__("Your booking payment") + " " + bookingDetails.bookingId + " " + i18n.__("has been refunded");
            mailData.service = services;
            mailData.tax = bookingDetails.tax;
            mailData.commission = bookingDetails.commission;
            mailData.totalAmount = bookingDetails.total;
            mailerController.sendMail(mailData);
        }
    }
};
let paymentNotification = function (userId, MsgData) {
    User.findById(userId, function (error, userDetails) {
        if (!error && userDetails && userDetails.deviceToken) {
            if (userDetails.bookingNotification === "true" && userDetails.deviceActive === 1 && userDetails.deviceToken != "") {
                fcmService.notifyUser(userDetails.deviceToken, { "title": MsgData.name, "scope": "booking", "message": JSON.stringify(MsgData) }, userDetails.languageType);
            }
        }
    });
};

let bookingNotification = function (userId, MsgData) {
    User.findById(userId, function (error, userDetails) {
        if (!error && userDetails) {
            if (userDetails.bookingNotification === "true" && userDetails.deviceActive === 1) {
                fcmService.notifyUser(userDetails.deviceToken, { "title": MsgData.name, "scope": "booking", "message": JSON.stringify(MsgData) }, userDetails.languageType);
            }
        }
    });
};