export interface ReportingAgency {
  id: string;
  name: string;
  type: 'credit' | 'consumer' | 'employment' | 'tenant';
  description: string;
  website: string;
  phone: string;
  disputeAddress: string;
  onlineDispute: boolean;
  processingTime: string;
  requestSteps: ReportRequestStep[];
  cost: string;
  frequency: string;
}

export interface ReportRequestStep {
  step: number;
  title: string;
  description: string;
  url?: string;
  requirements?: string[];
  estimatedTime?: string;
}

// Credit Bureau Information
export const creditBureaus: ReportingAgency[] = [
  {
    id: 'experian',
    name: 'Experian',
    type: 'credit',
    description: 'One of the three major credit reporting agencies',
    website: 'https://www.experian.com',
    phone: '1-888-397-3742',
    disputeAddress: 'P.O. Box 4500, Allen, TX 75013',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Visit AnnualCreditReport.com',
        description: 'Go to the official government-authorized website for free credit reports',
        url: 'https://www.annualcreditreport.com',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Verify Your Identity',
        description: 'Provide personal information including SSN, date of birth, and address',
        requirements: [
          'Social Security Number',
          'Date of birth',
          'Current address',
          'Previous address (if moved recently)'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 3,
        title: 'Select Experian',
        description: 'Choose Experian from the list of credit bureaus',
        estimatedTime: '1 minute'
      },
      {
        step: 4,
        title: 'Answer Security Questions',
        description: 'Complete identity verification with questions about your credit history',
        estimatedTime: '2 minutes'
      },
      {
        step: 5,
        title: 'Download Your Report',
        description: 'Save the PDF report to your device for upload to ScoreSweep',
        estimatedTime: '1 minute'
      }
    ]
  },
  {
    id: 'equifax',
    name: 'Equifax',
    type: 'credit',
    description: 'One of the three major credit reporting agencies',
    website: 'https://www.equifax.com',
    phone: '1-866-349-5191',
    disputeAddress: 'P.O. Box 740256, Atlanta, GA 30374',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Visit AnnualCreditReport.com',
        description: 'Go to the official government-authorized website for free credit reports',
        url: 'https://www.annualcreditreport.com',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Verify Your Identity',
        description: 'Provide personal information including SSN, date of birth, and address',
        requirements: [
          'Social Security Number',
          'Date of birth',
          'Current address',
          'Previous address (if moved recently)'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 3,
        title: 'Select Equifax',
        description: 'Choose Equifax from the list of credit bureaus',
        estimatedTime: '1 minute'
      },
      {
        step: 4,
        title: 'Answer Security Questions',
        description: 'Complete identity verification with questions about your credit history',
        estimatedTime: '2 minutes'
      },
      {
        step: 5,
        title: 'Download Your Report',
        description: 'Save the PDF report to your device for upload to ScoreSweep',
        estimatedTime: '1 minute'
      }
    ]
  },
  {
    id: 'transunion',
    name: 'TransUnion',
    type: 'credit',
    description: 'One of the three major credit reporting agencies',
    website: 'https://www.transunion.com',
    phone: '1-800-916-8800',
    disputeAddress: 'P.O. Box 2000, Chester, PA 19016',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Visit AnnualCreditReport.com',
        description: 'Go to the official government-authorized website for free credit reports',
        url: 'https://www.annualcreditreport.com',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Verify Your Identity',
        description: 'Provide personal information including SSN, date of birth, and address',
        requirements: [
          'Social Security Number',
          'Date of birth',
          'Current address',
          'Previous address (if moved recently)'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 3,
        title: 'Select TransUnion',
        description: 'Choose TransUnion from the list of credit bureaus',
        estimatedTime: '1 minute'
      },
      {
        step: 4,
        title: 'Answer Security Questions',
        description: 'Complete identity verification with questions about your credit history',
        estimatedTime: '2 minutes'
      },
      {
        step: 5,
        title: 'Download Your Report',
        description: 'Save the PDF report to your device for upload to ScoreSweep',
        estimatedTime: '1 minute'
      }
    ]
  }
];

