// models
const Log = require('../models/logModel');
const User = require('../models/userModel');
const bookingdetailModel = require('../models/bookingdetailModel');
const fs = require('fs');

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
  locales: ['en', 'fr','ar'],
  defaultLocale: 'ar',
  directory: path.join(__dirname, 'locales'),
})


let createLog =  async function (sender, receiver, reference, type, message, currency="default") {

    let user = await User.findOne({_id:receiver}); 
    var host = user.languageType;
    let rawdata = fs.readFileSync('languageCode.json');
    var string = JSON.parse(rawdata);
    var object =  string[host];
    var langName = object.toLowerCase();

    let unique_key = reference+''+receiver+''+message.replace(/\s/g, "");
    let userLogs =  await bookingdetailModel.find({bookingId: reference}).populate("serviceId");
    let serviceName = [];
    userLogs.filter(function (eachLog) {
        if (host != "en") {
            serviceName.push({
                service_names: (eachLog.serviceId[langName+'Name']) ? (eachLog.serviceId[langName+'Name']) : eachLog.serviceId.name,
            });
        }
        else{
            serviceName.push({
                service_names: eachLog.serviceId.name,
            });
        }
       
    });
    let newArray = serviceName.map(element => element.service_names);
 
    let logData = {};
    logData.logId = unique_key;
    logData.senderId = sender;
    logData.receiverId = receiver;
    logData.bookingId = reference;
    logData.messageType = type;
    logData.messageTxt = message;
    logData.currency =  currency;
    logData.serviceId = newArray;
    logData.type = "booking";
    logData.createdAt = new Date().toISOString();
    logData.updatedAt = new Date().toISOString();
    if (!sender) {
        logData.isAdmin = 1;
    }
    let newLog = new Log(logData);
    newLog.save(function (error, logDetails) {
        if (error) {
            // console.log(error);
        }
        else{
            // console.log(logDetails);
        }
    });
};

let userLogs = async function (req, res) {
    if (!req.params.userId || !req.params.limit || !req.params.offset) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.params.userId, role: "user" });
            
            let languageType = req.headers['accept-language']; 

            let limit = parseInt(req.params.limit);

            let offset = parseInt(req.params.offset);

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let searchObject = { receiverId: userDetails._id };

            let userLogs = await Log.find(searchObject).populate("senderId").populate("bookingId").sort({ "createdAt": -1 }).limit(limit).skip(offset);

            if (userLogs.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No notifications found") });

            let allLogs = [];

            

          
            //USER_MEDIA_URL
            //TASKER_MEDIA_URL

            userLogs.filter(function (eachLog) {
                let media_path = "";

                if(eachLog.senderId.role === "user"){
                    media_path = process.env.USER_MEDIA_URL;
                }else if(eachLog.senderId.role === "tasker"){
                    media_path = process.env.TASKER_MEDIA_URL;
                }

                // return res.status(200).json({ status_code: 400, message: media_path });

                let message = eachLog.messageTxt;
                allLogs.push({
                    user_id: eachLog.senderId.userId,
                    item_id: eachLog.bookingId._id,
                    reference_id: eachLog.bookingId.bookingId,
                    booking_date: eachLog.bookingId.createdAt,
                    item_type: eachLog.messageType,
                    service_names: eachLog.serviceId,
                    log_type: (eachLog.type)?(eachLog.type):"",
                    name: eachLog.senderId.name,
                    user_image: process.env.BASE_URL + media_path + eachLog.senderId.image,
                    location: eachLog.senderId.location,
                    description:  i18n.__({ phrase: message, locale: languageType }),
                    date: eachLog.createdAt
                });
            });

            return res.status(200).json({ status_code: 200, items: allLogs });

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

let taskerLogs = async function (req, res) {
    if (!req.params.userId || !req.params.limit || !req.params.offset) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.params.userId, role: "tasker" });
            
            let languageType = req.headers['accept-language'];

            let limit = parseInt(req.params.limit);

            let offset = parseInt(req.params.offset);

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let searchObject = { receiverId: userDetails._id };

            let userLogs = await Log.find(searchObject).sort({ "createdAt": -1 }).populate("senderId").populate("bookingId").limit(limit).skip(offset);
            console.log(userLogs);
            if (userLogs.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No notifications found") });

            let allLogs = [];

            userLogs.filter(function (eachLog) {
                let message = eachLog.messageTxt;
                let txt;
                if (eachLog.currency != "default" && eachLog.type == "booking"){
                    txt = i18n.__({ phrase: message , locale: languageType }) + " " + eachLog.currency;
                }
                else if(eachLog.type == "approval"){
                    txt = i18n.__({ phrase: message , locale: languageType });
                }
                else{
                    txt = i18n.__({ phrase: message , locale: languageType });
                }
                let item;
                let reference;
                let  bookingDate;
                let  service = [];
                if (eachLog.bookingId) {
                    item = (eachLog.bookingId._id)?(eachLog.bookingId._id):" ";
                    reference = (eachLog.bookingId.bookingId)?(eachLog.bookingId.bookingId):" ";
                    bookingDate = (eachLog.bookingId.createdAt)?(eachLog.bookingId.createdAt):" ";
                    service = eachLog.serviceId;
                }
                allLogs.push({
                    user_id: eachLog.senderId.userId,
                    item_id: (item) ? (item):" ",
                    reference_id: (reference) ? (reference):" ",
                    booking_date: (bookingDate) ? (bookingDate):" ",
                    service_names: service,
                    item_type: eachLog.messageType,
                    log_type: eachLog.type,
                    name: eachLog.senderId.name,
                    user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachLog.senderId.image,
                    location: eachLog.senderId.location,
                    description: txt,
                    date: eachLog.createdAt
                });
            });

            return res.status(200).json({ status_code: 200, items: allLogs });

        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

module.exports = {
    createLog: createLog,
    taskerLogs: taskerLogs,
    userLogs: userLogs
};