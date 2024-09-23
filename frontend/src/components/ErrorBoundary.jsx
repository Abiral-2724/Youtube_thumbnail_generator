import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{display:'flex' ,justifyContent:'center' ,alignItems:'center'}}>
            <h1>Something Went Wrong</h1>
            <br />
            <p>Please Reload the page</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
