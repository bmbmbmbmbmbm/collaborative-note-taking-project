const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);
describe('Login API Tests:', function () {
    describe('login requests', function() {
        it('should respond with 200 with valid credentials in the users database', function (done) {
            chai.request(server).post('/login').set('Content-Type', 'application/json').send({ email: "bm639@bath.ac.uk", password: "p4$$Word" }).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('token');
                done();
            })
        })

        it('should respond with 400 with invalid credentials', function (done) {
            chai.request(server).post('/login').set('Content-Type', 'application/json').send({ email: "BM639@bath.ac.uk", password: "password" }).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                chai.expect(res.body).to.not.have.property('token');
                done();
            })

        })

        it('should respond with 400 with valid credentials but the user does not exist', function (done) {
            chai.request(server).post('/login').set('Content-Type', 'application/json').send({ email: "oo000@bath.ac.uk", password: "p4$$Word" }).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                chai.expect(res.body).to.not.have.property('token');
                done();
            })
        })
    })
})
