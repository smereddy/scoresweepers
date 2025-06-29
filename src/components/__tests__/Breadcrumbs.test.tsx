import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import Breadcrumbs from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders dashboard link', () => {
    render(<Breadcrumbs items={[]} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/dashboard');
  });

  it('renders breadcrumb items', () => {
    const items = [
      { label: 'Audits', href: '/audits' },
      { label: 'New Audit', current: true },
    ];

    render(<Breadcrumbs items={items} />);
    
    expect(screen.getByText('Audits')).toBeInTheDocument();
    expect(screen.getByText('New Audit')).toBeInTheDocument();
    
    // Check that current item is not a link
    expect(screen.getByText('New Audit')).not.toHaveAttribute('href');
  });

  it('renders chevron separators', () => {
    const items = [
      { label: 'Audits', href: '/audits' },
      { label: 'New Audit', current: true },
    ];

    render(<Breadcrumbs items={items} />);
    
    // Should have chevrons between dashboard and first item, and between items
    const chevrons = document.querySelectorAll('svg');
    expect(chevrons.length).toBeGreaterThan(0);
  });

  it('handles empty items array', () => {
    render(<Breadcrumbs items={[]} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});