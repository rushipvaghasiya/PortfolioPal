const sendMail = require('../utils/email');

module.exports = {
  checkPrice: (userName, userEmail, category, currentStockPrice, alertPrice, companyName) => {
    const SUBJECT = `${companyName} has reached at ${category} alertPrice`;
    const TEXT = `The stock price of ${companyName} has reached @${currentStockPrice}`;
    const HTML = `The stock price of ${companyName} has reached @${currentStockPrice} 🤑`;

    if (category === 'High' && currentStockPrice >= alertPrice) {
      sendMail(userName, userEmail, SUBJECT, TEXT, HTML);
      return true;
    }
    if (category === 'Low' && currentStockPrice <= alertPrice) {
      sendMail(userName, userEmail, SUBJECT, TEXT, HTML);
      return true;
    }
    return false;
  },
  sendMailForGetToken: (userName, userEmail, resetUrl) => {
    const SUBJECT = 'Reset your password';
    const TEXT = `Click ${resetUrl} to reset your password`;
    const HTML = `Click <a href="${resetUrl}">here</a> to reset your password`;
    const isMailSent = sendMail(userName, userEmail, SUBJECT, TEXT, HTML);
    if (isMailSent) {
      return true;
    }
    return false;
  }
};
