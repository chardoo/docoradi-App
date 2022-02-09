require('dotenv').config();

const Firestore = require('@google-cloud/firestore');
const logger = require('../../utils/logger');

const getDB = () => {
  const credentials = JSON.parse(process.env.DB_CONNECTION);
  const dbConnection = new Firestore({
    projectId: credentials.project_id,
    credentials,
  });

  logger.info('SUCCESS: Database Connection');

  return dbConnection;
};

module.exports = {
  getDB,
};
