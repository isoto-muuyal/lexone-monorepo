const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const moment = require("moment");

// models
const User = require('../models/userModel');
const Media = require('../models/mediaModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const Setting = require('../models/settingModel');

// auth middleware
const userAuth = require("../middlewares/auth");

// email service
const mailerController = require('./mailController');

exports.signUp = async function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.mobile || !req.body.password || !req.body.device_mode || !req.body.device_platform || !req.body.location || !req.body.language_type) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            const emailExists = await User.findOne({ email: req.body.email });
            let appSettings = await Setting.findOne({});

            if (emailExists)
                return res.status(200).json({ status_code: 400, message: res.__("Email Already exists") });

            const phoneExists = await User.findOne({ mobile: req.body.mobile });
            if (phoneExists)
                return res.status(200).json({ status_code: 400,type:res.__(phoneExists.role), message: res.__("Mobile number Already used by "+phoneExists.role) }); 

            let userData = {};
            userData.name = req.body.name;
            userData.userId = uuidv4();
            userData.email = req.body.email.replace(/\s+/g, '');
            userData.mobile = req.body.mobile;
            userData.role = "tasker";
            userData.password = req.body.password;
            userData.languageType = req.body.language_type;
            if (req.body.device_token) {
                userData.deviceToken = req.body.device_token.replace(/\s+/g, '');
            }
            if (appSettings.instantLocation.toString() == "true") {
                if (!req.body.lat || !req.body.lon ) {
                    return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
                }
                else{
                    userData.lat = req.body.lat;
                    userData.lon = req.body.lon;
                }
                
            }
            userData.deviceMode = req.body.device_mode;
            userData.devicePlatform = req.body.device_platform;
            userData.location = req.body.location.replace(/\s+/g, '');
            let user = new User(userData);
            await user.save(function (error, userDetails) {
                if (!error) {

                    let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.TASKER_MEDIA_URL + userDetails.image : "";

                    // welcome mail
                    let mailData = {};
                    mailData.to = req.body.email;
                    mailData.subject = res.__("Welcome Mail");
                    mailData.title = res.__("Hello") + " " + userDetails.name;
                    mailData.message = res.__("Your tasker account is registered. Signin to continue to your account");
                    mailerController.sendMail(mailData);

                    return res.status(200).json({
                        status_code: 200,
                        user_id: userDetails.userId,
                        access_token: userAuth.createJwt(userDetails),
                        name: userDetails.name,
                        email: userDetails.email,
                        mobile: userDetails.mobile,
                        user_image: profileImage,
                        availability: userDetails.availability.toString(),
                        rating: userDetails.rating,
                        location: userDetails.location,
                        lat: userDetails.lat,
                        lon: userDetails.lon,
                        language_type : userDetails.languageType,
                    });
                } else {
                    return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                }
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.signIn = async function (req, res) {
    if (!req.body.email || !req.body.password || !req.body.device_token) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ email: req.body.email });
            let appSettings = await Setting.findOne({});

            if (!userDetails)
                return res.status(200).json({ status_code: 400, message: res.__("Enter the registered Email ID") });

            if (userDetails.role === "user")
                return res.status(200).json({ status_code: 400, message: res.__("Mail id register as a User. Try with some other mail") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });
            
            if (userDetails.status === 2)
                return res.status(200).json({ status_code: 402, message: res.__("Your account has been deleted. Kindly,Contact admin to restore the account") });

            const isValid = await User.isValidPassword(req.body.password, userDetails.password);

            if (!isValid)
                return res.status(200).json({ status_code: 400, message: res.__("Email / Password is not valid") });

            if (req.body.device_token && req.body.device_mode && req.body.device_platform) {
                userDetails = await User.findOneAndUpdate({ email: req.body.email }, { deviceToken: req.body.device_token, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
            }

            let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.TASKER_MEDIA_URL + userDetails.image : "";
            
            let payment;
            const stripe = require('stripe')(appSettings.stripePrivateKey);
            if (userDetails.accountId) {
                const account = await stripe.accounts.retrieve(
                    userDetails.accountId
                );
                if (account.charges_enabled == true) {
                    payment = "true";
                }
                else{
                    payment = "false";
                }
            }
            else{
                payment = "false";
            }
            userDetails.deviceToken = req.body.device_token;
            return res.status(200).json({
                status_code: 200,
                user_id: userDetails.userId,
                access_token: userAuth.createJwt(userDetails),
                name: userDetails.name,
                email: userDetails.email,
                mobile: userDetails.mobile,
                user_image: profileImage,
                rating: userDetails.rating,
                type: userDetails.role,
                location: userDetails.location,
                about: userDetails.about,
                profile_verified: (userDetails.verified) ? "true" : "false",
                payment_verified: payment,
                lat: userDetails.lat,
                lon: userDetails.lon,
            });
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.forgotPassword = async function (req, res) {
    
    // return false;    
    if (!req.body.email) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ email: req.body.email });

            if (!userDetails)
                return res.status(200).json({ status_code: 400, message: res.__("Email is not registered") });

            if(userDetails.role === "user")
                return res.status(200).json({ status_code: 400, message: res.__("Enter tasker email address") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });
            
            if (userDetails.status === 2)
                return res.status(200).json({ status_code: 401, message: res.__("Your account has been deleted. Kindly,Contact admin to restore the account") });

            // reset user's password
            let newPassword = nanoid(12);
            userDetails.password = newPassword;
            await userDetails.save();

            let mailData = {};
            mailData.to = req.body.email;
            // mailData.mailtype = "forgotpassword";
            mailData.subject = res.__("Reset Password");
            mailData.title = res.__("Reset Password is Done !");
            mailData.message = res.__("We received a request to reset your password");
            mailData.message_details = res.__("Your new password is") + " " + newPassword;

            mailerController.sendpasswordMail(mailData);

            return res.status(200).json({
                status_code: 200,
                message: res.__("Forgot Password mail is send successfully")
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
}


exports.userProfile = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            let appSettings = await Setting.findOne({});

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            if (req.body.name)
                userDetails.name = req.body.name;

            if (req.body.mobile)
                userDetails.mobile = req.body.mobile;

            if (req.body.location)
                userDetails.location = req.body.location;

            if (req.body.about)
                userDetails.about = req.body.about;

            if (req.body.stripe_public_key)
                userDetails.stripePublicKey = req.body.stripe_public_key;

            if (req.body.stripe_private_key)
                userDetails.stripePrivateKey = req.body.stripe_private_key;

            if (req.body.work_mode)
                userDetails.availability = (req.body.work_mode === "true") ? 1 : 0;

            if (req.body.chat_notification)
                userDetails.chatNotification = req.body.chat_notification;

            if (req.body.booking_notification)
                userDetails.bookingNotification = req.body.booking_notification;

            if (req.body.booking_email)
                userDetails.bookingEmail = req.body.booking_email;

            if (req.body.payment_email)
                userDetails.paymentEmail = req.body.payment_email;

            if (req.body.device_token) {
                userDetails.deviceActive = 1;
                userDetails.deviceToken = req.body.device_token;
            }
            if (req.body.language_type) {
                userDetails.languageType = req.body.language_type;
            }
            if (appSettings.instantLocation.toString() == "true") {
                if (req.body.source_lat && req.body.source_lon) {
                    let lon = parseFloat(req.body.source_lon);
                    let lat = parseFloat(req.body.source_lat);
                    userDetails.loc = [lon, lat];
                }
            }

            if (req.body.name || req.body.mobile || req.body.location || req.body.lat || req.body.lon || req.body.about || req.body.stripe_public_key || req.body.stripe_private_key || req.body.chat_notification || req.body.booking_notification || req.body.booking_email || req.body.payment_email || req.body.work_mode || req.body.device_token || req.body.language_type) {
                //await userDetails.save();

                //let mobileExist = await User.findOne({ mobile: req.body.mobile, userId: { $ne: req.body.user_id }, role: "tasker"});
                let mobileExist = await User.findOne({ mobile: req.body.mobile });
                console.log("***");
                console.log(mobileExist);
                console.log(req.body.user_id);
                console.log("***");
                // if(mobileExist){
                //     if(mobileExist.userId === req.body.user_id){
                //         await userDetails.save();
                //     }else{
                //         return res.status(200).json({ status_code: 400, message: res.__("Mobile number Already used by "+mobileExist.role) });
                //     }
                // }
                await userDetails.save();                
            }
            let lat;
            let lon
            if (userDetails.loc.length != 0) {
                lat = userDetails.loc[1].toString();
                lon = userDetails.loc[0].toString();
            }

            let payment;
            const stripe = require('stripe')(appSettings.stripePrivateKey);
            if (userDetails.accountId) {
                const account = await stripe.accounts.retrieve(
                    userDetails.accountId
                );
                if (account.charges_enabled == true) {
                    payment = "true";
                }
                else{
                    payment = "false";
                }
            }
            else{
                payment = "false";
            }

            let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.TASKER_MEDIA_URL + userDetails.image : "";

            return res.status(200).json({
                status_code: 200,
                user_id: userDetails.userId,
                name: userDetails.name,
                email: userDetails.email,
                mobile: userDetails.mobile,
                user_image: profileImage,
                location: userDetails.location,
                lat: lat,
                lon: lon,
                profile_verified: (userDetails.verified) ? "true" : "false",
                payment_verified: payment,
                stripe_public_key: (userDetails.stripePublicKey) ? userDetails.stripePublicKey : "",
                stripe_private_key: (userDetails.stripePrivateKey) ? userDetails.stripePrivateKey : "",
                about: userDetails.about,
                rating: userDetails.rating,
                work_mode: (userDetails.availability === 1) ? "true" : "false",
                chat_notification: userDetails.chatNotification,
                booking_notification: userDetails.bookingNotification,
                booking_email: userDetails.bookingEmail,
                payment_email: userDetails.paymentEmail,
                language_type: userDetails.languageType
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};



exports.userProfileupdate = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            let appSettings = await Setting.findOne({});

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            if (req.body.name)
                userDetails.name = req.body.name;

            if (req.body.mobile)
                userDetails.mobile = req.body.mobile;

            if (req.body.location)
                userDetails.location = req.body.location;

            if (req.body.about)
                userDetails.about = req.body.about;

            if (req.body.stripe_public_key)
                userDetails.stripePublicKey = req.body.stripe_public_key;

            if (req.body.stripe_private_key)
                userDetails.stripePrivateKey = req.body.stripe_private_key;

            if (req.body.work_mode)
                userDetails.availability = (req.body.work_mode === "true") ? 1 : 0;

            if (req.body.chat_notification)
                userDetails.chatNotification = req.body.chat_notification;

            if (req.body.booking_notification)
                userDetails.bookingNotification = req.body.booking_notification;

            if (req.body.booking_email)
                userDetails.bookingEmail = req.body.booking_email;

            if (req.body.payment_email)
                userDetails.paymentEmail = req.body.payment_email;

            if (req.body.device_token) {
                userDetails.deviceActive = 1;
                userDetails.deviceToken = req.body.device_token;
            }
            if (req.body.language_type) {
                userDetails.languageType = req.body.language_type;
            }
            if (appSettings.instantLocation.toString() == "true") {
                if (req.body.source_lat && req.body.source_lon) {
                    let lon = parseFloat(req.body.source_lon);
                    let lat = parseFloat(req.body.source_lat);
                    userDetails.loc = [lon, lat];
                }
            }

            if (req.body.name || req.body.mobile || req.body.location || req.body.lat || req.body.lon || req.body.about || req.body.stripe_public_key || req.body.stripe_private_key || req.body.chat_notification || req.body.booking_notification || req.body.booking_email || req.body.payment_email || req.body.work_mode || req.body.device_token || req.body.language_type) {
                
                if(req.body.mobile){
                    let mobileExist = await User.findOne({ mobile: req.body.mobile });
                    if(mobileExist){
                        console.log(mobileExist.userId);
                        console.log(mobileExist.mobile);
                        console.log(req.body.user_id);
                        if(mobileExist.userId === req.body.user_id){

                        }else{
                            return res.status(200).json({ status_code: 500, type:res.__(mobileExist.role), message: res.__("Phone number exist with another user") });
                        }
                    }
                }

                await userDetails.save();
                
            }
            let lat;
            let lon
            if (userDetails.loc.length != 0) {
                lat = userDetails.loc[1].toString();
                lon = userDetails.loc[0].toString();
            }

            let payment;
            const stripe = require('stripe')(appSettings.stripePrivateKey);
            if (userDetails.accountId) {
                const account = await stripe.accounts.retrieve(
                    userDetails.accountId
                );
                if (account.charges_enabled == true) {
                    payment = "true";
                }
                else{
                    payment = "false";
                }
            }
            else{
                payment = "false";
            }

            let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.TASKER_MEDIA_URL + userDetails.image : "";
            
            return res.status(200).json({
                status_code: 200,
                user_id: userDetails.userId,
                name: userDetails.name,
                email: userDetails.email,
                mobile: userDetails.mobile,
                user_image: profileImage,
                location: userDetails.location,
                lat: lat,
                lon: lon,
                profile_verified: (userDetails.verified) ? "true" : "false",
                payment_verified: payment,
                stripe_public_key: (userDetails.stripePublicKey) ? userDetails.stripePublicKey : "",
                stripe_private_key: (userDetails.stripePrivateKey) ? userDetails.stripePrivateKey : "",
                about: userDetails.about,
                rating: userDetails.rating,
                work_mode: (userDetails.availability === 1) ? "true" : "false",
                chat_notification: userDetails.chatNotification,
                booking_notification: userDetails.bookingNotification,
                booking_email: userDetails.bookingEmail,
                payment_email: userDetails.paymentEmail,
                language_type: userDetails.languageType
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};



exports.mobileLogin = async function (req, res){
    if (!req.body.type || !req.body.mobile || !req.body.device_token || !req.body.language_type || !req.body.device_platform || !req.body.device_mode) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    const userDetails = await User.findOne({ mobile: req.body.mobile });
    console.log(userDetails);
    if (userDetails.status === 0)
        return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });
    
    if (userDetails.status === 2)
        return res.status(200).json({ status_code: 402, message: res.__("Your account has been deleted. Kindly,Contact admin to restore the account") });
    if(userDetails){
        updateuserDetails = await User.findOneAndUpdate({ mobile: req.body.mobile }, { deviceToken: req.body.device_token, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
        const userDetails = await User.findOne({ mobile: req.body.mobile });
        let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";
        let payment;
        let appSettings = await Setting.findOne({});
        const stripe = require('stripe')(appSettings.stripePrivateKey);
        if (userDetails.accountId) {
                const account = await stripe.accounts.retrieve(
                    userDetails.accountId
                );
                if (account.charges_enabled == true) {
                    payment = "true";
                }
                else{
                    payment = "false";
                }
        }else{
                payment = "false";
        }

        return res.status(200).json({
            status_code: 200,
            user_id: userDetails.userId,
            access_token: userAuth.createJwt(userDetails),
            name: userDetails.name,
            email: userDetails.email,
            mobile: userDetails.mobile,
            user_image: profileImage,
            account_exists: "1",
            rating: userDetails.rating,
            type: userDetails.role,
            location: userDetails.location,
            about: userDetails.about,
            profile_verified: (userDetails.verified) ? "true" : "false",
            payment_verified: payment,
            lat: userDetails.lat,
            lon: userDetails.lon,
        });
    }else{
        return res.status(200).json({ status_code: 400, account_exists: "0", message: res.__("account not exist") });
    }

};

exports.resetPassword = async function (req, res) {
    if (!req.body.user_id || !req.body.current_password || !req.body.new_password) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            const isValid = await User.isValidPassword(req.body.current_password, userDetails.password);

            const samePassword = await User.isValidPassword(req.body.new_password, userDetails.password);

            if (!isValid)
                return res.status(200).json({ status_code: 400, message: res.__("Old Password is incorrect") });

            if (samePassword)
                return res.status(200).json({ status_code: 400, message: res.__("New password cannot be same as your old password") });

            // reset user's password
            userDetails.password = req.body.new_password;
            await userDetails.save();

            return res.status(200).json({
                status_code: 200,
                message: res.__("Password changed successfully")
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.signOut = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            // user's signed out
            userDetails.deviceActive = 0;
            await userDetails.save();

            return res.status(200).json({
                status_code: 200,
                message: res.__("Logged Out Successfully")
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.deactivateAccount = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 400, message: res.__("Account is already disabled") });

            // user's account deactivated
            userDetails.status = 0;
            await userDetails.save();

            return res.status(200).json({
                status_code: 200,
                message: res.__("Account is deactivated successfully")
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.deleteAccount = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });
            let bookingCount = await Booking.find({ taskerId: userDetails._id,$or: [{status:"accepted"},{status:"paid"},{status:"started"}]}).count();                       

            if(bookingCount>0)
                return res.status(200).json({ status_code: 403, message: res.__("You can't Delete this Account.")});
                
            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 2)
                return res.status(200).json({ status_code: 400, message: res.__("Account is already deleted") });

            // user's account deleted
            userDetails.status = 2;
            userDetails.onlineStatus = 0;
            userDetails.lastActive = moment().toISOString();
            userDetails.deviceToken = "";
            await userDetails.save();

            let bookingDetails = await Booking.find({ taskerId: userDetails._id,status:"requested"});  
            if(bookingDetails)
            {
                bookingDetails.forEach(async element => {
                    await Booking.findOneAndUpdate({ _id: element._id }, {status:"cancelled",cancelled_by:"tasker"});
                });
            }

            return res.status(200).json({
                status_code: 200,
                message: res.__("Account deleted Successfully")
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.viewProfile = async function (req, res) {
    if (!req.params.taskerId) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        try {

            let userDetails = await User.findOne({ userId: req.params.taskerId, role: "tasker" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 400, message: res.__("Account is already disabled") });

            let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.TASKER_MEDIA_URL + userDetails.image : "";

            let taskerDetails = {};
            taskerDetails.status_code = 200;
            taskerDetails.user_id = userDetails.userId;
            taskerDetails.name = userDetails.name;
            taskerDetails.email = userDetails.email;
            taskerDetails.mobile = userDetails.mobile;
            taskerDetails.about = userDetails.about;
            taskerDetails.user_image = profileImage;
            taskerDetails.location = userDetails.location;
            taskerDetails.rating = userDetails.rating;
            taskerDetails.recent_reviews = [];

            let allMedia = await Media.find({ taskerId: userDetails._id, for: "portfolio" });
            let mediaFiles = [];

            if (allMedia.length > 0) {
                allMedia.filter(function (eachFile) {
                    mediaFiles.push({
                        item_id: eachFile._id,
                        item_name: eachFile.name,
                        item_url: process.env.BASE_URL + process.env.PORTFOLIO_MEDIA_URL + eachFile.media_name
                    });
                });
            }

            taskerDetails.portfolio = mediaFiles;

            let allReviews = await Review.find({ taskerId: userDetails._id }).populate('userId').populate('bookingId').limit(3);

            taskerDetails.reviews = userDetails.reviews;

            let taskerReviews = [];
            if (allReviews.length > 0) {
                allReviews.filter(function (eachReview) {
                    taskerReviews.push({
                        review_id: eachReview._id,
                        user_id: eachReview.userId._id,
                        name: eachReview.userId.name,
                        description: eachReview.description,
                        date: eachReview.updatedAt,
                        rating: eachReview.rating,
                        location: eachReview.bookingId.bookedWhere,
                        reference_id: eachReview.bookingId.bookingId,
                        booking_date: eachReview.bookingId.createdAt,
                        user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachReview.userId.image
                    });
                });
            }

            taskerDetails.recent_reviews = taskerReviews;
            taskerDetails.portfolio = mediaFiles;
            taskerDetails.completed_jobs = userDetails.tasksCompleted;
            return res.status(200).json(taskerDetails);
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.taskerDashboard = async function (req, res) {
    if (!req.params.taskerId) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        try {

            let userDetails = await User.findOne({ userId: req.params.taskerId, role: "tasker" });

            var host = req.headers['accept-language']; 

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 400, message: res.__("Account is already disabled") });

            let totalTasks = 0;
            let upcomingTasks = 0;
            let completedTasks = 0;
            let totalEarnings = 0;
            let pendingEarnings = 0;
            let upcomings = [];
            let taskerMonthly = [{
                "duration": res.__({ phrase: 'Jan', locale: host }),
                "earns": "0",
                "id": 1,
            },
            {
                "duration": res.__({ phrase: 'Feb', locale: host }),
                "earns": "0",
                "id": 2,
            },
            {
                "duration": res.__({ phrase: 'Mar', locale: host }),
                "earns": "0",
                "id": 3,
            },
            {
                "duration": res.__({ phrase: 'Apr', locale: host }),
                "earns": "0",
                "id": 4,
            },
            {
                "duration": res.__({ phrase: 'May', locale: host }),
                "earns": "0",
                "id": 5,
            },
            {
                "duration": res.__({ phrase: 'Jun', locale: host }),
                "earns": "0",
                "id": 6,
            },
            {
                "duration": res.__({ phrase: 'Jul', locale: host }),
                "earns": "0",
                "id": 7,
            },
            {
                "duration": res.__({ phrase: 'Aug', locale: host }),
                "earns": "0",
                "id": 8,
            },
            {
                "duration": res.__({ phrase: 'Sep', locale: host }),
                "earns": "0",
                "id": 9,
            },
            {
                "duration": res.__({ phrase: 'Oct', locale: host }),
                "earns": "0",
                "id": 10,
            },
            {
                "duration": res.__({ phrase: 'Nov', locale: host }),
                "earns": "0",
                "id": 11,
            },
            {
                "duration": res.__({ phrase: 'Dec', locale: host }),
                "earns": "0",
                "id": 12,
            }];
            let taskerWeekly = [
                {
                    "duration": res.__({ phrase: 'Sun', locale: host }),
                    "earns": "0",
                    "id": 1
                }, {
                    "duration": res.__({ phrase: 'Mon', locale: host }),
                    "earns": "0",
                    "id": 2
                },
                {
                    "duration": res.__({ phrase: 'Tue', locale: host }),
                    "earns": "0",
                    "id": 3
                },
                {
                    "duration": res.__({ phrase: 'Wed', locale: host }),
                    "earns": "0",
                    "id": 4
                },
                {
                    "duration": res.__({ phrase: 'Thu', locale: host }),
                    "earns": "0",
                    "id": 5
                },
                {
                    "duration": res.__({ phrase: 'Fri', locale: host }),
                    "earns": "0",
                    "id": 6
                },
                {
                    "duration": res.__({ phrase: 'Sat', locale: host }),
                    "earns": "0",
                    "id": 7
                }];
            var host = req.headers['accept-language']; 
            let weeks
            let months
            months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            weeks = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            totalTasks = await Booking.countDocuments({ taskerId: userDetails._id });
            upcomingTasks = await Booking.countDocuments({ taskerId: userDetails._id, status: { $in: ["accepted", "paid"] } });
            completedTasks = await Booking.countDocuments({ taskerId: userDetails._id, status: { $in: ["completed"] } });

            let userEarnings = await Booking.aggregate([{
                $match: {
                    status: "completed",
                    taskerId: userDetails._id,

                }
            }, {
                $group: {
                    _id: "null",
                    total: {
                        $sum: {
                            $add: [
                                { $toDouble: "$price" },
                                { $toDouble: "$reward" }
                            ]
                        }
                    },
                }
            }]).exec();


            let earningsPending = await Booking.aggregate([{
                $match: {
                    status: { $in: ["completed", "paid", "started"] },
                    taskerId: userDetails._id,

                }
            }, {
                $group: {
                    _id: "null",
                    total: {
                        $sum: { $toDouble: "$price" }
                    },
                }
            }]).exec();

            let monthlyBookings = await Booking.aggregate([{
                $match: {
                    status: "completed",
                    taskerId: userDetails._id,
                    createdAt: { $gte: new Date(moment().startOf('year').toISOString()), $lte: new Date(moment().endOf('year').toISOString()) }
                }
            },
            {
                "$project": {
                    "y": {
                        "$year": "$createdAt"
                    },

                    "m": {
                        "$month": "$createdAt"
                    },

                    "price": "$price",

                    "status": 1,

                }
            },
            {
                "$group": {
                    "_id": {
                        "year": "$y",
                        "month": "$m",
                    },

                    count: {
                        $sum: { $toDouble: "$price" }
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }
            }]).exec();

            let weeklyBookings = await Booking.aggregate([{
                $match: {
                    status: "completed",
                    taskerId: userDetails._id,
                    createdAt: { $gte: new Date(moment().startOf('week').toISOString()), $lte: new Date(moment().endOf('week').toISOString()) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: {
                        $sum: { $toDouble: "$price" }
                    }
                }
            },
            {
                $sort: {
                    "_id": 1,
                }
            }
            ]).exec();

            if (userEarnings.length > 0) {
                totalEarnings = userEarnings[0].total;
            }

            if (earningsPending.length > 0) {
                pendingEarnings = earningsPending[0].total;
            }

            if (monthlyBookings.length > 0) {
                monthlyBookings.filter(function (eachBooking) {
                    let bookingDay =  months[eachBooking._id.month]
                    let monthbooking = res.__({ phrase: bookingDay, locale: host })
                    taskerMonthly = taskerMonthly.filter(obj => obj.duration !== monthbooking);
                    taskerMonthly.push({
                        duration:monthbooking,
                        earns: eachBooking.count.toString(),
                        id: eachBooking._id.month
                    });
                });
            }

            if (weeklyBookings.length > 0) {
                weeklyBookings.filter(function (eachBooking) {
                    let bookingDay = moment(eachBooking._id).format('dddd');
                    bookingDay = bookingDay.slice(0, 3);
                    taskerWeekly = taskerWeekly.filter(obj => obj.duration !== bookingDay);
                    let bookingDay2 = res.__({ phrase: bookingDay, locale: host })
                    taskerWeekly.push({
                        duration: bookingDay2,
                        earns: eachBooking.count.toString(),
                        id: weeks.indexOf(bookingDay),
                    });
                });
            }

            tasksUpcoming = await Booking.find({ taskerId: userDetails._id, status: { $in: ["accepted", "paid"] } }).populate("mainCategory").populate("userId").populate("subCategory").populate("serviceId").sort({ "createdAt": -1 }).limit(10);

            if (tasksUpcoming.length > 0) {
                tasksUpcoming.filter(function (eachTask) {
                    if (host == "fr") {
                        upcomings.push({
                            item_id: eachTask._id,
                            item_name: eachTask.bookedName,
                            item_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachTask.mainCategory.image,
                            time: eachTask.bookedWhen,
                            location: eachTask.bookedWhere,
                            category_id: eachTask.mainCategory._id,
                            category_name: eachTask.mainCategory.frenchName,
                            subcategory_id: eachTask.subCategory._id,
                            subcategory_name: eachTask.subCategory.frenchName,
                            description: eachTask.bookedFor,
                            price: eachTask.total,
                        });
                    }
                    else if (host == "ar") {
                        upcomings.push({
                            item_id: eachTask._id,
                            item_name: eachTask.bookedName,
                            item_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachTask.mainCategory.image,
                            time: eachTask.bookedWhen,
                            location: eachTask.bookedWhere,
                            category_id: eachTask.mainCategory._id,
                            category_name: eachTask.mainCategory.arabicName,
                            subcategory_id: eachTask.subCategory._id,
                            subcategory_name: eachTask.subCategory.arabicName,
                            description: eachTask.bookedFor,
                            price: eachTask.total,
                        });
                    }
                    else{
                        upcomings.push({
                            item_id: eachTask._id,
                            item_name: eachTask.bookedName,
                            item_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachTask.mainCategory.image,
                            time: eachTask.bookedWhen,
                            location: eachTask.bookedWhere,
                            category_id: eachTask.mainCategory._id,
                            category_name: eachTask.mainCategory.name,
                            subcategory_id: eachTask.subCategory._id,
                            subcategory_name: eachTask.subCategory.name,
                            description: eachTask.bookedFor,
                            price: eachTask.total,
                        });
                    }
                });
            }

            let taskerStats = {
                status_code: 200,
                total_tasks: totalTasks.toString(),
                upcoming_tasks: upcomingTasks.toString(),
                completed_tasks: completedTasks.toString(),
                total_earnings: totalEarnings.toString(),
                pending_earnings: pendingEarnings.toString(),
                "earn": {
                    "month": taskerMonthly.sort(function (a, b) {
                        return a.id - b.id;
                    }),

                    "week": taskerWeekly.sort(function (a, b) {
                        return a.id - b.id;
                    })
                },
                upcoming: upcomings,
            };

            return res.status(200).json(taskerStats);
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.accountConnection = async function (req, res) {

    console.log(req.params.taskerToken);
    return;

   /*  if (!req.params.taskerToken) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    } */

    try {
        let appSettings = await Setting.findOne({});
        const Stripe = require('stripe');
        const stripe = Stripe(appSettings.stripePrivateKey);
        console.log(req.params.taskerToken); 
    }catch (err) {
        console.log(err);
        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
    }

    /* reuturn false;

    const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: req.params.taskerToken,
        });

    var connected_account_id = response.stripe_user_id; */
    

    /* let userDetails = await User.findOne({ userId: req.params.taskerId, role: "tasker" });
    userDetails.accountId = account.id
    await userDetails.save();

    return res.status(200).json({
        status_code: 200,
        account_id: connected_account_id
    }); */
};

exports.stripeUrl = async function (req, res) {
    if (!req.params.taskerId) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.params.taskerId, role: "tasker" });

            let appSettings = await Setting.findOne({});
            console.log("checking 11111111111111111");
            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            const Stripe = require('stripe');
            const stripe = Stripe(appSettings.stripePrivateKey);
           
            if(userDetails.accountId != null){
               
                const accountLinks = await stripe.accountLinks.create({
                    account: userDetails.accountId,
                    refresh_url: 'https://tudofyapp.com/stripe/reauth',
                   
                     return_url: 'https://tudofyapp.com/web/tasker/update-payout',
                         type: 'account_onboarding',
                });
                console.log("checking 11111111111111111");
                console.log(await stripe.countrySpecs.retrieve('MX'));
                console.log("checking 22222222222222222222");
                // console.log(account.country);  // Should print 'MX'

    
                return res.status(200).json({
                    status_code: 200,
                    stripe_url: accountLinks.url,
                    account_id: userDetails.accountId
                });
            }
            else{
                const account = await stripe.accounts.create({
                    
                    
                    country: 'MX',
                    type: 'express',
                    capabilities: {
                      card_payments: {
                        requested: true,
                      },
                      transfers: {
                        requested: true,
                      },
                    },
                   
                });
             
                const accountLinks = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'https://tudofyapp.com/stripe/reauth',
                    return_url: 'https://tudofyapp.com/web/tasker/update-payout',
                  
                    type: 'account_onboarding',
                });
                

                userDetails.accountId = account.id
                await userDetails.save();
                console.log("checking 11111111111111111");
                console.log(await stripe.countrySpecs.retrieve('MX'));
                console.log("checking 22222222222222222222");
                // console.log(account.country);  // Should print 'MX'

                console.log(accountLinks.url);
                return res.status(200).json({
                    status_code: 200,
                    stripe_url: accountLinks.url,
                    account_id: account.id
                });
                
            }
            
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.mapconnectAccount = async function (req, res) {

    if (!req.params.taskerId) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }else{
        try {
            let appSettings = await Setting.findOne({});
            let userDetails = await User.findOne({ userId: req.params.taskerId, role: "tasker" });

            const Stripe = require('stripe');
            const stripe = Stripe(appSettings.stripePrivateKey);

            const response = await stripe.oauth.token({
                grant_type: 'authorization_code',
                code: req.params.taskerToken,
                });
            
            let connected_account_id = response.stripe_user_id;
            userDetails.accountId = connected_account_id
            await userDetails.save();
            return res.status(200).json({
                status_code: 200,
                account_id: connected_account_id
            });
            
        }catch(err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }

    
    

    /* 

    

    
        
      */


};


exports.stripestatus = async function (req, res) {
    if (!req.params.taskerId) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.params.taskerId, role: "tasker" });

            let appSettings = await Setting.findOne({});

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            const Stripe = require('stripe');
            const stripe = Stripe(appSettings.stripePrivateKey);
            let accountStatus;
            
            
            if (userDetails.accountId != null) {
                 accountStatus = await stripe.accounts.retrieve(
                    userDetails.accountId
                );
                if (accountStatus.charges_enabled == true) {
                    return res.status(200).json({ status_code: 200, message: res.__("Details has been filled successfully") });
                }
                else{
                    return res.status(200).json({ status_code: 400, message: res.__("Some details has been not yet filled") });
                }
            }
            else{
                return res.status(200).json({ status_code: 200, message: res.__("No account detail found for tasker") });
            }
        }
        catch (err) {
            // console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

