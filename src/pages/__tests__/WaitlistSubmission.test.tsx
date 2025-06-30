import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import LandingPage from '../LandingPage';
import { supabase } from '../../lib/supabase';

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
  type WaitlistEntry: {
    id?: string
    name: string
    email: string
    note?: string | null
    status?: string
    created_at?: string
  }
}));

describe('Waitlist Submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits waitlist form with valid data', async () => {
    render(<LandingPage />);
    
    // Open the waitlist modal
    const joinButton = screen.getByText('Join Private Beta');
    fireEvent.click(joinButton);
    
    // Fill out the form
    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email Address');
    const noteInput = screen.getByLabelText(/What's your biggest credit challenge/);
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(noteInput, { target: { value: 'Need help with credit score' } });
    
    // Submit the form
    const submitButton = screen.getByText('Join Private Beta', { selector: 'button[type="submit"]' });
    fireEvent.click(submitButton);
    
    // Verify supabase.from().insert() was called with correct data
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('beta_waitlist');
      expect(supabase.from().insert).toHaveBeenCalledWith([{
        name: 'Test User',
        email: 'test@example.com',
        note: 'Need help with credit score'
      }]);
    });
  });

  it('validates form fields before submission', async () => {
    render(<LandingPage />);
    
    // Open the waitlist modal
    const joinButton = screen.getByText('Join Private Beta');
    fireEvent.click(joinButton);
    
    // Submit without filling form
    const submitButton = screen.getByText('Join Private Beta', { selector: 'button[type="submit"]' });
    fireEvent.click(submitButton);
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Please enter your name/)).toBeInTheDocument();
    });
    
    // Verify supabase.from().insert() was NOT called
    expect(supabase.from).not.toHaveBeenCalled();
  });
});