const express = require("express");
const router = express.Router();

// auth middleware
const authMiddleware = require("../middlewares/auth");

// controllers
const userController = require("../controllers/web/userController");
const taskerController = require("../controllers/web/taskerController");
const categoryController = require("../controllers/web/categoryController");
const adminController = require("../controllers/web/adminController");
const serviceController = require("../controllers/web/serviceController");
const mediaController = require("../controllers/web/mediaController");
const needController = require("../controllers/web/needController");
const bookingController = require("../controllers/web/bookingController");
const reviewController = require("../controllers/web/reviewController");
const paymentController = require("../controllers/web/paymentController");
const chatController = require("../controllers/web/chatController");
const logController = require("../controllers/web/logController");
const calendarRoutes = require("./calendar");
const clientRoutes = require("./clients");
const caseRoutes = require("./cases");

// user routes
router.use("/", calendarRoutes);
router.use("/", clientRoutes);
router.use("/", caseRoutes);

router.post("/user/emailexist", userController.emailExists);
router.post("/user/mobileexists", userController.mobileExists);
router.post("/user/signup", userController.signUp);
router.post("/user/signin", userController.signIn);
router.post("/user/socialsignin", userController.socialSignIn);
router.post("/user/forgotpassword", userController.forgotPassword);
router.post("/user/forgetresetpassword", userController.forgetResetpassword);
router.post("/user/checkresetpasswordtoken", userController.checkResetpasswordToken);
router.post("/user/profile", userController.userProfile);
router.post("/user/resetpassword", authMiddleware.userJwt, userController.resetPassword);
router.post("/user/signout", authMiddleware.userJwt, userController.signOut);
router.post("/user/deactivateaccount", authMiddleware.userJwt, userController.deactivateAccount);
router.post("/user/deleteaccount", authMiddleware.userJwt, userController.deleteAccount);
router.post('/user/home', userController.userHome);
router.get('/user/get_home_feature_items/:offset/:limit', userController.home_feature_items);
router.post("/user/hiretaskers", authMiddleware.userJwt, serviceController.hireTaskers);
router.post("/user/addneed", authMiddleware.userJwt, needController.addNeed);
router.post("/user/needs", authMiddleware.userJwt, needController.allNeeds);
router.post("/user/bookservice", authMiddleware.userJwt, bookingController.bookService);
router.post("/user/createpaylink", authMiddleware.userJwt, bookingController.createPaylink);
router.post("/user/createrewardPaylink", authMiddleware.userJwt, bookingController.createrewardPaylink);
router.post("/user/retrievesessions", authMiddleware.userJwt, bookingController.retrieveSessions);
router.post("/user/retrieverewardsessions", authMiddleware.userJwt, bookingController.retrieverewardSessions);
router.post("/user/bookings", authMiddleware.userJwt, bookingController.userBookings);
router.get("/user/bookingdetails/:bookingId", authMiddleware.commonJwt, bookingController.bookingDetails);
router.get("/user/taskerprofile/:taskerId", authMiddleware.commonJwt, taskerController.viewProfile);
router.post("/user/postreview", authMiddleware.userJwt, reviewController.postReview);
router.post("/user/paybooking", authMiddleware.userJwt, paymentController.payBooking);
router.post("/user/payreward", authMiddleware.userJwt, paymentController.payReward);
router.post("/user/bookingstatus", authMiddleware.userJwt, bookingController.userBookingStatus);
router.get("/user/notifications/:userId/:offset/:limit", authMiddleware.commonJwt, logController.userLogs);
router.get("/user/chats/:userId/:platform", authMiddleware.commonJwt, chatController.userChats);
router.get("/user/messages/:chatId/:offset/:limit", authMiddleware.commonJwt, chatController.chatMessages);
router.post("/user/chatinfo", authMiddleware.userJwt, chatController.userChatInfo);
router.post("/user/recenttasks", authMiddleware.userJwt, needController.recentNeeds);
router.post("/user/createchat", authMiddleware.userJwt, chatController.createUserChat);
// addons
    router.post("/user/mobilesignin", userController.mobileSignIn);
// ends here



// tasker routes
router.post("/tasker/signup", taskerController.signUp);
router.post("/tasker/signin", taskerController.signIn);
router.post("/tasker/forgotpassword", taskerController.forgotPassword);
router.post("/tasker/profile", authMiddleware.taskerJwt, taskerController.userProfile);
router.post("/tasker/resetpassword", authMiddleware.taskerJwt, taskerController.resetPassword);
router.post("/tasker/signout", authMiddleware.signoutJwt, taskerController.signOut);
router.post("/tasker/deactivateaccount", authMiddleware.taskerJwt, taskerController.deactivateAccount);
router.post("/tasker/deleteaccount", authMiddleware.taskerJwt, taskerController.deleteAccount);
router.post("/tasker/addservice", authMiddleware.taskerJwt, serviceController.addService);
router.post("/tasker/servicecategories", authMiddleware.taskerJwt, serviceController.taskerCategories);
router.post("/tasker/services", authMiddleware.taskerJwt, serviceController.taskerServices);
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
router.get("/tasker/stripeurl/:taskerId", authMiddleware.commonJwt, taskerController.stripeUrl);
router.get("/tasker/stripestatus/:taskerId", authMiddleware.commonJwt, taskerController.stripestatus);
router.get("/tasker/mapconnectaccount/:taskerId/:taskerToken", authMiddleware.commonJwt, taskerController.mapconnectAccount);



// common routes
router.post("/category_by_id", categoryController.CategoryById);
router.post("/sub_category_by_id", categoryController.SubCategoryById);
router.post("/service_by_id", categoryController.ServiceById);

router.get("/categories_service_tree", categoryController.Categories_service_tree);
router.get("/categories", categoryController.allCategories);
router.post("/subcategories", categoryController.allSubcategories);
router.post("/services", categoryController.allServices);
router.post("/searchcategories", categoryController.searchCategories);
router.get("/appdefaults", adminController.appDefaults);
router.get("/helps/:type?", adminController.appHelps);
router.post("/contactus", adminController.contactAdmin);
router.get("/reviews/:reviewType/:reviewId/:offset/:limit", reviewController.allReviews);
router.get("/adminnotifications/:role/:platform/:offset/:limit", authMiddleware.commonJwt, adminController.adminNotifications);


module.exports = router;
