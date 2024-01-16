module.exports = {
  addStockDal: async (dbClient, columns) => {
    const sqlQuery = `
    INSERT INTO stocks(
      "userId", symbol, "companyName", price, 
      "open", "high", "low"
    ) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7)`;
    const parameters = [
      columns.userId,
      columns.symbol,
      columns.companyName,
      columns.price,
      columns.open,
      columns.high,
      columns.low
    ];
    const result = await dbClient.query(sqlQuery, parameters);
    return result.rows[0];
  },

  getStocksDal: async (dbClient, userId) => {
    const sqlQuery = `
    SELECT 
      stocks."stockId",
      stocks.symbol, 
      stocks."companyName", 
      stocks.price, 
      stocks.open, 
      stocks.high, 
      stocks.low, 
      stocks."createAt" 
    FROM 
      stocks 
    WHERE 
      stocks."userId" = $1;
    `;
    const parameter = [userId];
    const result = await dbClient.query(sqlQuery, parameter);
    return result.rows;
  },

  deleteStockDal: async (dbClient, userId, symbol) => {
    const sqlQuery = `
    DELETE FROM 
      stocks 
    WHERE
      stocks."userId" = $1
    AND   
      stocks.symbol = $2
    `;
    const parameters = [userId, symbol];
    const result = await dbClient.query(sqlQuery, parameters);
    if (!result.rowCount) {
      throw new Error('USER_NOT_FOUND');
    }
    return result.rows[0];
  },

  addTriggerDal: async (dbClient, stockId, category, alertPrice) => {
    const sqlQuery = `
     INSERT INTO triggers(
        "stockId", "category", "alertPrice"
      ) 
      VALUES 
        ($1, $2, $3);
     `;
    const parameters = [stockId, category, alertPrice];
    const result = await dbClient.query(sqlQuery, parameters);
    return result.rows[0];
  },

  getTriggersDal: async (dbClient) => {
    const sqlQuery = `
    SELECT
      triggers."triggerId",
      triggers."stockId",
      triggers."category",
      triggers."alertPrice",
      stocks.symbol,
      stocks."companyName",
      users."userName",
      users."userEmail"
    FROM
      triggers
    JOIN stocks ON triggers."stockId" = stocks."stockId"
    JOIN users ON users."userId" = stocks."userId";
    `;
    const result = await dbClient.query(sqlQuery);
    return result.rows;
  },

  deleteTriggerDal: async (dbClient, stockId) => {
    const sqlQuery = `
    DELETE FROM 
      triggers 
    WHERE 
      triggers."stockId" = $1;
    `;
    const parameter = [stockId];
    const result = await dbClient.query(sqlQuery, parameter);
    if (!result.rowCount) {
      throw new Error('USER_NOT_FOUND');
    }
    return result.rows;
  }
};
