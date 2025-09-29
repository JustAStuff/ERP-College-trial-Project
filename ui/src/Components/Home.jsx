import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Box, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, Paper, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, IconButton, Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

// Friendly labels for fields
const fieldLabels = {
  username: "Username",
  registerNumber: "Register Number",
  year: "Year",
  branch: "Branch",
  programme: "Programme",
  studyMode: "Study Mode",
  dob: "DOB",
  bloodGroup: "Blood Group",
  abcid: "ABC ID",
  aadharNumber: "Aadhar Number",
  email: "Email",
  contactNumber: "Contact Number",
  // Address fields
  doorNo: "Door Number",
  street: "Street",
  taluk: "Taluk",
  city: "City",
  state: "State",
  pincode: "Pincode"
};

// Define constants for the dropdown options
const PROGRAMMES = ['B.E', 'B.Tech', 'M.E', 'PhD'];
const STUDY_MODES = ['Regular', 'Part-time', 'Lateral'];

const Home = ({ username, setUsername, registerNumber, setRegisterNumber }) => {
  const navigate = useNavigate();
  const [viewingDetails, setViewingDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New state for file uploads
  const [aadharFile, setAadharFile] = useState(null);
  const aadharFileInputRef = useRef(null);

  useEffect(() => {
    if (viewingDetails && registerNumber) {
      console.log('Fetching details for registerNumber:', registerNumber);
      setLoading(true);
      
      axios.get(`http://localhost:8080/api/user/details?registerNumber=${registerNumber}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => {
          console.log('User details received:', res.data);
          setUserDetails(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error with primary endpoint:', error);
          
          axios.get(`http://localhost:8080/api/details?registerNumber=${registerNumber}`, {
            headers: {
              'Content-Type': 'application/json',
            }
          })
            .then(res => {
              console.log('User details received from fallback endpoint:', res.data);
              setUserDetails(res.data);
              setLoading(false);
            })
            .catch((fallbackError) => {
              console.error('Error with fallback endpoint:', fallbackError);
              setLoading(false);
              setSnack({
                open: true,
                message: `Failed to fetch user details: ${error.response?.data || error.message}`,
                severity: 'error',
              });
            });
        });
    }
  }, [viewingDetails, registerNumber]);

  const handleLogout = () => {
    setUsername('');
    setRegisterNumber('');
    setViewingDetails(false);
    setUserDetails(null);
    navigate('/');
  };

  const handleEdit = () => {
    setEditForm({
      ...userDetails,
      address: { ...userDetails.address }
    });
    setShowEditDialog(true);
  };

  // A single change handler for the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...editForm, [name]: value };

    // Conditional logic for studyMode
    if (name === 'year' && value !== '2' && updatedForm.studyMode === 'Lateral') {
        updatedForm.studyMode = '';
    }

    // Conditional logic for programme
    if (name === 'branch' && value === 'IT') {
        updatedForm.programme = 'B.Tech';
    }

    setEditForm(updatedForm);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ 
        ...prev, 
        address: { ...prev.address, [name]: value }
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/user/update`, editForm, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.status === 200) {
        setUserDetails(editForm);
        setSnack({ open: true, message: 'Details updated successfully', severity: 'success' });
        setShowEditDialog(false);
      }
    } catch (err) {
      setSnack({ open: true, message: 'Failed to update details', severity: 'error' });
    }
  };

  const handlePasswordReset = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnack({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.trim() === '') {
      setSnack({ open: true, message: 'Password cannot be empty', severity: 'error' });
      return;
    }

    try {
      console.log('Sending password reset request:', {
        registerNumber: registerNumber,
        password: passwordForm.newPassword
      });
      const res = await axios.post('http://localhost:8080/auth/reset-password', {
        registerNumber: registerNumber,
        password: passwordForm.newPassword
      });
      console.log('Password reset response:', res.data);
      
      if (res.status === 200) {
        setSnack({ open: true, message: 'Password reset successfully', severity: 'success' });
        setShowPasswordReset(false);
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error('Password reset error:', err.response?.data || err.message);
      setSnack({ open: true, message: `Failed to reset password: ${err.response?.data || err.message}`, severity: 'error' });
    }
  };

  // ----- New file upload logic -----
  const handleAadharFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setSnack({ open: true, message: "Invalid file type. Only JPG, PNG, or PDF are allowed.", severity: 'error' });
        setAadharFile(null);
      } else {
        setAadharFile(file);
      }
    }
  };

  const handleAadharUpload = async () => {
    if (!aadharFile) {
      setSnack({ open: true, message: "Please select an Aadhar document to upload.", severity: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('file', aadharFile);
    formData.append('registerNumber', registerNumber); // Send register number with the file

    try {
      setSnack({ open: true, message: "Uploading Aadhar document...", severity: 'info' });
      const res = await axios.post(`http://localhost:8080/api/documents/uploadAadhar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Aadhar upload successful:', res.data);
      setSnack({ open: true, message: res.data.message, severity: 'success' });
      setAadharFile(null); // Clear the file state
      if (aadharFileInputRef.current) {
        aadharFileInputRef.current.value = null; // Reset the input field
      }
    } catch (err) {
      console.error('Aadhar upload failed:', err.response?.data || err.message);
      setSnack({ open: true, message: err.response?.data?.message || 'Failed to upload Aadhar document.', severity: 'error' });
    }
  };
  // ---------------------------------

  if (!username) {
    return (
      <div className="home-container logged-out">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="top-right-buttons">
          <Button variant="contained" onClick={() => navigate('/signup')}>Sign Up</Button>
          <Button variant="contained" onClick={() => navigate('/signin')} sx={{ ml: 1 }}>Sign In</Button>
        </motion.div>
        <motion.div 
          className="welcome-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1>Welcome to Student ERP</h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="home-container logged-in">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="top-right-buttons">
        <Button variant="contained" color="secondary" onClick={handleLogout}>Sign Out</Button>
      </motion.div>

      {!viewingDetails && (
        <div className="center-content">
          <h1>Welcome to Student ERP, {username}!</h1>
          <Button variant="contained" size="large" 
            onClick={() => setViewingDetails(true)}>
            View Details
          </Button>
        </div>
      )}

      {viewingDetails && loading && (
        <Box sx={{ maxWidth: 700, margin: '40px auto', p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fafafa', textAlign: 'center' }}>
          <h2>Loading user details...</h2>
        </Box>
      )}

      {viewingDetails && userDetails && !loading && (
        <Box sx={{ maxWidth: 700, margin: '40px auto', p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fafafa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <h2>Your Details</h2>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit Details
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableBody>
                {/* Top-level fields */}
                <TableRow><TableCell>{fieldLabels.username}</TableCell><TableCell>{userDetails.username || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.registerNumber}</TableCell><TableCell>{userDetails.registerNumber || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.year}</TableCell><TableCell>{userDetails.year || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.branch}</TableCell><TableCell>{userDetails.branch || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.programme}</TableCell><TableCell>{userDetails.programme || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.studyMode}</TableCell><TableCell>{userDetails.studyMode || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.dob}</TableCell><TableCell>{userDetails.dob ? userDetails.dob.substring(0, 10) : ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.bloodGroup}</TableCell><TableCell>{userDetails.bloodGroup || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.abcid}</TableCell><TableCell>{userDetails.abcid || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.aadharNumber}</TableCell><TableCell>{userDetails.aadharNumber || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.email}</TableCell><TableCell>{userDetails.email || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.contactNumber}</TableCell><TableCell>{userDetails.contactNumber || ''}</TableCell></TableRow>
                {/* Display Aadhar document status */}
                <TableRow>
                  <TableCell>Aadhar Document</TableCell>
                  <TableCell>
                    {userDetails.aadharDocumentPath ? 
                      <a href={`http://localhost:8080/documents/${userDetails.aadharDocumentPath}`} target="_blank" rel="noopener noreferrer">View Document</a>
                      : 'Not Uploaded'
                    }
                  </TableCell>
                </TableRow>
                {/* Address nested fields */}
                <TableRow><TableCell colSpan={2}><b>Address</b></TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.doorNo}</TableCell><TableCell>{userDetails.address?.doorNo || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.street}</TableCell><TableCell>{userDetails.address?.street || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.taluk}</TableCell><TableCell>{userDetails.address?.taluk || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.city}</TableCell><TableCell>{userDetails.address?.city || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.state}</TableCell><TableCell>{userDetails.address?.state || ''}</TableCell></TableRow>
                <TableRow><TableCell>{fieldLabels.pincode}</TableCell><TableCell>{userDetails.address?.pincode || ''}</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* New Document Upload Section */}
          <Box sx={{ mt: 4, p: 3, border: '1px dashed #ccc', borderRadius: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Upload Your Documents
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="contained" component="label">
                {aadharFile ? aadharFile.name : 'Select Aadhar Document'}
                <input
                  type="file"
                  hidden
                  onChange={handleAadharFileChange}
                  ref={aadharFileInputRef}
                />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAadharUpload}
                disabled={!aadharFile}
              >
                Upload Aadhar Card
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Accepted formats: JPG, PNG, PDF
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Button variant="outlined" onClick={() => setViewingDetails(false)}>Close</Button>
          </Box>
        </Box>
      )}

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

      {/* Edit Dialog */}
      <Dialog 
        open={showEditDialog} 
        onClose={() => setShowEditDialog(false)} 
        maxWidth="md" 
        fullWidth
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <TextField
                label="Username"
                value={editForm.username || ''}
                disabled
                fullWidth
                margin="normal"
              />
              <TextField
                label="Register Number"
                value={editForm.registerNumber || ''}
                disabled
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Year</InputLabel>
                <Select
                  value={editForm.year || ''}
                  name="year"
                  onChange={handleEditChange}
                  label="Year"
                >
                  {['1', '2', '3', '4'].map(y => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Branch</InputLabel>
                <Select
                  value={editForm.branch || ''}
                  name="branch"
                  onChange={handleEditChange}
                  label="Branch"
                >
                  {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'].map(branch => (
                    <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Programme</InputLabel>
                <Select
                  value={editForm.programme || ''}
                  name="programme"
                  onChange={handleEditChange}
                  label="Programme"
                >
                  {PROGRAMMES.map(p => (
                    <MenuItem 
                      key={p} 
                      value={p}
                      disabled={editForm.branch === 'IT' && p !== 'B.Tech'}
                    >
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Study Mode</InputLabel>
                <Select
                  value={editForm.studyMode || ''}
                  name="studyMode"
                  onChange={handleEditChange}
                  label="Study Mode"
                >
                  {STUDY_MODES.map(sm => (
                    <MenuItem 
                      key={sm} 
                      value={sm}
                      disabled={sm === 'Lateral' && editForm.year !== '2'}
                    >
                      {sm}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="ABC ID"
                value={editForm.abcid || ''}
                disabled
                fullWidth
                margin="normal"
              />
              <TextField
                label="Aadhar Number"
                value={editForm.aadharNumber || ''}
                disabled
                fullWidth
                margin="normal"
              />
              <TextField
                label="DOB"
                value={editForm.dob || ''}
                disabled
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={editForm.bloodGroup || ''}
                  name="bloodGroup"
                  onChange={handleEditChange}
                  label="Blood Group"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Contact Number"
                value={editForm.contactNumber || ''}
                name="contactNumber"
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={editForm.email || ''}
                name="email"
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                value={editForm.address?.state || ''}
                name="state"
                onChange={handleAddressChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City"
                value={editForm.address?.city || ''}
                name="city"
                onChange={handleAddressChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Taluk"
                value={editForm.address?.taluk || ''}
                name="taluk"
                onChange={handleAddressChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Street"
                value={editForm.address?.street || ''}
                name="street"
                onChange={handleAddressChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Door No"
                value={editForm.address?.doorNo || ''}
                name="doorNo"
                onChange={handleAddressChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Pincode"
                value={editForm.address?.pincode || ''}
                name="pincode"
                onChange={handleAddressChange}
                fullWidth
                margin="normal"
              />
            </div>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => setShowPasswordReset(true)}
                sx={{ mt: 2 }}
                type="button"
              >
                Reset Password
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog 
        open={showPasswordReset} 
        onClose={() => setShowPasswordReset(false)} 
        maxWidth="sm" 
        fullWidth
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordReset(false)}>Cancel</Button>
          <Button onClick={handlePasswordReset} variant="contained" color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;