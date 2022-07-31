const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Register API Tests:', function() {
    it('should respond with 200 with valid credentials and if the user is new', function (done) {
        // For testing registering a new user, change the details in the .send() or remove the test user from the database.
        chai.request(server).post('/register').set('Content-Type', 'application/json').send({ email: "zz709@bath.ac.uk", password: "p4$$Word", subject_id: 1 }).end(function (req, res) {
            chai.expect(res.status).to.be.eq(200);
            chai.expect(res.body).to.have.property('token');
            done();
        })
    })

    it('should respond with 400 inputs with when registering with an email in the database', function(done) {
        chai.request(server).post('/register').set('Content-Type', 'application/json').send({ email: "bm639@bath.ac.uk", password: "p4$$Word", subject_id: 1}).end(function (req, res) {
            chai.expect(res.status).to.be.eq(400);
            chai.expect(res.body).to.have.property('message');
            done();
        })
    })

    it('should respond with 400 inputs with invalid email', function(done) {
        chai.request(server).post('/register').set('Content-Type', 'application/json').send({ email: "BM639@bath.ac.uk", password: "p4$$Word", subject_id: 1}).end(function (req, res) {
            chai.expect(res.status).to.be.eq(400);
            chai.expect(res.body).to.have.property('message');
            done();
        })
    })

    it('should respond with 400 inputs with invalid password', function(done) {
        chai.request(server).post('/register').set('Content-Type', 'application/json').send({ email: "bm639@bath.ac.uk", password: "password", subject_id: 1}).end(function (req, res) {
            chai.expect(res.status).to.be.eq(400);
            chai.expect(res.body).to.have.property('message');
            done();
        })
    })
})