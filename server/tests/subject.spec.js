const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJibTYzOSIsImlhdCI6MTY1OTI2NDA2MX0.u27LRIIphhn0DM53LkSY7X-5lSljFhb7CoQ1gDQzqEI";
var body;

describe('Subject API Tests:', function () {
    describe('Testing /subject/enrol route', function () {
        this.beforeEach(function () {
            body = [
                {
                    title: "CM30225",
                    code:  "CM30225"
                },
            ]
        })

        it('should respond with 400 if title is invalid', function (done) {
            chai.request(server).post('/threads/create/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /subject/get-units/:id route', function () {

    })

    describe('Testing /subject/get-subject/:id route', function () {

    })

    describe('Testing /subject/titleof/:id', function () {

    })

    describe('Testing /subject/:id route', function () {

    })

    describe('Testing /subject/ route', function () {

    })
})