// Consumer Reporting Agencies
export const consumerAgencies: ReportingAgency[] = [
  {
    id: 'lexisnexis',
    name: 'LexisNexis',
    type: 'consumer',
    description: 'Comprehensive consumer and background reporting',
    website: 'https://consumer.risk.lexisnexis.com',
    phone: '1-888-497-0011',
    disputeAddress: 'LexisNexis Consumer Center, P.O. Box 105108, Atlanta, GA 30348',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Visit LexisNexis Consumer Center',
        description: 'Go to the LexisNexis consumer disclosure website',
        url: 'https://consumer.risk.lexisnexis.com/request',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Create Account or Sign In',
        description: 'Register for a new account or sign in to existing account',
        requirements: [
          'Email address',
          'Phone number',
          'Personal information'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 3,
        title: 'Request Consumer Disclosure',
        description: 'Select the type of report you want to request',
        estimatedTime: '2 minutes'
      },
      {
        step: 4,
        title: 'Verify Identity',
        description: 'Complete identity verification process',
        requirements: [
          'Social Security Number',
          'Date of birth',
          'Current address',
          'Government-issued ID'
        ],
        estimatedTime: '5 minutes'
      },
      {
        step: 5,
        title: 'Receive Report',
        description: 'Report will be mailed or made available online within 15 business days',
        estimatedTime: '15 business days'
      }
    ]
  },
  {
    id: 'corelogic',
    name: 'CoreLogic',
    type: 'consumer',
    description: 'Property and consumer information services',
    website: 'https://www.corelogic.com/consumer-services',
    phone: '1-800-637-2422',
    disputeAddress: 'CoreLogic Credco, P.O. Box 509124, San Diego, CA 92150',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Visit CoreLogic Consumer Services',
        description: 'Go to the CoreLogic consumer services website',
        url: 'https://www.corelogic.com/consumer-services/',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Request Consumer Report',
        description: 'Fill out the consumer disclosure request form',
        requirements: [
          'Full legal name',
          'Social Security Number',
          'Date of birth',
          'Current and previous addresses'
        ],
        estimatedTime: '5 minutes'
      },
      {
        step: 3,
        title: 'Submit Required Documentation',
        description: 'Provide copies of required identification documents',
        requirements: [
          'Government-issued photo ID',
          'Proof of current address',
          'Social Security card (if requested)'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 4,
        title: 'Mail or Fax Request',
        description: 'Send completed form and documents via mail or fax',
        estimatedTime: '1 day'
      },
      {
        step: 5,
        title: 'Receive Report',
        description: 'Report will be mailed within 15 business days',
        estimatedTime: '15 business days'
      }
    ]
  }
];

// Employment Screening Agencies
export const employmentAgencies: ReportingAgency[] = [
  {
    id: 'hireright',
    name: 'HireRight',
    type: 'employment',
    description: 'Employment background screening services',
    website: 'https://www.hireright.com',
    phone: '1-800-400-2761',
    disputeAddress: 'HireRight Consumer Relations, 5151 California Ave, Irvine, CA 92617',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Visit HireRight Consumer Portal',
        description: 'Access the consumer disclosure request portal',
        url: 'https://www.hireright.com/consumers',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Submit Request Form',
        description: 'Complete the consumer disclosure request form online',
        requirements: [
          'Full legal name',
          'Date of birth',
          'Social Security Number',
          'Current address',
          'Email address'
        ],
        estimatedTime: '5 minutes'
      },
      {
        step: 3,
        title: 'Verify Identity',
        description: 'Upload required identification documents',
        requirements: [
          'Government-issued photo ID',
          'Proof of address',
          'Additional verification if requested'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 4,
        title: 'Processing',
        description: 'HireRight will process your request and verify your identity',
        estimatedTime: '5-7 business days'
      },
      {
        step: 5,
        title: 'Receive Report',
        description: 'Report will be provided electronically or by mail',
        estimatedTime: '15 business days'
      }
    ]
  },
  {
    id: 'sterling',
    name: 'Sterling',
    type: 'employment',
    description: 'Background screening and identity services',
    website: 'https://www.sterlingcheck.com',
    phone: '1-800-853-3228',
    disputeAddress: 'Sterling Consumer Advocacy, 1 State Street Plaza, New York, NY 10004',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Contact Sterling Consumer Advocacy',
        description: 'Call or email to request your consumer file',
        url: 'https://www.sterlingcheck.com/consumer-advocacy/',
        estimatedTime: '5 minutes'
      },
      {
        step: 2,
        title: 'Provide Required Information',
        description: 'Submit personal information and identification',
        requirements: [
          'Full legal name',
          'Date of birth',
          'Social Security Number',
          'Current and previous addresses',
          'Phone number and email'
        ],
        estimatedTime: '5 minutes'
      },
      {
        step: 3,
        title: 'Submit Documentation',
        description: 'Provide copies of required identification documents',
        requirements: [
          'Government-issued photo ID',
          'Proof of current address',
          'Signed request form'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 4,
        title: 'Processing and Verification',
        description: 'Sterling will verify your identity and process the request',
        estimatedTime: '5-10 business days'
      },
      {
        step: 5,
        title: 'Receive Report',
        description: 'Report will be mailed or provided electronically',
        estimatedTime: '15 business days'
      }
    ]
  }
];

