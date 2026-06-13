const fs = require("fs");
const express = require("express");
const moment = require("moment");
const app = express();
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
  locales: ['en', 'fr',],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales'),
})


// models
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const Booking = require('../models/bookingModel');
const BookingDetail = require('../models/bookingdetailModel');
const Setting = require('../models/settingModel');

// fcm service
const fcmService = require('../controllers/fcmController');

// notification controller
const logController = require("../controllers/logController");

// create express server
let server = require("http").createServer(app);

if (process.env.SSL === "1") {

    // load ssl certificates
    let privateKey = fs.readFileSync("/etc/letsencrypt/live/tudofyapp.com/privkey.pem");
    let certificate = fs.readFileSync("/etc/letsencrypt/live/tudofyapp.com/cert.pem");
    let ca = fs.readFileSync("/etc/letsencrypt/live/tudofyapp.com/fullchain.pem");
    let sslOptions = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
    server = require("https").createServer(sslOptions, app);
}

const io = require("socket.io").listen(server);

// console.log(server);

server.listen(process.env.CHAT_PORT, function () { console.log("Socket.io is running on: " + process.env.CHAT_PORT); });

io.sockets.on("connection", function (socket) {

    // console.log("a client connected");

    // user is online
    socket.on("liveMe", function (data) {
        User.findOneAndUpdate({ userId: data.user_id }, { onlineStatus: 1, lastActive: moment().toISOString() }, function (error, userDetails) {
            if (!error) {
                socket.user_id = data.user_id;
            }
        });
    });

    // user joined the chat
    socket.on("joinChat", function (data) {
        // console.log('chatdata');
        // console.log(data);
        socket.join(data.chat_id);
    });

    // user is messaging on chat
    socket.on("sendMessage", function (data) {
        if (data.type === "onlineStatus") {
            
            User.findOne({ userId: data.receiver_id }, function (error, userDetails) {
                if (!error) {
                    console.log('=============userDetails================');
                    console.log(userDetails);
                    // console.log(data);
                    let statusObject = {};
                    statusObject.type = data.type;
                    statusObject.user_id = data.receiver_id;
                    statusObject.status = userDetails.onlineStatus;
                    if (!userDetails.onlineStatus) {
                        statusObject.last_seen = userDetails.lastActive;
                    }
                    // console.log('ioooooooooooooo');
                    // console.log(statusObject);
                    io.in(data.user_id).emit('receiveMessage', statusObject);
                }
            });
        }
        if (data.type === "bookingchat") {
            Message.countDocuments({ chatId: data.chat_id, createdAt: { $gte: new Date(moment().startOf('day').toISOString()), $lte: new Date(moment().endOf('day').toISOString()) } }, function (error, todayMessages) {
                if (todayMessages === 0) {
                    if(data.message_type == "request" || data.message_type == "accept" || data.message_type == "cancel" ||  data.message_type == "quote"){
                        let tasker =  User.findOne({ userId: data.receiver_id });
                        var languageType2;
                        var message2;
                        tasker.exec(function (error, tasker) {
                            languageType2 = tasker.languageType;
                            if(data.message_type == "request"){
                                message2 ="Request for service";
                              }
                            else if(data.message_type == "accept"){
                                message2 ="Service request has been accepted";
                            }
                            else if(data.message_type == "cancel"){
                                message2 ="Service request has been declined";
                            }
                            data.message.message = i18n.__({ phrase: message2, locale: languageType2 });
                            if(data.message_type == "quote"){
                                data.message.message = i18n.__({ phrase: "quoted price", locale: languageType2 })+" "+ data.message.price +" " + i18n.__({ phrase: "for your booking", locale: languageType2 });
                            }
                            
                            let newMessage = new Message({
                                 chatId: data.chat_id,
                                 chatData: {
                                     "message_type": "date",
                                     "date": moment().toISOString(),
                                 }
                             });
                            newMessage.save(function (error, dateDetails) {
                                 if (!error) {
                                     let newMessage = new Message({
                                         chatId: data.chat_id,
                                         chatData: data
                                     });
 
                                    newMessage.save(function (error, messageDetails) {
                                         if (!error) {
                                             Chat.findByIdAndUpdate(data.chat_id, { lastMessage: messageDetails._id, lastMessageOn: moment().toISOString() }, function (error, result) {
                                                 if (!error) {
                                                     unreadNotification(data.chat_id, data.receiver_id);
                                                     fcmNotification(data.receiver_id, data);
                                                     socket.broadcast.to(data.chat_id).emit("receiveMessage", data);
                                                 }
                                             });
                                         }
                                    });
                                }
                             });
                         });
                    }
                    else if(data.message_type == "location"){
                        // console.log('location');
                        let tasker =  User.findOne({ userId: data.receiver_id });
                        var languageType2;
                        var message2 = 'location';
                        tasker.exec(function (error, tasker) {
                            languageType2 = tasker.languageType;
                            data.message.message = i18n.__({ phrase: message2, locale: languageType2 });
                            let newMessage = new Message({
                                chatId: data.chat_id,
                                chatData: {
                                    "message_type": "date",
                                    "date": moment().toISOString(),
                                }
                            });
                            // console.log(data.message.message);
                            newMessage.save(function (error, dateDetails) {
                                if (!error) {
                                    let newMessage = new Message({
                                        chatId: data.chat_id,
                                        chatData: data
                                    });
    
                                    newMessage.save(function (error, messageDetails) {
                                        if (!error) {
                                            Chat.findByIdAndUpdate(data.chat_id, { lastMessage: messageDetails._id, lastMessageOn: moment().toISOString() }, function (error, result) {
                                                if (!error) {
                                                    unreadNotification(data.chat_id, data.receiver_id);
                                                    fcmNotification(data.receiver_id, data);
                                                    socket.broadcast.to(data.chat_id).emit("receiveMessage", data);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                    else{
                        // console.log('dataaaaaaaaaaaa');
                        // console.log(data);
                        let newMessage = new Message({
                            chatId: data.chat_id,
                            chatData: {
                                "message_type": "date",
                                "date": moment().toISOString(),
                            }
                        });
                        newMessage.save(function (error, dateDetails) {
                            if (!error) {
                                let newMessage = new Message({
                                    chatId: data.chat_id,
                                    chatData: data
                                });

                                newMessage.save(function (error, messageDetails) {
                                    if (!error) {
                                        Chat.findByIdAndUpdate(data.chat_id, { lastMessage: messageDetails._id, lastMessageOn: moment().toISOString() }, function (error, result) {
                                            if (!error) {
                                                unreadNotification(data.chat_id, data.receiver_id);
                                                fcmNotification(data.receiver_id, data);
                                                socket.broadcast.to(data.chat_id).emit("receiveMessage", data);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                        
                }
                else {
                    if(data.message_type == "request" || data.message_type == "accept" || data.message_type == "cancel" ||  data.message_type == "quote"){
                        let tasker =  User.findOne({ userId: data.receiver_id });
                        var languageType2;
                        var message2;
                        tasker.exec(function (error, tasker) {
                            languageType2 = tasker.languageType;
                            if(data.message_type == "request"){
                                message2 ="Request for service";
                              }
                            else if(data.message_type == "accept"){
                                message2 ="Service request has been accepted";
                            }
                            else if(data.message_type == "cancel"){
                                message2 ="Service request has been declined";
                            }
                            data.message.message = i18n.__({ phrase: message2, locale: languageType2 });
                            if(data.message_type == "quote"){
                                data.message.message = i18n.__({ phrase: "quoted price", locale: languageType2 })+" "+ data.message.price +" " + i18n.__({ phrase: "for your booking", locale: languageType2 });
                            }
                            
                            let newMessage = new Message({
                                chatId: data.chat_id,
                                chatData: data
                            });
                            newMessage.save(function (error, messageDetails) {
                                if (!error) {
                                    Chat.findByIdAndUpdate(data.chat_id, { lastMessage: messageDetails._id, lastMessageOn: moment().toISOString() }, function (error, result) {
                                        if (!error) {
                                            unreadNotification(data.chat_id, data.receiver_id);
                                            fcmNotification(data.receiver_id, data);
                                            socket.broadcast.to(data.chat_id).emit("receiveMessage", data);
                                        }
                                    });
                                }
                            });
                        });
                    }
                    else if(data.message_type == "location"){
                        let tasker =  User.findOne({ userId: data.receiver_id });
                        var languageType2;
                        var message2 = 'location';
                        tasker.exec(function (error, tasker) {
                            languageType2 = tasker.languageType;
                            data.message.message = i18n.__({ phrase: message2, locale: languageType2 });
                            let newMessage = new Message({
                                chatId: data.chat_id,
                                chatData: data
                            });
                            newMessage.save(function (error, messageDetails) {
                                if (!error) {
                                    Chat.findByIdAndUpdate(data.chat_id, { lastMessage: messageDetails._id, lastMessageOn: moment().toISOString() }, function (error, result) {
                                        if (!error) {
                                            unreadNotification(data.chat_id, data.receiver_id);
                                            fcmNotification(data.receiver_id, data);
                                            socket.broadcast.to(data.chat_id).emit("receiveMessage", data);
                                        }
                                    });
                                }
                            });
                        });
                    }
                    else{
                        let newMessage = new Message({
                            chatId: data.chat_id,
                            chatData: data
                        });
                        newMessage.save(function (error, messageDetails) {
                            if (!error) {
                                Chat.findByIdAndUpdate(data.chat_id, { lastMessage: messageDetails._id, lastMessageOn: moment().toISOString() }, function (error, result) {
                                    if (!error) {
                                        unreadNotification(data.chat_id, data.receiver_id);
                                        fcmNotification(data.receiver_id, data);
                                        socket.broadcast.to(data.chat_id).emit("receiveMessage", data);
                                    }
                                });
                            }
                        });
                    }
                    
                }
            });
        }

        if (data.type === "updateChat") {
            // console.log(data);
            Message.findOneAndUpdate({ "chatData.message_id": data.message_id }, { chatData: data }, function (error, result) {
                if (error) {
                    // console.log(error);
                }
            });
        }

        if (data.type === "bookingStatus") {
            let bookingQuery = Booking.findById(data.booking_id).populate('taskerId');
            bookingQuery.exec(function (error, bookingDetails) {
                if (!error) {
                    
                    let bookingServiceQuery = BookingDetail.findOne({ bookingId: data.booking_id }).populate('serviceId');
                    bookingServiceQuery.exec(function (err, bookingServices) {
                        if (!err) {
                            // console.log("booking_status_after_accept", bookingDetails.status);
                            let bookingObject = {};
                            bookingObject.type = "bookingStatus";
                            bookingObject.user_id = data.user_id;
                            bookingObject.booking_id = data.booking_id;
                            bookingObject.status = bookingDetails.status;
                            bookingObject.description = bookingDetails.bookedFor;
                            bookingObject.service_id = bookingServices.serviceId._id;
                            bookingObject.service_name = bookingServices.serviceId.name;
                            bookingObject.service_price = bookingDetails.total;
                            bookingObject.assigned_to = (bookingDetails.taskerId) ? bookingDetails.taskerId.userId : "";
                            bookingObject.service_image = process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + bookingServices.serviceId.image;
                            io.in(data.user_id).emit('receiveMessage', bookingObject);
                        }
                    });
                }
            });
        }

        if (data.type === "blockChat") {
            if (data.blocked === "true") {
                blockChat(data.chat_id, data.user_id);
            } else {
                unblockChat(data.chat_id, data.user_id);
            }
            io.in(data.user_id).emit('blockChat', data);
            socket.broadcast.to(data.chat_id).emit("blockChat", data);
        }

        if (data.type === "reportUser") {
            User.findOneAndUpdate({ "userId": data.receiver_id }, { $inc: { reports: 1 } }, function (error, result) {
                if (error) {
                    // console.log(error);
                }
            });
        }

        if (data.type === "resetUnread") {
            resetUnread(data.chat_id, data.user_id);
        }

        if (data.type === "quoteConfirmed") {
            console.log('quoteConfirmed');
            console.log('quoteconfirmed',data);
            quoteAccepted(data.booking_id, data.price, data.receiver_id);
        }

        if (data.type === "acceptNeed") {
            console.log('calll acceptNeed funciton');
            User.findOne({ "userId": data.tasker_id, "role": "tasker" }, function (error, userDetails) {
                if (!error) {
                    console.log('detailsuser',userDetails);
                    console.log('acceptneed',data)
                    quoteAccepted(data.booking_id, data.price, data.receiver_id, userDetails._id);
                }
                else{
                    console.log(error);
                }
            });
        }
        // Live tracking
        if (data.type === "postLocation") {
            let loc = [];
            let lon = parseFloat(data.lon);
            let lat = parseFloat(data.lat);
            loc = [lon, lat];
            User.findOneAndUpdate({ "userId": data.user_id }, { $set: { loc:loc, location: data.location,lat:lat,lon:lon }}, function (error, result) {
               if(error){
                return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                }
            });
        }

        // Live tracking
        if (data.type === "getLocation") {
            User.findOne({ userId: data.tasker_id }, function (error, userDetails) {
                if (!error) {
                    let location = {};
                    location.lon = userDetails.loc[0];
                    location.lat = userDetails.loc[1];
                    location.location = userDetails.location;
                    location.user_id = data.user_id;
                    location.tasker_id = data.tasker_id;
                    location.type = data.type;
                    io.in(data.user_id).emit('receiveMessage', location);
                }
            });
        }

    });

    // user left the chat
    socket.on("disconnect", function () {
        if (socket.user_id) {
            User.findOneAndUpdate({ userId: socket.user_id }, { onlineStatus: 0, lastActive: moment().toISOString() }, function (error, userDetails) {
                if (error) {
                    // console.log(error);
                }
            });
        }
    });

    // user have unread notifications
    let unreadNotification = function (chatId, receiverId) {
        User.findOne({ "userId": receiverId }, function (error, userDetails) {
            if (!error) {

                let updateString = { $inc: { userUnread: 1 } };

                if (userDetails.role === "tasker") {
                    updateString = { $inc: { taskerUnread: 1 } };
                }

                Chat.findByIdAndUpdate(chatId, updateString, function (error, result) {
                    if (error) {
                        // console.log(error);
                    }
                });
            }
        });
    };

    // user block the chat
    let blockChat = function (chatId, userId) {
        User.findOne({ "userId": userId }, function (error, userDetails) {
            if (!error) {

                let updateString = { $push: { blockedBy: "user" } };

                if (userDetails.role === "tasker") {
                    updateString = { $push: { blockedBy: "tasker" } };
                }

                Chat.findByIdAndUpdate(chatId, updateString, function (error, result) {
                    if (error) {
                        // console.log(error);
                    }
                });
            }
        });
    };

    // user unblock the chat
    let unblockChat = function (chatId, userId) {
        User.findOne({ "userId": userId }, function (error, userDetails) {
            if (!error) {

                let updateString = { $pull: { blockedBy: "user" } };

                if (userDetails.role === "tasker") {
                    updateString = { $pull: { blockedBy: "tasker" } };
                }

                Chat.findByIdAndUpdate(chatId, updateString, function (error, result) {
                    if (error) {
                        // console.log(error);
                    }
                });
            }
        });
    };

    // user read all notifications
    let resetUnread = function (chatId, userId) {
        User.findOne({ "userId": userId }, function (error, userDetails) {
            if (!error) {

                let updateString = { userUnread: 0 };

                if (userDetails.role === "tasker") {
                    updateString = { taskerUnread: 0 };
                }

                Chat.findByIdAndUpdate(chatId, updateString, function (error, result) {
                    if (error) {
                        // console.log(error);
                    }
                });
            }
        });
    };

    // user's need is accepeted by tasker
    let quoteAccepted = async function (bookingId, confirmedPrice, receiverId, taskerId) {
        console.log('call accept function')
        let updateString = {};
        let taxPer = 0;
        let commissionPer = 0;

        await Setting.findOne(async function (error, appSettings) {
            if (!error) {

                if (appSettings.tax)
                    taxPer = appSettings.tax / 100;

                if (appSettings.commission)
                    commissionPer = appSettings.commission / 100;

                let quoteConfirmedFor = parseFloat(confirmedPrice);
                let bookingCommission = parseFloat(quoteConfirmedFor) * parseFloat(commissionPer);
                let bookingTax = parseFloat(quoteConfirmedFor) * parseFloat(taxPer);
                let totalAmount = parseFloat(quoteConfirmedFor) + parseFloat(bookingCommission) + parseFloat(bookingTax);

                updateString.commission = bookingCommission.toFixed(2);
                updateString.tax = bookingTax.toFixed(2);
                updateString.total = totalAmount.toFixed(2);
                updateString.price = quoteConfirmedFor.toFixed(2);
                updateString.status = "accepted";

                if (taskerId) {
                    updateString.taskerId = taskerId;
                }
                console.log('updated string',updateString)
                Booking.findOneAndUpdate({_id:bookingId}, updateString,{new:true}, async function (error, bookingDetails) {
                    if (!error) {
                        console.log('bookingDetails',bookingDetails);
                        /* let logMessage = res.__("Your service has been") + " " + res.__("accepted");
                        logController.createLog(bookingDetails.taskerId, bookingDetails.userId, bookingDetails._id, logMessage); */
                        let raw_user_id = receiverId;
                        // if(taskerId) {
                        //     console.log('yesssssssss',taskerId);
                        //     await User.findById(taskerId, function (error, userDetails) {
                        //         if (!error) {
                        //             raw_user_id = userDetails.userId;
                        //         }
                        //     });
                        // }
                        // else {
                        //     console.log('yesssssssssbro',taskerId);
                        //     await User.findById(bookingDetails.userId, function (error, userDetails) {
                        //         if (!error) {
                        //             raw_user_id = userDetails.userId;
                        //         }
                        //     });
                        // }
                        var bookingDetails_updateString = {};
                        // bookingDetails_updateString.price = quoteConfirmedFor.toFixed(2);
                        bookingDetails_updateString.total = totalAmount.toFixed(2);
                        BookingDetail.findOneAndUpdate({ bookingId : bookingId }, bookingDetails_updateString, function (error, subbookingDetails) {
                            if (!error) {
                                let bookingQuery = Booking.findOne({_id:bookingId}).populate('taskerId');
                                bookingQuery.exec(function (error, bookingDetails) {
                                    if (!error) {
                                        console.log('bookingDetailsdtas',bookingDetails);
                                        let bookingServiceQuery = BookingDetail.findOne({ bookingId: bookingId }).populate('serviceId');
                                        bookingServiceQuery.exec(function (err, bookingServices) {
                                            if (!err) {
                                                console.log("booking_status_after_accept", bookingDetails.status);
                                                let bookingObject = {};
                                                bookingObject.type = "bookingStatus";
                                                bookingObject.user_id = raw_user_id;
                                                bookingObject.booking_id = bookingId;
                                                bookingObject.status = bookingDetails.status;
                                                bookingObject.description = bookingDetails.bookedFor;
                                                bookingObject.service_id = bookingServices.serviceId._id;
                                                bookingObject.service_name = bookingServices.serviceId.name;
                                                bookingObject.service_price = bookingDetails.total;
                                                bookingObject.assigned_to = (bookingDetails.taskerId) ? bookingDetails.taskerId.userId : "";
                                                bookingObject.service_image = process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + bookingServices.serviceId.image;
                                                io.in(raw_user_id).emit('receiveMessage', bookingObject);
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                console.log(error);
                            }
                        });
                    }
                });
            }
        });
    };

    // push notification for user
    let fcmNotification = function (userId, MsgData) {
        User.findOne({ "userId": userId, chatNotification: "true", deviceActive: 1 }, function (error, userDetails) {
            if (!error && userDetails) {
                fcmService.notifyUser(userDetails.deviceToken, { "title": MsgData.user_name, "scope": "chat", "message": JSON.stringify(MsgData) },userDetails.languageType);
            }
        });
    };
   
});
