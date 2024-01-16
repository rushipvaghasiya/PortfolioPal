const cron = require('node-cron');
const stocksService = require('../component/stocks/stocks.service');
const { cronJobTime } = require('../constant/index');

const sendEmail = async () => {
  try {
    await stocksService.sendMailService();
  } catch (error) {
    console.info(error);
  }
};

const createCronJob = (tm, task) => {
  const job = cron.schedule(tm, task, {
    scheduled: true,
    timezone: 'UTC'
  });
  return job;
};

const scheduleJob = (tm, task) => {
  const job = createCronJob(tm, task);
  return job;
};

const cronJob = () => {
  const job = scheduleJob(cronJobTime.time, sendEmail);
  return job;
};

module.exports = cronJob;