// Tenant Screening Agencies
export const tenantAgencies: ReportingAgency[] = [
  {
    id: 'transunion-smartmove',
    name: 'TransUnion SmartMove',
    type: 'tenant',
    description: 'Tenant screening and rental background checks',
    website: 'https://www.mysmartmove.com',
    phone: '1-877-787-6686',
    disputeAddress: 'TransUnion SmartMove, P.O. Box 1000, Chester, PA 19016',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Visit SmartMove Consumer Portal',
        description: 'Access the consumer disclosure section',
        url: 'https://www.mysmartmove.com/consumer-disclosure',
        estimatedTime: '2 minutes'
      },
      {
        step: 2,
        title: 'Submit Request',
        description: 'Complete the online consumer disclosure request',
        requirements: [
          'Full legal name',
          'Date of birth',
          'Social Security Number',
          'Current address',
          'Email address'
        ],
        estimatedTime: '5 minutes'
      },
      {
        step: 3,
        title: 'Identity Verification',
        description: 'Complete the identity verification process',
        requirements: [
          'Government-issued photo ID',
          'Proof of address',
          'Additional verification questions'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 4,
        title: 'Processing',
        description: 'Request will be processed and verified',
        estimatedTime: '5-7 business days'
      },
      {
        step: 5,
        title: 'Receive Report',
        description: 'Report will be provided electronically or by mail',
        estimatedTime: '15 business days'
      }
    ]
  },
  {
    id: 'rentspree',
    name: 'RentSpree',
    type: 'tenant',
    description: 'Rental application and tenant screening platform',
    website: 'https://www.rentspree.com',
    phone: '1-844-736-8773',
    disputeAddress: 'RentSpree Consumer Services, 12100 Wilshire Blvd, Los Angeles, CA 90025',
    onlineDispute: true,
    processingTime: '30 days',
    cost: 'Free annually',
    frequency: 'Once per year free',
    requestSteps: [
      {
        step: 1,
        title: 'Contact RentSpree Support',
        description: 'Email or call to request your consumer file',
        url: 'https://www.rentspree.com/contact',
        estimatedTime: '5 minutes'
      },
      {
        step: 2,
        title: 'Submit Request Form',
        description: 'Complete the consumer disclosure request form',
        requirements: [
          'Full legal name',
          'Date of birth',
          'Email address used for applications',
          'Phone number',
          'Current address'
        ],
        estimatedTime: '5 minutes'
      },
      {
        step: 3,
        title: 'Provide Identification',
        description: 'Submit required identification documents',
        requirements: [
          'Government-issued photo ID',
          'Proof of current address',
          'Signed authorization form'
        ],
        estimatedTime: '3 minutes'
      },
      {
        step: 4,
        title: 'Verification Process',
        description: 'RentSpree will verify your identity and process the request',
        estimatedTime: '3-5 business days'
      },
      {
        step: 5,
        title: 'Receive Report',
        description: 'Report will be provided electronically',
        estimatedTime: '10 business days'
      }
    ]
  }
];

// Combined lookup function
export const getAllAgencies = (): ReportingAgency[] => {
  return [
    ...creditBureaus,
    ...consumerAgencies,
    ...employmentAgencies,
    ...tenantAgencies
  ];
};

export const getAgenciesByType = (type: 'credit' | 'consumer' | 'employment' | 'tenant'): ReportingAgency[] => {
  switch (type) {
    case 'credit':
      return creditBureaus;
    case 'consumer':
      return consumerAgencies;
    case 'employment':
      return employmentAgencies;
    case 'tenant':
      return tenantAgencies;
    default:
      return [];
  }
};

export const getAgencyById = (id: string): ReportingAgency | undefined => {
  return getAllAgencies().find(agency => agency.id === id);
};