const mongoose = require("mongoose");
const moment = require("moment");
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const Booking = require('../models/bookingModel');
const AdminChats = require('../models/adminChatModel');

exports.userChats = async function (req, res) {
    if (!req.params.userId || !req.params.platform) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        // try {

            let userDetails = await User.findOne({ userId: req.params.userId, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });
            
            if (userDetails.status === 2)
                return res.status(200).json({ status_code: 400, message: res.__("Account is already deleted") });

            let searchObject = { userId: userDetails._id };

            let userChats = await Chat.find(searchObject).populate("taskerId").populate("bookingId").populate("serviceId").populate("lastMessage").sort({ "lastMessageOn": -1 });

            let recentAdminMessage = await AdminChats.findOne({ msg_platform: req.params.platform, msg_to: "user" }).sort({ "created_at": -1 });

            let bookingChats = [];

            bookingChats.push({
                chat_type: "admin",
                date: (recentAdminMessage) ? recentAdminMessage.created_at : "",
                message: { "message": (recentAdminMessage) ? recentAdminMessage.msg_data : "" }
            });

            if (userChats.length === 0)
                return res.status(200).json({ status_code: 200, chats: bookingChats });

            userChats.filter(function (eachChat) {
                let values = eachChat.bookingId; 
                let dueStatus;
                if(eachChat.bookingId)
                    dueStatus = (eachChat.bookingId.needStatus === 0) ? "pending" : "active";

                if(eachChat.bookingId){
                    if (eachChat.bookingId.bookedType === "userneeds") {
                        let dueDate = moment(eachChat.bookingId.bookedWhen).isBefore(moment().startOf('day').toISOString());
                        dueStatus = (dueDate) ? "expired" : dueStatus;
                    }
                }
                if(eachChat.bookingId){
                bookingChats.push({
                    booking_id: eachChat.bookingId._id,
                    booking_status: eachChat.bookingId.status,
                    booking_date: eachChat.bookingId.createdAt,
                    reference_id: (eachChat.bookingId.bookingId) ? (eachChat.bookingId.bookingId) : "",
                    booking_type: eachChat.bookingId.bookedType,
                    user_id: (eachChat.taskerId) ? eachChat.taskerId.userId : "",
                    service_id: (eachChat.serviceId) ? eachChat.serviceId._id : "",
                    service_name: (eachChat.serviceId) ? eachChat.serviceId.name : "",
                    service_image: (eachChat.serviceId) ? process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachChat.serviceId.image : "",
                    chat_id: eachChat._id,
                    chat_type: "user",
                    name: (eachChat.taskerId) ? eachChat.taskerId.name : "",
                    user_image: (eachChat.taskerId) ? process.env.BASE_URL + process.env.TASKER_MEDIA_URL + eachChat.taskerId.image : "",
                    location: (eachChat.taskerId) ? eachChat.taskerId.location : "",
                    status: (eachChat.taskerId) ? eachChat.taskerId.onlineStatus : "",
                    block: (eachChat.blockedBy.includes("user")) ? "true" : eachChat.blockedBy.includes("tasker").toString(),
                    blocked_by: (eachChat.blockedBy.includes("user")) ? req.params.userId : eachChat.taskerId.userId,
                    unread_count: eachChat.userUnread.toString(),
                    message: (eachChat.lastMessage) ? eachChat.lastMessage.chatData.message : { "message": "" },
                    date: eachChat.updatedAt,
                    due_status: dueStatus
                });
            }
            });

            return res.status(200).json({ status_code: 200, chats: bookingChats });

        // }
        // catch (err) {
        //     return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        // }
    }
};

