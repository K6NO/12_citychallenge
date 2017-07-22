//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/bin/www');
let should = chai.should();
let seeder = require('mongoose-seeder');
let data = require('../src/mock/data.json');

let challengesAnswer = [
    {
        "_id": "57029ed4795118be119cc13b",
        "title": "Fourth challenge",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sem malesuada, aliquet libero a, tristique magna. Suspendisse rutrum lobortis ipsum, et commodo nibh. Praesent eu diam ex. Suspendisse potenti. Duis lacinia, nisl sed pretium molestie, tortor nisi pharetra erat, sed tempor sem turpis placerat felis. Suspendisse potenti. Donec consequat tristique diam id finibus. Donec vitae orci vel dui gravida tempus.",
        "karma": 10,
        "time": 1,
        "backgroundImage": "/assets/img/bg4.jpeg",
        "fun": 5,
        "difficulty": 1,
        "times_taken": 1,
        "likes": 0
    },
    {
        "_id": "57029ed4795118be119cc33b",
        "title": "Second challenge",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sem malesuada, aliquet libero a, tristique magna. Suspendisse rutrum lobortis ipsum, et commodo nibh. Praesent eu diam ex. Suspendisse potenti. Duis lacinia, nisl sed pretium molestie, tortor nisi pharetra erat, sed tempor sem turpis placerat felis. Suspendisse potenti. Donec consequat tristique diam id finibus. Donec vitae orci vel dui gravida tempus.",
        "karma": 10,
        "time": 7,
        "backgroundImage": "/assets/img/bg3.jpeg",
        "fun": 5,
        "difficulty": 3,
        "times_taken": 5,
        "likes": 0
    },
    {
        "_id": "57029ed4795118be119cc23b",
        "title": "Third challenge",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sem malesuada, aliquet libero a, tristique magna. Suspendisse rutrum lobortis ipsum, et commodo nibh. Praesent eu diam ex. Suspendisse potenti. Duis lacinia, nisl sed pretium molestie, tortor nisi pharetra erat, sed tempor sem turpis placerat felis. Suspendisse potenti. Donec consequat tristique diam id finibus. Donec vitae orci vel dui gravida tempus.",
        "karma": 10,
        "time": 7,
        "backgroundImage": "/assets/img/bg4.jpeg",
        "fun": 5,
        "difficulty": 1,
        "times_taken": 1,
        "likes": 0
    },
    {
        "_id": "57029ed4795118be119cc43b",
        "title": "First challenge",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt sem malesuada, aliquet libero a, tristique magna. Suspendisse rutrum lobortis ipsum, et commodo nibh. Praesent eu diam ex. Suspendisse potenti. Duis lacinia, nisl sed pretium molestie, tortor nisi pharetra erat, sed tempor sem turpis placerat felis. Suspendisse potenti. Donec consequat tristique diam id finibus. Donec vitae orci vel dui gravida tempus.",
        "karma": 10,
        "time": 30,
        "backgroundImage": "/assets/img/bg2.jpeg",
        "fun": 5,
        "difficulty": 1,
        "times_taken": 1,
        "likes": 0
    }
];


var expect = require('chai').expect;


chai.use(chaiHttp);

// Mocha self-test
describe('Mocha', function () {
    // Test spec (unit tests)
    it('should run the test with npm', function () {
        expect(true).to.be.ok; // -> ok truthy value
    });
});


// When I make a GET request to the api/challenges/:challengeId route without an authenticated user
describe('/api/challenges/:challengeId - no auth', function () {
    before((done) => {
        console.log("before");
        mongoose.connection.db.dropDatabase(function (err) {
            if(err) return next(err);
            console.log('DB deleted');
            done();
        });
    });

    it('should return 401 - unauthenticated', function (done) {
        chai.request(server)
            .get('/api/challenges/57029ed4795118be119cc13b')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
});
// When I make a GET request to the api/challenges/ route
describe('/api/challenges', function () {
    before((done) => {
        console.log("before");
        mongoose.connection.db.dropDatabase(function (err) {
            if(err) return next(err);
            console.log('DB deleted');
            done();
        });
    });

    it('should return json', function (done) {
        chai.request(server)
            .get('/api/challenges/')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if(err) return next(err);
                done();
            });
    });

    it('should return all challenges', function (done) {
        chai.request(server)
            .get('/api/challenges/')
            .end(function (err, res) {
                let respObject = res.body;

                expect(respObject.length).to.equal(4);
                done();
            });
    });
});

// when I make a PUT request to /challenges/:id update a challenge without auth

describe('PUT /challenges/57029ed4795118be119cc13b - no auth', function () {
    before((done) => {
        mongoose.connection.db.dropDatabase(function (err) {
            if (err) return next(err);
            console.log('DB deleted');
            done();
        });
    });
    //challengeId = 57029ed4795118be119cc13b
    it('should return status 401', function (done) {
        chai.request(server)
            .get('/api/challenges/57029ed4795118be119cc13b')
            .send({
                "times_taken": 6,
                "likes": 1
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });

});

// When I make a GET request to the api/users/ route without authentication
describe('/api/users - no auth', function () {
    before((done) => {
        mongoose.connection.db.dropDatabase(function (err) {
            if(err) return next(err);
            console.log('DB deleted');
            done();
        });
    });

    //
    it('should return status 401', function () {
        chai.request(server)
            .get('/api/users')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
});


// When I make a POST request to the auth/signup with the correct fields
// (minimum: emailAddress, fullName, userName, photoUrl, password)  route without authentication
describe('/auth/signup - no auth', function () {
    before((done) => {
        mongoose.connection.db.dropDatabase(function (err) {
            if(err) return next(err);
            console.log('DB deleted');
            done();
        });
    });

    it('should return status 401 when user is not authenticated', function () {
        chai.request(server)
            .post('/auth/signup')
            .send({
                "emailAddress": "newuser@gmail.com",
                "fullName": "New User",
                "userName": "NEWUSER",
                "photoUrl": "https://avatars3.githubusercontent.com/u/19394212?v=3&s=400",
                "password" : "password"
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
});

// When I make a GET request to /current/challenges/:id
describe('GET /current/challenges/:id - no auth', function () {
    before((done) => {
        mongoose.connection.db.dropDatabase(function (err) {
            if(err) return next(err);
            console.log('DB deleted');
            done();
        });
    });

    it('should return status 401 when user is not authenticated', function () {
        chai.request(server)
            .get('/api/current/challenges/9rfis9fsuf9sfsjfiofnsfksfnkjk')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });
});