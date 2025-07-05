import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RealTimeAssistant from './components/real-time-assistant';
import './index.css';

// Create a query client for the extension
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function ExtensionApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center mb-2">Horizon</h1>
            <p className="text-sm text-muted-foreground text-center">
              AI Interview Assistant
            </p>
          </div>
          
          <RealTimeAssistant />
        </div>
      </div>
    </QueryClientProvider>
  );
}

// Initialize the extension popup
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<ExtensionApp />);
} else {
  console.error('Root element not found');
}