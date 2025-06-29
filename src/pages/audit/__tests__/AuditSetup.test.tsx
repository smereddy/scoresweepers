import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import AuditSetup from '../AuditSetup';

describe('AuditSetup', () => {
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders report type selection', () => {
    render(<AuditSetup onNext={mockOnNext} />);
    
    expect(screen.getByText('Select Report Type')).toBeInTheDocument();
    expect(screen.getByText('Credit Report')).toBeInTheDocument();
    expect(screen.getByText('Consumer Report')).toBeInTheDocument();
    expect(screen.getByText('Employment Screening')).toBeInTheDocument();
    expect(screen.getByText('Tenant Screening')).toBeInTheDocument();
  });

  it('shows bureau selection after selecting credit report', () => {
    render(<AuditSetup onNext={mockOnNext} />);
    
    const creditReportOption = screen.getByLabelText(/Credit Report/);
    fireEvent.click(creditReportOption);
    
    expect(screen.getByText('Select Credit Bureaus')).toBeInTheDocument();
    expect(screen.getByText('Experian')).toBeInTheDocument();
    expect(screen.getByText('Equifax')).toBeInTheDocument();
    expect(screen.getByText('TransUnion')).toBeInTheDocument();
  });

  it('shows agency selection after selecting consumer report', () => {
    render(<AuditSetup onNext={mockOnNext} />);
    
    const consumerReportOption = screen.getByLabelText(/Consumer Report/);
    fireEvent.click(consumerReportOption);
    
    expect(screen.getByText('Select Reporting Agencies')).toBeInTheDocument();
    expect(screen.getByText('LexisNexis')).toBeInTheDocument();
    expect(screen.getByText('CoreLogic')).toBeInTheDocument();
  });

  it('enables continue button when valid selection is made', () => {
    render(<AuditSetup onNext={mockOnNext} />);
    
    // Initially disabled
    const continueButton = screen.getByText('Continue to Upload');
    expect(continueButton).toBeDisabled();
    
    // Select credit report
    const creditReportOption = screen.getByLabelText(/Credit Report/);
    fireEvent.click(creditReportOption);
    
    // Select a bureau
    const experianOption = screen.getByText('Experian');
    fireEvent.click(experianOption);
    
    // Should be enabled now
    expect(continueButton).not.toBeDisabled();
  });

  it('calls onNext with correct data when continue is clicked', () => {
    render(<AuditSetup onNext={mockOnNext} />);
    
    // Select credit report
    const creditReportOption = screen.getByLabelText(/Credit Report/);
    fireEvent.click(creditReportOption);
    
    // Select a bureau
    const experianOption = screen.getByText('Experian');
    fireEvent.click(experianOption);
    
    // Click continue
    const continueButton = screen.getByText('Continue to Upload');
    fireEvent.click(continueButton);
    
    expect(mockOnNext).toHaveBeenCalledWith({
      reportType: 'credit',
      bureaus: ['Experian'],
      purpose: undefined,
    });
  });

  it('renders purpose input field', () => {
    render(<AuditSetup onNext={mockOnNext} />);
    
    const creditReportOption = screen.getByLabelText(/Credit Report/);
    fireEvent.click(creditReportOption);
    
    expect(screen.getByText('Purpose (Optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., Mortgage application/)).toBeInTheDocument();
  });

  it('renders common issues info', () => {
    render(<AuditSetup onNext={mockOnNext} />);
    
    const creditReportOption = screen.getByLabelText(/Credit Report/);
    fireEvent.click(creditReportOption);
    
    expect(screen.getByText('Common Issues We Detect')).toBeInTheDocument();
    expect(screen.getByText('Incorrect payment history')).toBeInTheDocument();
  });
});