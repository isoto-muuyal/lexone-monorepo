const mongoose = require("mongoose");
const moment = require("moment");
const { nanoid } = require('nanoid');
const fs = require('fs');

// models
const Booking = require('../models/bookingModel');
const BookingDetail = require('../models/bookingdetailModel');
const User = require('../models/userModel');
const Setting = require('../models/settingModel');
const Category = require('../models/categoryModel');
const Service = require('../models/serviceModel');
const Subcategory = require('../models/subcategoryModel');

exports.addNeed = async function (req, res) {
    console.log("addNeed called");
    console.log(req.body);
    console.log(req.headers);
    if (!req.body.user_id || !req.body.parent_category_id || !req.body.subcategory_id || !req.body.service_id || !req.body.name || !req.body.price || !req.body.date  || !req.body.description) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXx0") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });
            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var moreDetailsLang = object.toUpperCase();
            var langName = object.toLowerCase();

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let appSettings = await Setting.findOne({});

            let taxPer = 0;

            let commissionPer = 0;

            if (appSettings.tax)
                taxPer = appSettings.tax / 100;

            if (appSettings.commission)
                commissionPer = appSettings.commission / 100;


            if (req.body.need_id) {

                let bookingDetails = await Booking.findById(req.body.need_id).populate("mainCategory").populate("subCategory").populate("serviceId");

                if (!bookingDetails)
                    return res.status(200).json({ status_code: 400, message: res.__("Booking does not exists") });

                  
                bookingDetails.bookedName = req.body.name;
                bookingDetails.bookedWhen = req.body.date;
                bookingDetails.bookedFor = req.body.description;
                bookingDetails.price = req.body.price;
                let category = await Category.findById(req.body.parent_category_id);
                bookingDetails.locationType = category.locationType;
                if (appSettings.instantLocation.toString() == "true") {
                    if (category.locationType == "transport") {
                        if (!req.body.source_location || !req.body.source_lat || !req.body.source_lon || !req.body.dest_location || !req.body.dest_lat || !req.body.dest_lon ) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid Params222") });
                        }
                        else{
                            bookingDetails.sourcelocation = req.body.source_location;
                            bookingDetails.sourceLat = req.body.source_lat;
                            bookingDetails.sourceLon = req.body.source_lon;
                            bookingDetails.destLocation = req.body.dest_location;
                            bookingDetails.destLat = req.body.dest_lat;
                            bookingDetails.destLon = req.body.dest_lon;
                            bookingDetails.loc = [req.body.source_lon, req.body.source_lat];
                        }
                    }
                    else if (category.locationType == "home") {
                        if (!req.body.source_location || !req.body.source_lat|| !req.body.source_lon) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXH") });
                        }
                        else{
                            bookingDetails.sourcelocation = req.body.source_location;
                            bookingDetails.source_lat = req.body.source_lat;
                            bookingDetails.source_lon = req.body.source_lon;
                            bookingDetails.loc = [req.body.source_lon, req.body.source_lat];
                        }
                    }
                }
                else{
                    if (category.locationType == "transport") {
                        if (!req.body.source_location || !req.body.dest_location ) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsLocation") });
                        }
                        else{
                            bookingDetails.sourcelocation = req.body.source_location;
                            bookingDetails.destLocation = req.body.dest_location;
                        }
                    }
                    else if (category.locationType == "home") {
                        if (!req.body.source_location) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsHome") });
                        }
                        else{
                            bookingDetails.sourcelocation = req.body.source_location;
                        }

                    }
                }
                let bookingCommission = parseFloat(req.body.price) * parseFloat(commissionPer);
                let bookingTax = parseFloat(req.body.price) * parseFloat(taxPer);

                bookingDetails.commission = bookingCommission.toFixed(2);
                bookingDetails.tax = bookingTax.toFixed(2);

                let totalAmount = parseFloat(req.body.price) + parseFloat(bookingCommission) + parseFloat(bookingTax);

                bookingDetails.total = totalAmount.toFixed(2);

                bookingDetails.save();

                let searchObject = { bookingId: bookingDetails._id };
                let saveObject = { price: req.body.price, total: totalAmount };
                updateBookingDetails(searchObject, saveObject);

                // return res.status(200).json({ status_code: 200, message: res.__("Posted successfully") });
                
                let dueDate = moment(bookingDetails.bookedWhen).isBefore(moment().startOf('day').toISOString());

                let bookingResponse = {}
                bookingResponse.status_code= 200;
                bookingResponse.item_id= bookingDetails._id;
                bookingResponse.user_id= userDetails._id;
                bookingResponse.parent_category_id= bookingDetails.mainCategory._id;
                bookingResponse.subcategory_id= bookingDetails.subCategory._id;
                bookingResponse.parent_category_name = bookingDetails.mainCategory.name;
                bookingResponse.service_name= (bookingDetails.serviceId.name) ? bookingDetails.serviceId.name : "";
                bookingResponse.subcategory_name = (bookingDetails.subCategory.name)?(bookingDetails.subCategory.name):"";
                bookingResponse.service_id= (bookingDetails.serviceId) ? bookingDetails.serviceId._id : "";
                if (host != "en") {
                    bookingResponse.parent_category_name = (bookingDetails.mainCategory[langName+'Name']) ? (bookingDetails.mainCategory[langName+'Name']) : bookingDetails.mainCategory.name;
                }
                if (host != "en") {
                    bookingResponse.subcategory_name = (bookingDetails.subCategory[langName+'Name']) ? (bookingDetails.subCategory[langName+'Name']) : bookingDetails.subCategory.name;
                }
                if (host != "en") {
                    bookingResponse.service_name = (bookingDetails.serviceId[langName+'Name']) ? (bookingDetails.serviceId[langName+'Name']) : bookingDetails.serviceId.name;
                }
                bookingResponse.location_type= bookingDetails.locationType;
                bookingResponse.service_image= (bookingDetails.serviceId) ? process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + bookingDetails.serviceId.image : "";
                bookingResponse.name= bookingDetails.bookedName;
                bookingResponse.booking_price= bookingDetails.price.toString();
                bookingResponse.date= bookingDetails.bookedWhen;
                bookingResponse.description= bookingDetails.bookedFor;
                bookingResponse.active_status= (bookingDetails.needStatus) ? "true" :"false";
                bookingResponse.due_status= dueDate.toString();
                bookingResponse.source_location = bookingDetails.sourcelocation;
                bookingResponse.source_lat = bookingDetails.sourceLat;
                bookingResponse.source_lon = bookingDetails.sourceLon;
                bookingResponse.dest_location = bookingDetails.destLocation;
                bookingResponse.dest_lat = bookingDetails.destLat;
                bookingResponse.dest_lon = bookingDetails.destLon;

                return res.status(200).json(bookingResponse);

            }
            else {
                let bookingData = {};
                bookingData.bookingId = process.env.BOOKING_PREFIX + nanoid(8);
                bookingData.bookedName = req.body.name;
                bookingData.bookedWhere = req.body.source_location;
                bookingData.bookedWhen = req.body.date;
                bookingData.bookedFor = req.body.description;
                bookingData.bookedType = "userneeds";
                bookingData.userId = mongoose.Types.ObjectId(userDetails._id);
                bookingData.mainCategory = mongoose.Types.ObjectId(req.body.parent_category_id);
                bookingData.subCategory = mongoose.Types.ObjectId(req.body.subcategory_id);
                bookingData.serviceId = mongoose.Types.ObjectId(req.body.service_id);
                bookingData.serviceIds = req.body.service_id;
                bookingData.status = "requested";
                bookingData.otp = Math.floor(1000 + Math.random() * 9000);
                bookingData.price = req.body.price;
               
               

                let bookingCommission = parseFloat(req.body.price) * parseFloat(commissionPer);
                let bookingTax = parseFloat(req.body.price) * parseFloat(taxPer);

                bookingData.commission = bookingCommission.toFixed(2);
                bookingData.tax = bookingTax.toFixed(2);

                let totalAmount = parseFloat(req.body.price) + parseFloat(bookingCommission) + parseFloat(bookingTax);

                bookingData.total = totalAmount.toFixed(2);
                let category = await Category.findById(req.body.parent_category_id);
                bookingData.locationType = category.locationType;
                if (appSettings.instantLocation.toString() == "true") {
                    if (category.locationType == "transport") {
                        console.log("req.body.source_location: ", req.body.source_location);
                        console.log("req.body.source_lat: ", req.body.source_lat);
                        console.log("req.body.source_lon: ", req.body.source_lon);
                        console.log("req.body.dest_location: ", req.body.dest_location);
                        console.log("req.body.dest_lat: ", req.body.dest_lat);
                        console.log("req.body.dest_lon: ", req.body.dest_lon);
                        if (!req.body.source_location || !req.body.source_lat || !req.body.source_lon || !req.body.dest_location || !req.body.dest_lat || !req.body.dest_lon ) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsX2") });
                        }
                        else{
                            bookingData.sourcelocation = req.body.source_location;
                            bookingData.sourceLat = req.body.source_lat;
                            bookingData.sourceLon = req.body.source_lon;
                            bookingData.destLocation = req.body.dest_location;
                            bookingData.destLat = req.body.dest_lat;
                            bookingData.destLon = req.body.dest_lon;
                            let lon = parseFloat(req.body.source_lon);
                            let lat = parseFloat(req.body.source_lat);
                            bookingData.loc = [lon, lat];
                            
                        }
                    }
                    else if (category.locationType == "home") {
                        if (!req.body.source_location || !req.body.source_lat|| !req.body.source_lon) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXH2") });
                        }
                        else{
                            bookingData.sourcelocation = req.body.source_location;
                            bookingData.sourceLat = req.body.source_lat;
                            bookingData.sourceLon = req.body.source_lon;
                            let lon = parseFloat(req.body.source_lon);
                            let lat = parseFloat(req.body.source_lat);
                            bookingData.loc = [lon, lat];
                        }

                    }
                }
                else{
                    if (category.locationType == "transport") {
                        if (!req.body.source_location || !req.body.dest_location ) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXt1") });
                        }
                        else{
                            bookingData.sourcelocation = req.body.source_location;
                            bookingData.destLocation = req.body.dest_location;
                        }
                    }
                    else if (category.locationType == "home") {
                        if (!req.body.source_location) {
                            return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXh5") });
                        }
                        else{
                            bookingData.sourcelocation = req.body.source_location;
                        }

                    }
                }
                let newBooking = new Booking(bookingData);
                await newBooking.save(async function (error, bookingDetails) {
                    if (!error) {
                        let saveObject = { bookingId: bookingDetails._id, serviceId: bookingDetails.serviceId, price: req.body.price, total: totalAmount };
                        saveBookingDetails(saveObject);
                        let categoryName = await Category.findById(bookingDetails.mainCategory);
                        let SubcategoryName = await Subcategory.findById(bookingDetails.subCategory);
                        let serviceName = await Service.findById(bookingDetails.serviceId);
                        var name;
                        var subName;
                        var servicename;
                        name = categoryName.name;
                        subName = SubcategoryName.name;
                        servicename =serviceName.name;
                        if (host != 'en') {
                            name = (categoryName[langName+'Name']) ? (categoryName[langName+'Name']) : name;
                        }
                        if (host != 'en') {
                            subName = (SubcategoryName[langName+'Name']) ? (SubcategoryName[langName+'Name']) : subName;
                        }
                        if (host != 'en') {
                            servicename = (serviceName[langName+'Name']) ? (serviceName[langName+'Name']) : servicename;
                        }
                        let bookingResponse = {
                            status_code: 200,
                            item_id: bookingDetails._id,
                            user_id: userDetails._id,
                            parent_category_id: bookingDetails.mainCategory._id,
                            subcategory_id: bookingDetails.subCategory._id,
                            service_id: (bookingDetails.serviceId) ? bookingDetails.serviceId._id : "",
                            parent_category_name: (name)?(name):"",
                            subcategory_name: (subName)?(subName):"",
                            service_name: (servicename)?(servicename):"",
                            service_image: (bookingDetails.serviceId) ? process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + bookingDetails.serviceId.image : "",
                            name: bookingDetails.bookedName,
                            booking_price: bookingDetails.total.toString(),
                            date: bookingDetails.bookedWhen,
                            description: bookingDetails.bookedFor,
                            source_location : bookingDetails.sourcelocation,
                            source_lat : bookingDetails.sourceLat,
                            source_lon : bookingDetails.sourceLon,
                            dest_location : bookingDetails.destLocation,
                            dest_lat : bookingDetails.destLat,
                            dest_lon : bookingDetails.destLon,
                        };
                        return res.status(200).json(bookingResponse);
                        
                    } else {
                        // console.log(error);
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

exports.allNeeds = async function (req, res) {
    if (!req.body.user_id || !req.body.limit || !req.body.offset) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXXY12") });
    }
    else {
        try {

            let limit = parseInt(req.body.limit);

            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var moreDetailsLang = object.toUpperCase();
            var langName = object.toLowerCase();

            let offset = parseInt(req.body.offset);

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let userBookings = await Booking.find({ userId: userDetails._id, bookedType: "userneeds", status: { $in: ["requested"] } }).populate("mainCategory").populate("subCategory").populate("serviceId").sort({ "createdAt": -1 }).limit(limit).skip(offset);

            
            if (userBookings.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No needs found") });

            let bookings = [];

            userBookings.filter(function (eachBooking) {
                let dueDate = moment(eachBooking.bookedWhen).isBefore(moment().startOf('day').toISOString());
                var categoryName =  eachBooking.mainCategory.name;
                var subCategoryName =  eachBooking.subCategory.name;
                var serviceName =  eachBooking.serviceId.name;
                if (host != 'en') {
                    categoryName = (eachBooking.mainCategory[langName+'Name']) ? ( eachBooking.mainCategory[langName+'Name']) : categoryName;
                }
                if (host != 'en') {
                    subCategoryName = (eachBooking.subCategory[langName+'Name']) ? ( eachBooking.subCategory[langName+'Name']) : subCategoryName;
                }
                if (host != 'en') {
                    serviceName = (eachBooking.serviceId[langName+'Name']) ? ( eachBooking.serviceId[langName+'Name']) : serviceName;
                }
                
                bookings.push({
                    item_id: eachBooking._id,
                    user_id: userDetails._id,
                    parent_category_id: eachBooking.mainCategory._id,
                    reference_id: eachBooking.bookingId ? (eachBooking.bookingId) : "",
                    subcategory_id: eachBooking.subCategory._id,
                    parent_category_name: categoryName,
                    subcategory_name: subCategoryName,
                    service_name: serviceName,
                    location_type: eachBooking.locationType,
                    source_location: eachBooking.sourcelocation,
                    source_lon: eachBooking.sourceLon,
                    source_lat: eachBooking.sourceLat,
                    dest_location: eachBooking.destLocation,
                    dest_lat: eachBooking.destLat,
                    dest_lon: eachBooking.destLon,
                    parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.mainCategory.image,
                    service_id: (eachBooking.serviceId) ? eachBooking.serviceId._id : "",
                    service_image: (eachBooking.serviceId) ? process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachBooking.serviceId.image : "",
                    name: eachBooking.bookedName,
                    booking_price: eachBooking.price.toString(),
                    date: eachBooking.bookedWhen,
                    location: eachBooking.bookedWhere,
                    description: eachBooking.bookedFor,
                    active_status: (eachBooking.needStatus) ? "true" : "false",
                    due_status: dueDate.toString(),
                });
            });

            return res.status(200).json({ status_code: 200, items: bookings });

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.browseNeeds = async function (req, res) {
    if (!req.body.user_id || !req.body.limit || !req.body.offset) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXXY") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });

            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var moreDetailsLang = object.toUpperCase();
            var langName = object.toLowerCase();

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let appSettings = await Setting.findOne({});
            let maxdistcoverage = parseFloat(appSettings.maxDistance);

            if (appSettings.instantLocation.toString() == "true") {
                if (!req.body.source_location || !req.body.source_lon|| !req.body.source_lat) {
                    return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXX2") });
                }
                /* notify nearby tasker */
                let lon = parseFloat(req.body.source_lon);
                let lat = parseFloat(req.body.source_lat);
                let searchkey = { $regex: req.body.search_key, $options: "i" };
                let offset = parseInt(req.body.offset);
                let serviceId = [];
                serviceId = userDetails.serviceIds;
                /* mongo geonear api */
                let query = Booking.aggregate([
                    {
                        $geoNear: {
                            near: {
                                type: "Point",
                                coordinates: [lon, lat]
                            },
                            spherical: true,
                            maxDistance: maxdistcoverage * 1000,
                            key:"loc",
                            distanceField: "distance",
                            query: {
                                bookedType:"userneeds",
                                status:"requested",
                                needStatus:1,
                                serviceIds: { $in: serviceId },
                                bookedName: searchkey
                            }
                            
                        },
                        
                    },{
                        $lookup: {
                            from: 'categories',
                            localField: 'mainCategory',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    {$unwind: '$category'},
                    {
                        $lookup: {
                            from: 'subcategories',
                            localField: 'subCategory',
                            foreignField: '_id',
                            as: 'subcategory'
                        }
                    },
                    {$unwind: '$subcategory'},
                    {
                        $lookup: {
                            from: 'services',
                            localField: 'serviceId',
                            foreignField: '_id',
                            as: 'service'
                        }
                    },
                    {$unwind: '$service'},
                    { $skip : offset }
                ]);
                query.exec(async function(err, booking) {
                    if (err) {
                        console.log(err);
                        return res.status(200).json({ status_code: 500, message: res.__("Something went wrowwng") });
                    } 
                    else {
                        let bookings = [];
                        if (booking.length === 0){
                            let limit = parseInt(req.body.limit);

                            let offset = parseInt(req.body.offset);
            
                            let searchString = {};
            
                            searchString.bookedType = "userneeds";

                            searchString.locationType = "remote";
            
                            searchString.status = { $in: ["requested"] };
            
                            searchString.needStatus = 1;
            
                            searchString.bookedWhen = { $gte: new Date(moment().startOf('day').toISOString()) };
            
            
                            if (userDetails.serviceIds)
                            searchString.serviceId = { $in: userDetails.serviceIds };
            
                            if (req.body.search_key)
                            searchString.bookedName = { $regex: req.body.search_key, $options: "i" };
            
            
            
                            let userBookings = await Booking.find(searchString).populate("mainCategory").populate("userId").populate("subCategory").populate("serviceId").sort({ "createdAt": -1 }).limit(limit).skip(offset);
                            
                            userBookings.filter(function (eachBooking) {

                                var categoryName =  eachBooking.mainCategory.name;
                                var subCategoryName =  eachBooking.subCategory.name;
                                var serviceName =  eachBooking.serviceId.name;

                                if (host != 'en') {
                                    categoryName = (eachBooking.mainCategory[langName+'Name']) ? ( eachBooking.mainCategory[langName+'Name']) : categoryName;
                                }
                                if (host != 'en') {
                                    subCategoryName = (eachBooking.subCategory[langName+'Name']) ? ( eachBooking.subCategory[langName+'Name']) : subCategoryName;
                                }
                                if (host != 'en') {
                                    serviceName = (eachBooking.serviceId[langName+'Name']) ? ( eachBooking.serviceId[langName+'Name']) : serviceName;
                                }
                                bookings.push({
                                    item_id: eachBooking._id,
                                    parent_category_type: eachBooking.locationType,
                                    user_id: eachBooking.userId.userId,
                                    user_name: eachBooking.userId.name,
                                    user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachBooking.userId.image,
                                    parent_category_id: eachBooking.mainCategory._id,
                                    parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.mainCategory.image,
                                    subcategory_id: eachBooking.subCategory._id,
                                    service_id: eachBooking.serviceId._id,
                                    parent_category_name: categoryName,
                                    subcategory_name: subCategoryName,
                                    service_name: serviceName,
                                    service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachBooking.serviceId.image,
                                    name: eachBooking.bookedName,
                                    booking_price: eachBooking.price.toString(),
                                    date: eachBooking.bookedWhen,
                                    location: eachBooking.sourcelocation,
                                    description: eachBooking.bookedFor,
                                });
                            });
                            
                        }
                        else{
                            let limit = parseInt(req.body.limit);

                            let offset = parseInt(req.body.offset);
            
                            let searchString = {};
            
                            searchString.bookedType = "userneeds";

                            searchString.locationType = "remote";
            
                            searchString.status = { $in: ["requested"] };
            
                            searchString.needStatus = 1;
            
                            searchString.bookedWhen = { $gte: new Date(moment().startOf('day').toISOString()) };
            
            
                            if (userDetails.serviceIds)
                            searchString.serviceId = { $in: userDetails.serviceIds };
            
                            if (req.body.search_key)
                            searchString.bookedName = { $regex: req.body.search_key, $options: "i" };

                            let userBookings = await Booking.find(searchString).populate("mainCategory").populate("userId").populate("subCategory").populate("serviceId").sort({ "createdAt": -1 }).limit(limit).skip(offset);
                            
                            userBookings.filter(function (eachBooking) {
                                var categoryName =  eachBooking.mainCategory.name;
                                var subCategoryName =  eachBooking.subCategory.name;
                                var serviceName =  eachBooking.serviceId.name;
                                if (host != 'en') {
                                    categoryName = (eachBooking.mainCategory[langName+'Name']) ? ( eachBooking.mainCategory[langName+'Name']) : categoryName;
                                }
                                if (host != 'en') {
                                    subCategoryName = (eachBooking.subCategory[langName+'Name']) ? ( eachBooking.subCategory[langName+'Name']) : subCategoryName;
                                }
                                if (host != 'en') {
                                    serviceName = (eachBooking.serviceId[langName+'Name']) ? ( eachBooking.serviceId[langName+'Name']) : serviceName;
                                }
                                bookings.push({
                                    item_id: eachBooking._id,
                                    parent_category_type: eachBooking.locationType,
                                    user_id: eachBooking.userId.userId,
                                    user_name: eachBooking.userId.name,
                                    user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachBooking.userId.image,
                                    parent_category_id: eachBooking.mainCategory._id,
                                    parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.mainCategory.image,
                                    subcategory_id: eachBooking.subCategory._id,
                                    service_id: eachBooking.serviceId._id,
                                    parent_category_name: categoryName,
                                    subcategory_name: subCategoryName,
                                    service_name: serviceName,
                                    service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachBooking.serviceId.image,
                                    name: eachBooking.bookedName,
                                    booking_price: eachBooking.price.toString(),
                                    date: eachBooking.bookedWhen,
                                    location: eachBooking.sourcelocation,
                                    description: eachBooking.bookedFor,
                                });
                            });
                            booking.filter( function (eachBooking) {
                                var categoryName =  eachBooking.category.name;
                                var subCategoryName =  eachBooking.subcategory.name;
                                var serviceName =  eachBooking.service.name;
                                if (host != 'en') {
                                    categoryName = (eachBooking.category[langName+'Name']) ? ( eachBooking.category[langName+'Name']) : categoryName;
                                }
                                if (host != 'en') {
                                    subCategoryName = (eachBooking.subcategory[langName+'Name']) ? ( eachBooking.subcategory[langName+'Name']) : subCategoryName;
                                }
                                if (host != 'en') {
                                    serviceName = (eachBooking.service[langName+'Name']) ? ( eachBooking.service[langName+'Name']) : serviceName;
                                }
                                if(eachBooking.serviceId){
                                    bookings.push({
                                        item_id: eachBooking._id,
                                        user_id: eachBooking.userId,
                                        parent_category_type: eachBooking.locationType,
                                        user_name: eachBooking.userName,
                                        user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachBooking.image,
                                        parent_category_id: eachBooking.mainCategory._id,
                                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.category.image,
                                        subcategory_id: eachBooking.subCategory._id,
                                        service_id: eachBooking.serviceId._id,
                                        parent_category_name: categoryName,
                                        subcategory_name: subCategoryName,
                                        service_name: serviceName,
                                        service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachBooking.service.image,
                                        name: eachBooking.bookedName,
                                        booking_price: eachBooking.price.toString(),
                                        date: eachBooking.bookedWhen,
                                        location: eachBooking.sourcelocation,
                                        description: eachBooking.bookedFor
                                    });
                                }
                            });
                        }
                        return res.status(200).json({ status_code: 200, items: bookings });
                    }
                });
            }
            else{
                if (!req.body.source_location) {
                    return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsXX") });
                }

                let bookings = [];
                
                let limit = parseInt(req.body.limit);

                let offset = parseInt(req.body.offset);

                let remotesearchString = {};

                remotesearchString.bookedType = "userneeds";

                remotesearchString.locationType = "remote";

                remotesearchString.status = { $in: ["requested"] };

                remotesearchString.needStatus = 1;

                remotesearchString.bookedWhen = { $gte: new Date(moment().startOf('day').toISOString()) };

                if (userDetails.serviceIds)
                remotesearchString.serviceId = { $in: userDetails.serviceIds };

                if (req.body.search_key)
                remotesearchString.bookedName = { $regex: req.body.search_key, $options: "i" };


                let remoteuserBookings = await Booking.find(remotesearchString).populate("mainCategory").populate("userId").populate("subCategory").populate("serviceId").sort({ "createdAt": -1 }).limit(limit).skip(offset);
                remoteuserBookings.filter(function (eachBooking) {
                    var categoryName =  eachBooking.mainCategory.name;
                    var subCategoryName =  eachBooking.subCategory.name;
                    var serviceName =  eachBooking.serviceId.name;
                    if (host != 'en') {
                        categoryName = (eachBooking.mainCategory[langName+'Name']) ? ( eachBooking.mainCategory[langName+'Name']) : categoryName;
                    }
                    if (host != 'en') {
                        subCategoryName = (eachBooking.subCategory[langName+'Name']) ? ( eachBooking.subCategory[langName+'Name']) : subCategoryName;
                    }
                    if (host != 'en') {
                        serviceName = (eachBooking.serviceId[langName+'Name']) ? ( eachBooking.serviceId[langName+'Name']) : serviceName;
                    }
                    bookings.push({
                        item_id: eachBooking._id,
                        parent_category_type: eachBooking.locationType,
                        user_id: eachBooking.userId.userId,
                        user_name: eachBooking.userId.name,
                        user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachBooking.userId.image,
                        parent_category_id: eachBooking.mainCategory._id,
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.mainCategory.image,
                        subcategory_id: eachBooking.subCategory._id,
                        service_id: eachBooking.serviceId._id,
                        parent_category_name: categoryName,
                        subcategory_name: subCategoryName,
                        service_name: serviceName,
                        service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachBooking.serviceId.image,
                        name: eachBooking.bookedName,
                        booking_price: eachBooking.price.toString(),
                        date: eachBooking.bookedWhen,
                        description: eachBooking.bookedFor,
                    });
                })

                let searchString = {};

                searchString.bookedType = "userneeds";

                searchString.sourcelocation = req.body.source_location;

                searchString.status = { $in: ["requested"] };

                searchString.needStatus = 1;

                searchString.bookedWhen = { $gte: new Date(moment().startOf('day').toISOString()) };

                if (userDetails.serviceIds)
                searchString.serviceId = { $in: userDetails.serviceIds };

                if (req.body.search_key)
                searchString.bookedName = { $regex: req.body.search_key, $options: "i" };

                let userBookings = await Booking.find(searchString).populate("mainCategory").populate("userId").populate("subCategory").populate("serviceId").sort({ "createdAt": -1 }).limit(limit).skip(offset);
                
                if (userBookings.length === 0 && remoteuserBookings.length === 0){
                    return res.status(200).json({ status_code: 400, message: res.__("No needs found") });
                }
                userBookings.filter(async function (eachBooking) {
                    var categoryName =  eachBooking.mainCategory.name;
                    var subCategoryName =  eachBooking.subCategory.name;
                    var serviceName =  eachBooking.serviceId.name;
                    if (host != 'en') {
                        categoryName = (eachBooking.mainCategory[langName+'Name']) ? ( eachBooking.mainCategory[langName+'Name']) : categoryName;
                    }
                    if (host != 'en') {
                        subCategoryName = (eachBooking.subCategory[langName+'Name']) ? ( eachBooking.subCategory[langName+'Name']) : subCategoryName;
                    }
                    if (host != 'en') {
                        serviceName = (eachBooking.serviceId[langName+'Name']) ? ( eachBooking.serviceId[langName+'Name']) : serviceName;
                    }
                    bookings.push({
                        item_id: eachBooking._id,
                        parent_category_type: eachBooking.locationType,
                        user_id: eachBooking.userId.userId,
                        user_name: eachBooking.userId.name,
                        user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachBooking.userId.image,
                        parent_category_id: eachBooking.mainCategory._id,
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachBooking.mainCategory.image,
                        subcategory_id: eachBooking.subCategory._id,
                        service_id: eachBooking.serviceId._id,
                        parent_category_name: categoryName,
                        subcategory_name: subCategoryName,
                        service_name: serviceName,
                        service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachBooking.serviceId.image,
                        name: eachBooking.bookedName,
                        booking_price: eachBooking.price.toString(),
                        date: eachBooking.bookedWhen,
                        location: eachBooking.sourcelocation,
                        description: eachBooking.bookedFor
                    });
                });
                console.log(bookings);
                return res.status(200).json({ status_code: 200, items: bookings });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.recentNeeds = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid ParamsRN") });
    }
    else {
        try {

            let searchString = {};

            searchString.bookedType = "userneeds";

            searchString.status = { $in: ["completed"] };

            searchString.needStatus = 1;

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let userBookings = await Booking.find(searchString).populate("mainCategory").populate("userId").populate("subCategory").sort({ "createdAt": -1 }).limit(10);

            if (userBookings.length === 0)
                return res.status(200).json({ status_code: 400, message: res.__("No needs found") });

            let bookings = [];

            userBookings.filter(function (eachBooking) {
                bookings.push({
                    item_id: eachBooking._id,
                    item_name: eachBooking.bookedName,
                    user_id: eachBooking.userId.userId,
                    user_name: eachBooking.userId.name,
                    user_image: process.env.BASE_URL + process.env.USER_MEDIA_URL + eachBooking.userId.image,
                    description: eachBooking.bookedFor,
                    price: eachBooking.total.toString(),
                });
            });

            return res.status(200).json({ status_code: 200, items: bookings });

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

let saveBookingDetails = function (saveObject) {
    let bookingDetails = new BookingDetail(saveObject);
    bookingDetails.save(function (error, result) {
        if (!error) {

        }
    });
};

let updateBookingDetails = function (searchObject, saveObject) {
    BookingDetail.findOneAndUpdate(searchObject, saveObject, { upsert: true }, function (error, result) {
        if (error) {
            // console.log(error);
        }
    });
};
