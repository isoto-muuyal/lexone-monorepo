const express = require("express");
const router = express.Router();

// auth middleware
const authMiddleware = require("../middlewares/auth");

// controllers
const userController = require("../controllers/userController");
const taskerController = require("../controllers/taskerController");
const categoryController = require("../controllers/categoryController");
const adminController = require("../controllers/adminController");
const serviceController = require("../controllers/serviceController");
const mediaController = require("../controllers/mediaController");
const needController = require("../controllers/needController");
const bookingController = require("../controllers/bookingController");
const reviewController = require("../controllers/reviewController");
const paymentController = require("../controllers/paymentController");
const chatController = require("../controllers/chatController");
const logController = require("../controllers/logController");

// user routes
router.post("/user/signup", userController.signUp);
router.post("/user/signin", userController.signIn);
router.post("/user/socialsignin", userController.socialSignIn);
router.post("/user/forgotpassword", userController.forgotPassword);
router.post("/user/deletestatus", userController.deleteStatus);
router.post("/user/profile", authMiddleware.userJwt, userController.userProfile);

router.post("/user/profileupdate", userController.userProfileupdate);
router.post("/tasker/profileupdate", taskerController.userProfileupdate);

router.post("/user/resetpassword", authMiddleware.userJwt, userController.resetPassword);
router.post("/user/signout", authMiddleware.userJwt, userController.signOut);
router.post("/user/deactivateaccount", authMiddleware.userJwt, userController.deactivateAccount);
router.post("/user/deleteaccount", authMiddleware.userJwt, userController.deleteAccount);
router.post('/user/home', authMiddleware.userJwt, userController.userHome);
router.post("/user/hiretaskers", authMiddleware.userJwt, serviceController.hireTaskers);
router.post("/user/addneed", authMiddleware.userJwt, needController.addNeed);
router.post("/user/needs", authMiddleware.userJwt, needController.allNeeds);
router.post("/user/bookservice", authMiddleware.userJwt, bookingController.bookService);
router.post("/user/bookings", authMiddleware.userJwt, bookingController.userBookings);
router.get("/user/bookingdetails/:bookingId",  bookingController.bookingDetails);
router.get("/user/taskerprofile/:taskerId", authMiddleware.commonJwt, taskerController.viewProfile);
router.post("/user/postreview", authMiddleware.userJwt, reviewController.postReview);
router.post("/user/paybooking", authMiddleware.userJwt, paymentController.payBooking);
router.post("/user/createpaymentintent", authMiddleware.userJwt, paymentController.createPaymentIntent);
//createPaymentIntent
router.post("/user/payreward", authMiddleware.userJwt, paymentController.payReward);
router.post("/user/bookingstatus", bookingController.userBookingStatus);
router.get("/user/notifications/:userId/:offset/:limit", authMiddleware.commonJwt, logController.userLogs);
router.get("/user/chats/:userId/:platform", authMiddleware.commonJwt, chatController.userChats);
router.get("/user/messages/:chatId/:offset/:limit", chatController.chatMessages);
router.post("/user/chatinfo", authMiddleware.userJwt, chatController.userChatInfo);
router.post("/user/recenttasks", authMiddleware.userJwt, needController.recentNeeds);
router.post("/user/createchat", authMiddleware.userJwt, chatController.createUserChat);
// addons
    router.post("/user/mobilesignin", userController.mobileSignIn);

    router.post("/user/mobilelogin", userController.mobileLogin);
    router.post("/tasker/mobilelogin", taskerController.mobileLogin);

    
// ends here

// tasker routes
router.post("/tasker/signup", taskerController.signUp);
router.post("/tasker/signin", taskerController.signIn);
router.post("/tasker/forgotpassword", taskerController.forgotPassword);
router.post("/tasker/profile", authMiddleware.taskerJwt, taskerController.userProfile);
router.post("/tasker/resetpassword", authMiddleware.taskerJwt, taskerController.resetPassword);
router.post("/tasker/signout", authMiddleware.taskerJwt, taskerController.signOut);
router.post("/tasker/deactivateaccount", authMiddleware.taskerJwt, taskerController.deactivateAccount);
router.post("/tasker/deleteaccount", authMiddleware.taskerJwt, taskerController.deleteAccount);
router.post("/tasker/addservice", serviceController.addService);
router.post("/tasker/servicecategories", authMiddleware.taskerJwt, serviceController.taskerCategories);
router.post("/tasker/services", serviceController.taskerServices);
router.post("/tasker/deleteservice", authMiddleware.taskerJwt, serviceController.deleteService);
router.post("/tasker/browseneeds", authMiddleware.taskerJwt, needController.browseNeeds);
router.post("/tasker/media", authMiddleware.taskerJwt, mediaController.allMedia);
router.post("/tasker/deletemedia/", authMiddleware.taskerJwt, mediaController.deleteMedia);
router.post("/tasker/bookings", authMiddleware.taskerJwt, bookingController.taskerBookings);
router.post("/tasker/bookingdetails", authMiddleware.taskerJwt, bookingController.taskerbookingDetails);
router.post("/tasker/bookingstatus", authMiddleware.taskerJwt, bookingController.taskerBookingStatus);
router.get("/tasker/chats/:userId/:platform", authMiddleware.commonJwt, chatController.taskerChats);
router.get("/tasker/notifications/:userId/:offset/:limit", authMiddleware.commonJwt, logController.taskerLogs);
router.get("/tasker/messages/:chatId/:offset/:limit", authMiddleware.commonJwt, chatController.chatMessages);
router.post("/tasker/chatinfo", authMiddleware.taskerJwt, chatController.taskerChatInfo);
router.post("/tasker/createchat", authMiddleware.taskerJwt, chatController.createChat);
router.get("/tasker/dashboard/:taskerId", authMiddleware.commonJwt, taskerController.taskerDashboard);
//router.get("/tasker/stripeurl/:taskerId", authMiddleware.commonJwt, taskerController.stripeUrl);
router.get("/tasker/stripeurl/:taskerId", authMiddleware.commonJwt, taskerController.stripeUrl);
router.get("/tasker/accountconnection/:taskerToken/:taskerId", authMiddleware.commonJwt, taskerController.accountConnection);
router.get("/tasker/stripestatus/:taskerId", taskerController.stripestatus); //authMiddleware.commonJwt,
router.get("/tasker/mapconnectaccount/:taskerId/:taskerToken", authMiddleware.commonJwt, taskerController.mapconnectAccount);

// common routes
router.post("/categories", authMiddleware.commonJwt, categoryController.allCategories);
router.post("/subcategories", categoryController.allSubcategories);
router.post("/services", authMiddleware.commonJwt, categoryController.allServices);
router.post("/searchcategories", authMiddleware.commonJwt, categoryController.searchCategories);
router.get("/appdefaults", adminController.appDefaults);
router.get("/helps/:type?", adminController.appHelps);
router.post("/contactus", authMiddleware.commonJwt, adminController.contactAdmin);
router.get("/reviews/:reviewType/:reviewId/:offset/:limit", authMiddleware.commonJwt, reviewController.allReviews);
router.get("/adminnotifications/:role/:platform/:offset/:limit", authMiddleware.commonJwt, adminController.adminNotifications);

module.exports = router;
