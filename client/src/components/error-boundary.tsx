import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Shield, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOnline: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-[#1a1f2e] flex items-center justify-center">
                <Shield className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white mb-2">UAE7Guard</h1>
              <p className="text-gray-400 text-sm">
                {this.state.isOnline
                  ? 'Something went wrong while loading the app.'
                  : 'No internet connection detected.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm">
              {this.state.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className={this.state.isOnline ? 'text-green-500' : 'text-red-500'}>
                {this.state.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <Button
              onClick={this.handleRetry}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <p className="text-xs text-gray-500">
              If the problem persists, please check your internet connection and try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
