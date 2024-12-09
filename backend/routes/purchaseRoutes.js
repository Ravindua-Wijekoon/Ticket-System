const express = require('express');
const { authenticate, customerOnly } = require('../middleware/authMiddleware');
const { purchaseTicket, viewPurchases } = require('../controllers/purchaseController');

const router = express.Router();

router.post('/buy', authenticate, customerOnly, purchaseTicket);
router.get('/my-tickets', authenticate, customerOnly, viewPurchases);

module.exports = router;
