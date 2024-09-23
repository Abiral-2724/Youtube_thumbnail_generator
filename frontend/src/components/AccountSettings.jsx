import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Divider, Snackbar, Alert, CircularProgress } from '@mui/material';
import Navbar from './Navbar';
import axios from 'axios';

const AccountSettings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post('https://youtube-thumbnail-generator.onrender.com/api/v1/user/profile', {
        withCredentials: true
      });
      const { user } = response.data; // This should work if the response structure is correct
      setUserId(user._id);
      setUsername(user.username);
      setEmail(user.email);
      setLoading(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching user information', severity: 'error' });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  

  const handleSave = async () => {
    if (!userId) {
      setSnackbar({ open: true, message: 'User ID not available', severity: 'error' });
      return;
    }
  
    try {
      const response = await axios.put(
        `https://youtube-thumbnail-generator.onrender.com/api/v1/user/profile/update/${userId}`,
        { email, username, password },  // Sends current email, username, and password for updating
        { withCredentials: true }
      );
  
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      setPassword(''); // Clear password field after update
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Error updating profile', severity: 'error' });
    }
  };
  

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '', minHeight: '100vh' }}>
      <Navbar />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '50px',
        paddingBottom: '50px'
      }}>
        <Box
          sx={{
            width: '400px',
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ marginBottom: '30px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', color: '#333' }}
          >
            Account Settings
          </Typography>
          <Divider style={{ marginBottom: '30px' }} />

          <TextField
            label="Update Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Update Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Update Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '30px' }}
          />

          <Divider style={{ marginBottom: '30px' }} />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginBottom: '15px', padding: '12px', fontSize: '16px' }}
            onClick={handleSave}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            style={{ padding: '12px', fontSize: '16px' }}
          >
            Cancel
          </Button>
        </Box>
      </div>
      <footer style={{ backgroundColor: '#f3f4f6', padding: '1rem 0', textAlign: 'center', color: '#4b5563' }}>
        <div>© Created By: Abiral Jain</div>
        <div>© 2024 YouTube Thumbnail Generator. All rights reserved.</div>
      </footer>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AccountSettings;
