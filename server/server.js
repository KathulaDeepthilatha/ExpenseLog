const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Import routes
const transactionRoutes = require('./routes/transactionRoutes');
// const recurringItemRoutes = require('./routes/recurringItemRoutes');
// Use routes
app.use('/api/transactions', transactionRoutes);
// app.use('/api/recurring-items', recurringItemRoutes);
app.use('/api', require('./routes/summaryRoutes'));

// Start the server
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});