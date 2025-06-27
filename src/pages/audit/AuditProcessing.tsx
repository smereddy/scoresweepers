import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Search,
  FileText,
  Shield,
  Clock
} from 'lucide-react';
import { simulateProcessing, type ReportType } from '../../data/auditWorkflow';
import { DetectedIssue } from '../../data/creditReportData';
import { ConsumerReportIssue } from '../../data/consumerReportData';
import LoadingSpinner from '../../components/LoadingSpinner';

interface AuditProcessingProps {
  reportType: ReportType;
  fileName: string;
  onNext: (analysisData: any) => void;
  onBack: () => void;
}

const AuditProcessing: React.FC<AuditProcessingProps> = ({ 
  reportType, 
  fileName, 
  onNext, 
  onBack 
}) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    issues: (DetectedIssue | ConsumerReportIssue)[];
    confidence: number;
    processingTime: number;
  } | null>(null);

  const processingSteps = [
    { step: 'Initializing AI models...', progress: 10 },
    { step: 'Extracting text from PDF...', progress: 25 },
    { step: 'Parsing document structure...', progress: 40 },
    { step: 'Analyzing personal information...', progress: 55 },
    { step: 'Checking account details...', progress: 70 },
    { step: 'Validating payment history...', progress: 85 },
    { step: 'Generating recommendations...', progress: 95 },
    { step: 'Analysis complete!', progress: 100 }
  ];

  useEffect(() => {
    const runAnalysis = async () => {
      setIsProcessing(true);
      
      // Simulate step-by-step processing
      for (const { step, progress: stepProgress } of processingSteps) {
        setCurrentStep(step);
        setProgress(stepProgress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Run the actual simulation
      const results = await simulateProcessing(reportType);
      setAnalysisResults(results);
      setIsProcessing(false);
      setAnalysisComplete(true);
    };

    runAnalysis();
  }, [reportType]);

  const handleContinue = () => {
    if (!analysisResults) return;

    const analysisData = {
      issuesFound: analysisResults.issues.length,
      confidence: analysisResults.confidence,
      processingTime: analysisResults.processingTime,
      issues: analysisResults.issues
    };

    onNext(analysisData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-400';
      case 'Medium': return 'bg-yellow-400';
      case 'Low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const getSeverityCount = (severity: string) => {
    if (!analysisResults) return 0;
    return analysisResults.issues.filter(issue => issue.severity === severity).length;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold font-space-grotesk mb-4">
          {isProcessing ? 'AI Analysis in Progress' : 'Analysis Complete'}
        </h2>
        <p className="text-xl text-white/80 font-plus-jakarta">
          {isProcessing 
            ? 'Our AI is analyzing your report for potential issues'
            : `Found ${analysisResults?.issues.length || 0} potential issues in your report`
          }
        </p>
      </div>

      {/* Processing Status */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#5CF0B2]/20 rounded-full flex items-center justify-center">
              {isProcessing ? (
                <Bot className="w-7 h-7 text-[#5CF0B2] animate-pulse" />
              ) : (
                <CheckCircle className="w-7 h-7 text-[#5CF0B2]" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white font-space-grotesk">
                {fileName}
              </h3>
              <p className="text-white/60 font-plus-jakarta">
                {isProcessing ? currentStep : 'Analysis completed successfully'}
              </p>
            </div>
          </div>
          
          {analysisComplete && (
            <div className="flex items-center space-x-3 text-[#5CF0B2]">
              <CheckCircle className="w-6 h-6" />
              <span className="font-plus-jakarta font-semibold">
                {analysisResults?.confidence}% confidence
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70 font-plus-jakarta">Progress</span>
            <span className="text-sm text-white/70 font-plus-jakarta">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-[#4C8DFF] to-[#5CF0B2] h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Processing Steps Visualization */}
        {isProcessing && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Search className="w-5 h-5 text-[#4C8DFF]" />
                <span className="font-semibold text-white font-space-grotesk">Scanning</span>
              </div>
              <p className="text-sm text-white/70 font-plus-jakarta">
                Extracting and parsing document content
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Bot className="w-5 h-5 text-[#5CF0B2]" />
                <span className="font-semibold text-white font-space-grotesk">Analyzing</span>
              </div>
              <p className="text-sm text-white/70 font-plus-jakarta">
                AI models detecting potential errors
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-5 h-5 text-[#4C8DFF]" />
                <span className="font-semibold text-white font-space-grotesk">Validating</span>
              </div>
              <p className="text-sm text-white/70 font-plus-jakarta">
                Cross-referencing and scoring confidence
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisComplete && analysisResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2 font-space-grotesk">
                {analysisResults.issues.length}
              </div>
              <div className="text-white/70 font-plus-jakarta">Total Issues</div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2 font-space-grotesk">
                {getSeverityCount('High')}
              </div>
              <div className="text-white/70 font-plus-jakarta">High Priority</div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2 font-space-grotesk">
                {getSeverityCount('Medium')}
              </div>
              <div className="text-white/70 font-plus-jakarta">Medium Priority</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2 font-space-grotesk">
                {getSeverityCount('Low')}
              </div>
              <div className="text-white/70 font-plus-jakarta">Low Priority</div>
            </div>
          </div>

          {/* Issues Preview */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <h3 className="text-xl font-semibold text-white mb-6 font-space-grotesk">
              Detected Issues Preview
            </h3>
            
            <div className="space-y-4">
              {analysisResults.issues.slice(0, 3).map((issue, index) => (
                <div key={issue.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(issue.severity)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white font-space-grotesk">{issue.type}</h4>
                        <span className="text-sm text-white/60 font-plus-jakarta">
                          {issue.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-white/80 font-plus-jakarta mb-2">{issue.description}</p>
                      <p className="text-sm text-[#5CF0B2] font-plus-jakarta">{issue.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {analysisResults.issues.length > 3 && (
                <div className="text-center text-white/60 font-plus-jakarta">
                  +{analysisResults.issues.length - 3} more issues found
                </div>
              )}
            </div>
          </div>

          {/* Processing Time */}
          <div className="bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-2 text-[#4C8DFF]">
              <Clock className="w-5 h-5" />
              <span className="font-plus-jakarta">
                Analysis completed in {(analysisResults.processingTime / 1000).toFixed(1)} seconds
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-plus-jakarta disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Upload</span>
        </button>

        <button
          onClick={handleContinue}
          disabled={!analysisComplete}
          className="bg-[#4C8DFF] hover:bg-[#3A7AE4] disabled:bg-[#4C8DFF]/50 text-white px-8 py-4 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
        >
          <span>Review Issues</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AuditProcessing;