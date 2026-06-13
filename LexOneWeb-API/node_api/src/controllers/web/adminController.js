const Setting = require('../../models/settingModel');
const fs = require('fs');

// models
const Help = require('../../models/helpModel');
const User = require('../../models/userModel');
const City = require('../../models/cityModel');
const AdminChats = require('../../models/adminChatModel');

// email service
const mailerController = require('./mailController');

exports.appDefaults = async function (req, res) {
    try {

        let appSettings = await Setting.findOne({});
        var host = req.headers['accept-language']; 
        var lang = host.charAt(0).toUpperCase()+ host.substr(1).toLowerCase();
        
        var langName = "guideLine"+lang;
        var guideLine =  (appSettings[langName]) ? (appSettings[langName]):appSettings.guideLine;
        let userTerms;

        userTerms = await Help.findOne({ "type": "user", "name": "Terms And Conditions", "lang":host }).select({ "_id": 0 });
        
        if(!userTerms){
            userTerms = await Help.findOne({ "type": "user", "name": "Terms And Conditions", "lang":"en" }).select({ "_id": 0 });
        }

        let taskerTerms;

        taskerTerms = await Help.findOne({ "type": "tasker", "name": "Terms And Conditions", "lang":host }).select({ "_id": 0 });
        
        if(!taskerTerms){
            taskerTerms = await Help.findOne({ "type": "tasker", "name": "Terms And Conditions", "lang":"en" }).select({ "_id": 0 });
        }

        let businessCities = await City.find().select({ "_id": 0, "city": 1, "state": 1 });

        let appUpdate = { 
                        'status':appSettings.status.toString(), 
                        'android_force_update':appSettings.androidForceUpdate.toString() ,
                        'ios_force_update':appSettings.iosForceUpdate.toString(), 
                        'android_version':appSettings.androidVersion.toString(), 
                        'ios_version':appSettings.iosVersion.toString(), 
                    };
        

        let availableCities = [];

        if (businessCities.length > 0) {
            businessCities.filter(function (eachCity) {
                if (availableCities.indexOf(eachCity.city) === -1) {
                    availableCities.push(eachCity.city);
                }
            });
        }
        return res.status(200).json({
            status_code: 200,
            site_logo : process.env.BASE_URL + process.env.ADMIN_MEDIA_URL + appSettings.siteLogo,
            site_favicon : process.env.BASE_URL + process.env.ADMIN_MEDIA_URL + appSettings.siteIcon,
            currency_code: appSettings.currencyCode,
            site_name: appSettings.siteName,
            currency_symbol: appSettings.currencySymbol,
            site_commission: appSettings.commission,
            site_tax: appSettings.tax,
            stripe_public_key: appSettings.stripePublicKey,
            max_ride_distance: appSettings.rideDistance,
            user_terms: (userTerms) ? userTerms : {},
            tasker_terms: (taskerTerms) ? taskerTerms : {},
            tasker_verification_guide: guideLine,
            minimum_payment_price: parseFloat(appSettings.minimumAmount),
            tasker_documents_limit: appSettings.docsLimit.toString(),
            tasker_portfolio_limit: appSettings.portfolioLimit.toString(),
            invite_link: appSettings.inviteLink,
            app_update: appUpdate,
            instant_location: appSettings.instantLocation.toString(),
            copyright_text: appSettings.copyrightText,
            appstore_link: appSettings.appstoreLink,
            fb_link: appSettings.fbLink,
            instagram_link: appSettings.instagramLink,
            playstore_link: appSettings.playstoreLink,
            twitter_link: appSettings.twitterLink,
            youtube_title: appSettings.youtubeTitle,
            youtube_link: appSettings.youtubeLink,
            youtube_description: appSettings.youtubeDescription,
            stripe_clientid : appSettings.stripeClientId,
            cities: availableCities.filter(e => e),
            googleadsense: (appSettings.googleadsense === true || appSettings.googleadsense === "true") ? "true" : "false",
            googleadclient: appSettings.googleadclient,
            googleadslot: appSettings.googleadslot,
            support_phone: appSettings.supportPhone || "",
        });
    }
    catch (err) {
    	console.log(err);
        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
    }
};

exports.appHelps = async function (req, res) {
    let host = req.headers['accept-language'];

    let helpType = (req.params.type) ? req.params.type : "user";

    try {
        let helps;

        helps = await Help.find({ "type": helpType, "lang":host }).select({ "_id": 0 });

        if (!helps) {
            helps = await Help.find({ "type": helpType, "lang":"en" }).select({ "_id": 0 });
        }

        return res.status(200).json({ status_code: 200, items: helps });
    }
    catch (err) {
        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
    }
};

exports.contactAdmin = async function (req, res) {
    if (!req.body.email || !req.body.mobile || !req.body.description) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ email: req.body.email });

            let appSettings = await Setting.findOne({});

            let languageType = req.headers['accept-language'];

            // if (!userDetails)
            //     return res.status(200).json({ status_code: 400, message: res.__({ phrase: 'Email is not registered', locale: languageType }) });
                
            // if (userDetails.status === 0)
            //     return res.status(200).json({ status_code: 401, message: res.__({ phrase: 'Account is disabled', locale: languageType })  });

            let mailData = {};
            mailData.to = appSettings.contactEmail;
            mailData.subject = res.__("Contact Mail");
            if(userDetails) {
                mailData.title = req.body.name+ " " + res.__("has been contacted you");
            }
            else {
                mailData.title = req.body.name+" New User " + res.__("has been contacted you");
            }
            console.log('req.body.description',req.body.description)
            console.log('req.body',req.body)
            mailData.message = res.__("Leave you message:") + " " + req.body.description;
            mailData.message_details = res.__("Contact him back with this mailid") + " " + req.body.email + " " + res.__("or with this mobile no") + " " + req.body.mobile;;
            mailerController.sendMail(mailData);
            return res.status(200).json({
                status_code: 200,
                message: res.__({ phrase: 'Mail sent successsfully', locale: languageType })
            });
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
}

exports.adminNotifications = async function (req, res) {
    try {

        let limit = parseInt(req.params.limit);
        let offset = parseInt(req.params.offset);

        let adminNotifications = await AdminChats.find({ "msg_to": { $in: [req.params.role, "all"] }, "msg_platform": req.params.platform }).sort({ "created_at": -1 }).limit(limit).skip(offset);

        if (adminNotifications.length === 0)
            return res.status(200).json({ status_code: 400, message: res.__("No notifications found") });

            

        let allNotifications = [];


        let appSettings = await Setting.findOne({});

        adminNotifications.filter(function (eachNotification) {
            allNotifications.push({
                "receiver_id": "",
                "user_id": "",
                "message_id": eachNotification._id,
                "message": {
                    "message": eachNotification.msg_data,
                    "type": "text",
                },
                "chat_id": "",
                "message_type": "text",
                "user_name": appSettings.siteName + " Team",
                "user_image": "",
                "date": eachNotification.created_at,
            });
        });

        return res.status(200).json({ status_code: 200, messages: allNotifications });

    }
    catch (err) {
        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
    }
};
