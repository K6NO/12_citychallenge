let messageFactory = require('./messageFactory.js');

let user = {
    userName: 'K6NO',
    emailAddress: 'tamas.kenessey@gmail.com'
};

let currentChallenge = {
    _id: '1234567',
    user : {
        _id : '987654',
        userName: 'userUserName',
        emailAddress: 'tamas.kenessey@gmail.com'},
    challenge: {
        _id : '545454545',
        title: 'This is the title'
    },
    partner : {
        _id: '343434343434',
        userName : 'partnerUserName'
    }
};

let messagingEvent = 'signup';

messageFactory(messagingEvent, user, null);