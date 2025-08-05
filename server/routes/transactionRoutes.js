const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions (History)
// Get all transactions for a specific month and year (History)
router.get('/', async (req, res) => {
  const { year, month } = req.query;
  
  // Set default to current month if not provided
  const targetDate = new Date();
  const targetYear = year ? parseInt(year) : targetDate.getFullYear();
  const targetMonth = month ? parseInt(month) - 1 : targetDate.getMonth();

  const startDate = new Date(targetYear, targetMonth, 1);
  const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

  try {
    const transactions = await Transaction.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new transaction
router.post('/', async (req, res) => {
  const { description, amount, type, paymentMethod } = req.body;
  const newTransaction = new Transaction({ description, amount, type, paymentMethod });
  try {
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// New: Update a transaction by ID
router.put('/:id', async (req, res) => {
    try {
        const { description, amount, paymentMethod, date } = req.body;
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { description, amount, paymentMethod, date },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// New: Delete a transaction by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(204).end(); // No content to send back
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;