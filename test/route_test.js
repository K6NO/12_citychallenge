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


var expect = require('chai').expect;


chai.use(chaiHttp);

// Mocha self-test
describe('Mocha', function () {
    // Test spec (unit tests)
    it('should run the test with npm', function () {
        expect(true).to.be.ok; // -> ok truthy value
    });
});

// When I make a request to the GET route with the correct credentials, the corresponding user document is returned
//describe('/ GET /users', function () {
//    before((done) => {
//        console.log("before");
//        mongoose.connection.db.dropDatabase(function (err) {
//            if(err) return next(err);
//            console.log('DB deleted');
//            done();
//        });
//    });
//
//    // joe@smith.com:password -> am9lQHNtaXRoLmNvbTpwYXNzd29yZA==
//    it('should respond with the authenticated user', function () {
//        chai.request(server)
//            .get('/api/users')
//            .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
//            .end(function (err, res) {
//                expect(
//                    { _id: "57029ed4795118be119cc437",
//                        fullName: 'Joe Smith',
//                        emailAddress: 'joe@smith.com',
//                        password: '$2a$10$nwVKZmtZhgE9k/wu9BdHJOIE6lXhpxKh1sK0RvmO1hl8DkhZ0.wGi',
//                        __v: 0 }
//                ).to.equal(res.body);
//                done();
//            });
//    });
//
//    it('should return 401 - unauthenticated', function (done) {
//        chai.request(server)
//            .get('/api/users')
//            .end(function (err, res) {
//                //expect(401).to.equal(res.status);
//                res.should.have.status(401)
//                done();
//            })
//    });
//});
//
//
////When I make a request to the GET /api/courses/:courseId route with the invalid credentials, a 401 status error is returned
//describe('/ GET /api/courses/:courseId', function () {
//    before((done) => {
//        console.log("before");
//        mongoose.connection.db.dropDatabase(function (err) {
//            if (err) return next(err);
//            console.log('DB deleted');
//            done();
//        });
//    });
//
//    it('should respond with 401 status error', function () {
//        chai.request(server)
//            .get('/api/courses/57029ed4795118be119cc43d')
//            .set('Authorization', 'Basic xxxxxxxxxxxxxxxxxxx')
//            .end(function (err, res) {
//                res.should.have.status(401);
//                done();
//            });
//    });
//});