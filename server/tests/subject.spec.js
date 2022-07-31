const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJibTYzOSIsImlhdCI6MTY1OTI2NDA2MX0.u27LRIIphhn0DM53LkSY7X-5lSljFhb7CoQ1gDQzqEI";
var body;

describe('Subject API Tests:', function () {
    describe('Testing /subject/enrol route', function () {
        this.beforeEach(function () {
            body = {
                units: [
                    {
                        title: "",
                        code: "CM30225"
                    },
                    {
                        title: "",
                        code: "CM30073"
                    },
                    {
                        title: "",
                        code: "CM30082"
                    },
                    {
                        title: "",
                        code: "CM30173"
                    },
                    {
                        title: "",
                        code: "CM30226"
                    },
                    {
                        title: "",
                        code: "CM30078"
                    },
                    {
                        title: "",
                        code: "CM30072"
                    },
                ]
            }
        })

        it('should respond with 200 if unit list is valid', function (done) {
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 200 if unit list removes unit from user', function (done) {
            body.units.length = 4;
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 200 if unit list adds unit to user', function (done) {
            body.units = [...body.units, { title: "", code: "CM10228" }];
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 if unit list has invalid unit', function (done) {
            body.units = [{ title: "", code: "" }]
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 if unit does not have title property', function (done) {
            body.units = [{ code: "CM30072" }]
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 if unit does not have code property', function (done) {
            body.units = [{ title: "" }]
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 if unit code is valid but does not exist', function (done) {
            body.units = [ { title: "", code: "CM99999" }]
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 units is not a list', function (done) {
            body.units = {title: "", title: "CM10228"}
            chai.request(server).post('/subject/enrol').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /subject/get-units/:id route', function () {
        it('should respond with 200 for existing user and provide array of units', function (done) {
            chai.request(server).get('/subject/get-units/bm639').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should respond with 400 when username is invalid', function (done) {
            chai.request(server).get('/subject/get-units/ooooo').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 when username is valid but they do not exist', function (done) {
            chai.request(server).get('/subject/get-units/oo000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /subject/get-subject/:id route', function () {
        it('should respond with 200 when user exists', function (done) {
            chai.request(server).get('/subject/get-subject/bm639').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('object');
                done();
            })
        })

        it('should respond with 400 when username is valid but does not exist', function (done) {
            chai.request(server).get('/subject/get-subject/oo000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 when username is invalid', function (done) {
            chai.request(server).get('/subject/get-subject/ooooo').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /subject/titleof/:id', function () {
        it('should respond with 200 when unit code exists', function (done) {
            chai.request(server).get('/subject/titleof/CM30225').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('object');
                done();
            })
        })

        it('should respond with 400 when unit code is valid but does not exist', function (done) {
            chai.request(server).get('/subject/titleof/aa00000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.be.an('object');
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 when unit code is invalid', function (done) {
            chai.request(server).get('/subject/titleof/aa00000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.be.an('object');
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /subject/:id route', function () {
        it('should respond with 200 when user exists', function (done) {
            chai.request(server).get('/subject/bm639').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should respond with 400 when username is valid but does not exist', function (done) {
            chai.request(server).get('/subject/aa00000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.be.an('object');
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond with 400 when username is invalid', function (done) {
            chai.request(server).get('/subject/ooooooo').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.be.an('object');
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /subject/ route', function () {
        it('should respond with 200 with valid JWT', function (done) {
            chai.request(server).get('/subject/').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should respond with 400 when JWT is invalid', function (done) {
            chai.request(server).get('/subject/').set('authorization', "invalid token").set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.be.an('object');
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })
})