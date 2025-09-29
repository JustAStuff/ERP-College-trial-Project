import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = ({ setUsername, setRegisterNumber }) => {
  const [form, setForm] = useState({ registerNumber: '', password: '' });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/signin', form, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.data.username) {
        setUsername(res.data.username);
        setRegisterNumber(form.registerNumber); // Store the register number
        setSnack({ open: true, message: 'Login successful!', severity: 'success' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setSnack({ open: true, message: 'Invalid credentials', severity: 'error' });
      }
    } catch (error) {
      setSnack({ open: true, message: `Login failed: ${error.response?.data?.error || error.message}`, severity: 'error' });
    }
  };

  return (
    <motion.div className="signin-container" initial={{ x: '100vw' }} animate={{ x: 0 }}>
      <h2>Sign In</h2>

      <TextField
        name="registerNumber"
        label="Register Number"
        value={form.registerNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
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

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ marginTop: 2, width: '100%' }}
      >
        Login
      </Button>

      <p style={{ marginTop: '10px' }}>
        Forgot Password?{' '}
        <span
          onClick={() => navigate('/forgot')}
          style={{ cursor: 'pointer', color: 'blue' }}
        >
          Reset
        </span>
      </p>

      <p>
        New user?{' '}
        <span
          onClick={() => navigate('/signup')}
          style={{ cursor: 'pointer', color: 'blue' }}
        >
          Create account
        </span>
      </p>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default SignIn;
