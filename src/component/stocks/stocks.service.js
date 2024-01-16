const stocksDal = require('./stocks.dal');
const { dbConnPool } = require('../../../config/db.config');
const { apiKey, apiKeyExtra } = require('../../../config/index');
const helper = require('../../helper/index');

module.exports = {
  searchStockService: async (symbol) => {
    const URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${apiKey}`;
    const response = await fetch(URL);
    const data = await response.json();
    if (!data) {
      throw new Error('NOT_FOUND');
    }
    const result = data.bestMatches.map(item => ({
      symbol: item['1. symbol'],
      companyName: item['2. name']
    }));

    return result;
  },

  addStockService: async (userId, symbol, companyName) => {
    const dbClient = await dbConnPool.connect();
    try {
      const URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(URL);
      const data = await response.json();
      if (!data) {
        throw new Error('NOT_FOUND');
      }
      const price = Math.round(Number(data['Global Quote']['05. price']));
      const open = Math.round(Number(data['Global Quote']['02. open']));
      const high = Math.round(Number(data['Global Quote']['03. high']));
      const low = Math.round(Number(data['Global Quote']['04. low']));

      const columns = {
        userId, symbol, companyName, price, open, high, low
      };
      await stocksDal.addStockDal(dbClient, columns);
    } finally {
      dbClient.release();
    }
  },

  stockChartService: async (symbol) => {
    const URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&TIME_SERIES_DAILY_ADJUSTED&apikey=${apiKey}`;
    const response = await fetch(URL);
    const data = await response.json();
    if (!data) {
      throw new Error('NOT_FOUND');
    }
    const storeData = [];
    const symbolName = data['Meta Data']['2. Symbol'];
    const timeSeries = data['Time Series (Daily)'];

    Object.keys(timeSeries).forEach(date => {
      const temp = { date, open: timeSeries[date]['1. open'], close: timeSeries[date]['4. close'] };
      storeData.push(temp);
    });
    const result = [{ symbolName, dateWise: storeData }];
    return result;
  },

  getStocksService: async (userId) => {
    const dbClient = await dbConnPool.connect();
    try {
      const result = await stocksDal.getStocksDal(dbClient, userId);
      return result;
    } finally {
      dbClient.release();
    }
  },

  getStockAnalysisService: async (symbol) => {
    const URL = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKeyExtra}`;
    const response = await fetch(URL);
    const data = await response.json();
    if (!data) {
      throw new Error('NOT_FOUND');
    }
    const storeData = [];
    const temp = {
      '10DayAverageTradingVolume': data.metric['10DayAverageTradingVolume'],
      '3MonthAverageTradingVolume': data.metric['3MonthAverageTradingVolume'],
      '52WeekHigh': data.metric['52WeekHigh'],
      '52WeekHighDate': data.metric['52WeekHighDate'],
      '52WeekLow': data.metric['52WeekLow'],
      '52WeekLowDate': data.metric['52WeekLowDate']
    };
    storeData.push(temp);
    return storeData;
  },

  deleteStockService: async (userId, symbol) => {
    const dbClient = await dbConnPool.connect();
    try {
      await stocksDal.deleteStockDal(dbClient, userId, symbol);
    } finally {
      dbClient.release();
    }
  },

  addTriggerService: async (stockId, category, alertPrice) => {
    const dbClient = await dbConnPool.connect();
    try {
      await stocksDal.addTriggerDal(dbClient, stockId, category, alertPrice);
    } finally {
      dbClient.release();
    }
  },

  getTriggersService: async () => {
    const dbClient = await dbConnPool.connect();
    try {
      const result = await stocksDal.getTriggersDal(dbClient);
      return result;
    } finally {
      dbClient.release();
    }
  },

  sendMailService: async () => {
    const dbClient = await dbConnPool.connect();
    try {
      const triggerData = await stocksDal.getTriggersDal(dbClient);
      if (triggerData) {
        await Promise.all(triggerData.map(async item => {
          const {
            stockId, symbol, companyName, category, alertPrice, userName, userEmail
          } = item;
          const URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
          const response = await fetch(URL);
          const data = await response.json();
          const currentStockPrice = Math.round(Number(data['Global Quote']['05. price']));
          const result = await helper.checkPrice(
            userName,
            userEmail,
            category,
            currentStockPrice,
            alertPrice,
            companyName,
          );
          if (result) {
            await stocksDal.deleteTriggerDal(dbClient, stockId);
          }
        }));
      }
    } finally {
      dbClient.release();
    }
  },

  deleteTriggerService: async (stockId) => {
    const dbClient = await dbConnPool.connect();
    try {
      await stocksDal.deleteTriggerDal(dbClient, stockId);
    } finally {
      dbClient.release();
    }
  }
};
