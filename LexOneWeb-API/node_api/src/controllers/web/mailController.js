
const createClient = require("smtpexpress");
const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const fs = require('fs');

// models
const Setting = require('../../models/settingModel');

// send mail to recipients
sendMailLegacy = async function (mailData) {
    try {
        let appSettings = await Setting.findOne({});
        if (appSettings.smtpHost) {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: appSettings.smtpHost,
                port: appSettings.smtpPort, 
                secure: (appSettings.smtpStatus === 1) ? true : false, // true for 465, false for other ports
                auth: {
                    user: appSettings.smtpEmail,
                    //user: 'AKIA3FLD6KLFHCGAYOS3',
                    pass: appSettings.smtpPassword,
                },
            });
            readHTMLFile(__dirname + '/mail-templates/email.html', function (err, html) {
                let template = handlebars.compile(html);
                let replacements = {
                    site_title: appSettings.siteName,
                    site_logo: process.env.BASE_URL + process.env.ADMIN_MEDIA_URL + "logo.png",
                    email_header: mailData.title,
                    email_message: mailData.message,
                    email_details: mailData.message_details,
                    email_service:  mailData.service,
                    email_tax:  mailData.tax,
                    reset_link:mailData.link ? mailData.link : '',
                    email_commission:  mailData.commission,
                    email_totalAmount:  mailData.totalAmount,
                    email_footer: appSettings.copyrightText,
                    facebook_link: appSettings.fbLink,
                    twitter_link: appSettings.twitterLink,
                    instagram_link: appSettings.instagramLink,
                };
                let htmlToSend = template(replacements);
                let mailOptions = {
                    from: appSettings.contactEmail,
                    to: mailData.to,
                    subject: mailData.subject,
                    html: htmlToSend,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log("SMTP ERROR:" + error);
                    }
                    else{
                        console.log('new send mail logs',mailData.subject+' '+info);
                    }
                });

            });

        }

    } catch (err) {
        console.log(err);
    }
};

  sendMail = async function (mailData) {
    console.log("Sending mail from sendMail function");
    console.log(mailData);

    const smtpexpressClient = createClient({
        projectId: "sm0pid-jXKRTMxW3nqhV2FWxvRTxn6pl",
        projectSecret: "22894af984c0f61691e1fb97de1e75fcfd09c15c04051bdda4"
      });
    

    e.preventDefault();
    setLoading(true);
   
    const email = mailData.to;
    const message = mailData.message;
    const subject = mailData.subject;
    console.table({ email, message });

    try {
      console.log("Sending mail using SMTP Express");
      // Sending an email using SMTP
      await smtpexpressClient.sendApi.sendMail({
        // Subject of the email
        subject: subject,
        // Body of the email
        message: `<h2>${message}</h2>`,
        // Sender's details
        sender: {
          // Sender's name
          name: "No-Reply@tudofyapp.com",
          // Sender's email address
          email: "profile7-b32789@smtpexpress.email",
        },
        // Recipient's details
        recipients: {
          // Recipient's email address (obtained from the form)
          email: email,
        },
      });

      // Notify user of successful submission
      console.log("Please check your email to view the sent message.");
      setLoading(false);

      setEmail("");
      setMessage("");
    } catch (error) {
      // You can console.log the error to know what went wrong
      console.log(error);
      setLoading(false);
    }

}


let readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

module.exports = {
    sendMail: sendMail,
};


