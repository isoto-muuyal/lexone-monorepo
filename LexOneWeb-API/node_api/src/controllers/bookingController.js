const mongoose = require("mongoose");
const moment = require("moment");
const { nanoid } = require('nanoid');
const path = require("path");
const fs = require('fs');

const Booking = require('../models/bookingModel');
const BookingDetail = require('../models/bookingdetailModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Setting = require('../models/settingModel');
const Review = require('../models/reviewModel');
const Chat = require('../models/chatModel');

const { I18n } = require('i18n');

/**
 * create a new instance
 */
const i18n = new I18n()

/**
 * later in code configure
 */
i18n.configure({
  locales: ['en', 'fr','ar'],
  defaultLocale: 'ar',
  directory: path.join(__dirname, 'locales'),
})

// notification logs
const logController = require("../controllers/logController");
const paymentController = require("../controllers/paymentController");

// email service
const mailerController = require('./mailController');

// fcm service
const fcmService = require('../controllers/fcmController');


exports.bookService = async function (req, res) {
    if (!req.body.user_id || !req.body.parent_category_id || !req.body.subcategory_id || !req.body.services || !req.body.date  || !req.body.price || !req.body.total) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Paramsss") });
    }
    else {
        // try {
            let appSettings = await Setting.findOne({});

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            let languageType = req.headers['accept-language'];

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__({ phrase: "Invalid User ID", locale: languageType }) });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__({ phrase: "Account is disabled", locale: languageType }) });

            let categoryDetails = await Category.findById(req.body.parent_category_id);

            if (!categoryDetails)
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong1") });

            let bookingData = {};
            bookingData.bookingId = process.env.BOOKING_PREFIX + nanoid(8);
            bookingData.bookedWhen = req.body.date.toString();
            bookingData.bookedFor = req.body.description;
            bookingData.bookedType = categoryDetails.type;
            bookingData.userId = mongoose.Types.ObjectId(userDetails._id);
            bookingData.mainCategory = mongoose.Types.ObjectId(req.body.parent_category_id);
            bookingData.subCategory = mongoose.Types.ObjectId(req.body.subcategory_id);
            bookingData.status = "requested";
            bookingData.locationType = categoryDetails.locationType;
            bookingData.otp = Math.floor(1000 + Math.random() * 9000);
            let category = await Category.findById(req.body.parent_category_id);
            if (appSettings.instantLocation.toString() == "true") {
                if (category.locationType == "transport") {
                    req.body.dest_location = "calle prueba 123"
                    if (!req.body.source_location || !req.body.source_lat || !req.body.source_lon || !req.body.dest_location || !req.body.dest_lat || !req.body.dest_lon ) {
                        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params1") });
                    }
                    else{
                        bookingData.sourcelocation = req.body.source_location;
                        bookingData.sourceLat = req.body.source_lat;
                        bookingData.sourceLon = req.body.source_lon;
                        bookingData.destLocation = req.body.dest_location;
                        bookingData.destLat = req.body.dest_lat;
                        bookingData.destLon = req.body.dest_lon;
                    }
                }
                else if (category.locationType == "home") {
                    if (!req.body.source_location || !req.body.source_lon|| !req.body.source_lat) {
                        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params2") });
                    }
                    else{
                        bookingData.sourcelocation = req.body.source_location;
                        bookingData.sourceLat = req.body.source_lat;
                        bookingData.sourceLon = req.body.source_lon;
                    }

                }
            }
            else{
                if (category.locationType == "transport") {
                    if (!req.body.source_location || !req.body.dest_location) {
                        return res.status(200).json({ status_code: 400, message: res.__("Invalid params3") });
                    }
                    else{
                        bookingData.sourcelocation = req.body.source_location;
                        bookingData.destLocation = req.body.dest_location;
                    }
                }
                else if (category.locationType == "home") {
                    if (!req.body.source_location ) {
                        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params4") });
                    }
                    else{
                        bookingData.sourcelocation = req.body.source_location;
                    }

                }
            }
            let allServices = JSON.parse(req.body.services);

            if (typeof allServices !== "object" || allServices.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("Invalid params5") });

            let bookingServices = [];
            let availservices = [];
            let bookingTotal = 0;
            let bookingCommission = 0;
            let bookingTax = 0;
            let taxPer = 0;
            let commissionPer = 0;
            let totalAmount = 0;
            let taskerDetails = {};

            if (req.body.tasker_id)
                taskerDetails = await User.findOne({ userId: req.body.tasker_id, role: "tasker" });


            if (appSettings.tax)
                taxPer = appSettings.tax / 100;

            if (appSettings.commission)
                commissionPer = appSettings.commission / 100;

            allServices.filter(function (eachService) {
                if (eachService.hasOwnProperty('service_id') && eachService.hasOwnProperty('service_price') && eachService.hasOwnProperty('service_pricing') && eachService.hasOwnProperty('service_quantity') && eachService.hasOwnProperty('service_total_price')) {
                    let servicePrice = parseFloat(eachService.service_price);
                    let serviceQuantity = parseInt(eachService.service_quantity);
                    let serviceTotal = parseFloat(servicePrice * serviceQuantity);
                    let eachserviceObject = {};
                    eachserviceObject.serviceId = eachService.service_id;
                    eachserviceObject.pricing = eachService.service_pricing;
                    eachserviceObject.price = servicePrice;
                    eachserviceObject.name = eachService.service_name;
                    eachserviceObject.quantity = serviceQuantity;
                    eachserviceObject.total = serviceTotal;
                    bookingServices.push(eachserviceObject);
                    availservices.push(eachService.service_id);
                    bookingTotal += serviceTotal;
                    bookingData.serviceId = eachService.service_id;
                }
            });
            if (categoryDetails.type === "professional") {
                if (appSettings.instantLocation.toString() == "true") {
                    if (categoryDetails.locationType != "remote") {
                        let availObject;
                        availObject = { role: "tasker", serviceIds: availservices, status: 1, availability: 1, verified: 1, onride: 0  };
                      
                        /* notify nearby tasker */
                        let lon = parseFloat(req.body.source_lon);
                        let lat = parseFloat(req.body.source_lat);
                        let maxdistcoverage = parseInt(appSettings.maxDistance);
                        
                        /* mongo geonear api */
                        let query = User.aggregate([
                            {
                                $geoNear: {
                                    near: {
                                        type: "Point",
                                        coordinates: [lon, lat]
                                    },
                                    spherical: true,
                                    key:"loc",
                                    distanceField: "distance",
                                    maxDistance: maxdistcoverage * 100000,
                                    query: availObject
                                }
                            }, 
                           
                            {
                                $sort: { lastBookedOn : 1 } 
                            },
                            {
                                $limit: 1
                            }
                        ]);
                        query.exec(function(err, tasker) {
                            if (err) {
                                console.log(err);
                            } 
                            else {
                                if (tasker.length === 0) {

                                    let availObject;
                                    availObject = { role: "tasker", serviceIds:  { $in: availservices }, status: 1, availability: 1, verified: 1, onride: 0  };
                                    
                                     /* mongo geonear api */
                                    let query2 = User.aggregate([
                                        {
                                            $geoNear: {
                                                near: {
                                                    type: "Point",
                                                    coordinates: [lon, lat]
                                                },
                                                spherical: true,
                                                key:"loc",
                                                distanceField: "distance",
                                                maxDistance: maxdistcoverage * 1000,
                                                query: availObject
                                            }
                                        }, 
                                        {
                                            $sort: { lastBookedOn : 1 } 
                                        },
                                        {    
                                            $limit: 1
                                        }
                                    ]);
                                    query2.exec(function(err, tasker) {
                                        if (err) {
                                            // console.log(tasker);
                                            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong2") });

                                        } 
                                        else{
                                            if (tasker.length === 0){
                                                res.json({
                                                    status_code: 400,
                                                    message: res.__("Sorry! No Tasker found nearby at this moment")
                                                });
                                            }
                                            else {
                                                bookingData.taskerId = tasker[0]._id;
                                                bookingCommission = parseFloat(bookingTotal) * parseFloat(commissionPer);
                                                bookingTax = parseFloat(bookingTotal) * parseFloat(taxPer);
                                    
                                                bookingData.commission = bookingCommission.toFixed(2);
                                                bookingData.tax = bookingTax.toFixed(2);
                                    
                                                totalAmount = parseFloat(bookingTotal) + parseFloat(bookingCommission) + parseFloat(bookingTax);
                                    
                                                bookingData.total = totalAmount.toFixed(2);
                                                bookingData.price = bookingTotal.toFixed(2);
                                    
                                                if (bookingData && bookingServices) {
                                                    let newBooking = new Booking(bookingData);
                                                    newBooking.save(async function (error, bookingDetails) {
                                                        if (!error) {
                                                            // booking confirmation
                                                            let services = [];
                                                            bookingServices.filter(function (eachService) {
                                                                let ser = {};
                                                                ser.services = eachService.name;
                                                                ser.servicePrice = eachService.price;
                                                                ser.serviceCount = eachService.quantity;
                                                                ser.serviceTotal = eachService.total;
                                                                services.push(ser);
                                                            });

                                                            if (userDetails.bookingEmail === "true") {
                                                                let mailData = {};
                                                                mailData.to = userDetails.email;
                                                                mailData.subject = res.__("Booking Confirmed");
                                                                mailData.title = res.__("Hello") + " " + userDetails.name;
                                                                mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId +" "+ " " + res.__("is confirmed");
                                                                mailData.service = services;
                                                                mailData.tax = bookingDetails.tax;
                                                                mailData.commission = bookingDetails.commission;
                                                                mailData.totalAmount = bookingDetails.total;
                                                                mailerController.sendMail(mailData);
                                                            }
                                                           
                                                            if (tasker[0].bookingEmail === "true") {
                                                                let mailData = {};
                                                                mailData.to = tasker[0].email;
                                                                mailData.subject = res.__("Booking Confirmed");
                                                                mailData.title = res.__("Hello") + " " + tasker[0].name;
                                                                mailData.service = services;
                                                                mailData.tax = bookingDetails.tax;
                                                                mailData.commission = bookingDetails.commission;
                                                                mailData.totalAmount = bookingDetails.total;
                                                                mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId +" "+ " " + res.__("is confirmed");
                                                                mailerController.sendMail(mailData);
                                                            }
                                                           
                                    
                                                            bookingServices.map((element) => {
                                                                return element.bookingId = bookingDetails._id;
                                                            });
                                    
                                                            if (categoryDetails.type === "marketplace") {
                                    
                                                                let newChat = new Chat({
                                                                    bookingId: bookingDetails._id,
                                                                    userId: userDetails._id,
                                                                    taskerId: taskerDetails._id,
                                                                    serviceId: bookingDetails.serviceId,
                                                                });
                                    
                                                                newChat.save(function (error, chatDetails) { });
                                                            }
                                    
                                                            BookingDetail.insertMany(bookingServices, async function (error, bookedServices) {
                                                                if (!error) {
                                                                    Chat.findOne({ bookingId: bookingDetails._id }, function (error, chatDetails) {
                                                                        let bookingResponse = {};
                                                                        let logMessage = res.__({ phrase: 'You have been assigned with a new service', locale: tasker[0].languageType });
                                                                        
                                                                        bookingResponse.status_code = 200;
                                                                        bookingResponse.availability = "true";
                                                                        bookingResponse.booking_id = bookingDetails._id;
                                                                        if (!error) {
                                    
                                                                            bookingResponse.chat_id = "";
                                    
                                                                            if (chatDetails) {
                                                                                bookingResponse.chat_id = chatDetails._id;
                                                                            }
                                    
                                                                            taskerAssigned(bookingData.taskerId);
                                                                            if (categoryDetails.type === "professional") {
                                                                                if (appSettings.instantLocation.toString() == "true") {
                                                                                        bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                                                }
                                                                                else{
                                                                                    bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                                                }
                                                                            }
                                                                            return res.status(200).json(bookingResponse);
                                                                        }
                                                                        else {
                                                                            taskerAssigned(bookingData.taskerId);
                                                                            if (categoryDetails.type === "professional") {
                                                                                bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                                            }
                                                                            return res.status(200).json(bookingResponse);
                                                                        }
                                                                    });
                                                                }
                                                                else {
                                                                    return res.status(200).json({ status_code: 500, message: res.__("Something went wrong3") });
                                                                }
                                                            });
                                                        } else {
                                                            console.log(error)
                                                            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong4") });
                                                        }
                                                    });
                                                }
                                            
            
                                            }
                                        }
                                    });
                                   
                                } 
                                else {
                                    bookingData.taskerId = tasker[0]._id;
                                    let languageType;
                                    languageType = tasker[0].languageType;
                                    bookingCommission = parseFloat(bookingTotal) * parseFloat(commissionPer);
                                    bookingTax = parseFloat(bookingTotal) * parseFloat(taxPer);
                        
                                    bookingData.commission = bookingCommission.toFixed(2);
                                    bookingData.tax = bookingTax.toFixed(2);
                        
                                    totalAmount = parseFloat(bookingTotal) + parseFloat(bookingCommission) + parseFloat(bookingTax);
                        
                                    bookingData.total = totalAmount.toFixed(2);
                                    bookingData.price = bookingTotal.toFixed(2);
                        
                                    if (bookingData && bookingServices) {
                        
                                        let newBooking = new Booking(bookingData);
                        
                                        newBooking.save(async function (error, bookingDetails) {
                                            if (!error) {
                                                // booking confirmation
                                                let services = [];
                                                bookingServices.filter(function (eachService) {
                                                    let ser = {};
                                                    ser.services = eachService.name;
                                                    ser.servicePrice = eachService.price;
                                                    ser.serviceCount = eachService.quantity;
                                                    ser.serviceTotal = eachService.total;
                                                    services.push(ser);
                                                    
                                                });
                                                if (userDetails.bookingEmail === "true") {
                                                    let mailData = {};
                                                    mailData.to = userDetails.email;
                                                    mailData.subject = res.__("Booking Confirmed");
                                                    mailData.title = res.__("Hello") + " " + userDetails.name;
                                                    mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + res.__("for")+ " " + bookingDetails.price + " " + res.__("is confirmed");
                                                    mailData.service = services;
                                                    mailData.tax = bookingDetails.tax;
                                                    mailData.commission = bookingDetails.commission;
                                                    mailData.totalAmount = bookingDetails.total;
                                                    mailerController.sendMail(mailData);
                                                }
                                                if (tasker[0].bookingEmail === "true") {
                                                    let mailData = {};
                                                    mailData.to = tasker[0].email;
                                                    mailData.subject = res.__("Booking Confirmed");
                                                    mailData.title = res.__("Hello") + " " + tasker[0].name;
                                                    mailData.service = services;
                                                    mailData.tax = bookingDetails.tax;
                                                    mailData.commission = bookingDetails.commission;
                                                    mailData.totalAmount = bookingDetails.total;
                                                    mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + " "+ bookingDetails.price + " " + res.__("is confirmed");
                                                    mailerController.sendMail(mailData);
                                                }
                        
                        
                                                bookingServices.map((element) => {
                                                    return element.bookingId = bookingDetails._id;
                                                });
                        
                                                if (categoryDetails.type === "marketplace") {
                        
                                                    let newChat = new Chat({
                                                        bookingId: bookingDetails._id,
                                                        userId: userDetails._id,
                                                        taskerId: taskerDetails._id,
                                                        serviceId: bookingDetails.serviceId,
                                                    });
                        
                                                    newChat.save(function (error, chatDetails) { });
                                                }
                        
                                                BookingDetail.insertMany(bookingServices, async function (error, bookedServices) {
                                                    if (!error) {
                                                        Chat.findOne({ bookingId: bookingDetails._id }, function (error, chatDetails) {
                                                            let bookingResponse = {};
                                                            let logMessage = res.__({ phrase: 'You have been assigned with a new service', locale: tasker[0].languageType });
                                                            bookingResponse.status_code = 200;
                                                            bookingResponse.availability = "true";
                                                            bookingResponse.booking_id = bookingDetails._id;
                                                            if (!error) {
                        
                                                                bookingResponse.chat_id = "";
                        
                                                                if (chatDetails) {
                                                                    bookingResponse.chat_id = chatDetails._id;
                                                                }
                        
                                                                taskerAssigned(bookingData.taskerId);
                                                                if (categoryDetails.type == "professional") {
                                                                    bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                                }
                                                                return res.status(200).json(bookingResponse);
                                                            }
                                                            else {
                                                                taskerAssigned(bookingData.taskerId);
                                                                if (categoryDsetails.type == "professional") {
                                                                    bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                                }
                                                                return res.status(200).json(bookingResponse);
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong5") });
                                                    }
                                                });
                                            } else {
                                                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong6") });
                                            }
                                        });
                                    }
                                

                                }
                            }
                        });
                    }
                }
                else{
                    if (categoryDetails.locationType != "remote") {
                        let services_unavailable = [];
                        let availObject;
                        availObject = { role: "tasker", serviceIds: { $all: availservices }, location: req.body.source_location, status: 1, availability: 1, verified: 1, onride: 0 };
                
                        let taskerAvailability = await User.findOne(availObject).sort({ lastBookedOn: 1 });
                
                        if (taskerAvailability)
                            services_unavailable = availservices.filter(x => !taskerAvailability.serviceIds.includes(x));
                
                        if (!taskerAvailability) {
                            let availObject;
                            availObject = { role: "tasker", serviceIds: { $all: availservices }, location: req.body.source_location, status: 1, availability: 1, verified: 1, onride: 0 };
                            taskerAvailability = await User.findOne(availObject);
                
                            if (taskerAvailability) {
                                services_unavailable = availservices.filter(x => !taskerAvailability.serviceIds.includes(x));
                            }
                
                        }
                
                        // if (taskerAvailability && services_unavailable.length > 0) {
                
                        //     availObject = { role: "tasker", userId: { "$nin": [taskerAvailability.userId] }, serviceIds: { $all: availservices }, location: req.body.location, status: 1, availability: 1, verified: 1 };
                
                        //     taskerAvailability = await User.findOne(availObject);
                
                        //     if (taskerAvailability) {
                        //         services_unavailable = availservices.filter(x => !taskerAvailability.serviceIds.includes(x));
                        //     }
                
                        // }
                
                        if (!taskerAvailability) {
                            let availObject;
                            availObject = { role: "tasker", serviceIds: { $in: availservices }, location: req.body.source_location, status: 1, availability: 1, verified: 1, onride: 0 };
                            
                            taskerAvailability = await User.findOne(availObject);
                
                            if (taskerAvailability) {
                                services_unavailable = availservices.filter(x => !taskerAvailability.serviceIds.includes(x));
                            }
                
                        }
                
                        if (!taskerAvailability) {
                            return res.status(200).json({ status_code: 400, message: res.__("Tasker is not available now") });
                        }
                
                        if (services_unavailable.length > 0)
                            return res.status(200).json({ status_code: 400, unavailable_services: services_unavailable, message:res.__("Tasker not available for some services") });
                
                        bookingData.taskerId = taskerAvailability._id;
                        bookingCommission = parseFloat(bookingTotal) * parseFloat(commissionPer);
                        bookingTax = parseFloat(bookingTotal) * parseFloat(taxPer);
                
                        bookingData.commission = bookingCommission.toFixed(2);
                        bookingData.tax = bookingTax.toFixed(2);
                
                        totalAmount = parseFloat(bookingTotal) + parseFloat(bookingCommission) + parseFloat(bookingTax);
                
                        bookingData.total = totalAmount.toFixed(2);
                        bookingData.price = bookingTotal.toFixed(2);
                
                        if (bookingData && bookingServices) {
                            let newBooking = new Booking(bookingData);
                            newBooking.save(async function (error, bookingDetails) {
                                if (!error) {
                                    // booking confirmation
                                    let services = [];
                                    bookingServices.filter(function (eachService) {
                                        let ser = {};
                                        ser.services = eachService.name;
                                        ser.servicePrice = eachService.price;
                                        ser.serviceCount = eachService.quantity;
                                        ser.serviceTotal = eachService.total;
                                        services.push(ser);
                                        
                                    });
                                    if (userDetails.bookingEmail === "true") {
                                        let mailData = {};
                                        mailData.to = userDetails.email;
                                        mailData.subject = res.__("Booking Confirmed");
                                        mailData.title = res.__("Hello") + " " + userDetails.name;
                                        mailData.service = services;
                                        mailData.tax = bookingDetails.tax;
                                        mailData.commission = bookingDetails.commission;
                                        mailData.totalAmount = bookingDetails.total;
                                        mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + res.__("for")+ " " + bookingDetails.price + " " + res.__("is confirmed");
                                        mailerController.sendMail(mailData);
                                    }
                                    if (taskerAvailability.bookingEmail === "true") {
                                        let mailData = {};
                                        mailData.to = taskerAvailability.email;
                                        mailData.subject = res.__("Booking Confirmed");
                                        mailData.title = res.__("Hello") + " " + taskerAvailability.name;
                                        mailData.service = services;
                                        mailData.tax = bookingDetails.tax;
                                        mailData.commission = bookingDetails.commission;
                                        mailData.totalAmount = bookingDetails.total;
                                        mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + res.__("for")+ " " + bookingDetails.price + " " + res.__("is confirmed");
                                        mailerController.sendMail(mailData);
                                    }
                                    bookingServices.map((element) => {
                                        return element.bookingId = bookingDetails._id;
                                    });
                
                                    if (categoryDetails.type === "marketplace") {
                                        let newChat = new Chat({
                                            bookingId: bookingDetails._id,
                                            userId: userDetails._id,
                                            taskerId: taskerDetails._id,
                                            serviceId: bookingDetails.serviceId,
                                        });
                                        newChat.save(function (error, chatDetails) { });
                                    }
                
                                    BookingDetail.insertMany(bookingServices, async function (error, bookedServices) {
                                        if (!error) {
                                            Chat.findOne({ bookingId: bookingDetails._id }, function (error, chatDetails) {
                                                let bookingResponse = {};
                                                bookingResponse.status_code = 200;
                                                bookingResponse.availability = "true";
                                                bookingResponse.booking_id = bookingDetails._id;
                                                if (!error) {
                                                    bookingResponse.chat_id = "";
                                                    if (chatDetails) {
                                                        bookingResponse.chat_id = chatDetails._id;
                                                    }
                                                    taskerAssigned(bookingData.taskerId);
                                                    if (categoryDetails.type === "professional") {
                                                        let logMessage = res.__({ phrase: 'You have been assigned with a new service', locale: taskerAvailability.languageType });
                                                        bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                    }
                                                    return res.status(200).json(bookingResponse);
                                                }
                                                else {
                                                    taskerAssigned(bookingData.taskerId);
                                                    if (categoryDetails.type === "professional") {
                                                        let logMessage = res.__({ phrase: 'You have been assigned with a new service', locale: taskerAvailability.languageType });
                                                        bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                    }
                                                    return res.status(200).json(bookingResponse);
                                                }
                                            });
                                        }
                                        else {
                                            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong7") });
                                        }
                                    });
                                } else {
                                    return res.status(200).json({ status_code: 500, message: res.__("Something went wrong8") });
                                }
                            });
                        }
                        
                    }
                }
                if (categoryDetails.locationType == "remote"){
                    
                    let services_unavailable = [];

                    let availObject = { role: "tasker", serviceIds: { $all: availservices },  status: 1, availability: 1, verified: 1 };

                    let taskerAvailability = await User.findOne(availObject).sort({ lastBookedOn: 1 });

                    if (taskerAvailability)
                        services_unavailable = availservices.filter(x => !taskerAvailability.serviceIds.includes(x));

                    if (!taskerAvailability) {

                        availObject = { role: "tasker", serviceIds: { $all: availservices },  status: 1, availability: 1, verified: 1 };

                        taskerAvailability = await User.findOne(availObject);

                        if (taskerAvailability) {
                            services_unavailable = availservices.filter(x => !taskerAvailability.serviceIds.includes(x));
                        }
                    }
                    if (!taskerAvailability) {

                        availObject = { role: "tasker", serviceIds: { $in: availservices }, status: 1, availability: 1, verified: 1 };

                        taskerAvailability = await User.findOne(availObject);

                        if (taskerAvailability) {
                            services_unavailable = availservices.filter(x => !taskerAvailability.serviceIds.includes(x));
                        }

                    }

                    if (!taskerAvailability) {
                        return res.status(200).json({ status_code: 400, message: res.__("Tasker is not available now") });
                        
                    }

                    if (services_unavailable.length > 0)
                        return res.status(200).json({ status_code: 400, unavailable_services: services_unavailable, message: res.__("Tasker not available for some services") });
                        
                    bookingData.taskerId = taskerAvailability._id;
                    bookingCommission = parseFloat(bookingTotal) * parseFloat(commissionPer);
                    bookingTax = parseFloat(bookingTotal) * parseFloat(taxPer);
        
                    bookingData.commission = bookingCommission.toFixed(2);
                    bookingData.tax = bookingTax.toFixed(2);
        
                    totalAmount = parseFloat(bookingTotal) + parseFloat(bookingCommission) + parseFloat(bookingTax);
        
                    bookingData.total = totalAmount.toFixed(2);
                    bookingData.price = bookingTotal.toFixed(2);
        
                    if (bookingData && bookingServices) {
        
                        let newBooking = new Booking(bookingData);
        
                        newBooking.save(async function (error, bookingDetails) {
                            if (!error) {
                                // booking confirmation
                                let services = [];
                                    bookingServices.filter(function (eachService) {
                                        let ser = {};
                                        ser.services = eachService.name;
                                        ser.servicePrice = eachService.price;
                                        ser.serviceCount = eachService.quantity;
                                        ser.serviceTotal = eachService.total;
                                        services.push(ser);
                                        
                                    });
                                if (userDetails.bookingEmail === "true") {
                                    let mailData = {};
                                    mailData.to = userDetails.email;
                                    mailData.subject = res.__("Booking Confirmed");
                                    mailData.title = res.__("Hello") + " " + userDetails.name;
                                    mailData.service =services;
                                    mailData.tax = bookingDetails.tax;
                                    mailData.commission = bookingDetails.commission;
                                    mailData.totalAmount = bookingDetails.total;
                                    mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + " " + res.__("is confirmed");
                                    mailerController.sendMail(mailData);
                                }
                                if (taskerAvailability.bookingEmail === "true") {
                                    let mailData = {};
                                    mailData.to = taskerAvailability.email;
                                    mailData.subject = res.__("Booking Confirmed");
                                    mailData.title = res.__("Hello") + " " + taskerAvailability.name;
                                    mailData.service =services;
                                    mailData.tax = bookingDetails.tax;
                                    mailData.commission = bookingDetails.commission;
                                    mailData.totalAmount = bookingDetails.total;
                                    mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + " " + res.__("is confirmed");
                                    mailerController.sendMail(mailData);
                                }
        
        
                                bookingServices.map((element) => {
                                    return element.bookingId = bookingDetails._id;
                                });
        
                                if (categoryDetails.type === "marketplace") {
        
                                    let newChat = new Chat({
                                        bookingId: bookingDetails._id,
                                        userId: userDetails._id,
                                        taskerId: taskerDetails._id,
                                        serviceId: bookingDetails.serviceId,
                                    });
        
                                    newChat.save(function (error, chatDetails) { });
                                }
        
                                BookingDetail.insertMany(bookingServices, async function (error, bookedServices) {
                                    if (!error) {
                                        Chat.findOne({ bookingId: bookingDetails._id }, function (error, chatDetails) {
                                            let bookingResponse = {};
                                            let logMessage = res.__({ phrase: 'You have been assigned with a new service', locale: taskerAvailability.languageType });
                                            bookingResponse.status_code = 200;
                                            bookingResponse.availability = "true";
                                            bookingResponse.booking_id = bookingDetails._id;
                                            if (!error) {
        
                                                bookingResponse.chat_id = "";
        
                                                if (chatDetails) {
                                                    bookingResponse.chat_id = chatDetails._id;
                                                }
        
                                                taskerAssigned(bookingData.taskerId);
                                                if (categoryDetails.type === "professional") {
                                                    if (appSettings.instantLocation.toString() == "true") {
                                                            bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                    }
                                                    else{
                                                        bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                    }
                                                }
                                                return res.status(200).json(bookingResponse);
                                            }
                                            else {
                                                taskerAssigned(bookingData.taskerId);
                                                if (categoryDetails.type === "professional") {
                                                    bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                                }
                                                return res.status(200).json(bookingResponse);
                                            }
                                        });
                                    }
                                    else {
                                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong9") });
                                    }
                                });
                            } else {
                                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong10") });
                            }
                        });
                    }
                }
            }

            if (categoryDetails.type === "marketplace" && !req.body.tasker_id)
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });

            if (categoryDetails.type === "marketplace") {
                bookingData.taskerId = taskerDetails._id;
                bookingCommission = parseFloat(bookingTotal) * parseFloat(commissionPer);
                bookingTax = parseFloat(bookingTotal) * parseFloat(taxPer);

                bookingData.commission = bookingCommission.toFixed(2);
                bookingData.tax = bookingTax.toFixed(2);

                totalAmount = parseFloat(bookingTotal) + parseFloat(bookingCommission) + parseFloat(bookingTax);

                bookingData.total = totalAmount.toFixed(2);
                bookingData.price = bookingTotal.toFixed(2);

                if (bookingData && bookingServices) {

                    let newBooking = new Booking(bookingData);

                    await newBooking.save(async function (error, bookingDetails) {
                        if (!error) {
                            // booking confirmation
                            let services = [];
                            bookingServices.filter(function (eachService) {
                                let ser = {};
                                ser.services = eachService.name;
                                ser.servicePrice = eachService.price;
                                ser.serviceCount = eachService.quantity;
                                ser.serviceTotal = eachService.total;
                                services.push(ser);
                                
                            });
                            if (userDetails.bookingEmail === "true") {
                                let mailData = {};
                                mailData.to = userDetails.email;
                                mailData.subject = res.__("Booking Confirmed");
                                mailData.title = res.__("Hello") + " " + userDetails.name;
                                mailData.service = services;
                                mailData.tax = bookingDetails.tax;
                                mailData.commission = bookingDetails.commission;
                                mailData.totalAmount = bookingDetails.total;
                                mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + " " + res.__("is confirmed");
                                mailerController.sendMail(mailData);
                            }
                            if (taskerDetails.bookingEmail === "true") {
                                let mailData = {};
                                mailData.to = taskerDetails.email;
                                mailData.subject = res.__("Booking Confirmed");
                                mailData.title = res.__("Hello") + " " + taskerDetails.name;
                                mailData.service = services;
                                mailData.tax = bookingDetails.tax;
                                mailData.commission = bookingDetails.commission;
                                mailData.totalAmount = bookingDetails.total;
                                mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + " " + res.__("is confirmed");
                                mailerController.sendMail(mailData);
                            }


                            bookingServices.map((element) => {
                                return element.bookingId = bookingDetails._id;
                            });

                            if (categoryDetails.type === "marketplace") {

                                let newChat = new Chat({
                                    bookingId: bookingDetails._id,
                                    userId: userDetails._id,
                                    taskerId: taskerDetails._id,
                                    serviceId: bookingDetails.serviceId,
                                });
                                newChat.save(function (error, chatDetails) { });
                            }

                            BookingDetail.insertMany(bookingServices, async function (error, bookedServices) {
                                if (!error) {
                                    Chat.findOne({ bookingId: bookingDetails._id }, function (error, chatDetails) {
                                        let bookingResponse = {};
                                        let logMessage = res.__("You have been assigned with a new service");
                                        bookingResponse.status_code = 200;
                                        bookingResponse.availability = "true";
                                        bookingResponse.booking_id = bookingDetails._id;
                                        if (!error) {

                                            bookingResponse.chat_id = "";

                                            if (chatDetails) {
                                                bookingResponse.chat_id = chatDetails._id;
                                            }

                                            taskerAssigned(bookingData.taskerId);
                                            if (categoryDetails.type === "professional") {
                                                bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                            }
                                            return res.status(200).json(bookingResponse);
                                        }
                                        else {
                                            taskerAssigned(bookingData.taskerId);
                                            if (categoryDetails.type === "professional") {
                                                bookingNotification(bookingData.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                                            }
                                            return res.status(200).json(bookingResponse);
                                        }
                                    });
                                }
                                else {
                                    return res.status(200).json({ status_code: 500, message: res.__("Something went wrong11") });
                                }
                            });
                        } else {
                            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong12") });
                        }
                    });
                }
            }

        // }
        // catch (err) {
        //     return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        // }
    }
};

