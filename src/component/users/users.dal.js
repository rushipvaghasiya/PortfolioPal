module.exports = {
  registerDal: async (dbClient, userName, userEmail, hashPassword) => {
    const sqlQuery = `
    INSERT
      INTO
      Users ("userName",
      "userEmail",
      "userPassword",
      "resetToken",
      "resetTokenExpireAt")
    VALUES ($1, $2, $3, NULL, NULL)`;
    const parameters = [userName, userEmail, hashPassword];
    const queryResult = await dbClient.query(sqlQuery, parameters);
    return queryResult.rows[0];
  },
  getUserDal: async (dbClient, userEmail) => {
    const sqlQuery = `
      SELECT
        "userId",
        "userName",
        "userEmail",
        "userPassword"
      FROM
        Users
      WHERE
        "userEmail" = $1`;
    const parameters = [userEmail];
    const queryResult = await dbClient.query(sqlQuery, parameters);
    return queryResult.rows[0];
  },
  updateUserResetData: async (dbClient, token, expiresAt, userEmail) => {
    const sqlQuery = `
    UPDATE 
      users 
    SET 
      "resetToken" = $1, 
      "resetTokenExpireAt" = $2 
    WHERE "userEmail" = $3`;
    const parameters = [token, expiresAt, userEmail];
    const queryResult = await dbClient.query(sqlQuery, parameters);
    return queryResult.rows[0];
  },
  resetPasswordDal: async (dbClient, token) => {
    const sqlQuery = `
    SELECT 
      "userName",
      "userEmail",
      "userPassword", 
      "resetToken", 
      "resetTokenExpireAt" 
    FROM 
      users 
    WHERE 
      "resetToken" = $1`;
    const parameters = [token];
    const queryResult = await dbClient.query(sqlQuery, parameters);
    return queryResult.rows[0];
  },
  updateUserPasswordDal: async (dbClient, hashedPassword, userEmail) => {
    const sqlQuery = `
    UPDATE 
      users 
    SET 
      "userPassword" = $1, 
      "resetToken" = NULL, 
      "resetTokenExpireAt" = NULL
    WHERE 
      "userEmail" = $2`;
    const parameters = [hashedPassword, userEmail];
    const queryResult = await dbClient.query(sqlQuery, parameters);
    return queryResult.rows[0];
  }
};
