// ThumbnailsPage.jsx
import React from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

const ThumbnailsPage = () => {
    const location = useLocation();
    const thumbnails = location.state?.thumbnails || [];

    const handleDownload = async (url, index) => {
        try {
            // Use proxy to bypass CORS and fetch image
            const response = await axios.get(`https://youtube-thumbnail-generator.onrender.com/api/proxy-thumbnail?url=${url}`, { responseType: 'blob' });
            
            // Create a URL for the blob
            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            
            // Create an anchor element and trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `thumbnail-${index + 1}.jpg`);
            
            // Append the anchor to the body, trigger the download, and then remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Thumbnail download successfully');
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };

    return (
        <div>
            <div>
                <Navbar></Navbar>
            </div>
        <div style={{ width: '100%', maxWidth: '960px', padding: '1rem', margin: '0 auto' }}>
            
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '1.5rem', fontFamily: 'cursive' }}>
                Generated Thumbnails :
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.7rem' }}>
                {thumbnails.map((thumbnailUrl, index) => (
                    <div 
                        key={index} 
                        style={{
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '300px',
                            position: 'relative',
                            transition: 'box-shadow 0.3s ease, transform 0.3s ease'
                        }}
                    >
                        <img 
                            src={thumbnailUrl} 
                            alt={`Thumbnail ${index + 1}`} 
                            style={{ width: '100%', height: 'auto', marginBottom: '1rem' }} 
                        />
                        <p 
                            style={{ 
                                fontSize: '0.875rem', 
                                color: '#4b5563', 
                                marginBottom: '0.5rem' 
                            }}
                        >
                            Size: {index === 0 ? 'Default' : index === 1 ? 'Medium' : 'High'}
                        </p>
                        <button
                            onClick={() => handleDownload(thumbnailUrl, index)}
                            style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '10px',
                                border: 'none',
                                display: 'flex',
                                fontSize: '15.777px',
                                fontWeight: '5500',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '80%',
                                marginLeft: '28px',
                                cursor: 'pointer',
                                position: 'absolute',
                                bottom: '1rem',
                                left: '0',
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            <Download size={20} style={{ marginRight: '0.5rem' }} />
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
        <footer style={{ backgroundColor: '#f3f4f6', padding: '1rem 0', textAlign: 'center', color: '#4b5563' }}>
        <div>© Created By : Abiral jain</div>
        <div>© 2024 YouTube Thumbnail Generator. All rights reserved.</div>
      </footer>
        </div>
    );
};

export default ThumbnailsPage;