exports.userBookings = async function (req, res) {
    if (!req.body.user_id || !req.body.limit || !req.body.offset || !req.body.type) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params6") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            let languageType = req.headers['accept-language'];

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__({ phrase: "Invalid User ID", locale: languageType }) });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__({ phrase: "Account is disabled", locale: languageType }) });


            let offset = 0;
            let limit = 10;
            let searchString = {};
            let needsString = {};
            let sortString = { updatedAt: -1 };

            if (req.body.limit && req.body.offset) {
                limit = parseInt(req.body.limit);
                offset = parseInt(req.body.offset);
            }

            searchString.userId = userDetails._id;
            needsString.userId = userDetails._id;
            searchString.status = { $in: ["cancelled", "completed", "refunded"] };
            needsString.status = { $in: ["cancelled", "completed", "refunded"] };

            if (req.body.type == "ongoing") {

                searchString.bookedType = { $in: ['professional', 'marketplace'] };
                searchString.status = { $in: ["requested", "paid", "started", "accepted"] };

                needsString.bookedType = { $in: ['userneeds'] };
                needsString.status = { $in: ["paid", "started", "accepted"] };
            }

            let userBookings = await Booking.find({ $or: [searchString, needsString] }).populate("mainCategory").populate("subCategory").limit(limit).skip(offset).sort(sortString);

            if (userBookings.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No bookings found") });
                


            let bookings = [];

            userBookings.filter(function (eachBooking) {
                bookings.push({
                    item_id: eachBooking._id,
                    reference_id: eachBooking.bookingId ? (eachBooking.bookingId) : "",
                    item_type: eachBooking.bookedType,
                    item_name: (eachBooking.bookedName) ? eachBooking.bookedName : eachBooking.bookedFor,
                    item_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.subCategory.image,
                    date: eachBooking.bookedWhen,
                    price: eachBooking.total,
                    status: eachBooking.status,
                    location: eachBooking.bookedWhere,
                });
            });

            return res.status(200).json({
                status_code: 200, items: bookings
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.taskerBookings = async function (req, res) {
    if (!req.body.user_id || !req.body.limit || !req.body.offset || !req.body.type) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params7") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            let languageType = req.headers['accept-language'];

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__({ phrase: "Invalid User ID", locale: languageType }) });
            


            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__({ phrase: "Account is disabled", locale: languageType }) });

            let offset = 0;
            let limit = 10;
            let searchString = {};
            let needsString = {};
            let sortString = { createdAt: -1 };

            if (req.body.limit && req.body.offset) {
                limit = parseInt(req.body.limit);
                offset = parseInt(req.body.offset);
            }

            searchString.taskerId = userDetails._id;
            needsString.taskerId = userDetails._id;
            searchString.status = { $in: ["cancelled", "completed", "refunded"] };
            needsString.status = { $in: ["cancelled", "completed", "refunded"] };

            if (req.body.type == "ongoing") {

                searchString.bookedType = { $in: ['professional', 'marketplace'] };
                searchString.status = { $in: ["requested", "paid", "started", "accepted"] };

                needsString.bookedType = { $in: ['userneeds'] };
                needsString.status = { $in: ["paid", "started", "accepted"] };
            }

            let userBookings = await Booking.find({ $or: [searchString, needsString] }).populate("mainCategory").populate("subCategory").limit(limit).skip(offset).sort(sortString);

            if (userBookings.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__({ phrase: "No bookings found", locale: languageType }) });

            let bookings = [];

            userBookings.filter(function (eachBooking) {
                bookings.push({
                    item_id: eachBooking._id,
                    reference_id: eachBooking.bookingId ? (eachBooking.bookingId) : "",
                    item_type: eachBooking.bookedType,
                    item_name: (eachBooking.bookedName) ? eachBooking.bookedName : eachBooking.bookedFor,
                    item_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.subCategory.image,
                    date: eachBooking.bookedWhen,
                    price: eachBooking.total,
                    status: eachBooking.status,
                    location: eachBooking.bookedWhere,
                });
            });

            return res.status(200).json({
                status_code: 200, items: bookings
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.bookingDetails = async function (req, res) {
    if (!req.params.bookingId) {
        return res.status(200).json({ status_code: 400, messsage: res.__("Invalid Params8") });
    }
    else {
        try {

            let bookingDetails = await Booking.findById(req.params.bookingId).populate("mainCategory").populate("taskerId").populate("subCategory");
            
            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var langName = (object) ? object.toLowerCase() : "";
           
            if (bookingDetails.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No bookings found") });

            let bookingServices = await BookingDetail.find({ bookingId: req.params.bookingId }).populate("serviceId");

            if (bookingServices.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No bookings found") });

            let bookingReviews = await Review.findOne({ bookingId: req.params.bookingId });

            let appSettings = await Setting.findOne({});


            let taskerReviews = 0;
            let completedTasks = 0;
            let chatDetails = {};
            if (bookingDetails.taskerId) {
                taskerDetails = await User.findById(bookingDetails.taskerId._id);
                completedTasks = (taskerDetails.tasksCompleted) ? taskerDetails.tasksCompleted : "0";
                taskerReviews = (taskerDetails.reviews) ? taskerDetails.reviews : "0";
                console.log("bookingDetails.taskerId", bookingDetails.taskerId._id)
                console.log("Booking ID:",req.params.bookingId)
                chatDetails = await Chat.findOne({ bookingId: req.params.bookingId, taskerId: bookingDetails.taskerId._id });
                console.log("chatDetails: ", chatDetails)
            }

            let bookingData = {};
            let rewarddetails = {};
            let reviewdetails = {};
            let allServices = [];
            let totalPrice = 0;
            bookingData.status_code = 200;
            bookingData.reference_id = (bookingDetails.bookingId) ? (bookingDetails.bookingId) : "";
            bookingData.parent_category_id = bookingDetails.mainCategory._id;
            bookingData.booking_type = bookingDetails.bookedType;
            bookingData.subcategory_id = bookingDetails.subCategory._id;
            bookingData.location_type = bookingDetails.locationType;
            bookingData.parent_category_name = bookingDetails.mainCategory.name;
            bookingData.subcategory_name = bookingDetails.subCategory.name;
            if (host != "en") {
                bookingData.parent_category_name = (bookingDetails.mainCategory[langName+'Name']) ? (bookingDetails.mainCategory[langName+'Name']) : bookingDetails.mainCategory.name;
            }
            if (host != "en") {
                bookingData.subcategory_name = (bookingDetails.subCategory[langName+'Name']) ? (bookingDetails.subCategory[langName+'Name']) : bookingDetails.subCategory.name;
            }
            bookingData.parent_category_type = bookingDetails.mainCategory.type;
            bookingData.parent_category_image = process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + bookingDetails.mainCategory.image;
            bookingData.subcategory_image = process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + bookingDetails.subCategory.image;
            bookingData.date = bookingDetails.bookedWhen;
            bookingData.description = bookingDetails.bookedFor;
            bookingData.otp = bookingDetails.otp;
            bookingData.commission = bookingDetails.commission;
            bookingData.tax = bookingDetails.tax;
            bookingData.price = bookingDetails.price;
            bookingData.total = bookingDetails.total;
            bookingData.payment_id = bookingDetails.paymentId;
            bookingData.booking_status = bookingDetails.status;
            bookingData.settlement = (bookingDetails.settlement === 0) ? "false" : "true";
            bookingData.paid = (bookingDetails.status === "paid") ? "true" : "false";
            bookingData.due_status = (bookingDetails.needStatus === 0) ? "pending" : "active";
            if (appSettings.instantLocation.toString() == "true") {
                if (bookingDetails.locationType == "transport") {
                    bookingData.source_location = bookingDetails.sourcelocation;
                    bookingData.source_lat = bookingDetails.sourceLat;
                    bookingData.source_lon = bookingDetails.sourceLon;
                    bookingData.dest_location = bookingDetails.destLocation;
                    bookingData.dest_lat = bookingDetails.destLat;
                    bookingData.dest_lon = bookingDetails.destLon;
                    
                }
                else if (bookingDetails.locationType == "home") {
                    bookingData.source_location = bookingDetails.sourcelocation;
                    bookingData.source_lat = bookingDetails.sourceLat;
                    bookingData.source_lon = bookingDetails.sourceLon;
                    
                }
            }
            else{
                if (bookingDetails.locationType == "transport") {
                    bookingData.source_location = bookingDetails.sourcelocation;
                    bookingData.dest_location = bookingDetails.destLocation;
                    
                }
                else if (bookingDetails.locationType == "home") {
                    bookingData.source_location = bookingDetails.sourcelocation;
                }

            }
            if (bookingDetails.bookedType === "userneeds") {
                let dueDate = moment(bookingDetails.bookedWhen).isBefore(moment().startOf('day').toISOString());
                bookingData.due_status = (dueDate) ? "expired" : bookingData.due_status;
            }

            bookingServices.filter(function (eachService) {
                totalPrice = parseFloat(eachService.total).toFixed(2);
                var name =  (eachService.serviceId[langName+'Name']) ? (eachService.serviceId[langName+'Name']):eachService.serviceId.name;
                allServices.push({
                    service_id: eachService.serviceId._id,
                    service_price: eachService.price,
                    service_name:name,
                    service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachService.serviceId.image,
                    service_pricing: eachService.serviceId.costType,
                    service_quantity: eachService.quantity,
                    service_total_price: totalPrice.toString()
                });
            });

            bookingData.services = allServices;

            let taskerdetails = {};

            if (bookingDetails.taskerId) {
                taskerdetails.id = bookingDetails.taskerId.userId;
                taskerdetails.name = bookingDetails.taskerId.name;
                taskerdetails.image = process.env.BASE_URL + process.env.TASKER_MEDIA_URL + bookingDetails.taskerId.image;
                taskerdetails.rating = bookingDetails.taskerId.rating;
                taskerdetails.phone = bookingDetails.taskerId.mobile;
                taskerdetails.reviews = taskerReviews;
                taskerdetails.completed_tasks = completedTasks;
            };
            rewarddetails.status = "false";
            reviewdetails.status = "false";

            if (bookingDetails.reward !== "0") {
                rewarddetails.status = "true";
                rewarddetails.amount = bookingDetails.reward;
            }

            if (bookingReviews) {
                reviewdetails.status = "true";
                reviewdetails.review_id = bookingReviews._id;
                reviewdetails.review_description = bookingReviews.description;
                reviewdetails.rating = bookingReviews.rating;
            }

            bookingData.chat_id = "";

            if (chatDetails) {
                bookingData.chat_id = (chatDetails._id) ? chatDetails._id : "";
            }

            bookingData.tasker = (taskerdetails) ? taskerdetails : [];
            bookingData.review = reviewdetails;
            bookingData.reward = rewarddetails;
            return res.status(200).json(bookingData);
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.taskerbookingDetails = async function (req, res) {
    if (!req.body.booking_id || !req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params9") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var langName = object.toLowerCase();

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let bookingDetails = await Booking.findById(req.body.booking_id).populate("mainCategory").populate("userId").populate("subCategory");

            if (bookingDetails.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No bookings found") });

            let bookingServices = await BookingDetail.find({ bookingId: req.body.booking_id }).populate("serviceId");

            if (bookingServices.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No bookings found") });

            let bookingReviews = await Review.findOne({ bookingId: req.body.booking_id });

            let chatDetails = {};

            if (bookingDetails.taskerId) {
                chatDetails = await Chat.findOne({ bookingId: req.body.booking_id, taskerId: userDetails._id });
            }

            let bookingData = {};
            let reviewdetails = {};
            let rewarddetails = {};
            let allServices = [];
            let totalPrice = 0;
            bookingData.status_code = 200;
            bookingData.reference_id = (bookingDetails.bookingId) ? (bookingDetails.bookingId) : "";
            bookingData.booking_type = bookingDetails.bookedType;
            bookingData.parent_category_id = bookingDetails.mainCategory._id;
            bookingData.subcategory_id = bookingDetails.subCategory._id;
            bookingData.parent_category_name = bookingDetails.mainCategory.name;
            bookingData.subcategory_name = bookingDetails.subCategory.name;
            if (host != "en") {
                bookingData.parent_category_name = (bookingDetails.mainCategory[langName+'Name']) ? (bookingDetails.mainCategory[langName+'Name']) : bookingDetails.mainCategory.name;
            }
            if (host != "en") {
                bookingData.subcategory_name = (bookingDetails.subCategory[langName+'Name']) ? (bookingDetails.subCategory[langName+'Name']) : bookingDetails.subCategory.name;
            }
            bookingData.parent_category_type = bookingDetails.mainCategory.type;
            bookingData.location_type = bookingDetails.locationType;
            bookingData.source_location = bookingDetails.sourcelocation;
            bookingData.source_lat = bookingDetails.sourceLat;
            bookingData.source_lon = bookingDetails.sourceLon;
            bookingData.dest_location = bookingDetails.destLocation;
            bookingData.dest_lat = bookingDetails.destLat;
            bookingData.dest_lon = bookingDetails.destLon;
            bookingData.parent_category_image = process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + bookingDetails.mainCategory.image;
            bookingData.subcategory_image = process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + bookingDetails.subCategory.image;
            bookingData.date = bookingDetails.bookedWhen;
            bookingData.description = bookingDetails.bookedFor;
            bookingData.otp = bookingDetails.otp;
            bookingData.commission = bookingDetails.commission;
            bookingData.tax = bookingDetails.tax;
            bookingData.price = bookingDetails.price;
            bookingData.total = bookingDetails.total;
            bookingData.payment_id = bookingDetails.paymentId;
            bookingData.booking_status = bookingDetails.status;
            bookingData.paid = (bookingDetails.status === "paid") ? "true" : "false";
            bookingData.due_status = (bookingDetails.needStatus === 0) ? "pending" : "active";

            if (bookingDetails.bookedType === "userneeds") {
                let dueDate = moment(bookingDetails.bookedWhen).isBefore(moment().startOf('day').toISOString());
                bookingData.due_status = (dueDate) ? "expired" : bookingData.due_status;
            }

            bookingServices.filter(function (eachService) {
                var name =  (eachService.serviceId[langName+'Name']) ? (eachService.serviceId[langName+'Name']):eachService.serviceId.name;
                totalPrice = parseFloat(eachService.total).toFixed(2);
                allServices.push({
                    service_id: eachService.serviceId._id,
                    service_price: eachService.price,
                    service_name: name, 
                    service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachService.serviceId.image,
                    service_pricing: eachService.serviceId.costType,
                    service_quantity: eachService.quantity,
                    service_total_price: totalPrice.toString()
                });
            });

            bookingData.services = allServices;

            let userdetails = {
                id: bookingDetails.userId.userId,
                name: bookingDetails.userId.name,
                image: process.env.BASE_URL + process.env.USER_MEDIA_URL + bookingDetails.userId.image,
                phone: bookingDetails.userId.mobile,
            };

            rewarddetails.status = "false";
            reviewdetails.status = "false";


            if (bookingDetails.reward !== "0") {
                rewarddetails.status = "true";
                rewarddetails.amount = bookingDetails.reward;
            }

            if (bookingReviews) {
                reviewdetails.status = "true";
                reviewdetails.review_id = bookingReviews._id;
                reviewdetails.review_description = bookingReviews.description;
                reviewdetails.rating = bookingReviews.rating;
            }

            bookingData.chat_id = "";

            if (chatDetails) {
                bookingData.chat_id = (chatDetails._id) ? chatDetails._id : "";
            }

            bookingData.user = userdetails;
            bookingData.review = reviewdetails;
            bookingData.reward = rewarddetails;
            return res.status(200).json(bookingData);
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.taskerBookingStatus = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id | !req.body.status) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params10") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            let appSettings = await Setting.findOne({});
            
            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let bookingDetails = await Booking.findById(req.body.booking_id);
            let userdetailsid = bookingDetails.userId;
            let bookinguserDetails = await User.findOne({ _id: userdetailsid, role: "user" });
            
            let languageType = bookinguserDetails.languageType;

            if (bookingDetails.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No bookings found") });

            if (bookingDetails.taskerId.toString() !== userDetails._id.toString())
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });

            if (req.body.status === "completed" && !req.body.otp)
                return res.status(200).json({ status_code: 400, message: res.__("Invalid Params11") });

            if ((req.body.status === "completed") && (req.body.otp !== bookingDetails.otp))
                return res.status(200).json({ status_code: 400, message: res.__("Verificaton Failed") });

            if ((bookingDetails.status === "cancelled") && (req.body.status === "started" || req.body.status === "completed")) {
                return res.status(200).json({ status_code: 400, booking_status: bookingDetails.status, message: res.__("Booking is already") + " " + bookingDetails.status });
            }
            else {
                bookingDetails.status = req.body.status;
                bookingDetails.save();

                if (req.body.status === "cancelled") {
                    // booking cancelled
                    let servicelist = await BookingDetail.find({ bookingId: bookingDetails._id}).populate("serviceId").populate("bookingId");
                    let services = [];
                    servicelist.filter(function (eachService) {
                        let ser = {};
                        ser.services = eachService.serviceId.name;
                        ser.servicePrice = eachService.price;
                        ser.serviceCount = eachService.quantity;
                        ser.serviceTotal = eachService.total;
                        services.push(ser);
                    });
                    if (bookinguserDetails.bookingEmail === "true") {
                        let mailData = {};
                        mailData.to = bookinguserDetails.email;
                        mailData.subject = res.__("Booking Cancellation");
                        mailData.title = res.__("Hello") + " " + bookinguserDetails.name;
                        mailData.service = services;
                        mailData.tax = bookingDetails.tax;
                        mailData.commission = bookingDetails.commission;
                        mailData.totalAmount = bookingDetails.total;
                        mailData.message = res.__("Your booking") + " " + bookingDetails._id + " " + res.__("is cancelled");
                        mailerController.sendMail(mailData);
                    }
                }
                let logMessage;
                let messageTxt;
                if (req.body.status === "cancelled") {
                    let verified = await User.updateMany({ _id: bookingDetails.taskerId }, {$set: {onride: 0}},{multi: true});
                    messageTxt = 'Your service has been cancelled'
                    logMessage = res.__({ phrase: 'Your service has been cancelled', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", messageTxt);
                }
                else if(req.body.status === "completed"){
                    let verified = await User.updateMany({ _id: bookingDetails.taskerId }, {$set: {onride: 0}},{multi: true});
                    messageTxt = 'Your service has been completed'
                    logMessage = res.__({ phrase: 'Your service has been completed', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", messageTxt);
                    var date = new Date();
                    let payout = appSettings.payoutDate;
                    let time =  date.setDate(date.getDate() + payout);
                    time = new Date(time).toISOString();
                    Booking.findByIdAndUpdate(bookingDetails._id, { payoutDate: time }, function (error, userDetails) {
                        if (error) {
                            console.log(error);
                        }
                        else{
                            console.log(userDetails);
                        }
                    });
                    
                   
                }
                else if(req.body.status === "paid"){
                    messageTxt = 'Your service has been paid'
                    logMessage = res.__({ phrase: 'Your service has been paid', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", messageTxt);
                }
                else if(req.body.status === "requested"){
                    messageTxt = 'Your service has been requested'
                    logMessage = res.__({ phrase: 'Your service has been requested', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", messageTxt);
                }
                else if(req.body.status === "ongoing"){
                    messageTxt = 'Your service is in progress'
                    logMessage = res.__({ phrase: 'Your service is in progress', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", messageTxt);
                }
                else if(req.body.status === "started"){
                    if (bookingDetails.locationType == "transport") {
                        let verified = await User.updateMany({ _id: bookingDetails.taskerId }, {$set: {onride: 1}},{multi: true});
                    }
                    messageTxt = 'Your service has been started'
                    logMessage = res.__({ phrase: 'Your service has been started', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.userId, bookingDetails._id, "booking", messageTxt);
                }
               
                bookingNotification(bookingDetails.userId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                if (req.body.status === "completed") {
                    tasksCompleted(userDetails._id);
                }
            }
            return res.status(200).json({ status_code: 200, message: res.__("Booking status updated successfully") });

        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.userBookingStatus = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id | !req.body.status) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params12") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });
            
            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let bookingDetails = await Booking.findById(req.body.booking_id);

            let tasker = await User.findOne({ _id: bookingDetails.taskerId, role: "tasker" });
            let languageType;
            if(tasker){
                languageType = tasker.languageType;
            }

            if (bookingDetails.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No bookings found") });

            if (bookingDetails.userId.toString() !== userDetails._id.toString())
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });

            if ((bookingDetails.status === "requested" || bookingDetails.status === "paid") && (bookingDetails.bookedType === "professional")) {
                bookingDetails.status = req.body.status;
                bookingDetails.save();

                if (req.body.status === "cancelled") {
                    // task cancelled
                    let servicelist = await BookingDetail.find({ bookingId: bookingDetails._id}).populate("serviceId").populate("bookingId");
                    let services = [];
                    servicelist.filter(function (eachService) {
                        let ser = {};
                        ser.services = eachService.serviceId.name;
                        ser.servicePrice = eachService.price;
                        ser.serviceCount = eachService.quantity;
                        ser.serviceTotal = eachService.total;
                        services.push(ser);
                    });

                    
                    if (tasker.bookingEmail === "true") {
                        let mailData = {};
                        mailData.to = tasker.email;
                        mailData.subject = res.__("Booking Cancellation");
                        mailData.title = res.__("Hello") + " " + tasker.name;
                        mailData.service = services;
                        mailData.tax = bookingDetails.tax;
                        mailData.commission = bookingDetails.commission;
                        mailData.totalAmount = bookingDetails.total;
                        mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + " " + res.__("is cancelled");
                        mailerController.sendMail(mailData);
                    }
                }
               
                paymentController.refundBooking(bookingDetails._id);
                let messageText = 'Your service has been cancelled';
                let logMessage = res.__({ phrase: messageText, locale: languageType });
                
                logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", messageText);

                if (bookingDetails.taskerId) {
                    bookingNotification(bookingDetails.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                }

                return res.status(200).json({ status_code: 200, message: res.__("Booking status updated successfully") });

            } else if ((bookingDetails.status === "requested" || bookingDetails.status === "accepted") && (bookingDetails.bookedType === "userneeds" || bookingDetails.bookedType === "marketplace")) {
                bookingDetails.status = req.body.status;
                bookingDetails.save();
                if (req.body.status === "cancelled") {
                    // task cancelled
                    if (tasker) {
                        let servicelist = await BookingDetail.find({ bookingId: bookingDetails._id}).populate("serviceId").populate("bookingId");
                        let services = [];
                        servicelist.filter(function (eachService) {
                            let ser = {};
                            ser.services = eachService.serviceId.name;
                            ser.servicePrice = eachService.price;
                            ser.serviceCount = eachService.quantity;
                            ser.serviceTotal = eachService.total;
                            services.push(ser);
                        });
                        if (tasker.bookingEmail === "true") {
                            let mailData = {};
                            mailData.to = tasker.email;
                            mailData.subject = res.__("Booking Cancellation");
                            mailData.title = res.__("Hello") + " " + tasker.name;
                            mailData.service = services;
                            mailData.tax = bookingDetails.tax;
                            mailData.commission = bookingDetails.commission;
                            mailData.totalAmount = bookingDetails.total;
                            mailData.message = res.__("Your booking") + " " + bookingDetails.bookingId + " " + res.__("is cancelled");
                            mailerController.sendMail(mailData);
                        }
                    }
                }

                paymentController.refundBooking(bookingDetails._id);
                let logMessage;
                let txtMsg;
                if (req.body.status === "cancelled") {
                    let verified = await User.updateMany({ _id: bookingDetails.taskerId }, {$set: {onride: 0}},{multi: true});
                    txtMsg = 'Your service has been cancelled'
                    logMessage = res.__({ phrase: 'Your service has been cancelled', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg);
                }
                else if(req.body.status === "completed"){
                    let verified = await User.updateMany({ _id: bookingDetails.taskerId }, {$set: {onride: 0}},{multi: true});
                    txtMsg = 'Your service has been completed'
                    logMessage = res.__({ phrase: 'Your service has been completed', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg);
                    var date = new Date();
                    let payout = appSettings.payoutDate;
                    let time =  date.setDate(date.getDate() + payout);
                    time = new Date(time).toISOString();
                    Booking.findByIdAndUpdate(bookingDetails._id, { payoutDate: time }, function (error, userDetails) {
                        if (error) {
                            console.log(error);
                        }
                        else{
                            console.log(userDetails);
                        }
                    });
                }
                else if(req.body.status === "paid"){
                    txtMsg = 'Your service has been paid'
                    logMessage = res.__({ phrase: 'Your service has been paid', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg);
                }
                else if(req.body.status === "requested"){
                    txtMsg = 'Your service has been requested'
                    logMessage = res.__({ phrase: 'Your service has been requested', locale: languageType })
                    logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg); 
                }
                else if(req.body.status === "ongoing"){
                    txtMsg = 'Your service has been ongoing'
                    logMessage = res.__({ phrase: 'Your service has been ongoing', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg);
                }
                else if(req.body.status === "started"){
                    if (bookingDetails.locationType == "transport") {
                        let verified = await User.updateMany({ _id: bookingDetails.taskerId }, {$set: {onride: 1}},{multi: true});
                    }
                    txtMsg = 'Your service has been started'
                    logMessage = res.__({ phrase: 'Your service has been cancelled', locale: languageType }) 
                    logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "booking", txtMsg);
                }
                
                if (bookingDetails.taskerId) {
                    bookingNotification(bookingDetails.taskerId, { "name": userDetails.name, "message": { "booking_id": bookingDetails._id, "message": logMessage } });
                }

                return res.status(200).json({ status_code: 200, message: res.__("Booking status updated successfully") });

            } else {
                return res.status(200).json({ status_code: 400, booking_status: bookingDetails.status, message: res.__("Booking is already") + " " + bookingDetails.status });
            }
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.userCompletedTask = async function (req, res) {
    if (!req.body.user_id ) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params13") });
    }
    else {
        try {
            let completedBooking = await Booking.find({ userId: userDetails._id }).populate("serviceId");
            let userTasker = {};
            let allServices = [];
            completedBooking.filter(function (eachService) {
                allServices.push({
                    subcategory: eachService.serviceId.name,
                });
            });
            userTasker.services = allServices;
            return res.status(200).json({ userTasker });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

// tasker got a job
let taskerAssigned = function (taskerId) {
    User.findByIdAndUpdate(taskerId, { lastBookedOn: moment().toISOString() }, function (error, userDetails) {
        if (error) {
            // console.log(error);
        }
    });
};


// tasker has completed no of jobs
let tasksCompleted = async function (taskerId) {
    let completedTasks = await Booking.countDocuments({ taskerId: taskerId, status: { $in: ["completed"] } });
    if (completedTasks) {
        User.findByIdAndUpdate(taskerId, { tasksCompleted: completedTasks.toString() }, function (error, userDetails) {
            if (error) {
                // console.log(error);
            }
        });
    }
};

let bookingNotification = function (userId, MsgData) {
    User.findById(userId, function (error, userDetails) {
        if (!error && userDetails) {
            if (userDetails.bookingNotification === "true" && userDetails.deviceActive === 1) {
                console.log("Notify checking two")
                console.log(userDetails.deviceToken)
                
                fcmService.notifyUser(userDetails.deviceToken, { "title": MsgData.name, "scope": "booking", "message": JSON.stringify(MsgData) },userDetails.languageType);
            }
        }
    });
};

