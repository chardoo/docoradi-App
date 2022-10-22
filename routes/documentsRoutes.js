const express = require('express');
const documentsController = require('../libs/controllers/documents');
const router = express.Router();

router.post('/initialDocuments', documentsController.initialDocuments);
router.post('/personalUploads', documentsController.personalUploadedDocuments);
router.post('/search', documentsController.searchDocuments);
router.post('/viewLater', documentsController.viewLater);
router.post('/markAsViewed', documentsController.markAsViewed);
router.post('/removeFromViewedList', documentsController.removeFromViewLater);
router.post('/getDocumentTypes', documentsController.getfileTypes);
router.post('/getFilesByMimeTypes', documentsController.getfilesByMimeType);
router.post('/filterdocuments', documentsController.filterDocuments);
module.exports = router;
