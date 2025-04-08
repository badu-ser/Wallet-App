// routes/admin.routes.js

import { Router } from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

const adminRouter = Router();

// Hardcoded admin access key (change this to your own secret)
const adminSecret = 'myAdminKey';

// Middleware to check if admin secret is passed
function isAdmin(req, res, next) {
  if (req.query.secret === adminSecret) return next();
  res.status(403).json({ message: 'Unauthorized - admin access only' });
}

// Get all users (excluding sensitive fields like password/token)
adminRouter.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password -token -verificationToken');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get all transactions for a user
adminRouter.get('/transactions/:userId', isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find({ owner: req.params.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Add a transaction to a user
adminRouter.post('/transactions/:userId', isAdmin, async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      owner: req.params.userId,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
});

// Edit a transaction by ID
adminRouter.patch('/transactions/:txnId', isAdmin, async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.txnId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error editing transaction', error });
  }
});

// Delete a transaction by ID
adminRouter.delete('/transactions/:txnId', isAdmin, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.txnId);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

export default adminRouter;
