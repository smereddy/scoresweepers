export interface Audit {
  id: string;
  name: string;
  type: 'Credit Report' | 'Consumer Report' | 'Employment Screening' | 'Tenant Screening';
  status: 'Draft' | 'In Progress' | 'Complete' | 'Review Required';
  createdAt: string;
  updatedAt: string;
  progress: number;
  issuesFound: number;
  totalItems: number;
}

export interface ReportType {
  id: string;
  name: string;
  description: string;
  category: 'Credit' | 'Consumer' | 'Employment' | 'Tenant';
  icon: string;
}

export interface AuditIssue {
  id: string;
  type: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Identified' | 'Disputed' | 'Resolved';
  recommendation: string;
}

export const mockAudits: Audit[] = [
  {
    id: '1',
    name: 'Personal Credit Report Analysis',
    type: 'Credit Report',
    status: 'Complete',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:22:00Z',
    progress: 100,
    issuesFound: 4,
    totalItems: 45
  },
  {
    id: '2',
    name: 'Employment Background Check Review',
    type: 'Employment Screening',
    status: 'In Progress',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    progress: 65,
    issuesFound: 2,
    totalItems: 28
  },
  {
    id: '3',
    name: 'Tenant Screening Audit',
    type: 'Tenant Screening',
    status: 'Draft',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    progress: 15,
    issuesFound: 0,
    totalItems: 0
  },
  {
    id: '4',
    name: 'Mortgage Application Review',
    type: 'Credit Report',
    status: 'Review Required',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    progress: 90,
    issuesFound: 5,
    totalItems: 52
  },
  {
    id: '5',
    name: 'Consumer Report Analysis',
    type: 'Consumer Report',
    status: 'Complete',
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-11T17:15:00Z',
    progress: 100,
    issuesFound: 3,
    totalItems: 38
  }
];

export const reportTypes: ReportType[] = [
  {
    id: 'credit-report',
    name: 'Credit Report',
    description: 'Comprehensive analysis of credit history and financial records',
    category: 'Credit',
    icon: 'CreditCard'
  },
  {
    id: 'consumer-report',
    name: 'Consumer Report',
    description: 'Background check and consumer information verification',
    category: 'Consumer',
    icon: 'Shield'
  },
  {
    id: 'employment-screening',
    name: 'Employment Screening',
    description: 'Employment background verification and screening',
    category: 'Employment',
    icon: 'Briefcase'
  },
  {
    id: 'tenant-screening',
    name: 'Tenant Screening',
    description: 'Rental application and tenant background verification',
    category: 'Tenant',
    icon: 'Home'
  }
];

export const mockAuditIssues: AuditIssue[] = [
  {
    id: '1',
    type: 'Incorrect Payment History',
    description: 'Payment marked as late when it was actually paid on time',
    severity: 'High',
    status: 'Identified',
    recommendation: 'Dispute with credit bureau and provide payment confirmation'
  },
  {
    id: '2',
    type: 'Outdated Account Information',
    description: 'Closed account still showing as active',
    severity: 'Medium',
    status: 'Disputed',
    recommendation: 'Request account status update from creditor'
  },
  {
    id: '3',
    type: 'Duplicate Entry',
    description: 'Same debt listed multiple times by different collectors',
    severity: 'High',
    status: 'Identified',
    recommendation: 'Dispute duplicate entries and request removal'
  }
];

export const mockExtractedData = {
  personalInfo: {
    name: 'John Smith',
    ssn: '***-**-1234',
    address: '123 Main St, Anytown, ST 12345',
    dateOfBirth: '01/15/1985'
  },
  accounts: [
    {
      creditor: 'Chase Bank',
      accountNumber: '****1234',
      balance: '$2,450',
      status: 'Current',
      paymentHistory: '30 days late (2 times)'
    },
    {
      creditor: 'Capital One',
      accountNumber: '****5678',
      balance: '$850',
      status: 'Closed',
      paymentHistory: 'Never late'
    }
  ],
  inquiries: [
    {
      company: 'Wells Fargo',
      date: '12/15/2023',
      type: 'Hard Inquiry'
    },
    {
      company: 'Credit Karma',
      date: '11/20/2023',
      type: 'Soft Inquiry'
    }
  ]
};

export const letterTemplates = [
  {
    id: 'dispute-letter',
    name: 'Standard Dispute Letter',
    description: 'Professional dispute letter for credit report errors',
    category: 'Credit Dispute'
  },
  {
    id: 'validation-letter',
    name: 'Debt Validation Letter',
    description: 'Request validation of debt from collection agencies',
    category: 'Debt Validation'
  },
  {
    id: 'goodwill-letter',
    name: 'Goodwill Letter',
    description: 'Request removal of negative items as a goodwill gesture',
    category: 'Goodwill Request'
  }
];