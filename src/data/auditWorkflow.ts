import { DetectedIssue, mockDetectedIssues } from './creditReportData';
import { ConsumerReportIssue, mockConsumerReportIssues } from './consumerReportData';

export type ReportType = 'credit' | 'consumer' | 'employment' | 'tenant';
export type WorkflowStep = 'setup' | 'upload' | 'processing' | 'review' | 'generation' | 'complete';

export interface AuditWorkflow {
  id: string;
  name: string;
  reportType: ReportType;
  currentStep: WorkflowStep;
  createdAt: string;
  updatedAt: string;
  progress: number;
  status: 'Draft' | 'In Progress' | 'Complete' | 'Review Required';
  
  // Step data
  setupData?: {
    reportType: ReportType;
    bureaus?: string[];
    agencies?: string[];
    purpose?: string;
  };
  
  uploadData?: {
    fileName?: string;
    fileSize?: number;
    uploadedAt?: string;
    processingStatus?: 'pending' | 'processing' | 'complete' | 'error';
  };
  
  analysisData?: {
    issuesFound: number;
    confidence: number;
    processingTime: number;
    issues: (DetectedIssue | ConsumerReportIssue)[];
  };
  
  reviewData?: {
    selectedIssues: string[];
    userNotes?: string;
    validationComplete: boolean;
  };
  
  generationData?: {
    letterType: 'dispute' | 'validation' | 'goodwill';
    customizations?: Record<string, string>;
    generatedAt?: string;
  };
}

// Mock workflow instances
export const mockWorkflows: AuditWorkflow[] = [
  {
    id: 'wf_001',
    name: 'Personal Credit Report Analysis',
    reportType: 'credit',
    currentStep: 'complete',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:22:00Z',
    progress: 100,
    status: 'Complete',
    setupData: {
      reportType: 'credit',
      bureaus: ['Experian', 'Equifax'],
      purpose: 'Personal credit improvement'
    },
    uploadData: {
      fileName: 'experian_credit_report.pdf',
      fileSize: 2450000,
      uploadedAt: '2024-01-15T10:35:00Z',
      processingStatus: 'complete'
    },
    analysisData: {
      issuesFound: 4,
      confidence: 92,
      processingTime: 28,
      issues: mockDetectedIssues
    },
    reviewData: {
      selectedIssues: ['issue_001', 'issue_002'],
      userNotes: 'Focus on high-impact items first',
      validationComplete: true
    },
    generationData: {
      letterType: 'dispute',
      customizations: {
        recipientName: 'Experian Consumer Assistance',
        senderName: 'John Michael Smith'
      },
      generatedAt: '2024-01-16T14:22:00Z'
    }
  },
  {
    id: 'wf_002',
    name: 'Employment Background Check Review',
    reportType: 'employment',
    currentStep: 'review',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    progress: 75,
    status: 'In Progress',
    setupData: {
      reportType: 'employment',
      agencies: ['LexisNexis'],
      purpose: 'Pre-employment screening review'
    },
    uploadData: {
      fileName: 'lexisnexis_background_report.pdf',
      fileSize: 1850000,
      uploadedAt: '2024-01-18T09:20:00Z',
      processingStatus: 'complete'
    },
    analysisData: {
      issuesFound: 3,
      confidence: 88,
      processingTime: 32,
      issues: mockConsumerReportIssues.slice(0, 3)
    },
    reviewData: {
      selectedIssues: ['cons_issue_001'],
      validationComplete: false
    }
  },
  {
    id: 'wf_003',
    name: 'Tenant Screening Audit',
    reportType: 'tenant',
    currentStep: 'processing',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:05:00Z',
    progress: 45,
    status: 'In Progress',
    setupData: {
      reportType: 'tenant',
      agencies: ['CoreLogic'],
      purpose: 'Rental application preparation'
    },
    uploadData: {
      fileName: 'tenant_screening_report.pdf',
      fileSize: 1200000,
      uploadedAt: '2024-01-20T11:05:00Z',
      processingStatus: 'processing'
    }
  }
];

// Workflow step definitions
export const workflowSteps = {
  setup: {
    title: 'Setup & Configuration',
    description: 'Choose report type and configure analysis parameters',
    icon: 'Settings',
    estimatedTime: '2 minutes'
  },
  upload: {
    title: 'Upload Report',
    description: 'Securely upload your report for analysis',
    icon: 'Upload',
    estimatedTime: '1 minute'
  },
  processing: {
    title: 'AI Analysis',
    description: 'AI processes your report and identifies potential issues',
    icon: 'Bot',
    estimatedTime: '30 seconds'
  },
  review: {
    title: 'Review & Validate',
    description: 'Review detected issues and select items to dispute',
    icon: 'Search',
    estimatedTime: '5 minutes'
  },
  generation: {
    title: 'Generate Documents',
    description: 'Create professional dispute letters and documentation',
    icon: 'FileText',
    estimatedTime: '2 minutes'
  },
  complete: {
    title: 'Complete',
    description: 'Download and submit your dispute documentation',
    icon: 'CheckCircle',
    estimatedTime: 'Done'
  }
};

