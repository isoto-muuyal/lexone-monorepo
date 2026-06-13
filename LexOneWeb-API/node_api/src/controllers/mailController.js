const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const createClient = require("smtpexpress");
const mailersend = require('mailersend');

const fs = require('fs');

// models
const Setting = require('../models/settingModel');

// send mail to recipients
sendMailOld = async function (mailData) {
    try {

        let appSettings = await Setting.findOne({});
        console.log("App Settings smtpHost: " + appSettings.smtpHost);
        console.log("App Settings smtpPort: " + appSettings.smtpPort);
        console.log("App Settings smtpEmail: " + appSettings.smtpEmail);
        console.log("App Settings smtpPassword: " + appSettings.smtpPassword);

        if (appSettings.smtpHost) {

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: appSettings.smtpHost,
                port: appSettings.smtpPort,
                secure: (appSettings.smtpStatus === 1) ? true : false, // true for 465, false for other ports
                auth: {
                    //user: appSettings.smtpEmail,
                    user: 'AKIA3FLD6KLFHCGAYOS3',
                    pass: appSettings.smtpPassword,
                },
            });

            let template_dir = __dirname + '/mail-templates/forgotemail.html';

            readHTMLFile(template_dir, function (err, html) {
                let template = handlebars.compile(html);
                let replacements = {
                    site_title: appSettings.siteName,
                    site_logo: process.env.BASE_URL + "media/admin_assets/" + "logo.png",
                    email_header: mailData.title,
                    email_message: mailData.message,
                    email_details: mailData.message_details,
                    email_service: mailData.service,
                    email_tax: mailData.tax,
                    email_commission: mailData.commission,
                    email_totalAmount: mailData.totalAmount,
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
                    else {
                        console.log(info);
                    }
                });
            });
        }
    } catch (err) {
        console.log(err);
    }
};

// send mail to recipients, using mailersend. Libreria para produccion.
sendmailMailersend = async function (mailData) {
    console.log('>>> sendmailMailersend called with:', JSON.stringify(mailData));

    try {
        const mailerSend = new mailersend.MailerSend({
            apiKey: 'mlsn.abeaa12dc79df05af6b4b8887e317e51abcf5b5afa740aed754582960194b0a7'
        });

        const sentFrom = new mailersend.Sender('no-reply@tudofyapp.com', 'TudofyApp');
        const recipients = [
            new mailersend.Recipient(mailData.to, "Usuario")
        ];

        console.log('>>> Preparing email to:', mailData.to);

        const emailParams = new mailersend.EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject(mailData.subject)
            .setHtml(
                '<img src="https://tudofyapp.com/media/admin_assets/logo.png">'
                + '<br> <h1>' + mailData.title + '</h1>'
                + '<br>' + mailData.message
                + "<br>" + mailData.message_details)
            .setText(".");

        console.log('>>> Sending email via MailerSend...');
        const response = await mailerSend.email.send(emailParams);
        console.log('>>> Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('>>> Error sending email:', error);
        throw error;
    }
}

sendpasswordMailOld = async function (mailData) {
    try {
        let appSettings = await Setting.findOne({});
        if (appSettings.smtpHost) {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: appSettings.smtpHost,
                port: appSettings.smtpPort,
                secure: (appSettings.smtpStatus === 1) ? true : false, // true for 465, false for other ports
                auth: {
                    //user: appSettings.smtpEmail,
                    user: 'AKIA3FLD6KLFHCGAYOS3',
                    pass: appSettings.smtpPassword,
                },
            });

            let template_dir = __dirname + '/mail-templates/forgotemail.html';

            readHTMLFile(template_dir, function (err, html) {
                let template = handlebars.compile(html);
                let replacements = {
                    site_title: appSettings.siteName,
                    site_logo: process.env.BASE_URL + "media/admin_assets/" + "logo.png",
                    email_header: mailData.title,
                    email_message: mailData.message,
                    email_details: mailData.message_details,
                    email_service: mailData.service,
                    email_tax: mailData.tax,
                    email_commission: mailData.commission,
                    email_totalAmount: mailData.totalAmount,
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
                        // console.log("SMTP ERROR:" + error);
                    }
                    else {
                        // console.log(info);
                    }
                });

            });

        }

    } catch (err) {
        console.log(err);
    }
};

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

sendpasswordMail = async function (mailData) {
    console.log("Sending mail from sendMail function");
    console.log(mailData);

    // const smtpexpressClient = createClient.createClient({
    //     projectId: "sm0pid-jXKRTMxW3nqhV2FWxvRTxn6pl",
    //     projectSecret: "22894af984c0f61691e1fb97de1e75fcfd09c15c04051bdda4"
    // });

    // e.preventDefault();
    // setLoading(true);

    const email = mailData.to;
    const message = mailData.message;
    const subject = mailData.subject;
    console.table({ email, message });


    const mailerSend = new mailersend.MailerSend({
        apiKey: 'mlsn.3036ca5b0931b7a19e3c2f13cfd01767f077d98bb37c5fc04ab3b49152fbf2d4',
    });

    const sentFrom = new mailersend.Sender('no-reply@tudofyapp.com', 'TudofyApp');
    const recipients = [
        new mailersend.Recipient(mailData.to, "Usuario")
    ];

    const emailParams = new mailersend.EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(mailData.subject)
        .setHtml(
            '<img src="https://tudofyapp.com/media/admin_assets/logo.png">'
            + '<br> <h1>' + mailData.title + '</h1>'
            + '<br>' + mailData.message 
            + "<br>" + mailData.message_details)
        .setText("This is the text content");

    await mailerSend.email.send(emailParams).then((response) => {
        console.log('Email sent successfully:', response);
    }).catch((error) => {
        console.error('Error sending email:', error);
    });
    
    // try {
    //     console.log("Sending mail using SMTP Express");
    //     // Sending an email using SMTP
    //     await smtpexpressClient.sendApi.sendMail({
    //         // Subject of the email
    //         subject: subject,
    //         // Body of the email
    //         message: `<h2>${message}</h2>`,
    //         // Sender's details
    //         sender: {
    //             // Sender's name
    //             name: "No-Reply@tudofyapp.com",
    //             // Sender's email address
    //             email: "profile7-b32789@smtpexpress.email",
    //         },
    //         // Recipient's details
    //         recipients: {
    //             // Recipient's email address (obtained from the form)
    //             email: email,
    //         },
    //     });

    //     // Notify user of successful submission
    //     console.log("Please check your email to view the sent message.");
    //     setLoading(false);

    //     setEmail("");
    //     setMessage("");
    // } catch (error) {
    //     // You can console.log the error to know what went wrong
    //     console.log(error);
    //     setLoading(false);
    // }

}


sendMail = async function (mailData) {
    console.log("Sending mail from sendMail function");
    console.log(mailData);

    const smtpexpressClient = createClient.createClient({
        projectId: "sm0pid-jXKRTMxW3nqhV2FWxvRTxn6pl",
        projectSecret: "22894af984c0f61691e1fb97de1e75fcfd09c15c04051bdda4"
    });

    const email = mailData.to;
    const message = mailData.message + "<br>" + mailData.message_details;
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
        //(false);

        // setEmail("");
        //setMessage("");
    } catch (error) {
        // You can console.log the error to know what went wrong
        console.log(error);
        //setLoading(false);
    }

}


// module.exports = {
//     sendMail: sendmailMailersend,
//     sendpasswordMail: sendpasswordMail,
// };


module.exports = {
    sendMail: sendmailMailersend,
    sendpasswordMail: sendmailMailersend,
};


