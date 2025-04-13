import { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../redux/selectors';
import { selectUserEmail } from '../../redux/auth/auth.slice'; // Add this import
import css from './CurrencyTable.module.css';

const PayoutForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    upiId: ''
  });

  const [errors, setErrors] = useState({
    amount: false,
    upiId: false,
    balance: false
  });

  const [balance, setBalance] = useState(0);
  const transactions = useSelector(selectTransactions);
  const userEmail = useSelector(selectUserEmail); // Access the user's email from Redux
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const incomesSum = transactions
      .filter(t => t.type === 'Income')
      .reduce((acc, t) => acc + t.sum * 100, 0);
      
    const expensesSum = transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => acc + t.sum * 100, 0);

    const newBalance = (incomesSum - expensesSum) / 100;
    setBalance(newBalance);
  }, [transactions]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      amount: false,
      upiId: false,
      balance: false
    };

    let valid = true;
    const amount = parseFloat(formData.amount);

    if (isNaN(amount)) {
      newErrors.amount = true;
      valid = false;
    } else if (amount < 10) {
      newErrors.amount = true;
      valid = false;
    }

    if (amount > balance) {
      newErrors.balance = true;
      valid = false;
    }

    if (!formData.upiId || !validateUPI(formData.upiId)) {
      newErrors.upiId = true;
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setOpenDialog(true);
    }
  };

  const handleConfirm = async () => {
    setOpenDialog(false);
    setLoading(true);
    
    try {
      const res = await fetch('https://x4-esports-official.vercel.app/api/SavePaymentData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          upiId: formData.upiId,
          email: userEmail, // Forward the user's email here
        }),
      });

      if (res.ok) {
        alert('Payout request submitted successfully!');
        setFormData({ amount: '', upiId: '' });
        setErrors({ amount: false, upiId: false, balance: false });
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
            inputProps: { min: 0, step: 0.01 }
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
          helperText={errors.upiId ? 'Enter a valid UPI ID (e.g., name@upi or 1234567890@upi)' : ''}
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
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
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

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm Payout Request
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to request a payout of Rs{formData.amount} to {formData.upiId}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirm} autoFocus color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default PayoutForm;