exports.taskerChats = async function (req, res) {
    if (!req.params.userId || !req.params.platform) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.params.userId, role: "tasker" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let searchObject = { taskerId: userDetails._id };

            let userChats = await Chat.find(searchObject).populate("userId").populate("lastMessage").populate("bookingId").populate("serviceId").sort({ "lastMessageOn": -1 });

            let recentAdminMessage = await AdminChats.findOne({ msg_platform: req.params.platform, msg_to: "tasker" }).sort({ "created_at": -1 });

            let bookingChats = [];

            bookingChats.push({
                chat_type: "admin",
                date: (recentAdminMessage) ? recentAdminMessage.created_at : "",
                message: { "message": (recentAdminMessage) ? recentAdminMessage.msg_data : "" }
            });

            if (userChats.length === 0)
                return res.status(200).json({ status_code: 200, chats: bookingChats });

           

            userChats.filter(function (eachChat) {
                if (eachChat.bookingId) {
                    let dueStatus = (eachChat.bookingId.needStatus === 0) ? "pending" : "active";

                    if (eachChat.bookingId.bookedType === "userneeds") {
                        let dueDate = moment(eachChat.bookingId.bookedWhen).isBefore(moment().startOf('day').toISOString());
                        dueStatus = (dueDate) ? "expired" : dueStatus;
                    }
    
                    bookingChats.push({
                        booking_id: eachChat.bookingId._id,
                        booking_status: eachChat.bookingId.status,
                        booking_date: eachChat.bookingId.createdAt,
                        reference_id: (eachChat.bookingId.bookingId) ? (eachChat.bookingId.bookingId) : "",
                        booking_type: eachChat.bookingId.bookedType,
                        service_id: (eachChat.serviceId) ? eachChat.serviceId._id : "",
                        service_name: (eachChat.serviceId) ? eachChat.serviceId.name : "",
                        service_image: (eachChat.serviceId) ? process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachChat.serviceId.image : "",
                        user_id: eachChat.userId.userId,
                        chat_id: eachChat._id,
                        chat_type: "user",
                        name: eachChat.userId.name,
                        user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachChat.userId.image,
                        location: eachChat.userId.location,
                        status: eachChat.userId.onlineStatus,
                        block: (eachChat.blockedBy.includes("user")) ? "true" : eachChat.blockedBy.includes("tasker").toString(),
                        blocked_by: (eachChat.blockedBy.includes("tasker")) ? req.params.userId : eachChat.userId.userId,
                        unread_count: eachChat.taskerUnread.toString(),
                        message: (eachChat.lastMessage) ? eachChat.lastMessage.chatData.message : { "message": "" },
                        date: eachChat.updatedAt,
                        due_status: dueStatus
                    });
                }
            });

            return res.status(200).json({ status_code: 200, chats: bookingChats });

        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.chatMessages = async function (req, res) {
    if (!req.params.chatId || !req.params.limit || !req.params.offset) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let searchObject = { chatId: req.params.chatId };

            let limit = parseInt(req.params.limit);

            let offset = parseInt(req.params.offset);

            let userMessages = await Message.find(searchObject).sort({ "createdAt": -1 }).limit(limit).skip(offset);

            if (userMessages.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No messages found") });

            let chatMessages = [];

            userMessages.filter(function (eachMessage) {
                chatMessages.push(eachMessage.chatData);
            });

            return res.status(200).json({ status_code: 200, messages: chatMessages });

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.userChatInfo = async function (req, res) {
    if (!req.body.user_id || !req.body.chat_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let userChats = await Chat.findById(req.body.chat_id).populate("taskerId").populate("bookingId").populate("lastMessage").populate("serviceId");

            if (userChats.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No chats found") });

            let dueStatus = (userChats.bookingId.needStatus === 0) ? "pending" : "active";

            if (userChats.bookingId.bookedType === "userneeds") {
                let dueDate = moment(userChats.bookingId.bookedWhen).isBefore(moment().startOf('day').toISOString());
                dueStatus = (dueDate) ? "expired" : dueStatus;
            }

            let bookingChats = {
                status_code: 200,
                booking_id: userChats.bookingId._id,
                booking_type: userChats.bookingId.bookedType,
                service_id: (userChats.serviceId) ? userChats.serviceId._id : "",
                service_name: (userChats.serviceId) ? userChats.serviceId.name : "",
                service_image: (userChats.serviceId) ? process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + userChats.serviceId.image : "",
                user_id: (userChats.taskerId) ? userChats.taskerId.userId : "",
                chat_id: userChats._id,
                chat_type: "user",
                name: (userChats.taskerId) ? userChats.taskerId.name : "",
                user_image: (userChats.taskerId) ? process.env.BASE_URL + process.env.TASKER_MEDIA_URL + userChats.taskerId.image : "",
                location: (userChats.taskerId) ? userChats.taskerId.location : "",
                status: (userChats.taskerId) ? userChats.taskerId.onlineStatus : "",
                block: (userChats.blockedBy.includes("user")) ? "true" : userChats.blockedBy.includes("tasker").toString(),
                blocked_by: (userChats.blockedBy.includes("user")) ? req.body.user_id : userChats.taskerId.userId,
                unread_count: userChats.userUnread.toString(),
                message: (userChats.lastMessage) ? userChats.lastMessage.chatData.message : "",
                date: userChats.updatedAt,
                due_status: dueStatus
            };

            return res.status(200).json(bookingChats);

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};


exports.taskerChatInfo = async function (req, res) {
    if (!req.body.user_id || !req.body.chat_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let userChats = await Chat.findById(req.body.chat_id).populate("bookingId").populate("userId").populate("lastMessage").populate("serviceId");

            if (userChats.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No chats found") });

            let dueStatus = (userChats.bookingId.needStatus === 0) ? "pending" : "active";

            if (userChats.bookingId.bookedType === "userneeds") {
                let dueDate = moment(userChats.bookingId.bookedWhen).isBefore(moment().startOf('day').toISOString());
                dueStatus = (dueDate) ? "expired" : dueStatus;
            }

            let bookingChats = {
                status_code: 200,
                booking_id: userChats.bookingId._id,
                booking_type: userChats.bookingId.bookedType,
                service_id: (userChats.serviceId) ? userChats.serviceId._id : "",
                service_name: (userChats.serviceId) ? userChats.serviceId.name : "",
                service_image: (userChats.serviceId) ? process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + userChats.serviceId.image : "",
                user_id: userChats.userId.userId,
                chat_id: userChats._id,
                chat_type: "user",
                name: userChats.userId.name,
                user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + userChats.userId.image,
                location: userChats.userId.location,
                status: userChats.userId.onlineStatus,
                block: (userChats.blockedBy.includes("user")) ? "true" : userChats.blockedBy.includes("tasker").toString(),
                blocked_by: (userChats.blockedBy.includes("tasker")) ? req.body.user_id : userChats.userId.userId,
                unread_count: userChats.taskerUnread.toString(),
                message: (userChats.lastMessage) ? userChats.lastMessage.chatData.message : "",
                date: userChats.updatedAt,
                due_status: dueStatus
            };

            return res.status(200).json(bookingChats);

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.createChat = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let chatExists = await Chat.countDocuments({ taskerId: mongoose.Types.ObjectId(userDetails._id), bookingId: mongoose.Types.ObjectId(req.body.booking_id) });

            let bookingDetails = await Booking.findById(req.body.booking_id);

            if (chatExists === 0) {

                let newChat = new Chat({
                    bookingId: bookingDetails._id,
                    userId: bookingDetails.userId,
                    serviceId: bookingDetails.serviceId,
                    taskerId: userDetails._id
                });

                newChat.save(async function (error, chatDetails) {

                    let eachChat = await Chat.findById(chatDetails._id).populate("userId").populate("lastMessage");

                    let bookingChats = {};
                    bookingChats.status_code = 200;
                    bookingChats.booking_type = bookingDetails.bookedType;
                    bookingChats.booking_id = eachChat.bookingId;
                    bookingChats.user_id = eachChat.userId.userId;
                    bookingChats.chat_id = eachChat._id;
                    bookingChats.chat_type = "user";
                    bookingChats.name = eachChat.userId.name;
                    bookingChats.user_image = process.env.BASE_URL + process.env.USER_MEDIA_URL + eachChat.userId.image;
                    bookingChats.location = eachChat.userId.location;
                    bookingChats.status = eachChat.userId.onlineStatus;
                    bookingChats.block = (eachChat.blockedBy.includes("user")) ? "true" : eachChat.blockedBy.includes("tasker").toString();
                    bookingChats.blocked_by = (eachChat.blockedBy.includes("tasker")) ? req.params.userId : eachChat.userId.userId;
                    bookingChats.unread_count = eachChat.taskerUnread.toString();
                    bookingChats.message = (eachChat.lastMessage) ? eachChat.lastMessage.chatData.message : "";
                    bookingChats.date = eachChat.updatedAt;
                    return res.status(200).json(bookingChats);

                });

            } else {
                let userChats = await Chat.findOne({ taskerId: userDetails._id, bookingId: req.body.booking_id });
                return res.status(200).json({ status_code: 200, chat_id: userChats._id });
            }
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.createUserChat = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let chatExists = await Chat.countDocuments({ userId: mongoose.Types.ObjectId(userDetails._id), bookingId: mongoose.Types.ObjectId(req.body.booking_id) });

            let bookingDetails = await Booking.findById(req.body.booking_id);

            if (chatExists === 0) {

                let newChat = new Chat({
                    bookingId: bookingDetails._id,
                    taskerId: bookingDetails.taskerId,
                    userId: userDetails._id
                });

                newChat.save(async function (error, chatDetails) {

                    let eachChat = await Chat.findById(chatDetails._id).populate("taskerId").populate("lastMessage");

                    let bookingChats = {};
                    bookingChats.status_code = 200;
                    bookingChats.booking_type = bookingDetails.bookedType;
                    bookingChats.booking_id = eachChat.bookingId;
                    bookingChats.user_id = eachChat.taskerId.userId;
                    bookingChats.chat_id = eachChat._id;
                    bookingChats.chat_type = "user";
                    bookingChats.name = eachChat.taskerId.name;
                    bookingChats.user_image = process.env.BASE_URL + process.env.TASKER_MEDIA_URL + eachChat.taskerId.image;
                    bookingChats.location = eachChat.taskerId.location;
                    bookingChats.status = eachChat.taskerId.onlineStatus;
                    bookingChats.block = (eachChat.blockedBy.includes("tasker")) ? "true" : eachChat.blockedBy.includes("user").toString();
                    bookingChats.blocked_by = (eachChat.blockedBy.includes("tasker")) ? req.params.userId : eachChat.taskerId.userId;
                    bookingChats.unread_count = eachChat.taskerUnread.toString();
                    bookingChats.message = (eachChat.lastMessage) ? eachChat.lastMessage.chatData.message : "";
                    bookingChats.date = eachChat.updatedAt;
                    return res.status(200).json(bookingChats);

                });

            } else {
                let userChats = await Chat.findOne({ userId: userDetails._id, bookingId: req.body.booking_id });
                return res.status(200).json({ status_code: 200, chat_id: userChats._id });
            }
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};