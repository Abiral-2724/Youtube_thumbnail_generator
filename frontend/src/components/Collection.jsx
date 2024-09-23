import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import { Download } from 'lucide-react';
import Alert from '@mui/material/Alert';

import {
  Box,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Search, Add, CloudDownload, Delete } from '@mui/icons-material';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const { user, isAuthenticated } = useSelector(selectAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`https://youtube-thumbnail-generator.onrender.com/api/v1/collections/user/${user._id}`);
      setCollections(response.data);
      setFilteredCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSearch = () => {
    setSearchClicked(true);

    if (!searchTerm) {
      setSearchError('Enter the name of the collection');
      setFilteredCollections(collections);
      return;
    }

    setSearchError('');

    const fuse = new Fuse(collections, {
      keys: ['name'],
      includeScore: true,
      threshold: 0.3,
    });

    const result = fuse.search(searchTerm);
    const searchResults = result.map(r => r.item);

    if (searchResults.length === 0) {
      setSearchError('No such collection found');
    } else {
      setSearchError('');
    }

    setFilteredCollections(searchResults);
  };

  useEffect(() => {
    if (searchClicked) {
      handleSearch();
    }
  }, [searchTerm, searchClicked]);

  const handleAddCollectionOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddCollectionClose = () => {
    setOpenAddDialog(false);
    setNewCollectionName('');
  };

  const handleAddCollection = async () => {
    if (newCollectionName.trim()) {
      try {
        const response = await axios.post('https://youtube-thumbnail-generator.onrender.com/api/v1/collections/', { name: newCollectionName.trim(), userId: user._id });
        const newCollection = response.data;
        setCollections([...collections, newCollection]);
        setFilteredCollections([...collections, newCollection]);
        navigate('/collection')
        handleAddCollectionClose();
        
       // toast.success('Collection added successfully')
      } catch (error) {
        console.error('Error adding collection:', error);
      }
    }
  };

  const handleSelectCollection = async (collection) => {
    try {
      const response = await axios.get(`https://youtube-thumbnail-generator.onrender.com/api/v1/collections/${collection._id}/thumbnails`);
      setSelectedCollection({
        ...collection,
        thumbnails: response.data.thumbnails
      });
    } catch (error) {
      console.error('Error fetching thumbnails:', error);
    }
  };

  const handleAddThumbnail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://youtube-thumbnail-generator.onrender.com/api/v1/collections/add-thumbnail', {
        collectionId: selectedCollection._id,
        youtubeUrl,
        userId: user._id
      });

      setSelectedCollection(prevCollection => ({
        ...prevCollection,
        thumbnails: [...prevCollection.thumbnails, response.data.thumbnail.thumbnailUrl]
      }));
     await navigate('/collection')
      setYoutubeUrl('');
      <Alert severity="success">This is a success Alert.</Alert>
    } catch (error) {
      console.error('Error adding thumbnail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCollection = async () => {
    try {
      const response = await axios.get(`https://youtube-thumbnail-generator.onrender.com/api/v1/collections/download/${selectedCollection._id}`);
      alert('Download URLs: ' + response.data.thumbnails.join(', '));
    } catch (error) {
      console.error('Error downloading collection:', error);
    }
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollection) return;

    if (window.confirm(`Are you sure you want to delete the collection "${selectedCollection.name}"?`)) {
      try {
        await axios.delete(`https://youtube-thumbnail-generator.onrender.com/api/v1/collections/${selectedCollection._id}`);
        setCollections(collections.filter(c => c._id !== selectedCollection._id));
        setFilteredCollections(filteredCollections.filter(c => c._id !== selectedCollection._id));
        setSelectedCollection(null);
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    }
  };

  const handleDownload = async (url, index) => {
    try {
      const response = await axios.get(`https://youtube-thumbnail-generator.onrender.com/api/proxy-thumbnail?url=${url}`, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `thumbnail-${index + 1}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Thumbnail Downloaded Successfully')
    } catch (error) {
        toast.error('Error in downloading Thumbnail')
      console.error('Error downloading the image:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <hr style={{}}/>
      <Box sx={{ flexGrow: 1, display: 'flex', p: 0 }}>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={3.2} sx={{ height: 'calc(100vh - 100px)' }}>
            <Box
              sx={{
                backgroundColor: '#e7e5e4',
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <Typography variant="h5" gutterBottom style={{color:'black', fontFamily:'cursive', fontWeight:'600', fontSize:'32px'}}>
                Collections
              </Typography>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search collections"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleSearch();
                    setSearchClicked(true);
                  }}
                  sx={{ ml: 1 }}
                >
                  <Search />
                </Button>
              </Box>
              {searchError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {searchError}
                </Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleAddCollectionOpen}
                startIcon={<Add />}
                sx={{ mb: 2 }}
              >
                Add Collection
              </Button>
              <List>
                {filteredCollections.map((collection) => (
                  <ListItem
                    key={collection._id}
                    onClick={() => handleSelectCollection(collection)}
                    selected={selectedCollection?._id === collection._id}
                    sx={{
                      borderRadius: '6px',
                      backgroundColor: selectedCollection?._id === collection._id ? '#1f2937' : '#9ca3af',
                      color: selectedCollection?._id === collection._id ? 'white' : 'black',
                      marginBottom: '6px',
                      '&:hover': {
                        backgroundColor: selectedCollection?._id === collection._id ? '#1f2937' : '#3f3f46',
                      },
                    }}
                    button
                  >
                    <ListItemText primary={collection.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={8.8} sx={{ height: 'calc(100vh - 100px)' }}>
            <Box
              sx={{
                backgroundColor: '#d4d4d4',
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
                height: '100%',
                overflowY: 'auto',
              }}
            >
              {selectedCollection ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" style={{color:'black', fontFamily:'cursive', fontWeight:'1000', fontSize:'33px'}}>
                      {selectedCollection.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDeleteCollection}
                      startIcon={<Delete />}
                    >
                      Delete Collection
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      style={{width:'80%'}}
                      variant="outlined"
                      size="small"
                      placeholder="Paste YouTube URL"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddThumbnail}
                      sx={{ ml: 1 }}
                      disabled={isLoading}
                      style={{backgroundColor:'#0284c7',fontWeight:'500'}}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Add Thumbnail'}
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDownloadCollection}
                    startIcon={<CloudDownload />}
                    sx={{ mb: 2 }}
                  >
                    Download Collection
                  </Button>
                  <Grid container spacing={2}>
                    {selectedCollection.thumbnails.map((thumbnail, index) => (
                      <Grid item xs={12} sm={6} md={5.7} key={index} style={{marginLeft:'14px'}}>
                        <Card
                          sx={{
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.09)',
                              boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="220"
                            image={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            sx={{
                              objectFit: 'cover',
                            }}
                          />
                          <CardActions>
                            <IconButton
                              onClick={() => handleDownload(thumbnail, index)}
                              size="small"
                              sx={{
                                backgroundColor: '#a1a1aa',
                                '&:hover': {
                                  backgroundColor: '#71717a',
                                },
                              }}
                            >
                              <CloudDownload />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (<div style={{display:'flex' ,justifyContent:'center' ,alignItems:'center',marginTop:'280px' ,color:'#581c87'}}>
               <div style={{fontWeight:'530' ,fontSize:'55px',fontFamily:'cursive'}}>No Collection Selected !!</div>
              </div>)}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Dialog open={openAddDialog} onClose={handleAddCollectionClose}>
        <DialogTitle>Add New Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your new collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Collection Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCollectionClose}>Cancel</Button>
          <Button onClick={handleAddCollection} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        component="footer"
        sx={{
          backgroundColor: '#f3f4f6',
          padding: '1rem 0',
          textAlign: 'center',
          color: '#4b5563',
          position: 'static', 
          marginTop:'40px',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div>© Created By: Abiral jain</div>
        <div>© 2024 YouTube Thumbnail Generator. All rights reserved.</div>
      </Box>
    </Box>
  );
};

export default Collection;