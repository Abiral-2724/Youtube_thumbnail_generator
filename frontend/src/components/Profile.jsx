import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Container,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit, Camera, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectAuth } from '@/redux/authSlice';
import Navbar from './Navbar';
import RecentThumbnails from './RecentThumbnails';
import ThumbnailAnalytics from './ThumbnailAnalytics';

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isAuthenticated } = useSelector(selectAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <Box sx={{ position: 'relative', height: 150, bgcolor: 'primary.main' }}>
                <Box sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}>
                  <StyledAvatar src="/api/placeholder/120/120" alt={user?.username} />
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      bgcolor: 'secondary.main',
                      '&:hover': { bgcolor: 'secondary.dark' },
                    }}
                  >
                    <Camera />
                  </IconButton>
                </Box>
              </Box>
              <CardContent sx={{ pt: 10, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>{user?.username}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>{user?.email}</Typography>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{ mt: 3 }}
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>

            <Card elevation={3} sx={{ mt: 4 }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Settings sx={{ mr: 1 }} />
                    <Typography variant="h6">Quick Actions</Typography>
                  </Box>
                }
              />
              <CardContent>
              <List>
  {[
    { label: 'Generate New Thumbnail', path: '/' },
    { label: 'Manage Collection', path: '/collection' },
    { label: 'Account Settings', path: '/account' },
    { label: 'My Thumbnail', path: '/mythumbnail' }
  ].map((action, index) => (
    <ListItem key={index} disablePadding>
      <ListItemText 
        primary={
          <Button
            component={Link} // Use Link component for routing
            to={action.path}  // Map the path to the correct route
            fullWidth
            variant="outlined"
            sx={{ justifyContent: 'flex-start', py: 1.5, mb: 1 }}
          >
            {action.label}
          </Button>
        }
      />
    </ListItem>
  ))}
</List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <ThumbnailAnalytics />
            <Box sx={{ mt: 4 }}>
              <RecentThumbnails />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <footer style={{ backgroundColor: '#f3f4f6', padding: '1rem 0', textAlign: 'center', color: '#4b5563',marginTop:'10px' }}>
      <div>© Created By : Abiral jain</div>
        <div>© 2024 YouTube Thumbnail Generator. All rights reserved.</div>
      </footer>
    </Box>
  );
};

export default Profile;