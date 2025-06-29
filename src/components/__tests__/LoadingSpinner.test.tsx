import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const customText = 'Loading data...';
    render(<LoadingSpinner text={customText} />);
    
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(document.querySelector('.w-4')).toBeInTheDocument();

    rerender(<LoadingSpinner size="md" />);
    expect(document.querySelector('.w-8')).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" />);
    expect(document.querySelector('.w-12')).toBeInTheDocument();
  });

  it('applies correct color classes', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />);
    expect(document.querySelector('.text-\\[\\#4C8DFF\\]')).toBeInTheDocument();

    rerender(<LoadingSpinner color="accent" />);
    expect(document.querySelector('.text-\\[\\#5CF0B2\\]')).toBeInTheDocument();

    rerender(<LoadingSpinner color="white" />);
    expect(document.querySelector('.text-white')).toBeInTheDocument();
  });
});