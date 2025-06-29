import { describe, it, expect } from 'vitest';
import { 
  mockCreditReport, 
  mockDetectedIssues, 
  bureauInfo,
  disputeLetterTemplates 
} from '../creditReportData';

describe('creditReportData', () => {
  describe('mockCreditReport', () => {
    it('has required structure', () => {
      expect(mockCreditReport.reportDate).toBeDefined();
      expect(mockCreditReport.bureau).toBeDefined();
      expect(mockCreditReport.personalInfo).toBeDefined();
      expect(mockCreditReport.accounts).toBeDefined();
      expect(mockCreditReport.inquiries).toBeDefined();
      expect(mockCreditReport.publicRecords).toBeDefined();
    });

    it('has valid personal info', () => {
      const { personalInfo } = mockCreditReport;
      expect(personalInfo.name).toBeDefined();
      expect(personalInfo.ssn).toBeDefined();
      expect(personalInfo.dateOfBirth).toBeDefined();
      expect(Array.isArray(personalInfo.addresses)).toBe(true);
      expect(Array.isArray(personalInfo.phoneNumbers)).toBe(true);
      expect(Array.isArray(personalInfo.employers)).toBe(true);
    });

    it('has valid accounts', () => {
      expect(Array.isArray(mockCreditReport.accounts)).toBe(true);
      mockCreditReport.accounts.forEach(account => {
        expect(account.id).toBeDefined();
        expect(account.creditorName).toBeDefined();
        expect(account.accountType).toBeDefined();
        expect(account.status).toBeDefined();
        expect(account.bureau).toBeDefined();
      });
    });

    it('has valid credit score', () => {
      const { creditScore } = mockCreditReport;
      expect(creditScore).toBeDefined();
      expect(creditScore!.score).toBeGreaterThan(0);
      expect(creditScore!.model).toBeDefined();
      expect(Array.isArray(creditScore!.factors)).toBe(true);
    });
  });

  describe('mockDetectedIssues', () => {
    it('has valid structure', () => {
      expect(Array.isArray(mockDetectedIssues)).toBe(true);
      expect(mockDetectedIssues.length).toBeGreaterThan(0);
    });

    it('has required properties for each issue', () => {
      mockDetectedIssues.forEach(issue => {
        expect(issue.id).toBeDefined();
        expect(issue.type).toBeDefined();
        expect(issue.severity).toBeDefined();
        expect(issue.description).toBeDefined();
        expect(issue.recommendation).toBeDefined();
        expect(issue.affectedItem).toBeDefined();
        expect(issue.bureau).toBeDefined();
        expect(issue.confidence).toBeGreaterThan(0);
        expect(issue.confidence).toBeLessThanOrEqual(100);
        expect(issue.potentialImpact).toBeDefined();
        expect(issue.disputeStrategy).toBeDefined();
      });
    });

    it('has valid severity levels', () => {
      const validSeverities = ['High', 'Medium', 'Low'];
      mockDetectedIssues.forEach(issue => {
        expect(validSeverities).toContain(issue.severity);
      });
    });

    it('has valid bureau names', () => {
      const validBureaus = ['Experian', 'Equifax', 'TransUnion'];
      mockDetectedIssues.forEach(issue => {
        expect(validBureaus).toContain(issue.bureau);
      });
    });
  });

  describe('bureauInfo', () => {
    it('contains all major bureaus', () => {
      expect(bureauInfo.Experian).toBeDefined();
      expect(bureauInfo.Equifax).toBeDefined();
      expect(bureauInfo.TransUnion).toBeDefined();
    });

    it('has required properties for each bureau', () => {
      Object.values(bureauInfo).forEach(bureau => {
        expect(bureau.name).toBeDefined();
        expect(bureau.disputeAddress).toBeDefined();
        expect(bureau.phone).toBeDefined();
        expect(bureau.website).toBeDefined();
        expect(typeof bureau.onlineDispute).toBe('boolean');
        expect(bureau.processingTime).toBeDefined();
      });
    });
  });

  describe('disputeLetterTemplates', () => {
    it('contains required templates', () => {
      expect(disputeLetterTemplates.paymentHistory).toBeDefined();
      expect(disputeLetterTemplates.publicRecord).toBeDefined();
      expect(disputeLetterTemplates.inquiry).toBeDefined();
    });

    it('has required properties for each template', () => {
      Object.values(disputeLetterTemplates).forEach(template => {
        expect(template.subject).toBeDefined();
        expect(template.template).toBeDefined();
        expect(template.template).toContain('{bureau_name}');
        expect(template.template).toContain('{consumer_name}');
      });
    });
  });
});