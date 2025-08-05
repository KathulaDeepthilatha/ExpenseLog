const mongoose = require('mongoose');

const recurringItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Cash', 'Credit Card'], required: true },
});

module.exports = mongoose.model('RecurringItem', recurringItemSchema);