// Report type configurations
export const reportTypeConfigs = {
  credit: {
    name: 'Credit Report',
    description: 'Analyze credit reports from major bureaus',
    bureaus: ['Experian', 'Equifax', 'TransUnion'],
    icon: 'CreditCard',
    color: 'blue',
    supportedFormats: ['PDF'],
    maxFileSize: '10MB',
    processingTime: '30 seconds',
    commonIssues: [
      'Incorrect payment history',
      'Outdated account information',
      'Unauthorized inquiries',
      'Identity information errors',
      'Public record inaccuracies'
    ]
  },
  consumer: {
    name: 'Consumer Report',
    description: 'Review comprehensive background and consumer reports',
    agencies: ['LexisNexis', 'CoreLogic', 'ChoicePoint'],
    icon: 'Shield',
    color: 'green',
    supportedFormats: ['PDF'],
    maxFileSize: '15MB',
    processingTime: '45 seconds',
    commonIssues: [
      'Address association errors',
      'Employment history inaccuracies',
      'Criminal record errors',
      'Identity mix-ups',
      'Education verification issues'
    ]
  },
  employment: {
    name: 'Employment Screening',
    description: 'Verify employment background check accuracy',
    agencies: ['LexisNexis', 'HireRight', 'Sterling'],
    icon: 'Briefcase',
    color: 'purple',
    supportedFormats: ['PDF'],
    maxFileSize: '10MB',
    processingTime: '35 seconds',
    commonIssues: [
      'Employment date discrepancies',
      'Salary information errors',
      'Criminal record inaccuracies',
      'Education verification issues',
      'Reference check errors'
    ]
  },
  tenant: {
    name: 'Tenant Screening',
    description: 'Review rental application background reports',
    agencies: ['CoreLogic', 'RentSpree', 'TransUnion SmartMove'],
    icon: 'Home',
    color: 'orange',
    supportedFormats: ['PDF'],
    maxFileSize: '8MB',
    processingTime: '25 seconds',
    commonIssues: [
      'Rental history errors',
      'Eviction record inaccuracies',
      'Income verification issues',
      'Credit information errors',
      'Identity verification problems'
    ]
  }
};

// Processing simulation functions
export const simulateProcessing = async (reportType: ReportType, onProgress?: (progress: number) => void): Promise<{
  issues: (DetectedIssue | ConsumerReportIssue)[];
  confidence: number;
  processingTime: number;
}> => {
  const totalSteps = 10;
  const stepDelay = 200; // ms per step
  
  for (let i = 0; i <= totalSteps; i++) {
    await new Promise(resolve => setTimeout(resolve, stepDelay));
    if (onProgress) {
      onProgress((i / totalSteps) * 100);
    }
  }
  
  // Return appropriate mock data based on report type
  if (reportType === 'credit') {
    return {
      issues: mockDetectedIssues,
      confidence: 92,
      processingTime: totalSteps * stepDelay
    };
  } else {
    return {
      issues: mockConsumerReportIssues,
      confidence: 88,
      processingTime: totalSteps * stepDelay
    };
  }
};

// Letter generation functions
export const generateDisputeLetter = (
  issues: (DetectedIssue | ConsumerReportIssue)[],
  customizations: Record<string, string> = {}
): string => {
  const defaultCustomizations = {
    recipientName: 'Credit Bureau Consumer Assistance',
    recipientAddress: 'P.O. Box 4500, Allen, TX 75013',
    senderName: 'John Michael Smith',
    senderAddress: '123 Main Street, Anytown, CA 90210',
    date: new Date().toLocaleDateString()
  };
  
  const merged = { ...defaultCustomizations, ...customizations };
  
  const letterContent = `${merged.date}

${merged.recipientName}
${merged.recipientAddress}

Dear Sir or Madam,

I am writing to dispute the following information in my credit file. The items listed below are inaccurate or incomplete, and I am requesting that they be removed or corrected.

DISPUTED ITEMS:

${issues.map((issue, index) => `${index + 1}. ${issue.description}
   Reason: ${issue.recommendation}
   Affected Item: ${issue.affectedItem}
`).join('\n')}

I have enclosed copies of supporting documentation that verify the inaccuracies of these items. Please investigate these matters and remove or correct the inaccurate information as soon as possible.

Under the Fair Credit Reporting Act, you have 30 days to investigate and respond to this dispute. Please send me written confirmation of the results of your investigation.

Sincerely,

${merged.senderName}
${merged.senderAddress}

Enclosures: Supporting documentation`;

  return letterContent;
};

export const generatePhoneScript = (
  issues: (DetectedIssue | ConsumerReportIssue)[],
  bureau: string = 'Credit Bureau'
): string => {
  const script = `PHONE DISPUTE SCRIPT - ${bureau.toUpperCase()}

Introduction:
"Hello, I'm calling to dispute some inaccurate information on my credit report. My name is [YOUR NAME] and my Social Security Number is [XXX-XX-XXXX]."

${issues.map((issue, index) => `
Item ${index + 1} - ${issue.type}:
"I need to dispute ${issue.affectedItem}. ${issue.description}. ${issue.recommendation}."
`).join('')}

Closing:
"Can you please start an investigation into these items? I'd like to receive written confirmation of the dispute and the results once your investigation is complete. What's the reference number for this dispute?"

IMPORTANT NOTES:
- Have your credit report and supporting documents ready
- Take notes during the call including representative name and reference numbers
- Follow up in writing within 24 hours
- Keep records of all communications

FOLLOW-UP ACTIONS:
1. Send written dispute letter within 24 hours
2. Include copies of supporting documentation
3. Send via certified mail with return receipt
4. Keep copies of all correspondence
5. Follow up if no response within 30 days`;

  return script;
};