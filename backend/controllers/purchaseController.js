const Event = require('../models/Event');
const Purchase = require('../models/Purchase');
const mongoose = require('mongoose');

// Purchase tickets for an event (customer only)
exports.purchaseTicket = async (req, res) => {
    const { eventId, quantity } = req.body;

    if (req.user.userType !== 'customer') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    if (quantity <= 0) {
        return res.status(400).json({ error: 'Invalid ticket quantity.' });
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const event = await Event.findById(eventId).session(session);
        if (!event) {
            throw new Error('Event not found.');
        }

        // Validate available tickets
        if (quantity > event.totalTickets) {
            throw new Error('Not enough tickets available.');
        }

        // Calculate total price
        const totalPrice = event.ticketPrice * quantity;

        // Deduct tickets and create purchase
        event.totalTickets -= quantity;
        event.ticketsSold += quantity;
        await event.save({ session });

        const purchase = new Purchase({
            customerId: req.user.id,
            eventId,
            quantity,
            price: totalPrice, 
        });
        await purchase.save({ session });

        await session.commitTransaction();
        res.json({ message: 'Ticket purchased successfully', purchase });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error purchasing tickets:', error);
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};


// View purchased tickets (customer only)
exports.viewPurchases = async (req, res) => {
    if (req.user.userType !== 'customer') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const purchases = await Purchase.find({ customerId: req.user.id }).populate('eventId', 'name');
        res.json(purchases.map(p => ({ ...p._doc, quantity: p.quantity })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve purchases' });
    }
};

