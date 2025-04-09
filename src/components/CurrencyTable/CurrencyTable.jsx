import { useEffect, useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment
} from '@mui/material';
import '../../stylesheet/vars.css';
import css from './CurrencyTable.module.css';

const PayoutForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    upiId: ''
  });
  const [errors, setErrors] = useState({
    amount: false,
    upiId: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateUPI = (upi) => {
    // Basic UPI validation regex
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    const upiNumberRegex = /^\d+@[a-zA-Z0-9]+$/;
    return upiRegex.test(upi) || upiNumberRegex.test(upi);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {
      amount: false,
      upiId: false
    };

    if (parseFloat(formData.amount) < 10) {
      newErrors.amount = true;
      valid = false;
    }

    if (!validateUPI(formData.upiId)) {
      newErrors.upiId = true;
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      // Submit the form
      console.log('Form submitted:', formData);
      alert('Payout request submitted successfully!');
    }
  };

  return (
    <div className={css.table}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: [280, 336, 393],
          height: '174px',
          borderRadius: '30px',
          overflow: 'hidden',
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#4a56e2',
          backgroundImage: 'url(icons/currencyTable.svg)',
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '@media screen and (max-width: 1279px)': {
            height: '182px',
          },
          '@media screen and (min-width: 1280px)': {
            height: '300px',
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
            marginBottom: '10px'
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
          error={errors.amount}
          helperText={errors.amount ? "Minimum amount is 10 Rs" : ""}
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
          helperText={errors.upiId ? "Enter a valid UPI ID" : ""}
          sx={{
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
          sx={{
            marginTop: '15px',
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
          Request Payout
        </Button>
      </Paper>
    </div>
  );
};

export default PayoutForm;
