export interface PersonalInfo {
  name: string;
  ssn: string;
  dateOfBirth: string;
  addresses: Address[];
  phoneNumbers: string[];
  employers: Employer[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  dateReported: string;
  source: string;
}

export interface Employer {
  name: string;
  position?: string;
  dateReported: string;
  source: string;
}

export interface CreditAccount {
  id: string;
  creditorName: string;
  accountNumber: string;
  accountType: 'Credit Card' | 'Mortgage' | 'Auto Loan' | 'Student Loan' | 'Personal Loan' | 'Line of Credit';
  status: 'Open' | 'Closed' | 'Paid' | 'Charge Off' | 'Collection';
  balance: number;
  creditLimit?: number;
  monthlyPayment?: number;
  dateOpened: string;
  dateClosed?: string;
  lastActivity: string;
  paymentHistory: PaymentHistory[];
  remarks?: string;
  bureau: 'Experian' | 'Equifax' | 'TransUnion';
}

export interface PaymentHistory {
  month: string;
  status: 'OK' | '30' | '60' | '90' | '120+' | 'CO' | 'R' | 'I';
}

export interface CreditInquiry {
  id: string;
  company: string;
  date: string;
  type: 'Hard' | 'Soft';
  purpose: string;
  bureau: 'Experian' | 'Equifax' | 'TransUnion';
}

export interface PublicRecord {
  id: string;
  type: 'Bankruptcy' | 'Tax Lien' | 'Judgment' | 'Foreclosure';
  court: string;
  amount?: number;
  dateField: string;
  status: 'Active' | 'Satisfied' | 'Dismissed';
  caseNumber: string;
  bureau: 'Experian' | 'Equifax' | 'TransUnion';
}

export interface DetectedIssue {
  id: string;
  type: 'Personal Info Error' | 'Account Error' | 'Payment History Error' | 'Inquiry Error' | 'Public Record Error';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
  affectedItem: string;
  bureau: 'Experian' | 'Equifax' | 'TransUnion';
  confidence: number;
  potentialImpact: string;
  disputeStrategy: string;
}

export interface CreditReport {
  reportDate: string;
  bureau: 'Experian' | 'Equifax' | 'TransUnion';
  personalInfo: PersonalInfo;
  accounts: CreditAccount[];
  inquiries: CreditInquiry[];
  publicRecords: PublicRecord[];
  creditScore?: {
    score: number;
    model: string;
    factors: string[];
  };
}

// Mock Credit Report Data
export const mockCreditReport: CreditReport = {
  reportDate: '2024-01-15',
  bureau: 'Experian',
  personalInfo: {
    name: 'John Michael Smith',
    ssn: '***-**-1234',
    dateOfBirth: '01/15/1985',
    addresses: [
      {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        dateReported: '2023-12-01',
        source: 'Chase Bank'
      },
      {
        street: '456 Oak Avenue',
        city: 'Oldtown',
        state: 'CA',
        zipCode: '90211',
        dateReported: '2021-03-15',
        source: 'Capital One'
      }
    ],
    phoneNumbers: ['(555) 123-4567', '(555) 987-6543'],
    employers: [
      {
        name: 'Tech Solutions Inc.',
        position: 'Software Engineer',
        dateReported: '2023-11-01',
        source: 'Chase Bank'
      },
      {
        name: 'Digital Marketing Co.',
        dateReported: '2020-05-15',
        source: 'Wells Fargo'
      }
    ]
  },
  accounts: [
    {
      id: 'acc_001',
      creditorName: 'Chase Bank',
      accountNumber: '****1234',
      accountType: 'Credit Card',
      status: 'Open',
      balance: 2450,
      creditLimit: 5000,
      monthlyPayment: 125,
      dateOpened: '2020-03-15',
      lastActivity: '2024-01-10',
      paymentHistory: [
        { month: '2024-01', status: 'OK' },
        { month: '2023-12', status: 'OK' },
        { month: '2023-11', status: '30' },
        { month: '2023-10', status: 'OK' }
      ],
      bureau: 'Experian'
    },
    {
      id: 'acc_002',
      creditorName: 'Capital One',
      accountNumber: '****5678',
      accountType: 'Credit Card',
      status: 'Closed',
      balance: 0,
      creditLimit: 3000,
      dateOpened: '2018-07-20',
      dateClosed: '2023-06-15',
      lastActivity: '2023-06-15',
      paymentHistory: [
        { month: '2023-06', status: 'OK' },
        { month: '2023-05', status: 'OK' },
        { month: '2023-04', status: 'OK' },
        { month: '2023-03', status: 'OK' }
      ],
      remarks: 'Account closed by consumer',
      bureau: 'Experian'
    },
    {
      id: 'acc_003',
      creditorName: 'Wells Fargo Auto',
      accountNumber: '****9012',
      accountType: 'Auto Loan',
      status: 'Open',
      balance: 18500,
      monthlyPayment: 425,
      dateOpened: '2022-09-10',
      lastActivity: '2024-01-05',
      paymentHistory: [
        { month: '2024-01', status: 'OK' },
        { month: '2023-12', status: 'OK' },
        { month: '2023-11', status: 'OK' },
        { month: '2023-10', status: 'OK' }
      ],
      bureau: 'Experian'
    }
  ],
  inquiries: [
    {
      id: 'inq_001',
      company: 'Wells Fargo Bank',
      date: '2023-12-15',
      type: 'Hard',
      purpose: 'Credit Card Application',
      bureau: 'Experian'
    },
    {
      id: 'inq_002',
      company: 'Credit Karma',
      date: '2023-11-20',
      type: 'Soft',
      purpose: 'Account Review',
      bureau: 'Experian'
    },
    {
      id: 'inq_003',
      company: 'Mortgage Lenders Inc.',
      date: '2021-08-05',
      type: 'Hard',
      purpose: 'Mortgage Application',
      bureau: 'Experian'
    }
  ],
  publicRecords: [
    {
      id: 'pub_001',
      type: 'Tax Lien',
      court: 'Los Angeles County Superior Court',
      amount: 3250,
      dateField: '2019-07-10',
      status: 'Satisfied',
      caseNumber: 'TL-2019-001234',
      bureau: 'Experian'
    }
  ],
  creditScore: {
    score: 720,
    model: 'FICO Score 8',
    factors: [
      'Payment history',
      'Credit utilization',
      'Length of credit history',
      'Credit mix',
      'New credit inquiries'
    ]
  }
};

// Mock Detected Issues
export const mockDetectedIssues: DetectedIssue[] = [
  {
    id: 'issue_001',
    type: 'Payment History Error',
    severity: 'High',
    description: 'Chase Bank account shows 30-day late payment in November 2023, but payment was made on time',
    recommendation: 'Dispute the incorrect late payment with supporting documentation',
    affectedItem: 'Chase Bank Credit Card (****1234)',
    bureau: 'Experian',
    confidence: 95,
    potentialImpact: 'Could improve credit score by 15-25 points',
    disputeStrategy: 'Provide bank statements showing on-time payment and request correction'
  },
  {
    id: 'issue_002',
    type: 'Public Record Error',
    severity: 'High',
    description: 'Tax lien from 2019 shows as active but was actually satisfied in 2021',
    recommendation: 'Dispute with proof of satisfaction and request removal or status update',
    affectedItem: 'Tax Lien (TL-2019-001234)',
    bureau: 'Experian',
    confidence: 90,
    potentialImpact: 'Could improve credit score by 20-35 points',
    disputeStrategy: 'Submit satisfaction documents and court records showing lien release'
  },
  {
    id: 'issue_003',
    type: 'Inquiry Error',
    severity: 'Medium',
    description: 'Hard inquiry from Mortgage Lenders Inc. is over 2 years old and should be removed',
    recommendation: 'Request removal of outdated inquiry',
    affectedItem: 'Mortgage Lenders Inc. Inquiry (08/05/2021)',
    bureau: 'Experian',
    confidence: 85,
    potentialImpact: 'Could improve credit score by 5-10 points',
    disputeStrategy: 'Request automatic removal due to age of inquiry (over 24 months)'
  },
  {
    id: 'issue_004',
    type: 'Personal Info Error',
    severity: 'Low',
    description: 'Old address still showing as current address',
    recommendation: 'Update address information to reflect current residence',
    affectedItem: '456 Oak Avenue, Oldtown, CA 90211',
    bureau: 'Experian',
    confidence: 80,
    potentialImpact: 'Improves report accuracy and prevents identity confusion',
    disputeStrategy: 'Provide current utility bills or lease agreement as proof of address'
  }
];

// Bureau-specific templates and contact information
export const bureauInfo = {
  Experian: {
    name: 'Experian',
    disputeAddress: 'P.O. Box 4500, Allen, TX 75013',
    phone: '1-888-397-3742',
    website: 'https://www.experian.com/disputes/',
    onlineDispute: true,
    processingTime: '30 days'
  },
  Equifax: {
    name: 'Equifax',
    disputeAddress: 'P.O. Box 740256, Atlanta, GA 30374',
    phone: '1-866-349-5191',
    website: 'https://www.equifax.com/personal/credit-report-services/credit-dispute/',
    onlineDispute: true,
    processingTime: '30 days'
  },
  TransUnion: {
    name: 'TransUnion',
    disputeAddress: 'P.O. Box 2000, Chester, PA 19016',
    phone: '1-800-916-8800',
    website: 'https://www.transunion.com/credit-disputes/',
    onlineDispute: true,
    processingTime: '30 days'
  }
};

// Letter templates for different dispute types
export const disputeLetterTemplates = {
  paymentHistory: {
    subject: 'Dispute of Incorrect Payment History',
    template: `Dear {bureau_name},

I am writing to dispute inaccurate payment history information on my credit report. The following item contains errors:

Account: {creditor_name}
Account Number: {account_number}
Error: {error_description}

The payment history shows a late payment that is incorrect. I have enclosed documentation proving that my payment was made on time. Please investigate this matter and correct the inaccurate information.

Under the Fair Credit Reporting Act, you have 30 days to investigate and respond to this dispute.

Sincerely,
{consumer_name}

Enclosures: Payment confirmation, bank statements`
  },
  publicRecord: {
    subject: 'Dispute of Inaccurate Public Record',
    template: `Dear {bureau_name},

I am disputing the following public record information on my credit report:

Type: {record_type}
Case Number: {case_number}
Error: {error_description}

This record is inaccurate as described above. I have enclosed supporting documentation that proves the error. Please investigate and remove or correct this information.

Under the Fair Credit Reporting Act, you have 30 days to investigate and respond to this dispute.

Sincerely,
{consumer_name}

Enclosures: Court documents, satisfaction records`
  },
  inquiry: {
    subject: 'Dispute of Unauthorized or Outdated Inquiry',
    template: `Dear {bureau_name},

I am disputing the following inquiry on my credit report:

Company: {inquiry_company}
Date: {inquiry_date}
Reason: {dispute_reason}

This inquiry should be removed from my credit report. Please investigate this matter and remove the inaccurate inquiry.

Under the Fair Credit Reporting Act, you have 30 days to investigate and respond to this dispute.

Sincerely,
{consumer_name}`
  }
};