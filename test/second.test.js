let chai = require('chai');
let chaiHttp =  require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

describe('Testing users Api', () => {
    it('Should return 200 for users', (done) => {
        chai.request('http://127.0.0.1:8654')
        .get('/users')
        .then((res) =>{
            expect(res).to.have.status(200);
            done();
        })
        .catch((err) => {
            throw err
        })
    })
})

describe('Testing users/:id Api', () => {
    it('Should return 200 for users/:id', (done) => {
        chai.request('http://127.0.0.1:8654')
        .get('/users/:id')
        .then((res) =>{
            expect(res).to.have.status(200);
            done();
        })
        .catch((err) => {
            throw err
        })
    })
})

describe('Testing user Api', () => {
    it('Should return 404 for users Api', (done) => {
        chai.request('http://127.0.0.1:8654')
        .get('/user')
        .then((res) =>{
            expect(res).to.have.status(404);
            done();
        })
        .catch((err) => {
            throw err
        })
    })
})

describe('Testing adduser Api', () => {
    it('Should return 200 for adduser Api', (done) => {
        chai.request('http://127.0.0.1:8654')
        .post('/addUser')
        .send({"name":"Testing User1","isActive":true})
        .then((res) =>{
            expect(res).to.have.status(200);
            done();
        })
        .catch((err) => {
            throw err
        })
    })
})

