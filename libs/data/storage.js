require('dotenv').config();

const { Storage } = require('@google-cloud/storage');
const logger = require('../../utils/logger');

const credentials = JSON.parse(process.env.STORAGE_CONNECTION);

const getBucket = () => {
  const storage = new Storage({
    projectId: credentials.project_id,
    credentials,
  });

  logger.info('SUCCESS: Storage Connection');
  const bucket = storage.bucket(process.env.BUCKET_NAME);

  return bucket;
};

module.exports = {
  getBucket,
};
