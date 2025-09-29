import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setSnack({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    try {
      const res = await axios.post('/auth/forgot-password', {
        email: form.email,
        password: form.password
      });

      const isSuccess = res.data === 'Password updated successfully';
      const isSamePassword = res.data === 'New password cannot be same as the old password';
      const isNotFound = res.data === 'User not found';

      setSnack({
        open: true,
        message: res.data,
        severity: isSuccess ? 'success' : 'error'
      });

      if (isSuccess) {
        setTimeout(() => navigate('/signin'), 2000);
      }

    } catch (err) {
      setSnack({
        open: true,
        message: "Failed to reset password: " + err.message,
        severity: 'error'
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
      </form>
      <p onClick={() => navigate('/signin')} style={{ cursor: 'pointer', color: 'blue', marginTop: '10px' }}>
        Go to Sign in Page
      </p>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>
      </Snackbar>
    </div>
  );
}

export default ForgotPassword;
