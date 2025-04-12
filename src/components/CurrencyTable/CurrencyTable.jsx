import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment
} from '@mui/material';
import '../../stylesheet/vars.css';
import css from './CurrencyTable.module.css';

const PayoutForm = ({ balance }) => {
  const [formData, setFormData] = useState({
    amount: '',
    upiId: ''
  });

  const [errors, setErrors] = useState({
    amount: false,
    upiId: false,
    balance: false
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUPI = (upi) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    const upiNumberRegex = /^\d+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upi) || upiNumberRegex.test(upi);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      amount: false,
      upiId: false,
      balance: false
    };

    const amount = parseFloat(formData.amount);
const availableBalance = Number(balance);

if (amount > availableBalance) {
  newErrors.balance = true;
  valid = false;
}

    if (amount < 10) {
      newErrors.amount = true;
      valid = false;
    }

    if (amount > balance) {
      newErrors.balance = true;
      valid = false;
    }

    if (!validateUPI(formData.upiId)) {
      newErrors.upiId = true;
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);
    try {
      const res = await fetch('https://x4-esports-official.vercel.app/api/SavePaymentData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Payout request submitted successfully!');
        setFormData({ amount: '', upiId: '' });
      } else {
        const err = await res.json();
        alert('Error: ' + (err.message || 'Submission failed.'));
      }
    } catch (err) {
      console.error('Error submitting payout request:', err);
      alert('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.table}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: [280, 336, 393],
          borderRadius: '30px',
          overflow: 'hidden',
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#4a56e2',
          backgroundImage: 'url(icons/currencyTable.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '@media screen and (max-width: 1279px)': {
            height: 'auto',
          },
          '@media screen and (min-width: 1280px)': {
            padding: '30px',
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '18px',
            fontFamily: 'var(--font-secondary)',
            marginBottom: '15px'
          }}
        >
          Request Payout
        </Typography>

        <TextField
          name="amount"
          label="Payout Amount"
          variant="outlined"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount || errors.balance}
          helperText={
            errors.amount
              ? 'Minimum amount is 10 Rs'
              : errors.balance
              ? 'Amount exceeds available balance'
              : ''
          }
          InputProps={{
            startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
          }}
          sx={{
            marginBottom: '15px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '10px',
            },
          }}
          fullWidth
        />

        <TextField
          name="upiId"
          label="UPI ID or UPI Number"
          variant="outlined"
          value={formData.upiId}
          onChange={handleChange}
          error={errors.upiId}
          helperText={errors.upiId ? 'Enter a valid UPI ID' : ''}
          sx={{
            marginBottom: '15px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '10px',
            },
          }}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: 'var(--color-category-childcare)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-secondary)',
            fontWeight: '700',
            '&:hover': {
              backgroundColor: 'var(--color-category-childcare-dark)',
            },
          }}
          fullWidth
        >
          {loading ? 'Processing...' : 'Request Payout'}
        </Button>
      </Paper>
    </div>
  );
};

export default PayoutForm;
