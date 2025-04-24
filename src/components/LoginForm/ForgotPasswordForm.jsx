import { useState, useEffect } from 'react';
import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Logo from '../Logo/Logo.jsx';
import CustomButton from '../CustomButton/CustomButton.jsx';
import css from './LoginForm.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setPasswordValid(newPassword.length >= 6 && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setOtpValid(otp.length === 4 && /^\d+$/.test(otp));
  }, [otp]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleContinue = async () => {
    try {
      const res = await axios.post('https://loginx4.onrender.com/api/auth/forgot-password', { email });
      const message = res.data?.message;

      if (message === 'OTP sent to registered email') {
        setEmailChecked(true);
        setErrorMsg('');
        setShowSuccessPopup(true);
      } else {
        setEmailChecked(false);
        setErrorMsg('User not found with that email.');
      }
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.');
      setEmailChecked(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await axios.post('https://loginx4.onrender.com/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });

      if (res.status === 200) {
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setEmailChecked(false);
        setShowSuccessPopup(true);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Something went wrong. Please try again.');
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
        fullWidth
        error={!!confirmPassword && !passwordValid}
        helperText={!!confirmPassword && !passwordValid && "Passwords must match and be at least 6 characters"}
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
        sx={inputSx}
      />
    </div>
  );

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 2,
        }}
      >
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
                fullWidth
                error={!!email && !emailValid}
                helperText={!!email && !emailValid && "Please enter a valid email address"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ fill: 'lightgray' }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />
            </div>

            {emailChecked && (
              <>
                <div className={css.container_input} style={{ marginTop: '20px' }}>
                  <TextField
                    label="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    variant="outlined"
                    fullWidth
                    error={!!otp && !otpValid}
                    helperText={!!otp && !otpValid && "Must be a 4-digit number"}
                    inputProps={{ maxLength: 4 }}
                    sx={inputSx}
                  />
                </div>
                {renderPasswordField('New Password', newPassword, setNewPassword)}
                {renderPasswordField('Confirm Password', confirmPassword, setConfirmPassword)}
              </>
            )}
          </div>

          {errorMsg && (
            <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{errorMsg}</p>
          )}

          <div className={css.button_container} style={{ marginTop: '25px' }}>
            <CustomButton
              type="button"
              color="primary"
              content={emailChecked ? 'Change Password' : 'Continue'}
              onClick={emailChecked ? handleChangePassword : handleContinue}
              disabled={emailChecked ? !(passwordValid && otpValid) : !emailValid}
              sx={{ width: '100%', mt: 2 }}
            />
          </div>
        </form>

        {showSuccessPopup && (
          <div className={css.success_overlay}>
            <div className={css.success_card}>
              <h2>Password Updated</h2>
              <p>You can now log in with your new password.</p>
              <CustomButton
                color="primary"
                content="OK"
                onClick={() => navigate('/login')}
              />
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
};

const inputSx = {
  marginTop: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'grey.300',
    },
    '&:hover fieldset': {
      borderColor: 'primary.main',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'grey.500',
    '&.Mui-focused': {
      color: 'primary.main',
    },
  },
};

export default ForgotPasswordForm;
