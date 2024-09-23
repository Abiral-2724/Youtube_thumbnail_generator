import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { Download } from 'lucide-react';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

const Explore = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [searchUrl, setSearchUrl] = useState('');
  const [filteredThumbnails, setFilteredThumbnails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchThumbnails();
  }, []);

  const fetchThumbnails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/generate-thumbnail/getthumbnails');
      const sortedThumbnails = response.data.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
      setThumbnails(sortedThumbnails);
      setFilteredThumbnails(sortedThumbnails);
    } catch (err) {
      setError('Failed to fetch thumbnails');
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchUrl) {
      setFilteredThumbnails(thumbnails);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/generate-thumbnail/search?url=${searchUrl}`);
      const sortedSearchResults = response.data.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
      setFilteredThumbnails(sortedSearchResults);
    } catch (err) {
      setError('No thumbnails found for this URL');
      setFilteredThumbnails([]);
    }
    setIsLoading(false);
  };

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
      toast.success('Thumbnail downloaded successfully')
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: '1', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', fontFamily: 'cursive' }}>
          <span style={{color:'#db2777'}}>Thumbnail</span> Explorer
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <input
            type="text"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            style={{
              width: '60%',
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#db2777',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginLeft : '10px'
            }}
          >
           Search
          </button>
        </div>

        {isLoading && <p style={{ textAlign: 'center' }}>Loading...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredThumbnails.map((thumbnail, index) => (
            <div
              key={index}
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
              <img src={thumbnail.thumbnailUrl[4]} alt={`Thumbnail ${index}`} style={{ width: '100%', height: 'auto' }} />
              <div style={{ padding: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'white', margin: 0 }}>Size : High</p>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'white',
                    margin: '0.25rem 0 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Video URL :
                  <a href={thumbnail.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{color:'#38bdf8'}}>
                    {thumbnail.youtubeUrl}
                  </a>
                </p>
              </div>

              <button
                onClick={() => handleDownload(thumbnail.thumbnailUrl[4], index)}
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
      </div>
      <footer style={{ backgroundColor: '#f3f4f6', padding: '1rem 0', textAlign: 'center', color: '#4b5563', marginTop: 'auto' }}>
      <div>© Created By : Abiral jain</div>
        <div>© 2024 YouTube Thumbnail Generator. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Explore;
