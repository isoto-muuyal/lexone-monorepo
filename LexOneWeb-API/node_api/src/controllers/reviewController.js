const mongoose = require("mongoose");

const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const Category = require('../models/categoryModel');

// fcm service
const fcmService = require('../controllers/fcmController');

const logController = require("../controllers/logController");

exports.postReview = async function (req, res) {
    if (!req.body.user_id || !req.body.booking_id | !req.body.rating || !req.body.description) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            if (req.body.review_id) {
                
                let reviewDetails = await Review.findById(req.body.review_id);

                if (!reviewDetails)
                    return res.status(200).json({ status_code: 400, message: res.__("Review does not exists") });

                reviewDetails.rating = req.body.rating;
                reviewDetails.description = req.body.description;
                reviewDetails.save();
                taskerRatings(reviewDetails.taskerId);
                categoryRatings(reviewDetails.mainCategory);
                return res.status(200).json({ status_code: 200, review_id: reviewDetails._id, message: res.__("Review updated successfully") });
            }
            else {

                let bookingDetails = await Booking.findById(req.body.booking_id);
                let tasker = await User.findById(bookingDetails.taskerId);
                let languageType = tasker.languageType;

                if (!bookingDetails)
                    return res.status(200).json({ status_code: 400, message: res.__("Booking does not exists") });

                let reviewData = {};

                reviewData.userId = userDetails._id;
                reviewData.taskerId = bookingDetails.taskerId;
                reviewData.mainCategory = bookingDetails.mainCategory;
                reviewData.bookingId = req.body.booking_id;
                reviewData.rating = req.body.rating;
                reviewData.description = req.body.description;

                let newReview = new Review(reviewData);
                await newReview.save(function (error, reviewDetails) {
                    if (!error) {
                        taskerRatings(reviewDetails.taskerId);
                        categoryRatings(reviewDetails.mainCategory);
                        
                        let logMessage = res.__({ phrase: "Your service has been rated with", locale: languageType }) + " " + req.body.rating + " " + res.__({ phrase: "stars", locale: languageType });
                        let txtMsg = "Your service has been rated with stars";
                        let currency = req.body.rating;
                        logController.createLog(userDetails._id, bookingDetails.taskerId, bookingDetails._id, "review", txtMsg, currency);
                        reviewNotification(reviewDetails.taskerId, { "name": userDetails.name, "message": { "message": logMessage } });
                        return res.status(200).json({ status_code: 200, review_id: reviewDetails._id, message: res.__("Review posted successfully") });
                    } else {
                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                    }
                });
            }
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.allReviews = async function (req, res) {
    if (!req.params.reviewType || !req.params.reviewId || !req.params.limit || !req.params.offset) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let limit = parseInt(req.params.limit);

            let offset = parseInt(req.params.offset);

            let searchObject = { mainCategory: req.params.reviewId };

            if (req.params.reviewType === "tasker") {
                let userDetails = await User.findOne({ userId: req.params.reviewId, role: "tasker" });
                searchObject = { taskerId: userDetails._id };
            }

            let userReviews = await Review.find(searchObject).populate("userId").populate("bookingId").populate("mainCategory").sort({ "updatedAt": -1 }).limit(limit).skip(offset);

            if (userReviews.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No reviews found") });

            let reviews = [];

            userReviews.filter(function (eachReview) {
                if (eachReview.bookingId){
                    reviews.push({
                        user_id: eachReview.userId._id,
                        review_id: eachReview._id,
                        name: eachReview.userId.name,
                        parent_category_name: eachReview.mainCategory.name,
                        user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachReview.userId.image,
                        description: eachReview.description,
                        date: eachReview.updatedAt,
                        rating: eachReview.rating,
                        location: eachReview.bookingId.bookedWhere,
                        reference_id: eachReview.bookingId.bookingId,
                        booking_date: eachReview.bookingId.createdAt,
                    });
                }
                
            });

            return res.status(200).json({ status_code: 200, items: reviews });

        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

let taskerRatings = async function (taskerId) {

    let totalReviews = await Review.countDocuments({ taskerId: mongoose.Types.ObjectId(taskerId) });

    if (totalReviews) {

        let totalRatings = await Review.aggregate([{ $match: { taskerId: mongoose.Types.ObjectId(taskerId) } }, {
            $group: {
                _id: "$taskerId", total: {
                    $sum: {
                        $toDouble: "$rating"
                    }
                }
            }
        }]).exec();

        let taskerratings = (totalRatings[0].total) ? parseFloat(totalRatings[0].total / totalReviews) : 0;

        if (taskerratings) {
            User.findByIdAndUpdate(taskerId, { reviews: totalReviews, rating: taskerratings.toFixed(1) }, function (error, result) {
                if (error) {
                    // console.log(error);
                }
            });
        }

    }
};

let categoryRatings = async function (categoryId) {
    let totalReviews = await Review.countDocuments({ mainCategory: mongoose.Types.ObjectId(categoryId) });

    if (totalReviews) {

        let totalRatings = await Review.aggregate([{ $match: { mainCategory: mongoose.Types.ObjectId(categoryId) } }, {
            $group: {
                _id: "$mainCategory", total: {
                    $sum: {
                        $toDouble: "$rating"
                    }
                }
            }
        }]).exec();

        let taskerratings = (totalRatings[0].total) ? parseFloat(totalRatings[0].total / totalReviews) : 0;

        if (taskerratings) {
            Category.findByIdAndUpdate(categoryId, { rating: taskerratings.toFixed(1) }, function (error, result) {
                if (error) {
                    // console.log(error);
                }
            });
        }
    }
};

let reviewNotification = function (userId, MsgData) {
    User.findById(userId, function (error, userDetails) {
        if (!error && userDetails && userDetails.deviceToken) {
            if (userDetails.bookingNotification === "true" && userDetails.deviceActive === 1 && userDetails.deviceToken != "") {
                fcmService.notifyUser(userDetails.deviceToken, { "title": MsgData.name, "scope": "review", "message": JSON.stringify(MsgData) },userDetails.languageType);
            }
        }
    });
};
