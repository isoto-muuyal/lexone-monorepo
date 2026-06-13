const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const fs = require('fs');
const moment = require("moment");
// auth middleware
const userAuth = require("../middlewares/auth");

// models
const User = require('../models/userModel');
const Banner = require('../models/bannerModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');
const Booking = require('../models/bookingModel');

// email service
const mailerController = require('./mailController');

exports.signUp = async function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.mobile || !req.body.password || !req.body.login_id || !req.body.login_type || !req.body.device_mode || !req.body.device_platform || !req.body.language_type) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            const emailExists = await User.findOne({ email: req.body.email })
            if (emailExists)
                return res.status(200).json({ status_code: 400, type:res.__(emailExists.role), message: res.__("Email Already exists") });

            const phoneExists = await User.findOne({ mobile: req.body.mobile });
            if (phoneExists){
                return res.status(200).json({ status_code: 400, type:res.__(phoneExists.role), message: res.__("Mobile number Already used by "+phoneExists.role) }); 
            }
            
            let userData = {};
            userData.name = req.body.name;
            userData.userId = uuidv4();
            userData.email = req.body.email.replace(/\s+/g, '');
            userData.mobile = req.body.mobile;
            userData.role = "user";
            userData.password = req.body.password;
            userData.deviceMode = req.body.device_mode;
            userData.devicePlatform = req.body.device_platform;
            userData.languageType = req.body.language_type;
            
            if (req.body.device_token) {
                userData.deviceToken = req.body.device_token.replace(/\s+/g, '');
            }

            if (req.body.login_type === "facebook") {
                userData.facebookId = req.body.login_id.replace(/\s+/g, '');
            }

            if (req.body.login_type === "google") {
                userData.googleId = req.body.login_id.replace(/\s+/g, '');
            }

            if (req.body.login_type === "apple") {
                userData.appleId = req.body.login_id.replace(/\s+/g, '');
            }

            let user = new User(userData);
            await user.save(function (error, userDetails) {
                if (!error) {

                    let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";

                    // welcome mail
                    let mailData = {};
                    mailData.to = req.body.email;
                    mailData.subject = res.__("Welcome Mail");
                    mailData.title = res.__("Hello") + " " + userDetails.name;
                    mailData.message = res.__("Your user account is registered. Signin to continue to your account");
                    mailerController.sendMail(mailData);

                    return res.status(200).json({
                        status_code: 200,
                        user_id: userDetails.userId,
                        access_token: userAuth.createJwt(userDetails),
                        name: userDetails.name,
                        email: userDetails.email,
                        mobile: userDetails.mobile,
                        user_image: profileImage,
                        language_type: userDetails.languageType,
                        type: userDetails.role,
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
    if (!req.body.login_id || !req.body.login_type || !req.body.device_mode || !req.body.device_platform) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = {};
            let formatted_user_info = {};
            if (req.body.email) {
                userDetails = await User.findOne({ email: req.body.email });
                if(userDetails !== null && Object.keys(userDetails).length > 0) {
                    
                    formatted_user_info.name = userDetails.name;
                    formatted_user_info.userId = userDetails.userId;
                    formatted_user_info.role = userDetails.role;
                    formatted_user_info.deviceToken = req.body.device_token;
                    formatted_user_info.id = userDetails.id;
                    formatted_user_info.status = userDetails.status;
                }
            }

            if (req.body.login_type == "apple" && req.body.login_id && !req.body.email) {
                userDetails = await User.findOne({ appleId: req.body.login_id });
            }

            if (!userDetails)
                return res.status(200).json({ status_code: 400, account_exists: "0", message: res.__("Enter the registered Email ID") });

            if (userDetails.role === "tasker")
                return res.status(200).json({ status_code: 400, account_exists: "1", message: res.__("Mail id register as a Tasker. Try with some other mail") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });
            
            if (userDetails.status === 2)
                return res.status(200).json({ status_code: 402, message: res.__("Your account has been deleted. Kindly,Contact admin to restore the account") });

            if (req.body.login_type == "email") {
                const isValid = await User.isValidPassword(req.body.password, userDetails.password);

                if (!isValid)
                    return res.status(200).json({ status_code: 400, message: res.__("Email / Password is not valid") });

                userDetails = await User.findOneAndUpdate({ email: req.body.email }, { deviceToken: req.body.device_token, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
            }

            if ((req.body.login_type == "facebook") && (req.body.email && req.body.login_id)) {
                userDetails = await User.findOneAndUpdate({ email: req.body.email }, { facebookId: req.body.login_id, deviceToken: req.body.device_token, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
            }

            if ((req.body.login_type == "google") && (req.body.email && req.body.login_id)) {
                userDetails = await User.findOneAndUpdate({ email: req.body.email }, { googleId: req.body.login_id, deviceToken: req.body.device_token, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
            }

            if ((req.body.login_type == "apple") && (req.body.email && req.body.login_id)) {
                userDetails = await User.findOneAndUpdate({ email: req.body.email }, { appleId: req.body.login_id, deviceToken: req.body.device_token, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
            }

            let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";

            return res.status(200).json({
                status_code: 200,
                user_id: userDetails.userId,
                access_token: userAuth.createJwt(formatted_user_info),
                name: userDetails.name,
                email: userDetails.email,
                mobile: userDetails.mobile,
                user_image: profileImage,
                type: userDetails.role,
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.socialSignIn = async function (req, res) {
    if (!req.body.login_id || !req.body.login_type || !req.body.device_mode || !req.body.device_platform) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = {};

            if (req.body.email && req.body.login_type !== "apple") {
                userDetails = await User.findOne({ email: req.body.email });
            }

            if (req.body.login_type == "apple" && req.body.login_id) {
                userDetails = await User.findOne({ appleId: req.body.login_id });
            }

            if (req.body.login_type == "facebook" && req.body.login_id && !req.body.email) {
                userDetails = await User.findOne({ facebookId: req.body.login_id });
            }

            if (req.body.login_type == "google" && req.body.login_id && !req.body.email) {
                userDetails = await User.findOne({ googleId: req.body.login_id });
            }
            let formatted_user_info = {};
            
            if (userDetails) {
                formatted_user_info.name = userDetails.name;
                formatted_user_info.userId = userDetails.userId;
                formatted_user_info.role = userDetails.role;
                formatted_user_info.deviceToken = req.body.device_token;
                formatted_user_info.id = userDetails.id;
                formatted_user_info.status = userDetails.status;
                if (userDetails.role === "tasker")
                    return res.status(200).json({ status_code: 400, account_exists: "1", message: res.__("Mail id register as a Tasker. Try with some other mail") });

                if (userDetails.status === 0)
                    return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

                if (userDetails.status === 2)
                    return res.status(200).json({ status_code: 402, message: res.__("Your account has been deleted. Kindly,Contact admin to restore the account") });

                if ((req.body.login_type == "facebook") && (req.body.email && req.body.login_id)) {
                    userDetails = await User.findOneAndUpdate({ email: req.body.email }, { facebookId: req.body.login_id, deviceToken: req.body.device_token, languageType: req.body.language_type, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
                }

                if ((req.body.login_type == "google") && (req.body.email && req.body.login_id)) {
                    userDetails = await User.findOneAndUpdate({ email: req.body.email }, { googleId: req.body.login_id, deviceToken: req.body.device_token, languageType: req.body.language_type, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
                }

                if ((req.body.login_type == "apple") && (req.body.email && req.body.login_id)) {
                    userDetails = await User.findOneAndUpdate({ appleId: req.body.login_id, }, { deviceToken: req.body.device_token, languageType: req.body.language_type, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
                }

                let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";

                return res.status(200).json({
                    status_code: 200,
                    user_id: userDetails.userId,
                    access_token: userAuth.createJwt(formatted_user_info),
                    name: userDetails.name,
                    email: userDetails.email,
                    user_image: profileImage,
                    mobile: userDetails.mobile,
                    type: userDetails.role,
                    new_account: "false"
                });
            }
            else {
                let userData = {};
                userData.name = req.body.name;
                userData.userId = uuidv4();
                userData.email = req.body.email.replace(/\s+/g, '');
                userData.mobile = req.body.mobile;
                userData.role = "user";
                userData.password = req.body.password;
                userData.deviceMode = req.body.device_mode;
                userData.devicePlatform = req.body.device_platform;

                if (req.body.device_token) {
                    userData.deviceToken = req.body.device_token.replace(/\s+/g, '');
                }

                if (req.body.language_type) {
                    userData.languageType = req.body.language_type;
                }

                if (req.body.login_type === "facebook") {
                    userData.facebookId = req.body.login_id.replace(/\s+/g, '');
                }

                if (req.body.login_type === "google") {
                    userData.googleId = req.body.login_id.replace(/\s+/g, '');
                }

                if (req.body.login_type === "apple") {
                    userData.appleId = req.body.login_id.replace(/\s+/g, '');
                }

                let user = new User(userData);
                await user.save(function (error, userDetails) {
                    if (!error) {

                        let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";

                        // welcome mail
                        let mailData = {};
                        mailData.to = req.body.email;
                        mailData.subject = res.__("Welcome Mail");
                        mailData.title = res.__("Hello") + " " + userDetails.name;
                        mailData.message = res.__("Your user account is registered. Signin to continue to your account");
                        mailerController.sendMail(mailData);

                        return res.status(200).json({
                            status_code: 200,
                            user_id: userDetails.userId,
                            access_token: userAuth.createJwt(userDetails),
                            name: userDetails.name,
                            email: userDetails.email,
                            mobile: userDetails.mobile,
                            user_image: profileImage,
                            type: userDetails.role,
                            new_account: "true"
                        });
                    } else {
                        console.log(error);
                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.forgotPassword = async function (req, res) {
    if (!req.body.email) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ email: req.body.email });

            if (!userDetails)
                return res.status(200).json({ status_code: 400, message: res.__("Email is not registered") });

                if(userDetails.role === "tasker")
                return res.status(200).json({ status_code: 400, message: res.__("Enter user email address") });

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
            mailData.subject = res.__("Reset Password");
            mailData.title = res.__("Reset Password is Done !");
            mailData.message = res.__("We received a request to reset your password.");
            mailData.message_details = res.__("Your new password is") + " " + newPassword;
            mailerController.sendMail(mailData);

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

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user", role: "user" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            if (req.body.name)
                userDetails.name = req.body.name;

            if (req.body.mobile)
                userDetails.mobile = req.body.mobile;

            if (req.body.chat_notification)
                userDetails.chatNotification = req.body.chat_notification;

            if (req.body.device_token) {
                userDetails.deviceActive = 1;
                userDetails.deviceToken = req.body.device_token;
            }

            if (req.body.booking_notification)
                userDetails.bookingNotification = req.body.booking_notification;

            if (req.body.booking_email)
                userDetails.bookingEmail = req.body.booking_email;

            if (req.body.payment_email)
                userDetails.paymentEmail = req.body.payment_email;

            if (req.body.language_type) {
                userDetails.languageType = req.body.language_type;
            }

            if (req.body.name || req.body.mobile || req.body.chat_notification || req.body.booking_notification || req.body.booking_email || req.body.payment_email || req.body.device_token || req.body.language_type) {
                //await userDetails.save();
                let mobileExist = await User.findOne({ mobile: req.body.mobile });
                console.log("mobile exist"+mobileExist);
                if(mobileExist){
                    if(mobileExist.userId === req.body.user_id){
                        await userDetails.save();
                    }else{
                        await userDetails.save();
                        //return res.status(200).json({ status_code: 400, message: res.__("Mobile number Already used by "+mobileExist.role) });
                    }
                }
                await userDetails.save();
            }


            let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";
            return res.status(200).json({
                status_code: 200,
                user_id: userDetails.userId,
                name: userDetails.name,
                email: userDetails.email,
                language_type: userDetails.languageType,
                mobile: (userDetails.mobile) ? userDetails.mobile : "",
                user_image: profileImage,
                chat_notification: userDetails.chatNotification,
                booking_notification: userDetails.bookingNotification,
                booking_email: userDetails.bookingEmail,
                payment_email: userDetails.paymentEmail,
                password_less_login: (!userDetails.password) ? "true" : "false",
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

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user", role: "user" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            if (req.body.name)
                userDetails.name = req.body.name;

            if (req.body.mobile)
                userDetails.mobile = req.body.mobile;

            if (req.body.chat_notification)
                userDetails.chatNotification = req.body.chat_notification;

            if (req.body.device_token) {
                userDetails.deviceActive = 1;
                userDetails.deviceToken = req.body.device_token;
            }

            if (req.body.booking_notification)
                userDetails.bookingNotification = req.body.booking_notification;

            if (req.body.booking_email)
                userDetails.bookingEmail = req.body.booking_email;

            if (req.body.payment_email)
                userDetails.paymentEmail = req.body.payment_email;

            if (req.body.language_type) {
                userDetails.languageType = req.body.language_type;
            }

            




            if (req.body.name || req.body.mobile || req.body.chat_notification || req.body.booking_notification || req.body.booking_email || req.body.payment_email || req.body.device_token || req.body.language_type) {
                let mobileExist = await User.findOne({ mobile: req.body.mobile });
                console.log("mobile exist"+mobileExist);
                if(mobileExist){
                    if(mobileExist.userId === req.body.user_id){
                        await userDetails.save();
                    }else{
                        return res.status(200).json({ status_code: 500, type: res.__(mobileExist.role), message: res.__("Phone number exist with another user") });
                    }
                }
                
            }


            let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";
            return res.status(200).json({
                status_code: 200,
                user_id: userDetails.userId,
                name: userDetails.name,
                email: userDetails.email,
                language_type: userDetails.languageType,
                mobile: (userDetails.mobile) ? userDetails.mobile : "",
                user_image: profileImage,
                chat_notification: userDetails.chatNotification,
                booking_notification: userDetails.bookingNotification,
                booking_email: userDetails.bookingEmail,
                payment_email: userDetails.paymentEmail,
                password_less_login: (!userDetails.password) ? "true" : "false",
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.mobileLogin = async function (req, res){
    if (!req.body.type || 
        !req.body.mobile || 
        !req.body.device_token || 
        !req.body.language_type || 
        !req.body.device_platform || 
        !req.body.device_mode) {
        console.log(req.body);
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params.") });
    }
    
    const userDetails = await User.findOne({ mobile: req.body.mobile });
    
    if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });
    
    if (userDetails.status === 2)
                    return res.status(200).json({ status_code: 402, message: res.__("Your account has been deleted. Kindly,Contact admin to restore the account") });
    if(userDetails){

        updateuserDetails = await User.findOneAndUpdate({ mobile: req.body.mobile }, { deviceToken: req.body.device_token, deviceMode: req.body.device_mode, devicePlatform: req.body.device_platform, deviceActive: 1 })
        let profileImage = (userDetails.image) ? process.env.BASE_URL + process.env.USER_MEDIA_URL + userDetails.image : "";

        let accessToken = userAuth.createJwt(userDetails);
        if(accessToken===401)
            {
                return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
            }

        return res.status(200).json({
            status_code: 200,
            user_id: userDetails.userId,
            account_exists:"1",
            access_token: accessToken,
            name: userDetails.name,
            email: userDetails.email,
            user_image: profileImage,
            mobile: userDetails.mobile,
            type: userDetails.role
        });
    }else{
        return res.status(200).json({ status_code: 400, account_exists:res.__("0"), message: res.__("Account not exist.") });
    }

};

exports.resetPassword = async function (req, res) {
    if (!req.body.user_id || !req.body.current_password || !req.body.new_password) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" })

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

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

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

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

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

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });
            let bookingCount = await Booking.find({ userId: userDetails._id,$or: [{status:"accepted"},{status:"paid"},{status:"started"}]}).count();                       
            
            if(bookingCount>0)
                return res.status(200).json({ status_code: 403, message: res.__("You can't Delete this Account.")});

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 2)
                return res.status(200).json({ status_code: 400, message: res.__("Account is already deleted") });

            userDetails.status = 2;
            userDetails.onlineStatus = 0;
            userDetails.lastActive = moment().toISOString();
            userDetails.deviceToken = "";
            await userDetails.save();                                 

            let bookingDetails = await Booking.find({ userId: userDetails._id,status:"requested"});  
            if(bookingDetails)
            {
                bookingDetails.forEach(async element => {
                    await Booking.findOneAndUpdate({ _id: element._id }, {status:"cancelled", cancelled_by:"user"});
                });
            }
            return res.status(200).json({
                status_code: 200,
                message: res.__("Account is deleted successfully")
            });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.userHome = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var langName = object.toLowerCase();

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let allBanners = await Banner.find({ status: 1 });

            let bannerItems = [], categoryItems = [], featuredItems = [], recentItems = [];

            if (allBanners) {
                allBanners.filter(function (eachBanner) {
                    bannerItems.push({
                        item_id: eachBanner._id,
                        item_image: process.env.BASE_URL + process.env.BANNER_MEDIA_URL + eachBanner.image,
                        item_link: eachBanner.url,
                    });
                });
            }

            let featuredCategories = await Category.find({ status: 1, featured: 1 });

            let allsubCategories = await Subcategory.find({ status: 1 }).populate("parentCategory");

            if (featuredCategories) {
                featuredCategories.filter(function (eachCategory) {
                    subcategoryList = allsubCategories.filter(function (subCategory) {
                        return (eachCategory._id.toString() === subCategory.parentCategory._id.toString());
                    }).map(function (eachcatObj) {
                        var subName =  (eachcatObj[langName+'Name']) ? (eachcatObj[langName+'Name']):eachcatObj.name;
                        return { 
                            item_id: eachcatObj._id, 
                            item_name: subName, 
                            item_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachcatObj.image, 
                            description: "good service" 
                        };
                    });
                    var name =  (eachCategory[langName+'Name']) ? (eachCategory[langName+'Name']):eachCategory.name;
                    featuredItems.push({
                        item_id: eachCategory._id,
                        item_name: name,
                        item_type: eachCategory.type,
                        location_type: eachCategory.locationType,
                        items: subcategoryList
                    });
                });
            }

            let allCategories = await Category.find({ status: 1 });
            if (allCategories) {
                allCategories.filter(function (eachCategory) {
                    var name =  (eachCategory[langName+'Name']) ? (eachCategory[langName+'Name']):eachCategory.name;
                    categoryItems.push({
                        item_id: eachCategory._id,
                        item_name: name,
                        item_type: eachCategory.type,
                        location_type: eachCategory.locationType,
                        item_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachCategory.image,
                    });
                });
            }
            let searchString = {};
            let needsString = {};
            searchString.userId = userDetails._id;
            needsString.userId = userDetails._id;
            searchString.bookedType = { $in: ['professional', 'marketplace'] };
            searchString.status = { $in: ["requested", "accepted"] };

            needsString.bookedType = { $in: ['userneeds'] };
            needsString.status = { $in: ["accepted"] };

            let completedBooking = await Booking.find({ $or: [searchString, needsString] }).sort({'updatedAt': -1}).populate("serviceId").populate("subCategory").populate("mainCategory");
            
            completedBooking.filter(function (eachTask) {
                if (eachTask.serviceId != null) {
                    var name =  (eachTask.mainCategory[langName+'Name']) ? (eachTask.mainCategory[langName+'Name']):eachTask.mainCategory.name;
                    var subName =  (eachTask.subCategory[langName+'Name']) ? (eachTask.subCategory[langName+'Name']):eachTask.subCategory.name;
                    recentItems.push({
                        item_id: eachTask._id,
                        item_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachTask.serviceId.image,
                        time: eachTask.bookedWhen,
                        status: eachTask.status,
                        category_id: eachTask.mainCategory._id,
                        category_name: name,
                        category_type: eachTask.mainCategory.type,
                        location_type: eachTask.mainCategory.locationType,
                        subcategory_id: eachTask.subCategory._id,
                        subcategory_name: subName,
                        description: eachTask.bookedFor,
                        price: eachTask.total,
                    });
                }
            });
            return res.json({ status_code: 200, banner_items: bannerItems, recent_items: recentItems, category_items: categoryItems, feature_items: featuredItems});

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.mobileSignIn = async function (req, res) {
    if (!req.body.mobile || !req.body.device_platform || !req.body.device_mode || !req.body.device_token || !req.body.login_type || !req.body.language_type)  {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            const userDetails = await User.findOne({ mobile: req.body.mobile });
            
            if (userDetails.status === 2)
                    return res.status(200).json({ status_code: 402, message: res.__("Your account has been deleted. Kindly,Contact admin to restore the account") });
                    
            if (userDetails)
                return res.status(200).json({ status_code: 400, message: res.__("Mobile Already exists") });
            else {
                let userData = {};
                userData.userId = uuidv4();
                userData.mobile = req.body.mobile;
                userData.role = "user";
                userData.deviceMode = req.body.device_mode;
                userData.devicePlatform = req.body.device_platform;
                userData.loginType = req.body.login_type;

                if (req.body.device_token) {
                    userData.deviceToken = req.body.device_token.replace(/\s+/g, '');
                }

                if (req.body.language_type) {
                    userData.languageType = req.body.language_type;
                }

                let user = new User(userData);
                await user.save(function (error, userDetails) {
                    if (!error) {
                        return res.status(200).json({
                            status_code: 200,
                            user_id: userDetails.userId,
                            access_token: userAuth.createJwt(userDetails),
                            name: userDetails.name,
                            mobile: userDetails.mobile,
                            type: userDetails.role,
                            new_account: "true"
                        });
                    } else {
                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                    }
                });
            }
        }
        catch (err) {
            // console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }

};


exports.deleteStatus = async function (req, res) {
    if (!req.body.user_id || !req.body.tasker_id)  {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            const userDetails = await User.findOne({ userId: req.body.user_id });
            const taskerDetails = await User.findOne({ userId: req.body.tasker_id });
            if(userDetails.status == 2 || taskerDetails.status == 2)
                return res.status(200).json({ status_code: 405, message: res.__("This account has been deleted.") });            
            else
                return res.status(200).json({  status_code: 200});                                  
        }
        catch (err) {
            // console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
    
};