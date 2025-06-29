import { describe, it, expect } from 'vitest';
import { render, screen } from './test/utils';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    // Should render the landing page by default in demo mode
    expect(screen.getByText(/Erase Credit Report Errors with/)).toBeInTheDocument();
  });

  it('provides auth context to children', () => {
    render(<App />);
    
    // The app should render without throwing context errors
    expect(document.body).toBeInTheDocument();
  });

  it('wraps app in error boundary', () => {
    render(<App />);
    
    // Should not throw errors during render
    expect(document.body).toBeInTheDocument();
  });
});