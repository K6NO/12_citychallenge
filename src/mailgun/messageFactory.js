const apiKey = require('../config/secret.json').mailGunApiKey;
const domain = require('../config/secret.json').mailGunSandbox
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

const MailComposer = require('nodemailer/lib/mail-composer');


module.exports = function (messagingEvent, user, currentChallenge) {
    const templates = require('./messageTemplates');

    if(!user) {
        console.log('no user');
        user = currentChallenge.user;
    }

    if(!currentChallenge) {
        currentChallenge = {};
        console.log('no currentChallenge');
        currentChallenge.user = user;
    }
    console.log(user);
    console.log('____________');
    console.log(currentChallenge);


    let constructEmail = function (messagingEvent, templates, user, currentChallenge) {


        let templateName = messagingEvent + 'Message';
        let subjectName = messagingEvent + 'Subject';
        let mailOptions = {
            from: 'CityChallenge <noreply@kenomano.com>',
            to: user.emailAddress,
            subject: templates[subjectName](currentChallenge),
            text: `Dear ${user.userName}, please switch to HTML view or visit your profile to view what's happening at: http:localhost//3000/`,
            html: templates[templateName](currentChallenge)
        };
        return mailOptions;
    };

    let mail = new MailComposer(constructEmail(messagingEvent, templates, user, currentChallenge));

    mail.compile().build(function (mailBuildError, message) {
        if (mailBuildError) {
            console.log(mailBuildError);
        } else {
            console.log('YAY!');
            let dataToSend = {
                to: user.emailAddress,
                message: message.toString('utf8')
            };
            mailgun.messages().sendMime(dataToSend, function (sendError, body) {
                if(sendError) {
                    console.log(sendError);
                } else {
                    console.log('messages sent');
                    console.log(body);
                }
            })
        }
    });
};



