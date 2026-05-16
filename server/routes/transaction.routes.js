const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getSummary,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth');

// All transaction routes require authentication
router.use(protect);

router.get('/summary', getSummary);
router.get('/', getTransactions);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;