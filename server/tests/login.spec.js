const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('login requests', () => {
    it('should respond with 200 with valid credentials in the users database', function (done) {
        chai.request(server).post('/login').set('Content-Type', 'application/json').send({email: "bm639@bath.ac.uk", password: "p4$$Word"}).end(function(req, res) {
            chai.expect(res.status).to.be.eq(200);
            chai.expect(res.body).to.have.property('token');
            done();
        })
    })

    it('should respond with 400 with invalid credentials', function (done) {
        chai.request(server).post('/login').set('Content-Type', 'application/json').send({email: "", password: ""}).end(function(req, res) {
            chai.expect(res.status).to.be.eq(400);
            done();
        })
        
    })
})
