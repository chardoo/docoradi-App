const Cloud = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

const serviceKey = path.join(__dirname, './key.json');

const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.Project_Id,
});

module.exports = storage;
