const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app');

const { expect } = chai;

chai.use(chaiHttp);

describe('Testing users routes', () => {
  let token;
  let refreshToken;
  describe('Testing /portfolio/users routes', () => {
    describe('Testing /portfolio/users/register', () => {
      let registerModel;
      let registerWrongModel;
      beforeEach(() => {
        registerModel = {
          userName: 'lastUser',
          userEmail: 'lastUser@gmail.com',
          userPassword: 'lastUser@123'
        };
        registerWrongModel = {
          userName: 'lastUser',
          userEmail: 'lastUser@gmail.com'
        };
      });

      it(
        'POST /portfolio/users/register should return Validation error',
        async () => chai.request(app)
          .post('/portfolio/users/register')
          .send(registerWrongModel)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );

      it(
        'POST /portfolio/users/register should successfully Register user',
        async () => chai.request(app)
          .post('/portfolio/users/register')
          .send(registerModel)
          .then((res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'POST /portfolio/users/register should return Conflict error',
        async () => chai.request(app)
          .post('/portfolio/users/register')
          .send(registerModel)
          .then((res) => {
            expect(res.status).to.equal(409);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );
    });
    describe('Testing /portfolio/users/login', () => {
      let loginModel;
      let loginWrongModel;
      beforeEach(() => {
        loginModel = {
          userEmail: 'lastUser@gmail.com',
          userPassword: 'lastUser@123'
        };
        loginWrongModel = {
          userEmail: 'lastUser@gmail.com'
        };
      });

      it(
        'GET /portfolio/users/login should return Validation error',
        async () => chai.request(app)
          .get('/portfolio/users/login')
          .send(loginWrongModel)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );

      it(
        'GET /portfolio/users/login should successfully return token',
        async () => chai.request(app)
          .get('/portfolio/users/login')
          .send(loginModel)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('token');
            expect(res.body).to.have.property('refreshToken');
            expect(res.body).to.be.an('object');
            token = res.body.token;
            refreshToken = res.body.refreshToken;
          })
      );
    });
    describe('Testing /portfolio/users/token', () => {
      let tokenModel;
      let tokenWrongModel;
      let tokenWrongValidationModel;
      beforeEach(() => {
        tokenModel = {
          userName: 'lastUser',
          userEmail: 'lastUser@gmail.com',
          refreshToken
        };
        tokenWrongModel = {
          userName: 'wrongUser',
          userEmail: 'wrongUser@gmail.com',
          refreshToken
        };
        tokenWrongValidationModel = {
          userName: 'lastUser',
          userEmail: 'lastUser@gmail.com',
        };
      });
      it(
        'GET /portfolio/users/token should return Validation error',
        async () => chai.request(app)
          .get('/portfolio/users/token')
          .send(tokenWrongValidationModel)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );
      it(
        'GET /portfolio/users/token should return Not found error',
        async () => chai.request(app)
          .get('/portfolio/users/token')
          .send(tokenWrongModel)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );
      it(
        'GET /portfolio/users/token should successfully return token',
        async () => chai.request(app)
          .get('/portfolio/users/token')
          .send(tokenModel)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
            expect(res.body).to.be.an('object');
          })
      );
    });
    describe('Testing /portfolio/users/forgot', () => {
      let forgotModel;
      let forgotWrongModel;
      let forgotWrongValidationModel;
      beforeEach(() => {
        forgotModel = {
          userEmail: 'lastUser@gmail.com'
        };
        forgotWrongModel = {
          userEmail: 'wrongUser@gmail.com'
        };
        forgotWrongValidationModel = {};
      });
      it(
        'GET /portfolio/users/forgot should return Validation error',
        async () => chai.request(app)
          .get('/portfolio/users/forgot')
          .send(forgotWrongValidationModel)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );

      it(
        'GET /portfolio/users/forgot should return Not found error',
        async () => chai.request(app)
          .get('/portfolio/users/forgot')
          .send(forgotWrongModel)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );
      it(
        'GET /portfolio/users/forgot should successfully return Sent mail',
        async () => chai.request(app)
          .get('/portfolio/users/forgot')
          .send(forgotModel)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );
    });
    describe('Testing /portfolio/users/reset', () => {
      let resetModel;
      let resetWrongValidationModel;
      before(() => {
        resetModel = {
          token: '3RTCHL9BRVQID0K1AKIO0M7XV',
          userPassword: 'Updatedpord@168745'
        };
        resetWrongValidationModel = {};
      });
      it(
        'GET /portfolio/users/reset should return Validation error',
        async () => chai.request(app)
          .get('/portfolio/users/reset')
          .send(resetWrongValidationModel)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );

      it(
        'GET /portfolio/users/reset should successfully password update',
        async () => chai.request(app)
          .get('/portfolio/users/reset')
          .send(resetModel)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );
    });
    describe('Testing /portfolio/users/logout', () => {
      it(
        'GET /portfolio/users/logout should return Invalid Authentication error',
        async () => chai.request(app)
          .get('/portfolio/users/logout')
          .set('Authorization', `${token}12`)
          .then((res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'GET /portfolio/users/logout should successfully Logout user',
        async () => chai.request(app)
          .get('/portfolio/users/logout')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
          })
      );
    });
  });
});
