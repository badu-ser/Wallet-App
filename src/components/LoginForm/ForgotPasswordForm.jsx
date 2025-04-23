import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../Logo/Logo.jsx';
import CustomButton from '../CustomButton/CustomButton.jsx';
import css from './LoginForm.module.css';
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleContinue = async () => {
    try {
      const res = await axios.post('https://loginx4.onrender.com/api/auth/forgot-password', { email });
      if (res.status === 200) {
        setEmailChecked(true);
        setErrorMsg('');
      }
    } catch {
      setErrorMsg('No user found with that email.');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('https://loginx4.onrender.com/api/auth/reset-password', {
        email,
        otp: '0000',
        newPassword,
      });

      if (res.status === 200) {
        alert('Password changed successfully.');
        // Optionally redirect or clear form
      }
    } catch {
      setErrorMsg('Something went wrong. Try again.');
    }
  };

  const renderPasswordField = (label, value, setValue) => (
    <div className={css.container_input}>
      <TextField
        type={showPassword ? 'text' : 'password'}
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        variant="outlined"
        className={css.password}
        sx={inputSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ fill: 'lightgray' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );

  return (
    <form className={css.form} onSubmit={(e) => e.preventDefault()}>
      <div className={css.logo_wrapper}>
        <Logo />
      </div>

      <div className={css.container_field}>
        <div className={css.container_input}>
          <TextField
            name="email"
            type="email"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            className={css.email}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ fill: 'lightgray' }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {emailChecked && (
          <>
            {renderPasswordField('New Password', newPassword, setNewPassword)}
            {renderPasswordField('Confirm Password', confirmPassword, setConfirmPassword)}
          </>
        )}
      </div>

      {errorMsg && <p style={{ color: 'red', marginLeft: '20px' }}>{errorMsg}</p>}

      <div className={css.button_container}>
        <CustomButton
          type="button"
          color="primary"
          content={emailChecked ? 'Change Password' : 'Continue'}
          onClick={emailChecked ? handleChangePassword : handleContinue}
        />
      </div>
    </form>
  );
};

const inputSx = {
  border: 'none',
  borderColor: 'grey.400',
  paddingTop: '0px',
  paddingBottom: '0px',
  marginTop: '20px',
  height: '80px',
  fieldset: {
    borderRadius: 0,
    border: 'none',
    borderBottom: 1,
    width: '315px',
  },
  input: {
    color: 'grey.600',
    fontFamily: 'var(--font-primary)',
    fontSize: '18px',
    paddingLeft: '0px',
    paddingTop: '8px',
    width: '270px',
  },
  label: {
    color: 'grey.400',
    fontFamily: 'var(--font-primary)',
    fontSize: '18px',
    marginLeft: '30px',
  },
};

export default ForgotPasswordForm;
