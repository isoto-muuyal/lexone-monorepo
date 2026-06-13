const admin = require("firebase-admin");
const serviceAccount = require("../config/fcm/modular-bucksaw-421523-firebase-adminsdk-w7ii6-50674802f4.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://modular-bucksaw-421523-default-rtdb.firebaseio.com"
    });
}

exports.notifyUser = function (deviceToken, msgObj) {
    let msgbody = JSON.parse(msgObj.message);
    let msgData = { "scope": msgObj.scope, "message": msgObj.message };

    let msgNotification = { "notification_data": JSON.stringify(msgData) };
    console.log(msgNotification);
    let message = {
        data: msgNotification,
        notification: {
            title: msgObj.title,
            body: msgbody.message.message
        },
        webpush: {
            headers: {
                Urgency: "high"
            }
        },
        android: {
            priority: "high"
        },
        apns: {
            payload: {
                aps: {
                    alert: {
                        title: msgObj.title,
                        body: msgbody.message.message
                    },
                    sound: "default"
                }
            },
            headers: {
                "apns-priority": "10"
            }
        },
        token: deviceToken
    };

    console.log('Sending message payload:', JSON.stringify(message, null, 2));

    admin.messaging().send(message).then(function (response) {
        console.log('FCM response:', response);
    }).catch(function (error) {
        console.log('FCM error:', error);
    });
};



exports.notifyUsers = function (deviceToken, msgObj) {

    let msgbody = JSON.parse(msgObj.message);
    let msgData = { "scope": msgObj.scope, "message": msgObj.message };

    let msgNotification = { "notification_data": JSON.stringify(msgData) };

    let message = {
        data: msgNotification,
        notification: {
            title: msgObj.title,
            body: msgbody.message.message
        },
        android: {
            priority: "high"
        },
        token: deviceToken,
        
    };
    let topic = 'stripe';

    admin.messaging().subscribeToTopic(message, topic).then(function(response) {
        
        console.log('Successfully subscribed to topic:', response);
    }).catch(function(error) {
        console.log('Error subscribing to topic:', error);
    });
};