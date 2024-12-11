const express = require('express');
const { authenticate, customerOnly } = require('../middleware/authMiddleware');
const { purchaseTicket, viewPurchases, viewPurchasesByEventId } = require('../controllers/purchaseController');

const router = express.Router();

router.post('/buy', authenticate, customerOnly, purchaseTicket);
router.get('/my-tickets', authenticate, customerOnly, viewPurchases);
router.get('/event/:eventId', authenticate, viewPurchasesByEventId);


module.exports = router;
