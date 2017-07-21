'use strict';

// sent when routes/auth -> // POST /signup ->
let signupMessage = function (currentChallenge) {
    return `<body style="font-family: 'Helvetica', 'sans-serif'; text-align: center">
        <div style="background: #f44336"><h1 style="color: #fffff0">Welcome in the CityChallenge community</h1></div>
        <div style="border: #f44336 solid 1px; background: #fffff0"></div>
        <h2>Dear ${currentChallenge.user.userName},</h2>
        <p>You have entered a great community of people ready to improve their life. We all want to experience real-world adventures and inner growth. We want to share these experiences with members of the community.
        We want to help each other on the journey to a happier, healthier, more active and more sustainable urban life.

        <a href="http://localhost:3000/" style="text-decoration: none; tex"><h2>Start your journey, take the first step</h2></a>
        <p>To sign in, use the email (${currentChallenge.user.emailAddress}) and password you provided at registration.</p>
        <hr>
        <p>Please don't reply to this email. Really...</p>
    </body>
    `
};

// sent when router-api -> // POST create a new current challenge -> waitlist.js
let startCurrentChallengeMessage = function (currentChallenge) {
    return `<body style="font-family: 'Helvetica', 'sans-serif'; text-align: center">
        <div style="background: #f44336"><h1 style="color: #fffff0">Good news! We have found your partner! Your challenge has started</h1></div>
        <div style="border: #f44336 solid 1px; background: #fffff0"></div>
        <h2>Dear ${currentChallenge.user.userName},</h2>
        <p>${currentChallenge.partner.userName} will be your partner in ${currentChallenge.challenge.title}. <br>
        <a href="http://localhost:3000/#!/challenges/current/${currentChallenge._id}">Check out the first step or say hi to your partner.</a>

        <hr>
        <p>Please don't reply to this email. Really...</p>
    </body>
    `
};

// sent when router-api -> PUT update a current challenge - abandon
let partnerAbandonedMessage = function (currentChallenge) {
    return `<body style="font-family: 'Helvetica', 'sans-serif'; text-align: center">
        <div style="background: #f44336"><h1 style="color: #fffff0">Snap! Your partner had to give up...</h1></div>
        <div style="border: #f44336 solid 1px; background: #fffff0"></div>
        <h2>Dear ${currentChallenge.user.userName},</h2>
        <p>${currentChallenge.partner.userName} abandoned your challenge. This is sad news, but please continue. At the end, you started it for yourself.<br>
        <a href="http://localhost:3000/#!/challenges/current/${currentChallenge._id}">Check if ${currentChallenge.partner.userName} has left you a message here.</a>

        <hr>
        <p>Please don't reply to this email. Really...</p>
    </body>
    `
};

// sent when router-api -> PUT update a current challenge - abandon
let challengeCompletedMessage = function (currentChallenge) {
    return `<body style="font-family: 'Helvetica', 'sans-serif'; text-align: center">
        <div style="background: #f44336"><h1 style="color: #fffff0">You are truly awesome!</h1></div>
        <div style="border: #f44336 solid 1px; background: #fffff0"></div>
        <h2>Dear ${currentChallenge.user.userName},</h2>
        <p>Congratulations, you made it! You have just completed ${currentChallenge.challenge.title} together with ${currentChallenge.partner.userName}.<br>
        You gained ${currentChallenge.challenge.karma} karma, check out <a href="http://localhost:3000/#!/profile">your profile!</a>
        <a href="http://localhost:3000/#!/challenges/current/${currentChallenge._id}">Take a last look at your achievement.</a><br>
        Stop for a moment and appreciate success, and don't forget to say thanks to ${currentChallenge.partner.userName}!

        <hr>
        <p>Please don't reply to this email. Really...</p>
    </body>
    `
};

// sent when router.api -> PUT update a current challenge - abandon
let userAbandonedMessage = function (currentChallenge) {
    return `<body style="font-family: 'Helvetica', 'sans-serif'; text-align: center">
        <div style="background: #f44336"><h1 style="color: #fffff0">You abandoned your challenge.</h1></div>
        <div style="border: #f44336 solid 1px; background: #fffff0"></div>
        <h2>Dear ${currentChallenge.user.userName},</h2>
        <p>Bummer... You abandoned your challenge: ${currentChallenge.challenge.title}. Sometimes life is more complicated than you have expected. But never give up! You can try again this one or start another challenge anytime. <a href="http://localhost:3000/">Why not now?</a><br>

        <hr>
        <p>Please don't reply to this email. Really...</p>
    </body>
    `
};

let challengeFailedMessage = function (currentChallenge) {
    return `<body style="font-family: 'Helvetica', 'sans-serif'; text-align: center">
        <div style="background: #f44336"><h1 style="color: #fffff0">Your challenge was unsuccessfull</h1></div>
        <div style="border: #f44336 solid 1px; background: #fffff0"></div>
        <h2>Dear ${currentChallenge.user.userName},</h2>
        <p>Bummer... You failed your challenge. Probably you forgot to <a href="http://localhost:3000/#!/challenges/current/${currentChallenge._id}"> mark your steps completed.</a> But remember, you can try again or start another challenge anytime. Why not today?<br>

        <hr>
        <p>Please don't reply to this email. Really...</p>
    </body>
    `
};

// TODO time-induced reminder

let signupSubject = function (currentChallenge) {
    return 'Welcome ' + currentChallenge.user.userName + ' in the CityChallenge community!'
};

let startCurrentChallengeSubject = function (currentChallenge) {
    return 'Hi ' + currentChallenge.user.userName + ', your challenge has just started!'
};

let partnerAbandonedSubject = function (currentChallenge) {
    return 'Life is hard. ' + currentChallenge.partner.userName + ' had to give up. Find out why!'
};

let challengeCompletedSubject = function (currentChallenge) {
    return 'Congratulations, you have completed ' + currentChallenge.challenge.title;
};

let userAbandonedSubject = function () {
    return 'You abandoned your challenge';
};
let userFailedSubject = function () {
    return 'Your challenge was unsuccessful :(';
};

module.exports.signupMessage = signupMessage;
module.exports.startCurrentChallengeMessage = startCurrentChallengeMessage;
module.exports.partnerAbandonedMessage = partnerAbandonedMessage;
module.exports.challengeCompletedMessage = challengeCompletedMessage;
module.exports.userAbandonedMessage = userAbandonedMessage;
module.exports.challengeFailedMessage = challengeFailedMessage;

module.exports.signupSubject = signupSubject;
module.exports.startCurrentChallengeSubject = startCurrentChallengeSubject;
module.exports.partnerAbandonedSubject = partnerAbandonedSubject;
module.exports.challengeCompletedSubject = challengeCompletedSubject;
module.exports.userAbandonedSubject = userAbandonedSubject;
module.exports.userFailedSubject = userFailedSubject;