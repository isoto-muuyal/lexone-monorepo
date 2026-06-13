const User = require('../models/userModel');
const Media = require('../models/mediaModel');

exports.allMedia = async function (req, res) {
    if (!req.body.user_id || !req.body.type) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let allMedia = await Media.find({ taskerId: userDetails._id, for: req.body.type });

            if (!allMedia)
                return res.status(200).json({ status_code: 200, items: [] });

            let mediaFiles = [];
            let mediaPath = process.env.DOCS_MEDIA_URL;
            allMedia.filter(function (eachFile) {
                mediaPath = (req.body.type === "document") ? process.env.DOCS_MEDIA_URL : process.env.PORTFOLIO_MEDIA_URL;
                mediaFiles.push({
                    item_id: eachFile._id,
                    item_name: eachFile.name,
                    item_url: process.env.BASE_URL + mediaPath + eachFile.media_name,
                });
            });
            return res.status(200).json({ status_code: 200, items: mediaFiles });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};

exports.deleteMedia = async function (req, res) {
    if (!req.body.user_id || !req.body.media_id) {
        return res.status(200).json({ status_code: 400, message: res.__("Invalid Params") });
    }
    else {
        try {

            let userDetails = await User.findOne({ userId: req.body.user_id, role: "tasker" })

            if (!userDetails)
                return res.status(200).json({ status_code: 401, message: res.__("Invalid User ID") });

            if (userDetails.status === 0)
                return res.status(200).json({ status_code: 401, message: res.__("Account is disabled") });

            let allMedia = await Media.findById(req.body.media_id);

            if (!allMedia)
                return res.status(200).json({ status_code: 500, message: res.__("Media not found") });

            await allMedia.remove();

            return res.status(200).json({ status_code: 200, message: res.__("Media deleted successfully") });
        }
        catch (err) {
            return res.status(200).json({ status_code: 500, message: res.__("Something went wrong") });
        }
    }
};