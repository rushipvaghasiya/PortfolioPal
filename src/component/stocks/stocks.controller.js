const stocksService = require('./stocks.service');

module.exports = {
  searchStock: async (req, res, next) => {
    const { symbol } = req.query;
    try {
      const responseBody = await stocksService.searchStockService(symbol);
      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  addStock: async (req, res, next) => {
    const { symbol } = req.query;
    const { userId } = req.user;
    const { companyName } = req.body;
    try {
      await stocksService.addStockService(userId, symbol, companyName);
      res.status(200).json({ message: 'Successfully new stock added' });
    } catch (error) {
      next(error);
    }
  },
  stockChart: async (req, res, next) => {
    const { symbol } = req.query;
    try {
      const responseBody = await stocksService.stockChartService(symbol);
      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  getStocks: async (req, res, next) => {
    const { userId } = req.user;
    try {
      const responseBody = await stocksService.getStocksService(userId);
      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  getStockAnalysis: async (req, res, next) => {
    const { symbol } = req.query;
    try {
      const responseBody = await stocksService.getStockAnalysisService(symbol);
      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  deleteStock: async (req, res, next) => {
    const { symbol } = req.query;
    const { userId } = req.user;
    try {
      await stocksService.deleteStockService(userId, symbol);
      res.status(200).json({ message: 'Stock successfully deleted' });
    } catch (error) {
      next(error);
    }
  },
  addTrigger: async (req, res, next) => {
    const { stockId } = req.params;
    const { category, alertPrice } = req.body;
    try {
      await stocksService.addTriggerService(stockId, category, alertPrice);
      res.status(200).json({ message: 'Successfully trigger added' });
    } catch (error) {
      next(error);
    }
  },
  getTriggers: async (req, res, next) => {
    try {
      const responseBody = await stocksService.getTriggersService();
      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  deleteTrigger: async (req, res, next) => {
    const { stockId } = req.params;
    try {
      await stocksService.deleteTriggerService(stockId);
      res.status(200).json({ message: 'Successfully trigger deleted' });
    } catch (error) {
      next(error);
    }
  }
};
