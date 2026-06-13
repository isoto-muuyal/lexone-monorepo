const jwt = require("jsonwebtoken");
const fs = require('fs');
const https = require('https');
const querystring = require('querystring');
const PUB_KEY = fs.readFileSync(__dirname + '/public.pem', 'utf8');
const PRIV_KEY = fs.readFileSync(__dirname + '/key.pem', 'utf8');

const User = require('../models/userModel');


exports.userJwt = async function (req, res, next) {


    const token = req.headers.authorization;
    if (!token) return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access") });
    try {
        const decodedJWT = jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] });
        if ((decodedJWT.userId !== req.body.user_id) || (decodedJWT.userRole !== "user")) {
            return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
        }
        let userDetails = await User.findOne({ userId: decodedJWT.userId });
        if(userDetails.status === 0){
            return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
        }
        
        deviceToken = userDetails.deviceToken;
        let deviceMatch = await User.countDocuments({ userId: decodedJWT.userId, deviceToken:decodedJWT.deviceToken });
        if (deviceMatch == 0) {
            return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access") });
        }
        // if ((decodedJWT.userId !== req.body.user_id) || (decodedJWT.userRole !== "user")) {
        //     return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
        // }
        return next();
    } catch (error) {
        return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
    }
};

exports.taskerJwt = async function (req, res, next) {
    
    const token = req.headers.authorization;
    if (!token) return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access2") });
    try {
        const decodedJWT = jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] });
        // const decodedJWT = jwt.verify(token, process.env.JWT_SECRET, {});
        if ((decodedJWT.userId !== req.body.user_id) || (decodedJWT.userRole !== "tasker")) {
            return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
        }
        let userDetails = await User.findOne({ userId: decodedJWT.userId });
        if(userDetails.status === 0){
            return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
        }
        deviceToken = userDetails.deviceToken;
        let deviceMatch = await User.countDocuments({ userId: decodedJWT.userId, deviceToken:decodedJWT.deviceToken });
        if (deviceMatch == 0) {
            return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access1") });
        }
        return next();
    } catch (error) {
        return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
    }
};



exports.signoutJwt = async function (req, res, next) {

    const token = req.headers.authorization;
    if (!token) return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access") });
    try {
        const decodedJWT = jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] });
        // const decodedJWT = jwt.verify(token, process.env.JWT_SECRET, {});
        if ((decodedJWT.userId !== req.body.user_id) || (decodedJWT.userRole !== "tasker")) {
            return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
        }
        let userDetails = await User.findOne({ userId: decodedJWT.userId });
        deviceToken = userDetails.deviceToken;
        let deviceMatch = await User.countDocuments({ userId: decodedJWT.userId, deviceToken:decodedJWT.deviceToken });
        
        if (deviceMatch == 0) {
            return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access") });
        }
        return next();
    } catch (error) {
        return res.status(200).json({ status_code: 401, message: res.__("Invalid Token")
    });
    }
};

exports.commonJwt = async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access") });
    try {
        const decodedJWT = jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] });
        let userDetails;
        let deviceToken;
        if (decodedJWT.userRole == "tasker") {
            userDetails = await User.findOne({ userId: decodedJWT.userId });
            deviceToken = userDetails.deviceToken;
        }
        
        if ((decodedJWT.deviceToken !== deviceToken) && (decodedJWT.userRole == "tasker") ) {
            return res.status(200).json({ status_code: 401, message: res.__("Unauthorized access") });
        }
        // const decodedJWT = jwt.verify(token, process.env.JWT_SECRET, {});
        return next();
    } catch (error) {
        return res.status(200).json({ status_code: 401, message: res.__("Invalid Token") });
    }
};

exports.createJwt = function (userInfo) {
    if(userInfo.status == '0')
        return 401;

    if (userInfo.name && userInfo.id && userInfo.role) {
        // return jwt.sign({ "userName": userInfo.name, "userId": userInfo.userId, "userRole": userInfo.role }, process.env.JWT_SECRET, {});
        return jwt.sign({ "userName": userInfo.name, "userId": userInfo.userId, "userRole": userInfo.role, "deviceToken": userInfo.deviceToken }, PRIV_KEY, { algorithm: 'RS256' });
       
    }
};


// exports.createJwt = function (userInfo) {
//     if (userInfo.status == '0') {
//         return 401;
//     }

//     if (userInfo.name && userInfo.id && userInfo.role) {
//         const token = jwt.sign(
//             {
//                 "userName": userInfo.name,
//                 "userId": userInfo.userId,
//                 "userRole": userInfo.role,
//                 "deviceToken": userInfo.deviceToken
//             },
//             PRIV_KEY,
//             { algorithm: 'RS256', audience: 'https://oauth2.googleapis.com/token' }
//             // { algorithm: 'RS256', expiresIn: '12h', audience: 'https://oauth2.googleapis.com/token' }
//         );
//         return token;
//     }
// };




// exports.getAccessToken = async function(userInfo) {
//     const jwtToken = exports.createJwt(userInfo);
//     console.log("Access token2");
//     console.log(jwtToken);
//     if (jwtToken === 401) {
//         throw new Error('User status is inactive.');
//     }

//     const tokenEndpoint = 'https://oauth2.googleapis.com/token';
//     const clientEmail = 'firebase-adminsdk-w7ii6@modular-bucksaw-421523.iam.gserviceaccount.com';
//     const scope = 'https://www.googleapis.com/auth/firebase.messaging';

//     const postData = querystring.stringify({
//         grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
//         assertion: jwtToken,
//         client_id: clientEmail,
//         scope: scope
//     });

//     const options = {
//         hostname: 'oauth2.googleapis.com',
//         port: 443,
//         path: '/token',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Content-Length': postData.length
//         }
//     };

//     return new Promise((resolve, reject) => {
//         const req = https.request(options, (res) => {
//             let data = '';

//             res.on('data', (chunk) => {
//                 data += chunk;
//             });

//             res.on('end', () => {
//                 try {
//                     const responseData = JSON.parse(data);
//                     if (responseData.error) {
//                         reject(new Error(`Error: ${responseData.error}`));
//                     } else {
//                         console.log("Access token1");
//                         console.log(responseData.access_token);
//                         resolve(responseData.access_token);
//                     }
//                 } catch (error) {
//                     reject(error);
//                 }
//             });
//         });

//         req.on('error', (error) => {
//             reject(error);
//         });

//         req.write(postData);
//         req.end();
//     });
// };






