import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/authSlice';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  CircularProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const ThumbnailAnalytics = () => {
  const { user } = useSelector(selectAuth);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (user && user._id) {
        try {
          setLoading(true);
          const response = await axios.get(`https://youtube-thumbnail-generator.onrender.com/api/v1/generate-thumbnail/user/${user._id}`);
          const thumbnails = response.data;

          // Prepare data for current year
          const currentYear = new Date().getFullYear();
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          // Initialize monthly counts
          const monthlyCounts = months.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
          }, {});

          // Process thumbnails to get monthly counts
          thumbnails.forEach(thumbnail => {
            const date = new Date(thumbnail.createdAt);
            if (date.getFullYear() === currentYear) {
              const month = date.toLocaleString('default', { month: 'long' });
              monthlyCounts[month] += 1;
            }
          });

          // Convert to chart data format
          const data = months.map(month => ({
            monthYear: month,
            count: monthlyCounts[month],
          }));

          setChartData(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching thumbnails:', err);
          setError('Failed to fetch thumbnail data. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchThumbnails();
  }, [user]);

  if (loading) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardHeader 
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }} style={{marginLeft:'250px'}}>
            <TrendingUp sx={{ mr: 1 }} style={{color:'red'}}/>
            <Typography variant="h6"style={{marginLeft:'6px', color:'#172554',fontWeight:'550'}}>Thumbnail Analytics</Typography>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="count" stroke="#FF0000" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ThumbnailAnalytics;
