import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
  Filter,
  X,
  Plus
} from 'lucide-react';
import { DetectedIssue } from '../../data/creditReportData';
import { ConsumerReportIssue } from '../../data/consumerReportData';
import { type ReportType } from '../../data/auditWorkflow';

interface AuditReviewProps {
  reportType: ReportType;
  issues: (DetectedIssue | ConsumerReportIssue)[];
  onNext: (reviewData: any) => void;
  onBack: () => void;
}

const AuditReview: React.FC<AuditReviewProps> = ({ 
  reportType, 
  issues, 
  onNext, 
  onBack 
}) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>(
    // Pre-select high severity issues
    issues.filter(issue => issue.severity === 'High').map(issue => issue.id)
  );
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState('');
  const [annotations, setAnnotations] = useState<Record<string, string>>({});

  const toggleIssueSelection = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const toggleDetails = (issueId: string) => {
    setShowDetails(prev => 
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const filteredIssues = issues.filter(issue => 
    severityFilter === 'all' || issue.severity === severityFilter
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-400';
      case 'Medium': return 'bg-yellow-400';
      case 'Low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'border-red-400/30';
      case 'Medium': return 'border-yellow-400/30';
      case 'Low': return 'border-green-400/30';
      default: return 'border-gray-400/30';
    }
  };

  const handleContinue = () => {
    const reviewData = {
      selectedIssues,
      userNotes: userNotes.trim() || undefined,
      annotations,
      validationComplete: true
    };

    onNext(reviewData);
  };

  const addAnnotation = (issueId: string, note: string) => {
    setAnnotations(prev => ({
      ...prev,
      [issueId]: note
    }));
  };

  const removeAnnotation = (issueId: string) => {
    setAnnotations(prev => {
      const newAnnotations = { ...prev };
      delete newAnnotations[issueId];
      return newAnnotations;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold font-space-grotesk mb-4">Review Detected Issues</h2>
        <p className="text-xl text-white/80 font-plus-jakarta">
          Select the issues you want to dispute and add any additional notes
        </p>
      </div>

      {/* Analysis Summary */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#5CF0B2]/20 rounded-full flex items-center justify-center">
              <Search className="w-7 h-7 text-[#5CF0B2]" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white font-space-grotesk">Analysis Results</h3>
              <p className="text-white/60 font-plus-jakarta">Found {issues.length} potential issues</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-[#5CF0B2]">
            <CheckCircle className="w-6 h-6" />
            <span className="font-plus-jakarta font-semibold">AI Analysis Complete</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1 font-space-grotesk">
              {issues.length}
            </div>
            <div className="text-sm text-white/70 font-plus-jakarta">Total Issues</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1 font-space-grotesk">
              {issues.filter(i => i.severity === 'High').length}
            </div>
            <div className="text-sm text-white/70 font-plus-jakarta">High Priority</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1 font-space-grotesk">
              {issues.filter(i => i.severity === 'Medium').length}
            </div>
            <div className="text-sm text-white/70 font-plus-jakarta">Medium Priority</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1 font-space-grotesk">
              {issues.filter(i => i.severity === 'Low').length}
            </div>
            <div className="text-sm text-white/70 font-plus-jakarta">Low Priority</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-white/60" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
            >
              <option value="all">All Severities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          
          <div className="text-sm text-white/60 font-plus-jakarta">
            {selectedIssues.length} of {filteredIssues.length} issues selected
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const isSelected = selectedIssues.includes(issue.id);
            const showingDetails = showDetails.includes(issue.id);
            const hasAnnotation = annotations[issue.id];
            
            return (
              <motion.div
                key={issue.id}
                className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'bg-[#4C8DFF]/10 border-[#4C8DFF]/50' 
                    : `bg-white/5 border-white/10 hover:border-white/20 ${getSeverityBorderColor(issue.severity)}`
                }`}
                onClick={() => toggleIssueSelection(issue.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 transition-all ${
                    isSelected 
                      ? 'bg-[#4C8DFF] border-[#4C8DFF]' 
                      : 'border-white/30 hover:border-white/50'
                  }`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-white text-lg font-space-grotesk">
                          {issue.type}
                        </h4>
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(issue.severity)}`}></div>
                        <span className="text-sm text-white/60 font-plus-jakarta">
                          {issue.severity} Priority
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-white/60 font-plus-jakarta">
                          {issue.confidence}% confidence
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDetails(issue.id);
                          }}
                          className="p-1 text-white/60 hover:text-white transition-colors"
                        >
                          {showingDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-white/80 font-plus-jakarta mb-3 leading-relaxed">
                      {issue.description}
                    </p>
                    
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-3">
                      <div className="flex items-start space-x-2">
                        <Search className="w-4 h-4 text-[#5CF0B2] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-[#5CF0B2] mb-1">AI Recommendation:</div>
                          <div className="text-sm text-white/70 font-plus-jakarta">{issue.recommendation}</div>
                        </div>
                      </div>
                    </div>

                    {showingDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/60 font-plus-jakarta">Affected Item:</span>
                            <div className="text-white font-plus-jakarta">{issue.affectedItem}</div>
                          </div>
                          <div>
                            <span className="text-white/60 font-plus-jakarta">Potential Impact:</span>
                            <div className="text-white font-plus-jakarta">{issue.potentialImpact}</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-white/60 font-plus-jakarta text-sm">Dispute Strategy:</span>
                          <div className="text-white font-plus-jakarta text-sm mt-1">{issue.disputeStrategy}</div>
                        </div>

                        {/* Annotation Input */}
                        <div className="pt-3 border-t border-white/10">
                          {!hasAnnotation ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const note = prompt('Add a note for this issue:');
                                if (note) addAnnotation(issue.id, note);
                              }}
                              className="flex items-center space-x-2 text-[#5CF0B2] hover:text-[#4AE09A] transition-colors text-sm font-plus-jakarta"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add note</span>
                            </button>
                          ) : (
                            <div className="bg-[#5CF0B2]/10 border border-[#5CF0B2]/20 rounded p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-semibold text-[#5CF0B2] mb-1">Your Note:</div>
                                  <div className="text-sm text-white/80 font-plus-jakarta">{hasAnnotation}</div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAnnotation(issue.id);
                                  }}
                                  className="text-white/60 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-white/60 font-plus-jakarta">
                          Impact: <span className="text-white">{issue.severity}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-white/50">
                        <Clock className="w-4 h-4" />
                        <span className="font-plus-jakarta">Est. 30 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selection Summary */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-white/80 font-plus-jakarta">
              <span className="font-semibold">{selectedIssues.length}</span> issues selected for dispute
            </div>
            <div className="text-sm text-white/60 font-plus-jakarta">
              Estimated processing time: 30-45 days
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <h3 className="text-xl font-semibold text-white mb-4 font-space-grotesk">
          Additional Notes (Optional)
        </h3>
        <p className="text-white/70 font-plus-jakarta mb-4">
          Add any additional context or specific instructions for the dispute process
        </p>
        
        <textarea
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          rows={4}
          placeholder="e.g., Focus on high-impact items first, specific documentation available..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 resize-none font-plus-jakarta"
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-plus-jakarta"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Processing</span>
        </button>

        <button
          onClick={handleContinue}
          disabled={selectedIssues.length === 0}
          className="bg-[#4C8DFF] hover:bg-[#3A7AE4] disabled:bg-[#4C8DFF]/50 text-white px-8 py-4 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
        >
          <span>Generate Documents</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {selectedIssues.length === 0 && (
        <div className="text-center">
          <p className="text-white/60 text-sm font-plus-jakarta">
            Select at least one issue to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditReview;