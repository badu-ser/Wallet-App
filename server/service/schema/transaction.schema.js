import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const transaction = new Schema(
  {
    date: {
      type: String,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    month: {
      type: String,
      enum: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      required: [true, 'Month is required'],
    },
    type: {
      type: String,
      enum: ['Income', 'Expense'],
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      enum: [
        'Main expenses',
        'TR Winnings',
        'TR Withdrawal',
        'UPI Withdrawal',
        'Deposit',
        'Referral Income',
        'Join Bonus',
        'Income'
      ],
      required: [true, 'Category is required'],
    },
    comment: {
      type: String,
    },
    sum: {
      type: Number,
      required: [true, 'Sum is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Owner is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

const Transaction = mongoose.model('transaction', transaction);

export default Transaction;
