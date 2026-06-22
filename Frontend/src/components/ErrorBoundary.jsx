import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#09090b] text-white p-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="p-4 bg-rose-500/10 rounded-full mb-6 border border-rose-500/20 relative z-10">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2 relative z-10">Something went wrong</h1>
          <p className="text-white/50 mb-8 max-w-md text-center relative z-10">
            A rendering error occurred in the application. Please try reloading.
          </p>
          <div className="bg-[#09090b]/80 backdrop-blur-xl border border-rose-500/20 p-4 rounded-xl text-sm font-mono text-rose-400 mb-8 max-w-2xl w-full overflow-auto shadow-2xl relative z-10">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black rounded-xl font-bold transition-colors relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
