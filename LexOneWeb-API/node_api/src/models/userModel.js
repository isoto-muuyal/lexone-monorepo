const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let userSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, minlength: 3, maxlength: 40, required: true },
    frenchName: { type: String, minlength: 3, maxlength: 40, required: false },
    arabicName: { type: String, minlength: 3, maxlength: 40, required: false },
    email: { type: String, lowercase: true, trim: true, unique: true, required: true },
    password: { type: String, minlength: 6, maxlength: 255, trim: true, required: false },
    mobile: { type: String, minlength: 6, maxlength: 15, trim: true, required: false },
    role: { type: String, required: true, enum: ['user', 'tasker'] },
    location: { type: String, trim: true, required: false },
    image: { type: String, maxlength: 30, required: false, },
    about: { type: String, required: false, default: "" }, // tasker bio
    serviceIds: { type: Array, default: [] },
    status: { type: Number, required: false, default: 1 },
    onride: { type: Number, required: false, default: 0 },
    availability: { type: Number, required: false, default: 1 },
    onlineStatus: { type: Number, required: false, default: 0 },
    verified: { type: Number, required: false, default: 0 }, // tasker's verification status
    reports: { type: Number, required: false, default: 0 },
    deviceToken: { type: String, trim: true, required: false },
    deviceMode: { type: Number, required: true, enum: [0, 1, 2], default: 0 },
    rating: { type: String, required: false, default: "0" }, // tasker's rating
    tasksCompleted: { type: String, required: false, default: "0" }, // tasker's completed tasks
    reviews: { type: String, required: false, default: "0" }, // tasker's reviews
    deviceActive: { type: Number, required: true, enum: [0, 1], default: 1 },
    chatNotification: { type: String, required: false, enum: ['true', 'false'], default: "true" },
    bookingNotification: { type: String, required: false, enum: ['true', 'false'], default: "true" },
    bookingEmail: { type: String, required: false, enum: ['true', 'false'], default: "true" },
    paymentEmail: { type: String, required: false, enum: ['true', 'false'], default: "true" },
    devicePlatform: { type: String, required: true, enum: ['android', 'iOS', 'web'] },
    facebookId: { type: String, required: false },
    googleId: { type: String, required: false },
    appleId: { type: String, required: false },
    stripePrivateKey: { type: String, required: false, },
    stripePublicKey: { type: String, required: false, },
    stripeCustomerId: { type: String, required: false, },
    accountId: { type: String, required: false, },
    languageType:{ type: String, required: false, },
    lat: { type: String, required: false },
    lon: { type: String, required: false },
    loc: { type: Array, default: [] },
    cancelled_by: { type: String, required: false },
    lastActive: { type: Date, required: false, default: Date.now() },
    lastBookedOn: { type: Date, required: false, default: Date.now() },
}, { timestamps: true });

// password hash
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified("password") || this.isNew) {
            if (this.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(this.password, salt);
                this.password = hashedPassword;
            }
        }
        next()
    } catch (error) {
        next(error)
    }
});


// exports model
module.exports = mongoose.model("Users", userSchema);

// password validation
module.exports.isValidPassword = async function (currentPassword, dbPassword) {
    try {
        if(dbPassword){
          return await bcrypt.compare(currentPassword, dbPassword);  
        }
    } catch (error) {
        throw error
    }
};

// password validation
module.exports.SamePassword = async function (oldPassword, newPassword) {
    try {
        return await bcrypt.compare(currentPassword, dbPassword);
    } catch (error) {
        throw error
    }
};

