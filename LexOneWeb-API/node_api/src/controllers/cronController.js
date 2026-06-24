const cron = require("node-cron"); 
const path = require("path");

const Setting = require('../models/settingModel');
const User = require('../models/userModel');

const fcmService = require('../controllers/fcmController');

const { I18n } = require('i18n');

/**
 * create a new instance
 */
const i18n = new I18n()

/**
 * later in code configure
 */
i18n.configure({
  locales: ['en', 'fr','ar'],
  defaultLocale: 'ar',
  directory: path.join(__dirname, 'locales'),
})

cron.schedule("*/1 * * * *", async function(req, res) { 
    
    let appSettings = await Setting.findOne({});
    if (appSettings && appSettings.stripeChange == "1") {
        let tasker = await User.updateMany({ role: 'tasker' }, {$set: {accountId: null}},{multi: true});
        
        let taskerservice = await User.find({ "role": 'tasker'});
        let MsgData;
       
        taskerservice.filter(function (eachTasker) {
            if(eachTasker.deviceToken){
                if (eachTasker.deviceActive === 1 && eachTasker.status === 1 && eachTasker.verified == 1) {
                    languageType = eachTasker.languageType;
                    logMessage = i18n.__({ phrase: 'Your Stripe details has been removed unfortunately please refill your details', locale: languageType });
                    MsgData = { "name": "Stripe", "message": { "booking_id": "Stripe", "message": logMessage } };
                    fcmService.notifyUser(eachTasker.deviceToken, { "title": "Stripe", "scope": "stripe", "message": JSON.stringify(MsgData) });
                }
            }
        });
        Setting.findOneAndUpdate({ "stripeChange": "1" }, { "stripeChange": "0" }, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
        let verified = await User.updateMany({ role: 'tasker' }, {$set: {verified: 0}},{multi: true});
        
    }
}); 