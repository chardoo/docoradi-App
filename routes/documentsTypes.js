const express = require('express');
const documentsTypesController = require('../libs/controllers/documentsTypes');
const router = express.Router();

router.get('/getdocumentsTypes', documentsTypesController.getDocumentTypes);
router.post('/uploadDocument', documentsTypesController.uploadDocumentTypes);
module.exports = router;
