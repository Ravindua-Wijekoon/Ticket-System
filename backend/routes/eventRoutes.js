const express = require('express');
const { authenticate, vendorOnly } = require('../middleware/authMiddleware');
const { getEvents, createEvent, updateEvent, deleteEvent, addTickets, getEventById } = require('../controllers/eventController');

const router = express.Router();

router.get('/', getEvents);
router.post('/', authenticate, vendorOnly, createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', authenticate, vendorOnly, deleteEvent);
router.post('/add-tickets', authenticate, vendorOnly, addTickets);
router.get('/:id', getEventById);

module.exports = router;
