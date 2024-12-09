const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    place: { type: String, required: true }, 
    date: { type: Date, required: true }, 
    time: { type: String, required: true }, 
    maxCapacity: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    ticketReleaseRate: { type: Number, required: true },
    ticketsSold: { type: Number, default: 0 },
    ticketPrice: { type: Number, required: true },
    ticketsAddedThisHour: { type: Number, default: 0 }, 
    lastTicketAddTime: { type: Date, default: null }, 
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    ticketPurchaseRate: { type: Number, required: true }  
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
