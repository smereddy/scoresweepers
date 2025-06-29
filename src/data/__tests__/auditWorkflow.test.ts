import { describe, it, expect, vi } from 'vitest';
import { 
  simulateProcessing, 
  generateDisputeLetter, 
  generatePhoneScript,
  reportTypeConfigs 
} from '../auditWorkflow';
import { mockDetectedIssues } from '../creditReportData';

describe('auditWorkflow', () => {
  describe('simulateProcessing', () => {
    it('simulates processing with progress callback', async () => {
      const onProgress = vi.fn();
      
      const result = await simulateProcessing('credit', onProgress);
      
      expect(onProgress).toHaveBeenCalled();
      expect(result.issues).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    it('returns credit issues for credit report type', async () => {
      const result = await simulateProcessing('credit');
      
      expect(result.issues).toEqual(mockDetectedIssues);
      expect(result.confidence).toBe(92);
    });

    it('returns consumer issues for non-credit report types', async () => {
      const result = await simulateProcessing('consumer');
      
      expect(result.confidence).toBe(88);
      expect(result.issues).toBeDefined();
    });
  });

  describe('generateDisputeLetter', () => {
    it('generates a dispute letter with default customizations', () => {
      const letter = generateDisputeLetter(mockDetectedIssues.slice(0, 2));
      
      expect(letter).toContain('Dear Sir or Madam');
      expect(letter).toContain('John Michael Smith');
      expect(letter).toContain('DISPUTED ITEMS:');
      expect(letter).toContain('Fair Credit Reporting Act');
    });

    it('applies custom customizations', () => {
      const customizations = {
        senderName: 'Jane Doe',
        recipientName: 'Equifax Consumer Services',
      };
      
      const letter = generateDisputeLetter(mockDetectedIssues.slice(0, 1), customizations);
      
      expect(letter).toContain('Jane Doe');
      expect(letter).toContain('Equifax Consumer Services');
    });

    it('includes all provided issues', () => {
      const issues = mockDetectedIssues.slice(0, 3);
      const letter = generateDisputeLetter(issues);
      
      issues.forEach((issue, index) => {
        expect(letter).toContain(`${index + 1}. ${issue.description}`);
        expect(letter).toContain(issue.recommendation);
        expect(letter).toContain(issue.affectedItem);
      });
    });
  });

  describe('generatePhoneScript', () => {
    it('generates a phone script with bureau name', () => {
      const script = generatePhoneScript(mockDetectedIssues.slice(0, 2), 'Experian');
      
      expect(script).toContain('PHONE DISPUTE SCRIPT - EXPERIAN');
      expect(script).toContain('Hello, I\'m calling to dispute');
      expect(script).toContain('IMPORTANT NOTES:');
      expect(script).toContain('FOLLOW-UP ACTIONS:');
    });

    it('includes all provided issues in script', () => {
      const issues = mockDetectedIssues.slice(0, 2);
      const script = generatePhoneScript(issues);
      
      issues.forEach((issue, index) => {
        expect(script).toContain(`Item ${index + 1} - ${issue.type}`);
        expect(script).toContain(issue.affectedItem);
      });
    });

    it('uses default bureau name when not provided', () => {
      const script = generatePhoneScript(mockDetectedIssues.slice(0, 1));
      
      expect(script).toContain('PHONE DISPUTE SCRIPT - CREDIT BUREAU');
    });
  });

  describe('reportTypeConfigs', () => {
    it('contains all required report types', () => {
      expect(reportTypeConfigs.credit).toBeDefined();
      expect(reportTypeConfigs.consumer).toBeDefined();
      expect(reportTypeConfigs.employment).toBeDefined();
      expect(reportTypeConfigs.tenant).toBeDefined();
    });

    it('has required properties for each report type', () => {
      Object.values(reportTypeConfigs).forEach(config => {
        expect(config.name).toBeDefined();
        expect(config.description).toBeDefined();
        expect(config.icon).toBeDefined();
        expect(config.color).toBeDefined();
        expect(config.supportedFormats).toBeDefined();
        expect(config.maxFileSize).toBeDefined();
        expect(config.processingTime).toBeDefined();
        expect(config.commonIssues).toBeDefined();
        expect(Array.isArray(config.commonIssues)).toBe(true);
      });
    });
  });
});