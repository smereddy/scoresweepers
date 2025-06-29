import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import LandingPage from '../LandingPage';

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}));

describe('LandingPage', () => {
  it('renders main heading', () => {
    render(<LandingPage />);
    
    expect(screen.getByText(/Erase Credit Report Errors with/)).toBeInTheDocument();
    expect(screen.getByText(/AI Precision/)).toBeInTheDocument();
  });

  it('renders demo mode indicator', () => {
    render(<LandingPage />);
    
    expect(screen.getByText(/Demo Mode - Try Now!/)).toBeInTheDocument();
  });

  it('renders main CTA button', () => {
    render(<LandingPage />);
    
    expect(screen.getByText('Try Demo Now')).toBeInTheDocument();
  });

  it('renders how it works section', () => {
    render(<LandingPage />);
    
    expect(screen.getByText('How ScoreSweep Works')).toBeInTheDocument();
    expect(screen.getByText('Upload & Secure')).toBeInTheDocument();
    expect(screen.getByText('AI Analysis')).toBeInTheDocument();
    expect(screen.getByText('Generate & Send')).toBeInTheDocument();
  });

  it('renders FAQ section', () => {
    render(<LandingPage />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('opens and closes FAQ items', async () => {
    render(<LandingPage />);
    
    const faqButton = screen.getByText('What types of reports does ScoreSweep analyze?');
    fireEvent.click(faqButton);
    
    await waitFor(() => {
      expect(screen.getByText(/ScoreSweep analyzes credit reports/)).toBeInTheDocument();
    });
  });

  it('renders security features', () => {
    render(<LandingPage />);
    
    expect(screen.getByText('Bank-level security')).toBeInTheDocument();
    expect(screen.getByText('30-second analysis')).toBeInTheDocument();
    expect(screen.getByText('95% accuracy')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<LandingPage />);
    
    expect(screen.getByText(/© 2025 ScoreSweep/)).toBeInTheDocument();
    expect(screen.getByText(/Built for Bolt World's Largest Hackathon/)).toBeInTheDocument();
  });
});