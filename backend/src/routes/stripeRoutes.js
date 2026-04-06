const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const stripeController = require('../controllers/stripeController');

router.post('/create-checkout-session', protect, stripeController.createCheckoutSession);
router.post('/verify-session', protect, stripeController.verifySession);

module.exports = router;
