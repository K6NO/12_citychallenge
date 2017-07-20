const apiKey = require('../config/secret.json').mailGunApiKey;
const domain = require('../config/secret.json').mailGunSandbox
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

const MailComposer = require('nodemailer/lib/mail-composer');

let subjectVar = 'K6NO';


var mailOptions = {
    from: 'CityChallenge <info@citychallenge.com>',
    to: ['tamas.kenessey@gmail.com', 'keno@happyzens.com'],
    bcc: ['tamas.kenessey@gmail.com', 'keno@happyzens.com'],
    subject: 'This is the first MIME email message from ' + subjectVar,
    text: `Hello! This is the text version of the message from ${subjectVar}. Special chars: éáíöüőúó "+#$@  -------`,
    html: `<h1>Hello</h1><p>This is the text version of the message from ${subjectVar}
            <br> special chars: éáíöüőúó "+#$@  -------
            <br> <span style="color: darkred">Using inline CSS style</span></p>
            <img src="http://localhost:3000/assets/img/bg.jpg" style="max-width: 300px; border: 5px solid black" alt="Image from server with CSS-style"/>`
};
var mail = new MailComposer(mailOptions);
mail.compile().build(function (mailBuildError, message) {
    if (mailBuildError) {
        console.log(mailBuildError);
    } else {
        console.log('YAY!');
        let dataToSend = {
            to: ['tamas.kenessey@gmail.com', 'keno@happyzens.com'],
            bcc: ['tamas.kenessey@gmail.com', 'keno@happyzens.com'],
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

//mail.compile().build(function(err, message){
//    if (err) console.log((err);
//    process.stdout.write(message);
//});
//
//
//
//let emailData = {
//    from: 'K6NO <me@samples.mailgun.org>',
//    to: 'tamas.kenessey@gmail.com',
//    subject: 'Hello ' + subjectVar,
//    text: 'Testing some Mailgun awesomness!'
//};
//
//mailgun.messages().send(emailData, function (error, body) {
//    if(error) {
//        console.log(error)
//    } else {
//        console.log('yay');
//        console.log(body);
//    }
//});
