const Pricing = require('../models/pricingModel');
const Service = require('../models/serviceModel');
const User = require('../models/userModel');
const Setting = require('../models/settingModel');
const Category = require('../models/categoryModel');
const fs = require('fs');

exports.addService = async function (req, res) {
    if (!req.body.user_id || !req.body.parent_category_id || !req.body.subcategory_id || !req.body.services || !req.body.type) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        // try {
            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            if (req.body.type === "add") {
                let resetCategoryId = { taskerId: userDetails._id, mainCategory: req.body.parent_category_id, subCategory: req.body.subcategory_id };
                // resetPricing(resetCategoryId);
            }
            console.log('services',req.body.services)
            let allServices = JSON.parse(req.body.services);
            let allServices_len = allServices.length;
            let service_iterator = 1;
            if (typeof allServices !== "object")
                return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
            if(allServices_len >= service_iterator) {
                allServices.filter(async function (eachService) {
                    if (eachService.hasOwnProperty('service_id')) {
                        let saveobject = { taskerId: userDetails._id, mainCategory: req.body.parent_category_id, subCategory: req.body.subcategory_id, serviceId: eachService.service_id, price: eachService.service_price };
                        let searchobject = { taskerId: userDetails._id, serviceId: eachService.service_id };
                        console.log('searchobject',searchobject);
                        console.log('saveobject',saveobject);
                        await savePricing(searchobject, saveobject, userDetails._id, req.body.type);
                    }
                    service_iterator++;
                });
            }
            
            return res.status(200).json({ status_code: 200, message: res.__("Services updated successfully") });
        // }
        // catch (err) {
        //     return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        // }
    }
};


