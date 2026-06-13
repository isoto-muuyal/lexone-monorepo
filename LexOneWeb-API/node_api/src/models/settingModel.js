const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let settingSchema = new Schema({
	siteName: { type: String, minLength: 3, maxlength: 30, required: true },
	siteIcon: { type: String, minLength: 3, maxlength: 30, required: false },
	siteLogo: { type: String, minLength: 3, maxlength: 30, required: false },
	contactEmail: { type: String, minLength: 3, maxlength: 30, required: true },
	copyrightText: { type: String, minLength: 3, maxlength: 300, required: true },
	guideLine: { type: String, minLength: 3, maxlength: 5000, required: true },
	guideLineAr: { type: String, minLength: 3, maxlength: 5000, required: true },
	guideLineFr: { type: String, minLength: 3, maxlength: 5000, required: true },
	timezone: { type: String, required: false, default: "Asia/Calcutta" },
	currencyCode: { type: String, minLength: 1, maxlength: 5, required: true, default: "USD" },
	currencySymbol: { type: String, minLength: 1, maxlength: 5, required: true, default: "$" },
	docsLimit: { type: Number, required: true, default: 1 }, //  maximum number for documents allowed for tasker
	portfolioLimit: { type: Number, required: true, default: 1 }, //  maximum number for portfolio images allowed for tasker
	commission: { type: String, minLength: 1, maxlength: 2, required: false, default: "0" },
	tax: { type: String, minLength: 1, maxlength: 2, required: false, default: "0" },
	minimumAmount: { type: String, minLength: 1, required: false, default: "0" },
	payoutDate: { type: Number, minLength: 1, required: false, default: "2" },
	stripePrivateKey: { type: String, required: false, },
	stripePublicKey: { type: String, required: false, },
	smtpHost: { type: String, required: false, },
	smtpEmail: { type: String, required: false, },
	smtpPassword: { type: String, required: false, },
	smtpPort: { type: String, required: false, },
	smtpStatus: { type: Number, required: false, },
	paymentType: { type: String, required: false, },
	fbLink: { type: String, required: false, },
	inviteLink: { type: String, required: false, },
	instagramLink: { type: String, required: false, },
	twitterLink: { type: String, required: false, },
	status: { type: Boolean, required: false, default: 1 },
	instantLocation: { type: Boolean, required: false, default: "false" },
	androidForceUpdate: { type: Boolean, required: false, default: 1 },
	androidVersion: { type: Number, required: false, default: 1 },
	iosForceUpdate: { type: Boolean, required: false, default: 0 },
	iosVersion: { type: Number, required: false, default: 1.1 },
	maxDistance:{type: Number, required: false, default: 10},
	rideDistance:{type: Number, required: false},
	stripeChange:{type: String, required: false},
	stripeClientId:{type: String, required: false},
	youtubeLink:{type: String, required: false},
	youtubeTitle:{type: String, required: false},
	youtubeDescription:{type: String, required: false},
	googleadsense:{type: Boolean, required: false, default: "false" },
	googleadclient:{type: String, required: false},
	googleadslot:{type: String, required: false},
	supportPhone:{type: String, required: false},
}, { timestamps: true });

// exports model
module.exports = mongoose.model("Settings", settingSchema);