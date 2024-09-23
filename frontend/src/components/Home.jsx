import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import ThumbnailGenerator from './Thumbnail.jsx';
import ErrorBoundary from './ErrorBoundary.jsx'; // You'll need to create this component

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If user is not authenticated, redirect to login page
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Or you could return a loading spinner here
  }

  return (
    <ErrorBoundary>
      <div>
        <Navbar />
        <ErrorBoundary>
          <ThumbnailGenerator />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default Home;