exports.taskerCategories = async function (req, res) {
    if (!req.body.user_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var langName = object.toLowerCase();

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let searchObject = { taskerId: userDetails._id };

            let serviceCategories = await Pricing.find(searchObject).populate('mainCategory');

            if (!serviceCategories)
                return res.status(200).json({ status_code: 200, message: res.__("No services found") });

            let categoryList = [];

            let maincategories = [];

            serviceCategories.filter(function (eachCategory) {

                if (maincategories.indexOf(eachCategory.mainCategory._id) === -1) {
                    var name =  (eachCategory.mainCategory[langName+'Name']) ? (eachCategory.mainCategory[langName+'Name']):eachCategory.mainCategory.name;
                    categoryList.push({
                        parent_category_id: eachCategory.mainCategory._id,
                        parent_category_name: name,
                        parent_category_type: eachCategory.mainCategory.type,
                        parent_category_status: eachCategory.mainCategory.status.toString(),
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachCategory.mainCategory.image,
                    });
                }

                maincategories.push(eachCategory.mainCategory._id);
            });
            return res.status(200).json({ status_code: 200, servicecategories: categoryList });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.taskerServices = async function (req, res) {
    if (!req.body.user_id || !req.body.parent_category_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" });
           
            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var langName = object.toLowerCase();


            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let searchObject = { taskerId: userDetails._id, mainCategory: req.body.parent_category_id };

            if (req.body.subcategory_id) {
                searchObject = { taskerId: userDetails._id, mainCategory: req.body.parent_category_id, subCategory: req.body.subcategory_id };
            }

            let allPricing = await Pricing.find(searchObject).populate('mainCategory').populate('subCategory').populate('serviceId');

            if (!allPricing)
                return res.status(200).json({ status_code: 200, message: res.__("No services found") });


            let taskerservices = {};

            let serviceList = [];

            let availableServices = [];

            taskerservices.status_code = 200;

            allPricing.filter(function (eachService) {
                taskerservices.parent_category_id = eachService.mainCategory._id;
                var subCategoryName =  (eachService.subCategory[langName+'Name']) ? (eachService.subCategory[langName+'Name']):eachService.subCategory.name;
                var serviceName = (eachService.serviceId[langName+'Name']) ? (eachService.serviceId[langName+'Name']):eachService.serviceId.name;
                if (eachService.serviceId) {
                    serviceList.push({
                        service_id: eachService.serviceId._id,
                        subcategory_name: subCategoryName,
                        service_name: serviceName,
                        service_price: (eachService.mainCategory.type === "professional") ? eachService.serviceId.serviceCost.toString() : eachService.price.toString(),
                        service_status: eachService.serviceId.status.toString(),
                        service_pricing: eachService.serviceId.costType,
                        service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachService.serviceId.image,
                        subcategory_id: eachService.subCategory._id,
                        subcategory_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachService.subCategory.image,
                        is_new: "false"
                    });
                    availableServices.push(eachService.serviceId._id);
                }
            });


            if (req.body.subcategory_id) {
                let allServices = await Service.find({ mainCategory: req.body.parent_category_id, subCategory: req.body.subcategory_id, status: 1, _id: { $nin: availableServices } }).populate("mainCategory").populate("subCategory");
                if (allServices.length !== 0) {
                    allServices.filter(function (eachService) {
                        var serviceName =  (eachService[langName+'Name']) ? (eachService[langName+'Name']):eachService.name;
                        var subCategoryName =  (eachService.subCategory[langName+'Name']) ? (eachService.subCategory[langName+'Name']):eachService.subCategory.name;
                        serviceList.push({
                            service_id: eachService._id,
                            service_name: serviceName,
                            service_pricing: eachService.costType,
                            service_status: eachService.status.toString(),
                            service_price: (eachService.mainCategory.type === "professional") ? eachService.serviceCost.toString() : "",
                            service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachService.image,
                            subcategory_id: eachService.subCategory._id,
                            subcategory_name: subCategoryName,
                            subcategory_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachService.subCategory.image,
                            is_new: "true"
                        });
                    });
                }
            }
            taskerservices.services = serviceList;
            
            return res.status(200).json(taskerservices);
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.deleteService = async function (req, res) {
    if (!req.body.user_id || !req.body.parent_category_id || !req.body.subcategory_id || !req.body.service_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let searchObject = { taskerId: userDetails._id, mainCategory: req.body.parent_category_id, subCategory: req.body.subcategory_id, serviceId: req.body.service_id };

            await Pricing.findOneAndDelete(searchObject);

            let taskerServices = await Pricing.find({ taskerId: userDetails._id });

            let services = [];
            taskerServices.filter(function (eachTasker) {
                services.push(eachTasker.serviceId.toString());
            });

            await User.findByIdAndUpdate(userDetails._id, { serviceIds: services }, function (error, result) {
                if (error) {
                    // console.log(error);
                }
            });

            return res.status(200).json({ status_code: 200, message: res.__("Service deleted successfully") });

        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.hireTaskers = async function (req, res) {
    if (!req.body.user_id || !req.body.service_id || !req.body.page || !req.body.parent_category_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "user" });

            let appSettings = await Setting.findOne({});

            let maxdistcoverage = parseFloat(appSettings.maxDistance);

            let categoryDetails = await Category.findById(req.body.parent_category_id);

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let offset = 0;
            let limit = 10;
            let sortString = { "taskerId": -1 };
            let sortTaskers = {};


            if (req.body.page) {
                offset = parseInt((req.body.page - 1) * 10);
            }

            if (req.body.sort === "0") {
                sortString = { price: 1 };
            }

            if (req.body.sort === "1") {
                sortString = { price: -1 };
            }

            if (req.body.sort === "2") {
                sortTaskers = { rating: -1 };
            }

            if (req.body.sort === "3") {
                sortTaskers = { tasksCompleted: -1 };
            }
            if (appSettings.instantLocation.toString() == "true") {
                if (categoryDetails.locationType != "remote") {
                    if (!req.body.source_location || !req.body.source_lon || !req.body.source_lat) {
                        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
                    }
                    let availObject;
                    availObject = { role: "tasker", serviceIds: { $in: [req.body.service_id] }, status: 1, availability: 1, verified: 1, onride: 0 };

                    /* notify nearby tasker */
                    let lon = parseFloat(req.body.source_lon);
                    let lat = parseFloat(req.body.source_lat);

                    /* mongo geonear api */
                    let query = User.aggregate([
                        {
                            $geoNear: {
                                near: {
                                    type: "Point",
                                    coordinates: [lon, lat]
                                },
                                spherical: true,
                                maxDistance: maxdistcoverage * 1000,
                                key: "loc",
                                distanceField: "distance",
                                query: availObject
                            }
                        }
                    ]);
                    query.exec(async function (err, tasker) {
                        if (err) {
                            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
                        }
                        else {
                            if (tasker.length === 0) {
                                res.json({
                                    status_code: 400,
                                    message: res.__("Sorry! No Tasker found nearby at this moment")
                                });
                            }
                            else {
                                const availableTaskers = [];
                                tasker.filter(function (d) {
                                    availableTaskers.push(d._id);
                                });

                                let searchObject = { taskerId: { $in: availableTaskers }, serviceId: req.body.service_id, price: { $gt: 0 } };

                                let serviceTaskers = await Pricing.find(searchObject).populate("taskerId").sort(sortString);

                                if (!serviceTaskers)
                                    return res.status(200).json({ status_code: 400, message: res.__("Service is not available now") });

                                let taskerList = [];
                                serviceTaskers.filter(function (eachTasker) {
                                    taskerList.push({
                                        user_id: eachTasker.taskerId.userId,
                                        name: eachTasker.taskerId.name,
                                        user_image: process.env.BASE_URL + process.env.TASKER_MEDIA_URL + eachTasker.taskerId.image,
                                        reviews: (eachTasker.taskerId.reviews) ? eachTasker.taskerId.reviews : "0",
                                        rating: eachTasker.taskerId.rating,
                                        completed_tasks: (eachTasker.taskerId.tasksCompleted) ? eachTasker.taskerId.tasksCompleted : "0",
                                        price: eachTasker.price.toString()
                                    });
                                });
                                if (req.body.sort === "2") {
                                    taskerList.sort(function (a, b) { return parseFloat(b.rating) - parseFloat(a.rating); });
                                }

                                if (req.body.sort === "3") {
                                    taskerList.sort(function (a, b) { return parseFloat(b.completed_tasks) - parseFloat(a.completed_tasks); });
                                }

                                return res.status(200).json({ status_code: 200, items: taskerList });
                            }
                        }
                    });
                }
            }
            else {
                if (categoryDetails.locationType != "remote"){
                    let availObject;
                    availObject = { role: "tasker", serviceIds: { $in: [req.body.service_id] }, status: 1, availability: 1, verified: 1, location: req.body.source_location, onride: 0 };
                   
                    let taskerAvailability = await User.find(availObject).sort(sortTaskers).limit(limit).skip(offset);
    
                    if (taskerAvailability.length === 0)
                        return res.status(200).json({ status_code: 400, message: res.__("No taskers found") });
    
                    let availableTaskers = [];
                    taskerAvailability.filter(function (eachTasker) {
                        availableTaskers.push(eachTasker._id);
                    });
                    let searchObject = { taskerId: { $in: availableTaskers }, serviceId: req.body.service_id, price: { $gt: 0 } };
    
                    let serviceTaskers = await Pricing.find(searchObject).populate("taskerId").sort(sortString);
    
                    if (!serviceTaskers)
                        return res.status(200).json({ status_code: 400, message: res.__("Service is not available now") });
    
                    let taskerList = [];
                    serviceTaskers.filter(function (eachTasker) {
                        taskerList.push({
                            user_id: eachTasker.taskerId.userId,
                            name: eachTasker.taskerId.name,
                            user_image: process.env.BASE_URL + process.env.TASKER_MEDIA_URL + eachTasker.taskerId.image,
                            reviews: (eachTasker.taskerId.reviews) ? eachTasker.taskerId.reviews : "0",
                            rating: eachTasker.taskerId.rating,
                            completed_tasks: (eachTasker.taskerId.tasksCompleted) ? eachTasker.taskerId.tasksCompleted : "0",
                            price: eachTasker.price.toString()
                        });
                    });
    
                    if (req.body.sort === "2") {
                        taskerList.sort(function (a, b) { return parseFloat(b.rating) - parseFloat(a.rating); });
                    }
    
                    if (req.body.sort === "3") {
                        taskerList.sort(function (a, b) { return parseFloat(b.completed_tasks) - parseFloat(a.completed_tasks); });
                    }
    
                    return res.status(200).json({ status_code: 200, items: taskerList });
                }
            }
            if (categoryDetails.locationType == "remote") {
                let availObject = { role: "tasker", serviceIds: { $in: [req.body.service_id] }, status: 1, availability: 1, verified: 1 };

                let taskerAvailability = await User.find(availObject).sort(sortTaskers).limit(limit).skip(offset);
                console.log(taskerAvailability);

                if (taskerAvailability.length === 0)
                    return res.status(200).json({ status_code: 400, message: res.__("No taskers found") });

                let availableTaskers = [];
                taskerAvailability.filter(function (eachTasker) {
                    availableTaskers.push(eachTasker._id);
                });
                let searchObject = { taskerId: { $in: availableTaskers }, serviceId: req.body.service_id, price: { $gt: 0 } };

                let serviceTaskers = await Pricing.find(searchObject).populate("taskerId").sort(sortString);

                if (!serviceTaskers)
                    return res.status(200).json({ status_code: 400, message: res.__("Service is not available now") });

                let taskerList = [];
                serviceTaskers.filter(function (eachTasker) {
                    taskerList.push({
                        user_id: eachTasker.taskerId.userId,
                        name: eachTasker.taskerId.name,
                        user_image: process.env.BASE_URL + process.env.TASKER_MEDIA_URL + eachTasker.taskerId.image,
                        reviews: (eachTasker.taskerId.reviews) ? eachTasker.taskerId.reviews : "0",
                        rating: eachTasker.taskerId.rating,
                        completed_tasks: (eachTasker.taskerId.tasksCompleted) ? eachTasker.taskerId.tasksCompleted : "0",
                        price: eachTasker.price.toString()
                    });
                });

                if (req.body.sort === "2") {
                    taskerList.sort(function (a, b) { return parseFloat(b.rating) - parseFloat(a.rating); });
                }

                if (req.body.sort === "3") {
                    taskerList.sort(function (a, b) { return parseFloat(b.completed_tasks) - parseFloat(a.completed_tasks); });
                }

                return res.status(200).json({ status_code: 200, items: taskerList });

            }
        }
        catch (err) {
            // console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

let saveServices = async function (taskerId) {
    let services = [];
    let taskerServices = await Pricing.find({ taskerId: taskerId });
    taskerServices.filter(function (eachTasker) { services.push(eachTasker.serviceId.toString()); });
    console.log(services);
    await User.findOneAndUpdate({_id:taskerId}, { serviceIds: services }, {new: true}, function (error, result) {
        if (!error) {
            console.log('saveservice result',result);
        }
        else{
            console.log(error);
        }
    });
}

let savePricing = async function (searchObject, saveObject, tasker_id, type) {
   let pricing =  await Pricing.findOneAndUpdate(searchObject,saveObject, { new: true,upsert: true}, async function (error, result) {      
        if (error) {
            console.log('New user ',error);
        }
        else{
            if(type == 'add') {
                await saveServices(tasker_id);
                console.log('Existing user ',result);
            }            
        }
    });
    
};

// let resetPricing = function (searchObject) {
//     Pricing.deleteMany(searchObject, function (err, result) {
//         if (!err) {
//             console.log('delete result',result);
//         }
//     });
// };


