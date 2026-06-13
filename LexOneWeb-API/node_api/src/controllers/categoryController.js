const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');
const Service = require('../models/serviceModel');
const fs = require('fs');

exports.allCategories = async function (req, res) {
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

            let allCategories = await Category.find({ status: 1 });

            if (!allCategories)
                return res.status(200).json({ status_code: 200, category: [] });
            
            let categoryList = [];
            allCategories.filter(function (mainCategory) {
                var serviceName =  (mainCategory[langName+'Name'])?(mainCategory[langName+'Name']):mainCategory.name ;
                categoryList.push({
                    parent_category_id: mainCategory._id,
                    parent_category_name:serviceName,
                    parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + mainCategory.image,
                    parent_category_type: mainCategory.type,
                    location_type:mainCategory.locationType,
                });
                
            });
            return res.status(200).json({ status_code: 200, category: categoryList });
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.allSubcategories = async function (req, res) {
    if (!req.body.user_id || !req.body.parent_category_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let categoryDetails = await Category.findById(req.body.parent_category_id).exec();

            let allCategories = await Subcategory.find({ status: 1, parentCategory: req.body.parent_category_id });

            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var moreDetailsLang = object.charAt(0).toUpperCase()+ object.substr(1).toLowerCase();
            console.log(moreDetailsLang);
            var langName = object.toLowerCase();
            if (!allCategories)
                return res.status(200).json({ status_code: 200, subcategory: [] });

            let categoryList = [];
            allCategories.filter(function (mainCategory) {
                var serviceName =  (mainCategory[langName+'Name'])?(mainCategory[langName+'Name']):mainCategory.name;
                categoryList.push({
                    subcategory_id: mainCategory._id,
                    subcategory_name: serviceName,
                    subcategory_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + mainCategory.image,
                });
            });
            let faq = "faq";
            let description = "description";
            let  about = "about";
            let categoryFAQ;
            let categoryDescription;
            let aboutCategory;
            console.log(categoryDetails["faq"+moreDetailsLang]);
            console.log(categoryDetails['faq'+moreDetailsLang]);
            categoryFAQ = (categoryDetails[faq+moreDetailsLang]) ? (categoryDetails[faq+moreDetailsLang]) : categoryDetails.faq;
            categoryDescription = (categoryDetails[description+moreDetailsLang]) ? (categoryDetails[description+moreDetailsLang]) : categoryDetails.description;
            aboutCategory = (categoryDetails[about+moreDetailsLang]) ? (categoryDetails[about+moreDetailsLang]) : categoryDetails.about;
            return res.status(200).json({ status_code: 200, subcategory: categoryList, about_task: aboutCategory, how_it_works: categoryDescription, faq: categoryFAQ, });
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.allServices = async function (req, res) {
    if (!req.body.user_id || !req.body.parent_category_id || !req.body.subcategory_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {
            let allServices = await Service.find({ status: 1, mainCategory: req.body.parent_category_id, subCategory: req.body.subcategory_id });
            var host = req.headers['accept-language']; 
            let rawdata = fs.readFileSync('languageCode.json');
            var string = JSON.parse(rawdata);
            var object =  string[host];
            var langName = object.toLowerCase();

            if (!allServices)
                return res.status(200).json({ status_code: 200, services: [] });

            let serviceList = [];
            allServices.filter(function (eachService) {
                var serviceName =  (eachService[langName+'Name'])?(eachService[langName+'Name']):eachService.name ;
                serviceList.push({
                    service_id: eachService._id,
                    service_name: serviceName,
                    service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachService.image,
                    service_price: (eachService.serviceCost) ? eachService.serviceCost.toString() : "",
                    service_pricing: res.__(eachService.costType),
                });
            });
            return res.status(200).json({ status_code: 200, services: serviceList });
        }
        catch (err) {
            console.log(err);
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.searchCategories = async function (req, res) {
    if (!req.body.search_key || !req.body.page) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {

        let keywordLength = req.body.search_key.length;
        var host = req.headers['accept-language']; 
        let rawdata = fs.readFileSync('languageCode.json');
        var string = JSON.parse(rawdata);
        var object =  string[host];
        var moreDetailsLang = object.toUpperCase();
        var langName = object.toLowerCase();

        if (keywordLength < 3) {
            return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
        }
        let offset = 0;
        let limit = 10;
        if (req.body.page) {
            offset = parseInt((req.body.page - 1) * 10);
        }
        let searchString = {};
        searchString.status = 1;
        if (host != "en") {
            searchString[langName+'Name'] = { $regex: req.body.search_key, $options: "i" };
        }
        else{
            searchString.name = { $regex: req.body.search_key, $options: "i" };
        }
       
        let searchSuggestions = [];
        let allServices = await Service.find(searchString).populate("mainCategory").populate("subCategory").limit(limit).skip(offset);

        if (allServices) {
            if (host == "en") {
                allServices.filter(function (eachService) {
                    if(eachService.mainCategory){
                        searchSuggestions.push({
                            parent_category_id: eachService.mainCategory._id,
                            parent_category_name: eachService.mainCategory.name,
                            location_type: eachService.mainCategory.locationType,
                            parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachService.mainCategory.image,
                            parent_category_type: eachService.mainCategory.type,
                            subcategory_id: eachService.subCategory._id,
                            subcategory_name: eachService.subCategory.name,
                            subcategory_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachService.subCategory.image,
                            service_id: eachService._id,
                            service_name: eachService.name,
                            service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachService.image,
                            service_pricing: eachService.costType,
                            type: "service",
                        });
                    }
                });
            }
            else{
                allServices.filter(function (eachService) {
                    searchSuggestions.push({
                        parent_category_id: eachService.mainCategory._id,
                        parent_category_name: eachService.mainCategory[langName+'Name'],
                        location_type: eachService.mainCategory.locationType,
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachService.mainCategory.image,
                        parent_category_type: eachService.mainCategory.type,
                        subcategory_id: eachService.subCategory._id,
                        subcategory_name: eachService.subCategory[langName+'Name'],
                        subcategory_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachService.subCategory.image,
                        service_id: eachService._id,
                        service_name: eachService[langName+'Name'],
                        service_image: process.env.BASE_URL + process.env.SERVICE_MEDIA_URL + eachService.image,
                        service_pricing: eachService.costType,
                        type: "service",
                    });
                });
            }
            
        }

        let allSubcategories = await Subcategory.find(searchString).populate("parentCategory").limit(limit).skip(offset);

        if (allSubcategories) {
            if (host == "en") {
                allSubcategories.filter(function (eachSubcategory) {
                    searchSuggestions.push({
                        parent_category_id: eachSubcategory.parentCategory._id,
                        parent_category_name: eachSubcategory.parentCategory.name,
                        location_type: eachSubcategory.parentCategory.locationType,
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachSubcategory.parentCategory.image,
                        parent_category_type: eachSubcategory.parentCategory.type,
                        subcategory_id: eachSubcategory._id,
                        subcategory_name: eachSubcategory.name,
                        subcategory_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachSubcategory.image,
                        type: "subcategory",
                    });
                });
            }
            else{
                allSubcategories.filter(function (eachSubcategory) {
                    searchSuggestions.push({
                        parent_category_id: eachSubcategory.parentCategory._id,
                        parent_category_name: eachSubcategory.parentCategory[langName+'Name'],
                        location_type: eachSubcategory.parentCategory.locationType,
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachSubcategory.parentCategory.image,
                        parent_category_type: eachSubcategory.parentCategory.type,
                        subcategory_id: eachSubcategory._id,
                        subcategory_name: eachSubcategory[langName+'Name'],
                        subcategory_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachSubcategory.image,
                        type: "subcategory",
                    });
                });
            }
        }

        let allCategories = await Category.find(searchString).limit(limit).skip(offset);

        if (allCategories) {
            if (host == "en") {
                allCategories.filter(function (eachCategory) {
                    searchSuggestions.push({
                        parent_category_id: eachCategory._id,
                        parent_category_name: eachCategory.name,
                        parent_category_type: eachCategory.type,
                        location_type: eachCategory.locationType,
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachCategory.image,
                        type: "category",
                    });
                });
            }
            else{
                allCategories.filter(function (eachCategory) {
                    searchSuggestions.push({
                        parent_category_id: eachCategory._id,
                        parent_category_name: eachCategory[langName+'Name'],
                        parent_category_type: eachCategory.type,
                        location_type: eachCategory.locationType,
                        parent_category_image: process.env.BASE_URL + process.env.CATEGORY_MEDIA_URL + eachCategory.image,
                        type: "category",
                    });
                });
            }
        }
        return res.json({ status_code: 200, items: searchSuggestions });
    }
}
