const express = require('express');
const stocksController = require('./stocks.controller');
const { validate } = require('../../lib/expressValidation');
const validation = require('./stocks.validation');
const { auth } = require('../../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /stocks/searchStock:
 *   get:
 *     tags:
 *       - stocks
 *     summary: To return all available stocks' names and symbols.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         required: true
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AFISX
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#searchStock'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/searchStock')
  .get(
    auth,
    validate(validation.searchStock),
    stocksController.searchStock
  );

/**
 * @swagger
 * /stocks/addStock:
 *   post:
 *     tags:
 *       - stocks
 *     summary: To add new stock
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         required: true
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AFISX
 *       - in: body
 *         required: true
 *         name: companyName
 *         schema:
 *           $ref: 'components/stocks/req.json#addStock'
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#addStock'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/addStock')
  .post(
    auth,
    validate(validation.addStock),
    stocksController.addStock
  );

/**
 * @swagger
 * /stocks/stock-chart:
 *   get:
 *     tags:
 *       - stocks
 *     summary: To return history of all stocks
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         required: true
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AFISX
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#stock-chart'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/stock-chart')
  .get(
    auth,
    validate(validation.stockChart),
    stocksController.stockChart
  );

/**
 * @swagger
 * /stocks/getStocks:
 *   get:
 *     tags:
 *       - stocks
 *     summary: To return all existing stocks
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#getStocks'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/getStocks')
  .get(
    auth,
    stocksController.getStocks
  );

/**
 * @swagger
 * /stocks/getStockAnalysis/{symbol}:
 *   get:
 *     tags:
 *       - stocks
 *     summary: To return analysis of a particular stock
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         required: true
 *         name: symbol
 *         schema:
 *           type: string
 *           example: HMCA
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#getStockAnalysis'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/getStockAnalysis')
  .get(
    auth,
    validate(validation.getStockAnalysis),
    stocksController.getStockAnalysis
  );

/**
 * @swagger
 * /stocks/deleteStock/{symbol}:
 *   delete:
 *     tags:
 *       - stocks
 *     summary: To delete a particular stock
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         required: true
 *         name: symbol
 *         schema:
 *           type: string
 *           example: AFISX
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#deleteStock'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/deleteStock')
  .delete(
    auth,
    validate(validation.deleteStock),
    stocksController.deleteStock
  );

/**
 * @swagger
 * /stocks/addTrigger/{stockId}:
 *   post:
 *     tags:
 *       - stocks
 *     summary: To add a new trigger on a stock
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         required: true
 *         name: stockId
 *         schema:
 *           type: integer
 *           example: 3
 *       - in: body
 *         required: true
 *         name: body
 *         schema:
 *           $ref: 'components/stocks/req.json#addTrigger'
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#addTrigger'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/addTrigger/:stockId')
  .post(
    auth,
    validate(validation.addTrigger),
    stocksController.addTrigger
  );

/**
 * @swagger
 * /stocks/getTriggers:
 *   get:
 *     tags:
 *       - stocks
 *     summary: To get all triggers
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#getTriggers'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/getTriggers')
  .get(
    auth,
    stocksController.getTriggers
  );

/**
 * @swagger
 * /stocks/deleteTrigger/{stockId}:
 *   delete:
 *     tags:
 *       - stocks
 *     summary: To delete a trigger
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         required: true
 *         name: stockId
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/stocks/res.json#deleteTrigger'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
router.route('/deleteTrigger/:stockId')
  .delete(
    auth,
    validate(validation.deleteTrigger),
    stocksController.deleteTrigger
  );
module.exports = router;
