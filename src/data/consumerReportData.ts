// LexisNexis Consumer Report Data Structures
export interface ConsumerReportPersonalInfo {
  name: string;
  ssn: string;
  dateOfBirth: string;
  addresses: ConsumerAddress[];
  phoneNumbers: string[];
  aliases: string[];
}

export interface ConsumerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  dateRange: string;
  source: string;
  type: 'Current' | 'Previous' | 'Associated';
}

export interface EmploymentRecord {
  employer: string;
  position?: string;
  dateRange: string;
  salary?: string;
  source: string;
  verified: boolean;
}

export interface CriminalRecord {
  id: string;
  type: 'Felony' | 'Misdemeanor' | 'Infraction';
  charge: string;
  court: string;
  date: string;
  disposition: string;
  status: 'Active' | 'Dismissed' | 'Sealed' | 'Expunged';
  county: string;
  state: string;
}

export interface EducationRecord {
  institution: string;
  degree?: string;
  field?: string;
  dateRange: string;
  verified: boolean;
  source: string;
}

export interface ProfessionalLicense {
  type: string;
  number: string;
  state: string;
  issueDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Revoked';
}

export interface ConsumerReportIssue {
  id: string;
  type: 'Identity Error' | 'Employment Error' | 'Criminal Record Error' | 'Address Error' | 'Education Error';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
  affectedItem: string;
  confidence: number;
  potentialImpact: string;
  disputeStrategy: string;
}

export interface ConsumerReport {
  reportDate: string;
  reportType: 'Employment Screening' | 'Tenant Screening' | 'Background Check';
  personalInfo: ConsumerReportPersonalInfo;
  employment: EmploymentRecord[];
  criminal: CriminalRecord[];
  education: EducationRecord[];
  licenses: ProfessionalLicense[];
  verifications: {
    identity: boolean;
    ssn: boolean;
    address: boolean;
  };
}

// Mock Consumer Report Data
export const mockConsumerReport: ConsumerReport = {
  reportDate: '2024-01-15',
  reportType: 'Employment Screening',
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
        dateRange: '2021-Present',
        source: 'Public Records',
        type: 'Current'
      },
      {
        street: '456 Oak Avenue',
        city: 'Oldtown',
        state: 'CA',
        zipCode: '90211',
        dateRange: '2018-2021',
        source: 'Public Records',
        type: 'Previous'
      },
      {
        street: '789 Pine Street',
        city: 'Somewhere',
        state: 'NV',
        zipCode: '89101',
        dateRange: '2019-2020',
        source: 'Credit Header',
        type: 'Associated'
      }
    ],
    phoneNumbers: ['(555) 123-4567', '(555) 987-6543', '(555) 555-0123'],
    aliases: ['John Smith', 'J. Michael Smith', 'Johnny Smith']
  },
  employment: [
    {
      employer: 'Tech Solutions Inc.',
      position: 'Senior Software Engineer',
      dateRange: '2022-Present',
      salary: '$95,000',
      source: 'Employment Verification',
      verified: true
    },
    {
      employer: 'Digital Marketing Co.',
      position: 'Software Developer',
      dateRange: '2020-2022',
      salary: '$75,000',
      source: 'Employment Verification',
      verified: true
    },
    {
      employer: 'StartupXYZ Inc.',
      position: 'Junior Developer',
      dateRange: '2018-2020',
      source: 'Public Records',
      verified: false
    }
  ],
  criminal: [
    {
      id: 'crim_001',
      type: 'Misdemeanor',
      charge: 'Traffic Violation - Speeding',
      court: 'Los Angeles Municipal Court',
      date: '2019-03-15',
      disposition: 'Fine Paid',
      status: 'Dismissed',
      county: 'Los Angeles',
      state: 'CA'
    }
  ],
  education: [
    {
      institution: 'University of California, Los Angeles',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      dateRange: '2003-2007',
      verified: true,
      source: 'National Student Clearinghouse'
    },
    {
      institution: 'Community College of Denver',
      degree: 'Associate Degree',
      field: 'Information Technology',
      dateRange: '2001-2003',
      verified: false,
      source: 'Self-Reported'
    }
  ],
  licenses: [
    {
      type: 'Professional Engineer License',
      number: 'PE-12345',
      state: 'CA',
      issueDate: '2010-06-15',
      expirationDate: '2025-06-15',
      status: 'Active'
    }
  ],
  verifications: {
    identity: true,
    ssn: true,
    address: true
  }
};

// Mock Consumer Report Issues
export const mockConsumerReportIssues: ConsumerReportIssue[] = [
  {
    id: 'cons_issue_001',
    type: 'Address Error',
    severity: 'Medium',
    description: 'Address in Nevada (789 Pine Street) appears to be incorrectly associated with your profile',
    recommendation: 'Dispute the incorrect address association',
    affectedItem: '789 Pine Street, Somewhere, NV 89101',
    confidence: 85,
    potentialImpact: 'Could prevent confusion in employment or tenant screening',
    disputeStrategy: 'Provide documentation showing you never lived at this address'
  },
  {
    id: 'cons_issue_002',
    type: 'Employment Error',
    severity: 'Low',
    description: 'StartupXYZ Inc. employment record shows unverified information',
    recommendation: 'Provide employment verification documentation',
    affectedItem: 'StartupXYZ Inc. (2018-2020)',
    confidence: 70,
    potentialImpact: 'Improves employment history accuracy for background checks',
    disputeStrategy: 'Submit W-2 forms, pay stubs, or employment letter for verification'
  },
  {
    id: 'cons_issue_003',
    type: 'Education Error',
    severity: 'Low',
    description: 'Community College of Denver record is unverified and may be inaccurate',
    recommendation: 'Verify education credentials or request removal if inaccurate',
    affectedItem: 'Community College of Denver (2001-2003)',
    confidence: 75,
    potentialImpact: 'Ensures accurate education history for employment screening',
    disputeStrategy: 'Contact school registrar for official transcript or verification'
  },
  {
    id: 'cons_issue_004',
    type: 'Identity Error',
    severity: 'High',
    description: 'Multiple name variations may cause identity confusion',
    recommendation: 'Standardize name usage and dispute incorrect aliases',
    affectedItem: 'Name aliases: Johnny Smith',
    confidence: 90,
    potentialImpact: 'Prevents identity mix-ups in background checks',
    disputeStrategy: 'Provide legal documentation of correct name and request alias removal'
  }
];

// Consumer reporting agency information
export const consumerReportingAgencies = {
  LexisNexis: {
    name: 'LexisNexis',
    disputeAddress: 'LexisNexis Consumer Center, P.O. Box 105108, Atlanta, GA 30348',
    phone: '1-888-497-0011',
    website: 'https://consumer.risk.lexisnexis.com/',
    onlineDispute: true,
    processingTime: '30 days'
  },
  CoreLogic: {
    name: 'CoreLogic',
    disputeAddress: 'CoreLogic Credco, P.O. Box 509124, San Diego, CA 92150',
    phone: '1-800-637-2422',
    website: 'https://www.corelogic.com/consumer-services/',
    onlineDispute: true,
    processingTime: '30 days'
  },
  ChoicePoint: {
    name: 'ChoicePoint (LexisNexis)',
    disputeAddress: 'LexisNexis Consumer Center, P.O. Box 105108, Atlanta, GA 30348',
    phone: '1-888-497-0011',
    website: 'https://consumer.risk.lexisnexis.com/',
    onlineDispute: true,
    processingTime: '30 days'
  }
};