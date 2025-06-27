import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  Briefcase, 
  Home,
  ArrowRight,
  Info,
  Clock,
  FileText,
  CheckCircle,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { reportTypeConfigs, type ReportType } from '../../data/auditWorkflow';
import { getAgenciesByType, ReportingAgency } from '../../data/reportingAgencies';
import ReportRequestGuide from '../../components/ReportRequestGuide';

interface AuditSetupProps {
  onNext: (setupData: any) => void;
}

const AuditSetup: React.FC<AuditSetupProps> = ({ onNext }) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | ''>('');
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [purpose, setPurpose] = useState('');
  const [showRequestGuide, setShowRequestGuide] = useState(false);
  const [selectedAgencyForGuide, setSelectedAgencyForGuide] = useState<ReportingAgency | null>(null);

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'credit': return CreditCard;
      case 'consumer': return Shield;
      case 'employment': return Briefcase;
      case 'tenant': return Home;
    }
  };

  const getReportTypeColor = (type: ReportType) => {
    const config = reportTypeConfigs[type];
    switch (config.color) {
      case 'blue': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'green': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'purple': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'orange': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      default: return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    }
  };

  const handleReportTypeSelect = (type: ReportType) => {
    setSelectedReportType(type);
    setSelectedBureaus([]);
    setSelectedAgencies([]);
  };

  const toggleBureau = (bureau: string) => {
    setSelectedBureaus(prev => 
      prev.includes(bureau) 
        ? prev.filter(b => b !== bureau)
        : [...prev, bureau]
    );
  };

  const toggleAgency = (agency: string) => {
    setSelectedAgencies(prev => 
      prev.includes(agency) 
        ? prev.filter(a => a !== agency)
        : [...prev, agency]
    );
  };

  const handleShowRequestGuide = (agencyId: string) => {
    const agencies = getAgenciesByType(selectedReportType as ReportType);
    const agency = agencies.find(a => a.id === agencyId);
    if (agency) {
      setSelectedAgencyForGuide(agency);
      setShowRequestGuide(true);
    }
  };

  const handleContinue = () => {
    if (!selectedReportType) return;

    const setupData = {
      reportType: selectedReportType,
      bureaus: selectedBureaus.length > 0 ? selectedBureaus : undefined,
      agencies: selectedAgencies.length > 0 ? selectedAgencies : undefined,
      purpose: purpose || undefined
    };

    onNext(setupData);
  };

  const isValid = selectedReportType && (
    (selectedReportType === 'credit' && selectedBureaus.length > 0) ||
    (['consumer', 'employment', 'tenant'].includes(selectedReportType) && selectedAgencies.length > 0)
  );

  const getAvailableOptions = () => {
    if (!selectedReportType) return [];
    
    if (selectedReportType === 'credit') {
      return reportTypeConfigs[selectedReportType].bureaus || [];
    } else {
      return reportTypeConfigs[selectedReportType].agencies || [];
    }
  };

  const getAgencyInfo = (optionName: string) => {
    if (!selectedReportType) return null;
    
    const agencies = getAgenciesByType(selectedReportType as ReportType);
    return agencies.find(agency => 
      agency.name === optionName || 
      agency.name.toLowerCase().includes(optionName.toLowerCase())
    );
  };

  return (
    <div className="space-y-8">
      {/* Report Type Selection */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <h3 className="text-2xl font-semibold font-space-grotesk mb-6">Select Report Type</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {(Object.keys(reportTypeConfigs) as ReportType[]).map((type) => {
            const config = reportTypeConfigs[type];
            const IconComponent = getReportTypeIcon(type);
            const isSelected = selectedReportType === type;
            
            return (
              <motion.button
                key={type}
                onClick={() => handleReportTypeSelect(type)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected 
                    ? 'border-[#4C8DFF] bg-[#4C8DFF]/10' 
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getReportTypeColor(type)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white font-space-grotesk mb-2">
                      {config.name}
                    </h4>
                    <p className="text-white/70 font-plus-jakarta mb-3">
                      {config.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{config.processingTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{config.maxFileSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-[#4C8DFF]" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bureau/Agency Selection */}
      {selectedReportType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold font-space-grotesk">
              {selectedReportType === 'credit' ? 'Select Credit Bureaus' : 'Select Reporting Agencies'}
            </h3>
            <div className="text-sm text-white/60 font-plus-jakarta">
              Don't have a report yet? We'll show you how to get one.
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAvailableOptions().map((option) => {
              const isSelected = selectedReportType === 'credit' 
                ? selectedBureaus.includes(option)
                : selectedAgencies.includes(option);
              
              const agencyInfo = getAgencyInfo(option);
              
              return (
                <div key={option} className="space-y-2">
                  <button
                    onClick={() => selectedReportType === 'credit' ? toggleBureau(option) : toggleAgency(option)}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#5CF0B2] bg-[#5CF0B2]/10 text-white'
                        : 'border-white/20 hover:border-white/40 bg-white/5 text-white/80'
                    }`}
                  >
                    <div className="font-semibold font-space-grotesk">{option}</div>
                    {agencyInfo && (
                      <div className="text-xs text-white/60 font-plus-jakarta mt-1">
                        {agencyInfo.cost} • {agencyInfo.frequency}
                      </div>
                    )}
                  </button>
                  
                  {agencyInfo && (
                    <button
                      onClick={() => handleShowRequestGuide(agencyInfo.id)}
                      className="w-full flex items-center justify-center space-x-2 text-[#4C8DFF] hover:text-[#3A7AE4] transition-colors text-sm font-plus-jakarta py-2"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>How to request report</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Request Help Section */}
          <div className="mt-6 bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-[#4C8DFF] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2 font-space-grotesk">
                  Need to Request a Report First?
                </h4>
                <p className="text-white/80 font-plus-jakarta text-sm mb-3">
                  If you don't have a recent report, click "How to request report" next to any agency above. 
                  We'll guide you through the process step-by-step.
                </p>
                <div className="text-xs text-white/60 font-plus-jakarta">
                  💡 Tip: You're entitled to one free report per year from each agency
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Purpose (Optional) */}
      {selectedReportType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
        >
          <h3 className="text-xl font-semibold font-space-grotesk mb-4">Purpose (Optional)</h3>
          <p className="text-white/70 font-plus-jakarta mb-4">
            Help us customize the analysis for your specific needs
          </p>
          
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Mortgage application, Employment screening, Personal review"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
          />
        </motion.div>
      )}

      {/* Common Issues Info */}
      {selectedReportType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-[#4C8DFF] mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white mb-2 font-space-grotesk">
                Common Issues We Detect
              </h4>
              <ul className="text-white/80 font-plus-jakarta space-y-1">
                {reportTypeConfigs[selectedReportType].commonIssues.map((issue, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-[#4C8DFF] rounded-full"></div>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className="bg-[#4C8DFF] hover:bg-[#3A7AE4] disabled:bg-[#4C8DFF]/50 text-white px-8 py-4 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
        >
          <span>Continue to Upload</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Report Request Guide Modal */}
      {selectedAgencyForGuide && (
        <ReportRequestGuide
          agency={selectedAgencyForGuide}
          isOpen={showRequestGuide}
          onClose={() => {
            setShowRequestGuide(false);
            setSelectedAgencyForGuide(null);
          }}
        />
      )}
    </div>
  );
};

export default AuditSetup;