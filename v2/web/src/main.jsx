import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Still App Crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#05070d',
          color: '#fff',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#38bdf8' }}>Still Sanctuary</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '300px', marginBottom: '16px' }}>
            A momentary refresh is needed.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 24px',
              color: '#000',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Reload Still
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
