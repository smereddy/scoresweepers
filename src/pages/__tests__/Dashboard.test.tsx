import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import Dashboard from '../Dashboard';

// Mock the useSubscription hook
vi.mock('../../hooks/useSubscription', () => ({
  useSubscription: () => ({
    subscription: null,
    loading: false,
    error: null,
    hasActiveSubscription: () => false,
    isSubscriptionCanceled: () => false,
    getCurrentPeriodEnd: () => null,
  }),
}));

describe('Dashboard', () => {
  it('renders dashboard header', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Audit Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage and track your audit reports')).toBeInTheDocument();
  });

  it('renders create new audit button', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Create New Audit')).toBeInTheDocument();
  });

  it('renders stats cards', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Total Audits')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Issues Found')).toBeInTheDocument();
  });

  it('renders search and filter controls', () => {
    render(<Dashboard />);
    
    expect(screen.getByPlaceholderText('Search audits...')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
    expect(screen.getByText('All Types')).toBeInTheDocument();
  });

  it('renders audit table headers', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Audit Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Last Updated')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders sidebar sections', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Saved Drafts')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});