import React, { useState } from 'react';
import {
  TextField, Button, Snackbar, Alert,
  FormControl, InputLabel, Select, MenuItem, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const YEARS = ['1', '2', '3', '4'];
const PROGRAMMES = ['B.E', 'B.Tech', 'M.E', 'PhD'];
const STUDY_MODES = ['Regular', 'Part-time', 'Lateral'];

const SignUp = () => {
  const [form, setForm] = useState({
    username: '', registerNumber: '', year: '', branch: '', programme: '', studyMode: '',
    dob: null, bloodGroup: '', abcid: '',
    address: { state: '', city: '', taluk: '', street: '', doorNo: '', pincode: '' },
    contactNumber: '', aadharNumber: '', email: '', password: '', confirmPassword: ''
  });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      let updatedForm = { ...form, [name]: value };

      if (name === 'year' && value !== '2' && updatedForm.studyMode === 'Lateral') {
        updatedForm.studyMode = '';
      }

      if (name === 'branch' && value === 'IT') {
        updatedForm.programme = 'B.Tech';
      }

      setForm(updatedForm);
    }
  };

  const handleDOBChange = (date) => setForm(prev => ({ ...prev, dob: date }));

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const validatePassword = password =>
    password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password);
  const validateRegisterNumber = (value) => {
    return /^\d{11}$/.test(value);
  };
  const validateAbcid = (value) => {
    const cleanValue = value.replace(/-/g, '');
    return /^\d{12}$/.test(cleanValue);
  };
  const validateAadharNumber = (value) => {
    const cleanValue = value.replace(/\s/g, '');
    return /^\d{12}$/.test(cleanValue);
  };
  const validateContactNumber = (value) => {
    return /^\d{10}$/.test(value);
  };

  const formatAbcid = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9, 12)}`;
  };
  const formatAadharNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;
  };

  const handleAbcidChange = (e) => {
    const value = e.target.value;
    const formatted = formatAbcid(value);
    setForm(prev => ({ ...prev, abcid: formatted }));
  };

  const handleAadharNumberChange = (e) => {
    const value = e.target.value;
    const formatted = formatAadharNumber(value);
    setForm(prev => ({ ...prev, aadharNumber: formatted }));
  };

  const validateAllFields = () => {
    const requiredFields = [
      'username', 'registerNumber', 'year', 'branch', 'programme', 'studyMode',
      'bloodGroup', 'abcid', 'contactNumber', 'aadharNumber', 'email', 'password'
    ];
    const addressFields = ['state', 'city', 'taluk', 'street', 'doorNo', 'pincode'];

    for (const field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === '') {
        setSnack({ open: true, message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`, severity: 'error' });
        return false;
      }
    }

    for (const field of addressFields) {
      if (!form.address[field] || form.address[field].toString().trim() === '') {
        setSnack({ open: true, message: `Address ${field.charAt(0).toUpperCase() + field.slice(1)} is required`, severity: 'error' });
        return false;
      }
    }

    if (!form.dob) {
      setSnack({ open: true, message: 'Date of Birth is required', severity: 'error' });
      return false;
    }

    if (!validateRegisterNumber(form.registerNumber)) {
      setSnack({ open: true, message: 'Register Number must be exactly 11 digits', severity: 'error' });
      return false;
    }

    if (!validateAbcid(form.abcid)) {
      setSnack({ open: true, message: 'ABC ID must be exactly 12 digits', severity: 'error' });
      return false;
    }

    if (!validateAadharNumber(form.aadharNumber)) {
      setSnack({ open: true, message: 'Aadhar Number must be exactly 12 digits', severity: 'error' });
      return false;
    }

    if (!validateContactNumber(form.contactNumber)) {
      setSnack({ open: true, message: 'Contact Number must be exactly 10 digits', severity: 'error' });
      return false;
    }

    if (!validateEmail(form.email)) {
      setSnack({ open: true, message: 'Invalid email format', severity: 'error' });
      return false;
    }

    if (!validatePassword(form.password)) {
      setSnack({ open: true, message: 'Password must be at least 6 chars, include a digit and uppercase', severity: 'error' });
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setSnack({ open: true, message: 'Passwords do not match', severity: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmRegistration = async () => {
    try {
      const formData = { 
        ...form, 
        dob: form.dob ? form.dob.toISOString().substring(0, 10) : '',
        abcid: form.abcid.replace(/-/g, ''), 
        aadharNumber: form.aadharNumber.replace(/\s/g, '')
      };

      console.log('Submitting form data:', formData);
      
      const res = await axios.post('http://localhost:8080/api/signup', formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.data.exists) {
        setSnack({ open: true, message: 'Account already exists', severity: 'error' });
      } else {
        setSnack({ open: true, message: 'Signup successful', severity: 'success' });
        setTimeout(() => navigate('/signin'), 1500);
      }
      setShowConfirmation(false);
    } catch (err) {
      console.error('Registration error:', err);
      setSnack({ open: true, message: `Signup failed: ${err.response?.data?.error || err.message}`, severity: 'error' });
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <motion.div className="signup-container" initial={{ x: '-100vw' }} animate={{ x: 0 }}>
        <h2>Sign Up</h2>
        <Box
          component="form"
          sx={{ width: '100%' }}
          autoComplete="off"
          onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        >
          <div className="flex-row">
            <div className="flex-item">
              <TextField
                name="username"
                label="Username"
                onChange={handleChange}
                value={form.username}
                fullWidth
              />
            </div>
            <div className="flex-item">
              <TextField
                name="registerNumber"
                label="Register Number"
                onChange={handleChange}
                value={form.registerNumber}
                fullWidth
                placeholder="91762100001"
                helperText="Must be exactly 11 digits"
              />
            </div>
            <div className="flex-item">
              <FormControl fullWidth>
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                  labelId="year-label"
                  name="year"
                  label="Year"
                  value={form.year}
                  onChange={handleChange}
                >
                  {YEARS.map(y => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="flex-row">
            <div className="flex-item">
              <FormControl fullWidth>
                <InputLabel id="branch-label">Branch</InputLabel>
                <Select
                  labelId="branch-label"
                  name="branch"
                  label="Branch"
                  value={form.branch}
                  onChange={handleChange}
                >
                  {BRANCHES.map(branch => (
                    <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex-item">
              <FormControl fullWidth>
                <InputLabel id="programme-label">Programme</InputLabel>
                <Select
                  labelId="programme-label"
                  name="programme"
                  label="Programme"
                  value={form.programme}
                  onChange={handleChange}
                >
                  {PROGRAMMES.map(p => (
                    <MenuItem 
                      key={p} 
                      value={p}
                      disabled={form.branch === 'IT' && p !== 'B.Tech'}
                    >
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex-item">
              <FormControl fullWidth>
                <InputLabel id="studyMode-label">Study Mode</InputLabel>
                <Select
                  labelId="studyMode-label"
                  name="studyMode"
                  label="Study Mode"
                  value={form.studyMode}
                  onChange={handleChange}
                >
                  {STUDY_MODES.map(sm => (
                    <MenuItem 
                      key={sm} 
                      value={sm}
                      disabled={sm === 'Lateral' && form.year !== '2'}
                    >
                      {sm}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="flex-row">
            <div className="flex-item">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DOB"
                  value={form.dob}
                  onChange={handleDOBChange}
                  disableFuture
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className="flex-item">
              <FormControl fullWidth>
                <InputLabel id="bloodGroup-label">Blood Group</InputLabel>
                <Select
                  labelId="bloodGroup-label"
                  name="bloodGroup"
                  label="Blood Group"
                  value={form.bloodGroup}
                  onChange={handleChange}
                >
                  {BLOOD_GROUPS.map(bg => (
                    <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex-item">
              <TextField
                name="abcid"
                label="ABC ID"
                onChange={handleAbcidChange}
                value={form.abcid}
                fullWidth
                placeholder="123-456-789-012"
                helperText="Must be exactly 12 digits"
              />
            </div>
          </div>

          <div className="flex-row">
            <div className="flex-item">
              <TextField
                name="state"
                label="State"
                onChange={handleChange}
                value={form.address.state}
                fullWidth
              />
            </div>
            <div className="flex-item">
              <TextField
                name="city"
                label="City"
                onChange={handleChange}
                value={form.address.city}
                fullWidth
              />
            </div>
            <div className="flex-item">
              <TextField
                name="taluk"
                label="Area/Taluk"
                onChange={handleChange}
                value={form.address.taluk}
                fullWidth
              />
            </div>
          </div>

          <div className="flex-row">
            <div className="flex-item">
              <TextField
                name="street"
                label="Street"
                onChange={handleChange}
                value={form.address.street}
                fullWidth
              />
            </div>
            <div className="flex-item">
              <TextField
                name="doorNo"
                label="Door No"
                onChange={handleChange}
                value={form.address.doorNo}
                fullWidth
              />
            </div>
            <div className="flex-item">
              <TextField
                name="pincode"
                label="Pincode"
                onChange={handleChange}
                value={form.address.pincode}
                fullWidth
              />
            </div>
          </div>

          <div className="flex-row">
            <div className="flex-item">
              <TextField
                name="contactNumber"
                label="Contact Number"
                onChange={handleChange}
                value={form.contactNumber}
                fullWidth
                placeholder="1234567890"
                helperText="Must be exactly 10 digits"
              />
            </div>
            <div className="flex-item">
              <TextField
                name="aadharNumber"
                label="Aadhar Number"
                onChange={handleAadharNumberChange}
                value={form.aadharNumber}
                fullWidth
                placeholder="1234 5678 9012"
                helperText="Must be exactly 12 digits"
              />
            </div>
            <div className="flex-item">
              <TextField
                name="email"
                label="Email"
                onChange={handleChange}
                value={form.email}
                fullWidth
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: '1 1 50%' }}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                onChange={handleChange}
                value={form.password}
                fullWidth
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
            </div>
            <div style={{ flex: '1 1 50%' }}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                onChange={handleChange}
                value={form.confirmPassword}
                fullWidth
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
            </div>
          </div>

          <Button variant="contained" type="submit" sx={{ mt: 3, width: '100%' }}>
            Register
          </Button>

          <p style={{ marginTop: 10 }}>
            Already have an account?{' '}
            <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/signin')}>
              Login
            </span>
          </p>
        </Box>
      </motion.div>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)} maxWidth="md" fullWidth>
        <DialogTitle>Confirm Registration Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <h3>Please review your details before registration:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div><strong>Username:</strong> {form.username}</div>
              <div><strong>Register Number:</strong> {form.registerNumber}</div>
              <div><strong>Year:</strong> {form.year}</div>
              <div><strong>Branch:</strong> {form.branch}</div>
              <div><strong>Programme:</strong> {form.programme}</div>
              <div><strong>Study Mode:</strong> {form.studyMode}</div>
              <div><strong>DOB:</strong> {form.dob ? form.dob.toLocaleDateString() : ''}</div>
              <div><strong>Blood Group:</strong> {form.bloodGroup}</div>
              <div><strong>ABC ID:</strong> {form.abcid}</div>
              <div><strong>Contact Number:</strong> {form.contactNumber}</div>
              <div><strong>Aadhar Number:</strong> {form.aadharNumber}</div>
              <div><strong>Email:</strong> {form.email}</div>
              <div><strong>Password:</strong> {form.password}</div>
              <div><strong>State:</strong> {form.address.state}</div>
              <div><strong>City:</strong> {form.address.city}</div>
              <div><strong>Taluk:</strong> {form.address.taluk}</div>
              <div><strong>Street:</strong> {form.address.street}</div>
              <div><strong>Door No:</strong> {form.address.doorNo}</div>
              <div><strong>Pincode:</strong> {form.address.pincode}</div>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button onClick={handleConfirmRegistration} variant="contained" color="primary">
            Confirm Registration
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignUp;