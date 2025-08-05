const express = require('express');
const router = express.Router();
const RecurringItem = require('../models/RecurringItem');
const Transaction = require('../models/Transaction');

// Get all recurring items
router.get('/', async (req, res) => {
  try {
    const items = await RecurringItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new recurring item
router.post('/', async (req, res) => {
  const { description, amount, paymentMethod } = req.body;
  const newItem = new RecurringItem({ description, amount, paymentMethod });
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a recurring item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await RecurringItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the new updated document
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a recurring item
router.delete('/:id', async (req, res) => {
  try {
    await RecurringItem.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add selected recurring items as new transactions
router.post('/apply', async (req, res) => {
  const { selectedIds, date } = req.body;
  try {
    const itemsToApply = await RecurringItem.find({ _id: { $in: selectedIds } });
    const newTransactions = itemsToApply.map(item => ({
      description: item.description,
      amount: item.amount,
      type: 'expense',
      paymentMethod: item.paymentMethod,
      date: date || new Date(),
    }));
    await Transaction.insertMany(newTransactions);
    res.status(201).json({ message: 'Items added as transactions' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;