const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get Financial Summary
router.get('/summary', async (req, res) => {
  const { year, month } = req.query;
  if (!year || !month) {
    return res.status(400).json({ message: 'Year and month are required' });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  
  try {
    const summary = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          transactions: { $push: '$$ROOT' },
        },
      },
    ]);

    let totalCredits = 0;
    let totalExpenses = 0;
    let outstandingCc = 0;

    summary.forEach(item => {
      if (item._id === 'credit') {
        totalCredits = item.total;
      } else if (item._id === 'expense') {
        totalExpenses = item.total;
        outstandingCc = item.transactions
          .filter(t => t.paymentMethod === 'Credit Card')
          .reduce((sum, t) => sum + t.amount, 0);
      }
    });

    const availableBalance = totalCredits - totalExpenses;
    const totalSpent = totalExpenses;
    const creditsAdded = totalCredits;

    res.json({
      availableBalance,
      totalSpent,
      creditsAdded,
      outstandingCc,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;