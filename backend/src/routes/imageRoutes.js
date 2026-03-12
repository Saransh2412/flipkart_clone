const express = require('express');
const { getProxyImage } = require('../controllers/imageController');

const router = express.Router();

// GET /api/images/proxy?url=...
router.get('/proxy', getProxyImage);

module.exports = router;
