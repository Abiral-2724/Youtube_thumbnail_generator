import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/authSlice';
import { toast } from 'react-toastify';
import {
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Typography,
    Button,
    Grid,
    CircularProgress,
  } from '@mui/material'
import Navbar from './Navbar';

const MyThumbnailsPage = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(selectAuth);

  const fetchThumbnails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/v1/generate-thumbnail/user/${user._id}`);
      const sortedThumbnails = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setThumbnails(sortedThumbnails);
    } catch (err) {
      setError('Failed to fetch thumbnails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThumbnails();
  }, []);

  const handleDownload = async (url, index) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/proxy-thumbnail?url=${url}`, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `thumbnail-${index + 1}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Thumbnail downloaded successfully');
    } catch (error) {
      console.error('Error downloading the image:', error);
      toast.error('Failed to download thumbnail');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'red' }}>
        <Typography variant="h6">Error: {error}</Typography>
        <Button onClick={fetchThumbnails} variant="contained" style={{ marginTop: '20px' }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
        <Navbar></Navbar>
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
    
      <Typography variant="h4" gutterBottom style={{marginTop:'10px' ,marginBottom:'25px',fontFamily:'cursive',marginLeft:'490px'}}>My Thumbnails</Typography>
      {thumbnails.length === 0 ? (
        <Typography>You haven't created any thumbnails yet.</Typography>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))', gap: '1rem' }}>
          {thumbnails.map((thumbnail, index) => (
            <div
              key={thumbnail.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={thumbnail.url}
                alt={`Thumbnail ${index}`}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }} // Adjust to show the image
              />
              <div style={{ padding: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>Size: High</p>
                <p style={{ fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  Created: {new Date(thumbnail.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDownload(thumbnail.url, index)}
                style={{
                  backgroundColor: '#0284c7',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  display: 'flex',
                  fontSize: '1rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50%',
                  margin: '10px auto',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
              >
                <Download size={23} style={{ marginRight: '0.5rem' }} />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    <footer style={{ backgroundColor: '#f3f4f6', padding: '1rem 0', textAlign: 'center', color: '#4b5563' }}>
      <div>© Created By : Abiral jain</div>
        <div>© 2024 YouTube Thumbnail Generator. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default MyThumbnailsPage;
