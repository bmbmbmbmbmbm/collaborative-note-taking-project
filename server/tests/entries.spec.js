const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJibTYzOSIsImlhdCI6MTY1OTI2NDA2MX0.u27LRIIphhn0DM53LkSY7X-5lSljFhb7CoQ1gDQzqEI";

const entry = [{ "type": "heading-one", "children": [{ "text": "Rendering Custom Elements" }] }, { "type": "paragraph", "children": [{ "text": "Adding in HTML elements to the document requires providing a series of renderers for each element. These are simple React components that return small amounts of HTML, that being usually the tag in question to be rendered, although some of these tags may need additional tags for the sake of functionality, in particular images. Images amongst other more complex tags will be discussed later as they require additional changes to be made to the editor object to function." }] }, { "url": "https://i.imgur.com/IndaSg8.png", "type": "image", "children": [{ "text": "" }] }, { "type": "paragraph", "children": [{ "text": "Figure 5.1 displays the function that does this within the entry creator file found in the client portion of the project. It requires the attributes parameter for the given tag, these are attributes that are required by Slate to handle both rendering them alongside allowing editable text; the children parameter, this is essentially the text content for the element; the element parameter, this is an element from the document JSON list, in which the type is used to determine what element to render within the switch. The default option is to display the text within a paragraph tag if no type is specified." }] }]
var body;

