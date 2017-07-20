const apiKey = require('../config/secret.json').mailGunApiKey;
const domain = require('../config/secret.json').mailGunSandbox
const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

const MailComposer = require('nodemailer/lib/mail-composer');

let subjectVar = 'K6NO';


var mailOptions = {
    from: 'CityChallenge <info@citychallenge.com>',
    to: ['tamas.kenessey@gmail.com'],
    bcc: ['tamas.kenessey@gmail.com', 'keno@happyzens.com', 'eurologusok@gmail.com'],
    subject: 'This is the first MIME eamil message',
    text: 'Hello! This is the text version of the message from ' + subjectVar,
    html: '<h1>Hello</h1><p>This is the text version of the message from' + subjectVar + '</p>'
};
var mail = new MailComposer(mailOptions);
mail.compile().build(function (err, message) {
    if (err) {
        console.log(err);
    } else {
        console.log('YAY!');
        process.stdout.write(message);
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
