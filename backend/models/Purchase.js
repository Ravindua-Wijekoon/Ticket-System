const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    quantity: { type: Number, required: true }, 
    price: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
},{ timestamps: true});

module.exports = mongoose.model('Purchase', PurchaseSchema);
