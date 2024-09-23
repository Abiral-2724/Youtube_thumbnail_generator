import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/authSlice';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Paper,
  CircularProgress
} from '@mui/material';
import { Image } from 'lucide-react';
import { Link } from 'react-router-dom';
const RecentThumbnails = () => {
  const { user, isAuthenticated } = useSelector(selectAuth);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (user && user._id) {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8000/api/v1/generate-thumbnail/user/${user._id}`);
          setThumbnails(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching thumbnails:', err);
          setError('Failed to fetch thumbnails. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchThumbnails();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!thumbnails || thumbnails.length === 0) {
    return (
      <Card>
        <CardHeader 
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Thumbnails</Typography>
            </Box>
          }
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            No thumbnails available. Start creating some!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image sx={{ mr: 1 }} />
            <Typography variant="h6">Recent Thumbnails</Typography>
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          {thumbnails.map((thumbnail, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper 
                elevation={3}
                sx={{
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <img 
                  src={thumbnail.thumbnailUrl[thumbnail.thumbnailUrl.length - 1] || '/api/placeholder/320/180?text=No Image'} 
                  alt={`Thumbnail ${index + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/api/placeholder/320/180?text=Error Loading Image';
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
       
      </CardContent>
      <div style={{display:'flex' ,justifyContent:'center' ,alignContent:'center'}}>
        <Link to='/mythumbnail'><button style={{margin:'0 auto' ,marginTop:'' ,height:'40px' ,width:'140px',font:'inherit' ,fontWeight:'600',backgroundColor:'#1677FF',border:'none' ,borderRadius:'6px'}}>View all</button></Link>
      
      </div>
  
    </Card>
  );
};

export default RecentThumbnails;