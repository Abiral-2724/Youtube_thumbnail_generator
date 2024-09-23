import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/authSlice';
import { toast } from 'react-toastify';

const ThumbnailGenerator = () => {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showViewButton, setShowViewButton] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setShowViewButton(false);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/generate-thumbnail/thumbnail', { youtubeUrl: url, userId: user._id });
      setThumbnails(response.data.thumbnailUrls);
      setIsLoading(false);
      setShowViewButton(true);
      toast.success('Thumbnail generated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleViewThumbnails = () => {
    navigate('/thumbnails', { state: { thumbnails } });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>
          YouTube <span style={styles.highlightText}>Thumbnail</span> Generator !
        </h1>
        
        <p style={styles.welcomeText}>Welcome, {user?.username || 'User'}!</p>
        <p style={styles.instructionText}>Enter a <span style={{color:'#b91c1c'  ,animation: 'pulse 3.5s infinite'}}>YouTube URL</span> to generate thumbnails</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL"
              style={styles.input}
            />
            <button
              type="submit"
              style={{...styles.button, ...(isLoading ? styles.disabledButton : {})}}
              disabled={isLoading}
            >
              {isLoading ? 'Generating..' : 'Generate'}
            </button>
          </div>
        </form>

        {error && <p style={styles.errorText}>{error}</p>}
        
        {showViewButton && (
          <button
            onClick={handleViewThumbnails}
            style={styles.viewButton}
          >
            View Thumbnails
          </button>
        )}
      </main>
      
      <footer style={styles.footer}>
        <div>© Created By : Abiral jain</div>
        <div>© 2024 YouTube Thumbnail Generator. All rights reserved.</div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '',
    color:'white'
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 0',
  },
  title: {
    fontSize: '5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    textAlign: 'center',
    fontFamily: 'cursive',
    color: '',
    animation: 'fadeInDown 1s ease-out',
  },
  highlightText: {
    color: '#9d174d',
    animation: 'pulse 2s infinite',
  },
  welcomeText: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    textAlign: 'center',
    fontFamily: 'monospace',
    animation: 'fadeIn 1s ease-out 0.5s both',
  },
  instructionText: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginTop: '-10px',
    animation: 'fadeIn 1s ease-out 0.7s both',
  },
 
  form: {
    marginBottom: '1rem',
    width: '100%',
    maxWidth: '600px',
    animation: 'fadeIn 1s ease-out 0.9s both',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  input: {
    flexGrow: 1,
    border: 'none',
    padding: '0.75rem',
    fontSize: '1.125rem',
    color: '#0f172a',
    width: '30rem',
    height: '1.7rem',
    borderRadius: '0.5rem',
    marginRight: '0.5rem',
    backgroundColor: '#f1f5f9',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0 1rem',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    border: '2px solid #3b82f6',
    cursor: 'pointer',
    width: '8rem',
    height: '3rem',
    transition: 'all 0.3s ease',
  },
  disabledButton: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: '1rem',
  },
  viewButton: {
    backgroundColor: '#6d28d9',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '7px',
    fontWeight: '550',
    cursor: 'pointer',
    marginBottom: '1rem',
    width: '200px',
    height: '43px',
    fontSize: '17px',
    border: 'none',
    transition: 'all 0.3s ease',
  },
  footer: {
    backgroundColor: '#f3f4f6',
    padding: '1rem 0',
    textAlign: 'center',
    color: '#4b5563',
    animation: 'fadeIn 1s ease-out 1.1s both',
  },
};

// CSS animations
const animationStyles = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Add the animation styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);

export default ThumbnailGenerator;