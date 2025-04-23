import { useState } from 'react';
import { TextField } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Logo from '../Logo/Logo.jsx';
import CustomButton from '../CustomButton/CustomButton.jsx';
import css from './LoginForm.module.css'; // Reuse styling from LoginForm
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleContinue = async () => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      if (res.status === 200) {
        setEmailChecked(true);
        setErrorMsg('');
      }
    } catch (err) {
      setErrorMsg('No user found');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('/api/auth/reset-password', {
        email,
        otp: '0000', // optional, adjust as needed
        newPassword,
      });

      if (res.status === 200) {
        alert('Password changed successfully');
        // Optionally redirect or reset state
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Try again.');
    }
  };

  const inputSx = {
    border: 'none',
    borderColor: 'grey.400',
    paddingTop: '0px',
    paddingBottom: '0px',
    marginTop: '20px',
    marginBottom: '0px',
    height: '80px',
    fieldset: {
      borderRadius: 0,
      border: 'none',
      borderBottom: 1,
      width: '315px',
    },
    input: {
      position: 'relative',
      color: 'grey.600',
      fontFamily: 'var(--font-primary)',
      lineHeight: 1,
      fontSize: '18px',
      marginLeft: '45px',
      marginTop: '0px',
      marginBottom: '10px',
      paddingLeft: '0px',
      paddingTop: '8px',
      paddingRight: '0px',
      paddingBottom: '0px',
      width: '270px',
    },
    label: {
      color: 'grey.400',
      fontFamily: 'var(--font-primary)',
      lineHeight: 1,
      fontSize: '18px',
      marginLeft: '30px',
    },
    p: {
      color: 'grey.400',
      fontFamily: 'var(--font-primary)',
      lineHeight: 1,
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'start',
      paddingLeft: '0px',
    },
    legend: {
      color: 'grey.400',
      fontFamily: 'var(--font-primary)',
      lineHeight: 1,
      marginLeft: '30px',
      marginTop: '0px',
      marginBottom: '0px',
      paddingLeft: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    span: { color: 'grey.400', fontFamily: 'var(--font-primary)', lineHeight: 1 },
  };

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
            onChange={e => setEmail(e.target.value)}
            variant="outlined"
            color="grey"
            className={css.email}
            sx={inputSx}
          />
          <EmailIcon
            sx={{
              position: 'absolute',
              fill: 'lightgray',
              top: '10px',
              left: '10px',
            }}
          />
        </div>

        {emailChecked && (
          <>
            <div className={css.container_input}>
              <TextField
                name="newPassword"
                type="password"
                label="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                variant="outlined"
                color="grey"
                className={css.password}
                sx={inputSx}
              />
              <LockIcon
                sx={{
                  position: 'absolute',
                  fill: 'lightgray',
                  top: '10px',
                  left: '10px',
                }}
              />
            </div>

            <div className={css.container_input}>
              <TextField
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                variant="outlined"
                color="grey"
                className={css.password}
                sx={inputSx}
              />
              <LockIcon
                sx={{
                  position: 'absolute',
                  fill: 'lightgray',
                  top: '10px',
                  left: '10px',
                }}
              />
            </div>
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

export default ForgotPasswordForm;