describe('Entry API Tests:', function () {
    describe('Testing /entry/create route', function () {
        this.beforeEach(function () {
            body = {
                title: 'This is a test',
                entry: entry,
                unitCode: 'GENERAL',
                private: false,
            }
        });

        it('should respond 200 when provided with a valid JWT and body', function (done) {
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('id');
                done();
            })
        })

        it('should respond 400 when provided with a valid JWT and an invalid title', function (done) {
            body.title = ""
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when provided with a valid JWT and a title containing illegal characters and at least one letter', function (done) {
            body.title = "\0\x08\x09\x1a\n\r\"'\\%a"
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('id');
                done();
            })
        })

        it('should respond 400 when provided with a valid JWT and a title containing only illegal characters', function (done) {
            body.title = "\0\x08\x09\x1a\n\r\"'\\%"
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when provided with a valid JWT when entry has invalid JSON properties', function (done) {
            body.entry = [{}]
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when provided with an entry that is not an array', function (done) {
            body.entry = {}
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when provided entry that has correct structure but incorrect types for type property', function (done) {
            body.entry = [{ "type": function () { return "bad" }, "children": [{ "text": "this is a test" }] }]
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when provided entry that has correct structure but incorrect types for type property', function (done) {
            body.entry = [{ "type": "this is a test", "children": [{ "text": function () { return "uh oh" } }] }]
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry with incorrect types for children properties', function (done) {
            body.entry = [{ "type": "this is a test", "children": function () { return "bad stuff" } }]
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when providing entry with illegal characters in text property', function (done) {
            body.entry = [{ "type": "this is a test", "children": [{ "text": "\0\x08\x09\x1a\n\r\"'\\%" }] }]
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('id');
                done();
            })
        })

        it('should respond 200 when providing entry with illegal characters in type property', function (done) {
            body.entry = [{ "type": "\0\x08\x09\x1a\n\r\"'\\%", "children": [{ "text": "this is a test" }] }]
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('id');
                done();
            })
        })

        it('should respond 400 when provided with invalid unit', function (done) {
            body.unitCode = '';
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when provided if unit does not exist', function (done) {
            body.unitCode = 'AW350ME';
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when provided if private is not a boolean', function (done) {
            body.private = 'not a boolean';
            chai.request(server).post('/entry/create').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/update', function () {
        this.beforeEach(function () {
            body = {
                entryId: 13,
                entry: entry,
            }
        });

        it('should respond 200 when provided with JWT and valid data', function (done) {
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry with incorrect types for text properties', function (done) {
            body.entry = [{ "type": "this is a test", "children": [{ "text": function () { return "uh oh" } }] }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry with incorrect types for type properties', function (done) {
            body.entry = [{ "type": function () { return "bad" }, "children": [{ "text": "this is a test" }] }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry with incorrect types for children properties', function (done) {
            body.entry = [{ "type": "this is a test", "children": function () { return "bad stuff" } }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry which is not an array', function (done) {
            body.entry = { "type": "this is a test", "children": function () { return "bad stuff" } }
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry when type property does not exist', function (done) {
            body.entry = [{ "not-type": "this is a test", "children": [{ "text": "this is a test" }] }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry when children property does not exist', function (done) {
            body.entry = [{ "type": "this is a test", "not-children": [{ "text": "this is a test" }] }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when providing entry when children and type do not exist but text does', function (done) {
            body.entry = [{ "text": "this is a test" }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when entry identifier is invalid', function (done) {
            body.entryId = -1;
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when entry identifier is valid but has no entry', function (done) {
            body.entryId = 2147483647;
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when type property contains illegal characters', function (done) {
            body.entry = [{ "type": "\0\x08\x09\x1a\n\r\"'\\%", "children": [{ "text": "this is a test" }] }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when text property contains illegal characters', function (done) {
            body.entry = [{ "type": "this is a test", "children": [{ "text": "\0\x08\x09\x1a\n\r\"'\\%" }] }]
            chai.request(server).put('/entry/update/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing Entry Get Edits', function () {

    })

    describe('Testing /entry/create-edit/ route', function () {
        this.beforeEach(function () {
            body = {
                entryId: 13,
                entry: entry,
            }
        });

        it('should respond 200 when entry identifier is correct and has an entry', function (done) {
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry with incorrect types for text properties', function (done) {
            body.entry = [{ "type": "this is a test", "children": [{ "text": function () { return "uh oh" } }] }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry with incorrect types for type properties', function (done) {
            body.entry = [{ "type": function () { return "bad" }, "children": [{ "text": "this is a test" }] }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry with incorrect types for children properties', function (done) {
            body.entry = [{ "type": "this is a test", "children": function () { return "bad stuff" } }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry which is not an array', function (done) {
            body.entry = { "type": "this is a test", "children": function () { return "bad stuff" } }
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry when type property does not exist', function (done) {
            body.entry = [{ "not-type": "this is a test", "children": [{ "text": "this is a test" }] }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when providing entry when children property does not exist', function (done) {
            body.entry = [{ "type": "this is a test", "not-children": [{ "text": "this is a test" }] }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when providing entry when children and type do not exist but text does', function (done) {
            body.entry = [{ "text": "this is a test" }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when entry identifier is invalid', function (done) {
            body.entryId = -1;
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when entry identifier is valid but has no entry', function (done) {
            body.entryId = 2147483647;
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when type property contains illegal characters', function (done) {
            body.entry = [{ "type": "\0\x08\x09\x1a\n\r\"'\\%", "children": [{ "text": "this is a test" }] }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 200 when text property contains illegal characters', function (done) {
            body.entry = [{ "type": "this is a test", "children": [{ "text": "\0\x08\x09\x1a\n\r\"'\\%" }] }]
            chai.request(server).post('/entry/create-edit/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/edit-diff/:id route', function () {
        it('should respond 200 when entry exists', function (done) {
            chai.request(server).get('/entry/edit-diff/13').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('object');
                done();
            })
        })

        it('should respond 400 when entry does not exist', function (done) {
            chai.request(server).get('/entry/edit-diff/20000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when identifier is invalid', function (done) {
            chai.request(server).get('/entry/edit-diff/-13').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when no JWT is provided in authorization header', function (done) {
            chai.request(server).get('/entry/edit-diff/13').set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

    })

    describe('Testing /entry/edit-suggestions/:id', function () {
        it('should respond 200 when entry exists', function (done) {
            chai.request(server).get('/entry/edit-suggestions/13').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should respond 200 when entry does not exist', function (done) {
            chai.request(server).get('/entry/edit-suggestions/20000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should respond 400 when identifier is invalid', function (done) {
            chai.request(server).get('/entry/edit-suggestions/-13').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 when no JWT is provided in authorization header', function (done) {
            chai.request(server).get('/entry/edit-suggestions/13').set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/edit/:id route', function () {
        it('should respond 200 provided valid JWT and entry identifier', function (done) {
            chai.request(server).get('/entry/edit/13').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('object');
                done();
            })
        })

        it('should respond 400 if the entry does not exist', function (done) {
            chai.request(server).get('/entry/edit/20000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 if the entry identifier is invalid', function (done) {
            chai.request(server).get('/entry/edit/-20000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/view/:id route', function () {
        it('should respond 200 with the entry if the id is valid and it is public', function (done) {
            chai.request(server).get('/entry/view/13').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('object');
                done();
            })
        })

        it('should respond 400 if the entry is private', function (done) {
            chai.request(server).get('/entry/view/14').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 if the entry does not exist', function (done) {
            chai.request(server).get('/entry/view/200000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should respond 400 if the entry identifier is invalid', function (done) {
            chai.request(server).get('/entry/view/-200000').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/view-all/:id route', function () {
        it('should return 200 and entry information when user requesting is the same as asked for', function (done) {
            chai.request(server).get('/entry/view-all/bm639').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should return 400 when user requesting is not the same as asked for', function (done) {
            chai.request(server).get('/entry/view-all/ad245').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 when username is invalid', function (done) {
            chai.request(server).get('/entry/view-all/ooooo').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/public/:id route', function () {
        it('should return 200 when username is valid', function (done) {
            chai.request(server).get('/entry/public/bm639').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should return 200 when username is valid but does not exist', function (done) {
            chai.request(server).get('/entry/public/bm639').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should return 400 when username is invalid', function (done) {
            chai.request(server).get('/entry/public/ooooo').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/:id/view', function () {
        it('should return 200 and entry list if unit exists', function (done) {
            chai.request(server).get('/entry/CM30225/view').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.be.an('array');
                done();
            })
        })

        it('should return 400 if unitcode is valid but does not exist', function (done) {
            chai.request(server).get('/entry/AA30225/view').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if unitcode is invalid', function (done) {
            chai.request(server).get('/entry/aaaaaaa/view').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/add-reply/ route', function () {
        this.beforeEach(function() {
            body = {
                content: "this is a comment",
                entryId: 13,
                commentId: 14,
            }
        })

        it('should return 200 if valid entry identifier, comment identifier and valid content are provided', function (done) {
            chai.request(server).post('/entry/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 200 if valid entry identifier and valid content are provided', function (done) {
            body.commentId = -1;
            chai.request(server).post('/entry/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if valid thread identifier and content contains illegal character', function (done) {
            body.content = "\0\x08\x09\x1a\n\r\"'\\%"
            chai.request(server).post('/entry/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if valid entry identifier and valid content are provided', function (done) {
            body.commentId = -1;
            chai.request(server).post('/entry/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })

        it('should return 400 if entry does not exist (with comment)', function (done) {
            body.entryId = 200000;
            chai.request(server).post('/entry/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    
        it('should return 400 if entry does not exist (without comment)', function (done) {
            body.entryId = 200000;
            body.commentId = -1;
            chai.request(server).post('/entry/add-reply/').set('authorization', JWT).set('Content-Type', 'application/json').send(body).end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })

    describe('Testing /entry/view/:id/replies', function () {
        it('should return 200 if entry exists', function (done) {
            chai.request(server).get('/entry/view/13/replies').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('comments');
                chai.expect(res.body).to.have.property('replies');
                done();
            })
        })

        it('should return 200 if entry does not exist', function (done) {
            chai.request(server).get('/entry/view/20000/replies').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(200);
                chai.expect(res.body).to.have.property('comments');
                chai.expect(res.body).to.have.property('replies');
                done();
            })
        })

        it('should return 200 if entry exists', function (done) {
            chai.request(server).get('/entry/view/-1/replies').set('authorization', JWT).set('Content-Type', 'application/json').end(function (req, res) {
                chai.expect(res.status).to.be.eq(400);
                chai.expect(res.body).to.have.property('message');
                done();
            })
        })
    })
})