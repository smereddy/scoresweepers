import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ArrowRight, 
  ArrowLeft,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  Save
} from 'lucide-react';
import { DetectedIssue } from '../../data/creditReportData';
import { ConsumerReportIssue } from '../../data/consumerReportData';
import { type ReportType, generateDisputeLetter, generatePhoneScript } from '../../data/auditWorkflow';

interface AuditGenerationProps {
  reportType: ReportType;
  selectedIssues: string[];
  issues: (DetectedIssue | ConsumerReportIssue)[];
  onNext: (generationData: any) => void;
  onBack: () => void;
}

const AuditGeneration: React.FC<AuditGenerationProps> = ({ 
  reportType, 
  selectedIssues, 
  issues, 
  onNext, 
  onBack 
}) => {
  const [outputType, setOutputType] = useState<'letter' | 'script'>('letter');
  const [showPreview, setShowPreview] = useState(true);
  const [customizations, setCustomizations] = useState({
    recipientName: 'Experian Consumer Assistance',
    recipientAddress: 'P.O. Box 4500, Allen, TX 75013',
    senderName: 'John Michael Smith',
    senderAddress: '123 Main Street, Anytown, CA 90210'
  });

  const selectedIssueObjects = issues.filter(issue => selectedIssues.includes(issue.id));
  
  const generatedContent = outputType === 'letter' 
    ? generateDisputeLetter(selectedIssueObjects, customizations)
    : generatePhoneScript(selectedIssueObjects, customizations.recipientName);

  const handleCustomizationChange = (field: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = (format: 'pdf' | 'word') => {
    // Mock export functionality
    alert(`Exporting as ${format.toUpperCase()}... (Demo only)`);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  const handleSaveDraft = () => {
    // Mock save functionality
    alert('Draft saved successfully!');
  };

  const handleComplete = () => {
    const generationData = {
      letterType: 'dispute' as const,
      customizations,
      outputType,
      generatedAt: new Date().toISOString()
    };

    onNext(generationData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold font-space-grotesk mb-4">Generate Dispute Documents</h2>
        <p className="text-xl text-white/80 font-plus-jakarta">
          Professional dispute documentation ready for submission
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Output Type Selection */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">Output Type</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="outputType"
                  value="letter"
                  checked={outputType === 'letter'}
                  onChange={(e) => setOutputType(e.target.value as 'letter')}
                  className="w-4 h-4 text-[#4C8DFF] bg-transparent border-white/30 focus:ring-[#4C8DFF] focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-[#4C8DFF]" />
                  <span className="text-white font-plus-jakarta">Dispute Letter</span>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="outputType"
                  value="script"
                  checked={outputType === 'script'}
                  onChange={(e) => setOutputType(e.target.value as 'script')}
                  className="w-4 h-4 text-[#4C8DFF] bg-transparent border-white/30 focus:ring-[#4C8DFF] focus:ring-2"
                />
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-[#4C8DFF]" />
                  <span className="text-white font-plus-jakarta">Phone Script</span>
                </div>
              </label>
            </div>
          </div>

          {/* Customization Fields */}
          {outputType === 'letter' && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">Letter Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customizations.senderName}
                    onChange={(e) => handleCustomizationChange('senderName', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">
                    Your Address
                  </label>
                  <input
                    type="text"
                    value={customizations.senderAddress}
                    onChange={(e) => handleCustomizationChange('senderAddress', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={customizations.recipientName}
                    onChange={(e) => handleCustomizationChange('recipientName', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={customizations.recipientAddress}
                    onChange={(e) => handleCustomizationChange('recipientAddress', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Selected Issues Summary */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">
              Issues to Dispute ({selectedIssueObjects.length})
            </h3>
            <div className="space-y-3">
              {selectedIssueObjects.map((issue, index) => (
                <div key={issue.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold font-space-grotesk text-sm">
                      {index + 1}. {issue.type}
                    </div>
                    <div className="text-xs text-white/60 font-plus-jakarta">{issue.severity}</div>
                  </div>
                  <div className="text-xs text-white/70 font-plus-jakarta">{issue.affectedItem}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">Export Options</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-4 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export as PDF</span>
              </button>
              <button
                onClick={() => handleExport('word')}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export as Word</span>
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2"
              >
                <Copy className="w-5 h-5" />
                <span>Copy to Clipboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white font-space-grotesk">
              {outputType === 'letter' ? 'Letter Preview' : 'Script Preview'}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-[#5CF0B2]">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-plus-jakarta">Ready</span>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 text-[#5CF0B2] hover:text-[#4AE09A] transition-colors font-plus-jakarta"
              >
                {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span>{showPreview ? 'Hide' : 'Show'}</span>
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 max-h-96 overflow-y-auto">
              <pre className="text-sm text-white/90 font-plus-jakarta leading-relaxed whitespace-pre-wrap">
                {generatedContent}
              </pre>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-white/60 font-plus-jakarta">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Est. 30-day response</span>
                </div>
                {outputType === 'letter' && (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Certified mail recommended</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#5CF0B2]/10 border border-[#5CF0B2]/20 rounded-lg">
              <div className="text-sm text-white/80 font-plus-jakarta">
                <div className="font-semibold text-white mb-2">Next Steps:</div>
                <ul className="space-y-1 text-white/70">
                  {outputType === 'letter' ? (
                    <>
                      <li>• Print and sign the letter</li>
                      <li>• Include supporting documentation</li>
                      <li>• Send via certified mail with return receipt</li>
                      <li>• Keep copies for your records</li>
                    </>
                  ) : (
                    <>
                      <li>• Review the script before calling</li>
                      <li>• Have supporting documents ready</li>
                      <li>• Call during business hours</li>
                      <li>• Take notes and get reference numbers</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-plus-jakarta"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Review</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleSaveDraft}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleComplete}
            className="bg-[#5CF0B2] hover:bg-[#4AE09A] text-[#050D25] px-8 py-4 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Complete Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditGeneration;