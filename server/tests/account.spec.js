const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../main')

chai.use(chaiHttp)

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJibTYzOSIsImlhdCI6MTY1OTI2NDA2MX0.u27LRIIphhn0DM53LkSY7X-5lSljFhb7CoQ1gDQzqEI'
let body

describe('Testing Account API:', function () {
    this.beforeEach(function () {
        body = {
            email: 'bm639@bath.ac.uk',
            oldPassword: 'p4$$Word',
            newPassword: 'p4$$Word',
            confirmPassword: 'p4$$Word'
        }
    })

    describe('Testing /account/change-password', function () {
        it('should respond with 200 when provided with valid JWT and correct credentials', function (done) {
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(200)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })

        it('should respond with 400 when provided with valid JWT and another users credentials', function (done) {
            body.email = 'ad245@bath.ac.uk'
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })

        it('should respond with 400 when provided with valid JWT and valid credentials that do not exist in the system', function (done) {
            body.email = 'oo000@bath.ac.uk'
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })

        it('should respond with 400 when provided with valid JWT and invalid email', function (done) {
            body.email = 'bm639@gmail.com'
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })

        it('should respond with 400 when provided with valid JWT and email but incorrect old password', function (done) {
            body.oldPassword = 'p4$$WordZ'
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })

        it('should respond with 400 when provided with valid JWT and email but invalid old password', function (done) {
            body.oldPassword = 'password'
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })

        it('should respond with 400 when provided with valid JWT, email, old password but new passwords do not match', function (done) {
            body.newPassword = 'p4$$Word'
            body.confirmPassword = 'P4$$Word'
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })

        it('should respond with 400 when provided with valid JWT, email, old password but new password is not valid', function (done) {
            body.newPassword = 'password'
            body.confirmPassword = 'password'
            chai.request(server).put('/account/change-password').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end((req, res) => {
                chai.expect(res.status).to.be.eq(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('message')
                done()
            })
        })
    })
})
