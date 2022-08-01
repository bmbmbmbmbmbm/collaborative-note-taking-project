const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJibTYzOSIsImlhdCI6MTY1OTI2NDA2MX0.u27LRIIphhn0DM53LkSY7X-5lSljFhb7CoQ1gDQzqEI";
var body;

describe('Threads API Tests:', function () {
    describe('Testing /threads/create route', function () {
        this.beforeEach(function () {
            body = {
                title: "this is a title",
                unitCode: "GENERAL",
                content: "This is some content"
            }
        })

        it('should respond with 400 if title is invalid', function (done) {
            body.title = "";
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 if unit code is invalid', function (done) {
            body.unitCode ='aaaaaaa'
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 if content is invalid', function (done) {
            body.content = ""
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 if unit code is valid but does not exist', function(done) {
            body.unitCode = "AA30225"
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 200 if all details are valid and JWT is provided', function (done) {
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('id');
                done();
            })
        })

        it('should respond with 200 if all title contains illegal characters and at least one letter and JWT is provided', function (done) {
            body.title = "\0\x08\x09\x1a\n\r\"'\\%a"
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('id');
                done();
            })
        })

        it('should respond with 400 if all title contains are illegal characters', function (done) {
            body.title = "\0\x08\x09\x1a\n\r\"'\\%"
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 200 if all content contains illegal characters and JWT is provided', function (done) {
            body.content = "\0\x08\x09\x1a\n\r\"'\\%"
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('id');
                done();
            })
        })
    })

    describe('Testing /threads/add-reply/ route', function () {
        this.beforeEach(function() {
            body = {
                content: "this is a comment",
                threadId: 1,
                commentId: 10,
            }
        })

        it('should return 200 if valid thread identifier, comment identifier and valid content are provided', function (done) {
            chai.request(server).post('/threads/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 200 if valid thread identifier and valid content are provided', function (done) {
            body.commentId = -1;
            chai.request(server).post('/threads/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if valid thread identifier and valid content are provided', function (done) {
            body.commentId = -1;
            chai.request(server).post('/threads/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if valid thread identifier and content contains illegal character', function (done) {
            body.content = "\0\x08\x09\x1a\n\r\"'\\%"
            chai.request(server).post('/threads/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if thread does not exist (with comment)', function (done) {
            body.threadId = 200000;
            chai.request(server).post('/threads/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    
        it('should return 400 if thread does not exist (without comment)', function (done) {
            body.threadId = 200000;
            body.commentId = -1;
            chai.request(server).post('/threads/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /threads/view-all/ route', function () {
        it('should return 200 and thread information when user requesting is the same as asked for', function (done) {
            chai.request(server).get('/threads/view-all/bm639').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should return 400 when username is invalid', function (done) {
            chai.request(server).get('/threads/view-all/ooooo').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /threads/:id/view', function () {
        it('should return 200 and thread list if unit exists', function (done) {
            chai.request(server).get('/threads/CM30225/view').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should return 400 if unitcode is valid but does not exist', function (done) {
            chai.request(server).get('/threads/AA30225/view').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if unitcode is invalid', function (done) {
            chai.request(server).get('/threads/aaaaaaa/view').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /threads/view/:id/replies', function () {
        it('should return 200 if thread exists', function (done) {
            chai.request(server).get('/threads/view/1/replies').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('comments');
                chai.expect(res.body).to.have.property('replies');
                done();
            })
        })

        it('should return 400 if thread does not exist', function (done) {
            chai.request(server).get('/threads/view/20000/replies').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 200 if thread exists', function (done) {
            chai.request(server).get('/threads/view/-1/replies').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })
});