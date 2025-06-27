import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Mail,
  Globe,
  FileText,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ReportingAgency, ReportRequestStep } from '../data/reportingAgencies';

interface ReportRequestGuideProps {
  agency: ReportingAgency;
  isOpen: boolean;
  onClose: () => void;
}

const ReportRequestGuide: React.FC<ReportRequestGuideProps> = ({ 
  agency, 
  isOpen, 
  onClose 
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const getTotalEstimatedTime = () => {
    const lastStep = agency.requestSteps[agency.requestSteps.length - 1];
    return lastStep.estimatedTime || 'Varies';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white font-space-grotesk">
                    How to Request Your {agency.name} Report
                  </h2>
                  <p className="text-white/80 font-plus-jakarta mt-1">
                    {agency.description}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Agency Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="font-semibold text-white mb-3 font-space-grotesk">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-[#4C8DFF]" />
                      <a 
                        href={agency.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#4C8DFF] hover:text-[#3A7AE4] transition-colors font-plus-jakarta"
                      >
                        {agency.website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-[#5CF0B2]" />
                      <span className="text-white font-plus-jakarta">{agency.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Mail className="w-4 h-4 text-[#5CF0B2] mt-0.5" />
                      <span className="text-white font-plus-jakarta text-xs leading-relaxed">
                        {agency.disputeAddress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="font-semibold text-white mb-3 font-space-grotesk">Report Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-plus-jakarta">Cost:</span>
                      <span className="text-white font-plus-jakarta">{agency.cost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-plus-jakarta">Frequency:</span>
                      <span className="text-white font-plus-jakarta">{agency.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-plus-jakarta">Processing:</span>
                      <span className="text-white font-plus-jakarta">{agency.processingTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 font-plus-jakarta">Total Time:</span>
                      <span className="text-white font-plus-jakarta">{getTotalEstimatedTime()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white font-space-grotesk mb-4">
                  Step-by-Step Instructions
                </h3>

                {agency.requestSteps.map((step, index) => (
                  <div key={step.step} className="bg-white/10 rounded-xl border border-white/20 overflow-hidden">
                    <button
                      onClick={() => toggleStep(step.step)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-[#4C8DFF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white font-space-grotesk">{step.title}</h4>
                          {step.estimatedTime && (
                            <div className="flex items-center space-x-1 text-sm text-white/80 mt-1">
                              <Clock className="w-3 h-3" />
                              <span className="font-plus-jakarta">{step.estimatedTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {expandedStep === step.step ? (
                        <ChevronDown className="w-5 h-5 text-white/80" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white/80" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedStep === step.step && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-white/20">
                            <p className="text-white/90 font-plus-jakarta mb-4 leading-relaxed">
                              {step.description}
                            </p>

                            {step.url && (
                              <div className="mb-4">
                                <a
                                  href={step.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-2 bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-4 py-2 rounded-lg font-semibold transition-colors font-plus-jakarta"
                                >
                                  <span>Visit Website</span>
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            )}

                            {step.requirements && step.requirements.length > 0 && (
                              <div className="bg-[#5CF0B2]/15 border border-[#5CF0B2]/30 rounded-lg p-3">
                                <h5 className="font-semibold text-[#5CF0B2] mb-2 font-space-grotesk text-sm">
                                  Required Information:
                                </h5>
                                <ul className="space-y-1">
                                  {step.requirements.map((req, reqIndex) => (
                                    <li key={reqIndex} className="flex items-center space-x-2 text-sm">
                                      <CheckCircle className="w-3 h-3 text-[#5CF0B2] flex-shrink-0" />
                                      <span className="text-white/90 font-plus-jakarta">{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Important Notes */}
              <div className="mt-8 bg-yellow-500/15 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2 font-space-grotesk">Important Notes</h4>
                    <ul className="text-white/90 font-plus-jakarta text-sm space-y-1">
                      <li>• Keep copies of all documents you submit</li>
                      <li>• Allow extra time for mail delivery and processing</li>
                      <li>• Contact the agency if you don't receive your report within the expected timeframe</li>
                      <li>• You are entitled to one free report per year from each agency</li>
                      <li>• Save your report as a PDF for upload to ScoreSweep</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="bg-white/15 hover:bg-white/25 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta"
                >
                  Close Guide
                </button>
                
                <a
                  href={agency.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta inline-flex items-center space-x-2"
                >
                  <span>Start Request</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportRequestGuide;