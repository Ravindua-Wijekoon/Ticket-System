require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const vendorRouts = require('./routes/vendorRouts');
const cors = require('cors');
const cron = require('node-cron');
const Event = require('./models/Event');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/vendors', vendorRouts);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
