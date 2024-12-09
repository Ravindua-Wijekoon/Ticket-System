const Event = require('../models/Event');
const mongoose = require('mongoose');

// View all events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
};

// Add a new event
exports.createEvent = async (req, res) => {
    if (req.user.userType !== 'vendor') return res.status(403).json({ error: 'Unauthorized' });
    try {
        const { firstName, lastName } = req.user;
        const createdBy = `${firstName} ${lastName}`;

        const event = new Event({
            ...req.body,
            createdBy,
            ticketPurchaseRate: req.body.ticketPurchaseRate,
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error('Event creation failed:', error);
        res.status(400).json({ error: 'Event creation failed' });
    }
};


// Update an event 
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Event update failed' });
    }
};

// Delete an event 
exports.deleteEvent = async (req, res) => {
    if (req.user.userType !== 'vendor') return res.status(403).json({ error: 'Unauthorized' });
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Event deletion failed' });
    }
};

// addTickets 
exports.addTickets = async (req, res) => {
    const { eventId, ticketsToAdd } = req.body;

    if (!Number.isInteger(ticketsToAdd) || ticketsToAdd <= 0) {
        return res.status(400).json({ error: 'Invalid ticket quantity.' });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Event not found' });
        }

        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        if (!event.lastTicketAddTime || event.lastTicketAddTime < oneHourAgo) {
            event.ticketsAddedThisHour = 0;
            event.lastTicketAddTime = now;
        }

        // Check hourly ticket limit
        if (event.ticketsAddedThisHour + ticketsToAdd > event.ticketReleaseRate) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: `Exceeded hourly limit of ${event.ticketReleaseRate} tickets.` });
        }

        // Check max capacity
        if (event.ticketsSold + event.totalTickets + ticketsToAdd > event.maxCapacity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: 'Exceeded maximum event capacity.' });
        }

        event.totalTickets += ticketsToAdd;
        event.ticketsAddedThisHour += ticketsToAdd;
        event.lastTicketAddTime = now;

        await event.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: `${ticketsToAdd} tickets added successfully.` });
    } catch (error) {
        console.error('Error adding tickets:', error);
        res.status(500).json({ error: 'Failed to add tickets' });
    }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ error: 'Failed to fetch event.' });
    }
};