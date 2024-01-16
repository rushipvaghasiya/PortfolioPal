const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app');

const { expect } = chai;

chai.use(chaiHttp);

describe('Testing stocks routes', () => {
  let token;
  describe('Testing /portfolio/users routes', () => {
    describe('Testing /portfolio/users/login', () => {
      let sampleUserVal;
      before(() => {
        sampleUserVal = {
          userEmail: 'FirstUser@gmail.com',
          userPassword: 'FirstUser@123'
        };
      });
      it('GET /portfolio/users/login should successfully return token', async () => chai.request(app)
        .get('/portfolio/users/login')
        .send(sampleUserVal)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('refreshToken');
          expect(res.body).to.be.an('object');
          token = res.body.token;
        }));
    });
  });

  describe('Testing /portfolio/stocks routes', () => {
    describe('Testing /portfolio/stocks/searchStock', () => {
      it(
        'GET /portfolio/stocks/searchStock should return validation error',
        async () => chai.request(app)
          .get('/portfolio/stocks/searchStock?symbol=')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );

      it('GET /portfolio/stocks/searchStock should return Invalid Authentication error.', async () => chai.request(app)
        .get('/portfolio/stocks/searchStock?symbol=yuk')
        .set('Authorization', `${token}12`)
        .then((res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('code');
          expect(res.body).to.have.property('message');
        }));

      it(
        'GET /portfolio/stocks/searchStock should successfully return stocks symbol and name',
        async () => chai.request(app)
          .get('/portfolio/stocks/searchStock?symbol=YUK')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
          })
      );
    });

    describe('Testing /portfolio/stocks/addStock', () => {
      let stockModel;
      beforeEach(() => {
        stockModel = {
          companyName: 'AMERICAFIRST SEASONAL ROTATION FUND CLASS I'
        };
      });
      it(
        'POST /portfolio/stocks/addStock should return validation error',
        async () => chai.request(app)
          .post('/portfolio/stocks/addStock/xyz')
          .set('Authorization', token)
          .send(stockModel)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );

      it(
        'POST /portfolio/stocks/addStock should return Invalid Authentication error',
        async () => chai.request(app)
          .post('/portfolio/stocks/addStock/11?symbol=AMC')
          .set('Authorization', `${token}12`)
          .send(stockModel)
          .then((res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'POST /portfolio/stocks/addStock should successfully add stock',
        async () => chai.request(app)
          .post('/portfolio/stocks/addStock/11?symbol=AMC')
          .set('Authorization', token)
          .send(stockModel)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'POST /portfolio/stocks/addStock should return conflict error',
        async () => chai.request(app)
          .post('/portfolio/stocks/addStock/11?symbol=AMC')
          .set('Authorization', token)
          .send(stockModel)
          .then((res) => {
            expect(res.status).to.equal(409);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );
    });

    describe('Testing /portfolio/stocks/stock-chart', () => {
      it(
        'GET /portfolio/stocks/stock-chart should successfully return validation error',
        async () => chai.request(app)
          .get('/portfolio/stocks/stock-chart?')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );

      it('GET /portfolio/stocks/stock-chart should return Invalid Authentication error.', async () => chai.request(app)
        .get('/portfolio/stocks/stock-chart?symbol=ADANIPOWER.BSE')
        .set('Authorization', `${token}12`)
        .then((res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('code');
          expect(res.body).to.have.property('message');
        }));

      it('GET /portfolio/stocks/stock-chart should successfully return stock chart', async () => chai.request(app)
        .get('/portfolio/stocks/stock-chart?symbol=AMC')
        .set('Authorization', token)
        .then((res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
        }));
    });

    describe('Testing /portfolio/stocks/getStocks', () => {
      it(
        'GET /portfolio/stocks/getStocks should successfully return validation error',
        async () => chai.request(app)
          .get('/portfolio/stocks/getStocks/abc')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );

      it(
        'GET /portfolio/stocks/getStocks should return Invalid Authentication error.',
        async () => chai.request(app)
          .get('/portfolio/stocks/getStocks/11')
          .set('Authorization', `${token}12`)
          .then((res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'GET /portfolio/stocks/getStocks should successfully return stocks',
        async () => chai.request(app)
          .get('/portfolio/stocks/getStocks/11')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
          })
      );
    });

    describe('Testing /portfolio/stocks/addTrigger', () => {
      let addTriggerModel;
      beforeEach(() => {
        addTriggerModel = {
          category: 'High',
          alertPrice: 2
        };
      });
      it(
        'POST /portfolio/stocks/addTrigger should return Validation error',
        async () => chai.request(app)
          .post('/portfolio/stocks/addTrigger/abc')
          .set('Authorization', token)
          .send(addTriggerModel)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('errors').to.be.an('array');
          })
      );

      it(
        'POST /portfolio/stocks/addTrigger should return Invalid Authentication error.',
        async () => chai.request(app)
          .post('/portfolio/stocks/addTrigger/40')
          .set('Authorization', `${token}12`)
          .send(addTriggerModel)
          .then((res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'POST /portfolio/stocks/addTrigger should successfully Add trigger',
        async () => chai.request(app)
          .post('/portfolio/stocks/addTrigger/40')
          .set('Authorization', token)
          .send(addTriggerModel)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
          })
      );

      it('POST /portfolio/stocks/addTrigger  should return Conflict error', async () => chai.request(app)
        .post('/portfolio/stocks/addTrigger/40')
        .set('Authorization', token)
        .send(addTriggerModel)
        .then((res) => {
          expect(res.status).to.equal(409);
          expect(res.body).to.have.property('code');
          expect(res.body).to.have.property('message');
        }));
    });

    describe('Testing /portfolio/stocks/deleteTrigger', () => {
      it(
        'DELETE /portfolio/stocks/deleteTrigger should successfully return validation error',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteTrigger/abc')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );

      it(
        'DELETE /portfolio/stocks/deleteTrigger should return Invalid Authentication error',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteTrigger/40')
          .set('Authorization', `${token}12`)
          .then((res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'DELETE /portfolio/stocks/deleteTrigger should return Not Found error',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteTrigger/1500')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'DELETE /portfolio/stocks/deleteTrigger should successfully Delete stock',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteTrigger/40')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );
    });

    describe('Testing /portfolio/stocks/deleteStock', () => {
      it(
        'DELETE /portfolio/stocks/deleteStock should successfully return validation error',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteStock/abc?')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );

      it(
        'DELETE /portfolio/stocks/deleteStock should return Invalid Authentication error.',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteStock/11?symbol=AMOVF')
          .set('Authorization', `${token}12`)
          .then((res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'DELETE /portfolio/stocks/deleteStock should return Not Found error',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteStock/150?symbol=XYZ')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
          })
      );

      it(
        'DELETE /portfolio/stocks/deleteStock should successfully Delete stock',
        async () => chai.request(app)
          .delete('/portfolio/stocks/deleteStock/11?symbol=AMC')
          .set('Authorization', token)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
          })
      );
    });
  });
});
