import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Upload, 
  FileText, 
  Bot,
  Eye,
  Download,
  Save,
  AlertTriangle,
  Clock,
  User,
  LogOut,
  Bell,
  CreditCard,
  Shield,
  Briefcase,
  MessageSquare,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { reportTypes, mockExtractedData, letterTemplates } from '../../data/mockData';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingSpinner from '../../components/LoadingSpinner';

type WizardStep = 'setup' | 'processing' | 'generation';

const AuditWizard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('setup');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [actionType, setActionType] = useState<'new' | 'upload' | 'draft'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('dispute-letter');
  const [customFields, setCustomFields] = useState({
    recipientName: 'Experian Consumer Assistance',
    recipientAddress: 'P.O. Box 4500, Allen, TX 75013',
    yourName: user?.user_metadata?.full_name || 'John Smith',
    yourAddress: '123 Main St, Anytown, ST 12345',
    accountNumber: '****1234',
    disputeReason: 'Incorrect payment history information'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [validationChecks, setValidationChecks] = useState({
    personalInfo: true,
    accountDetails: false,
    paymentHistory: true,
    inquiries: false
  });
  const [annotations, setAnnotations] = useState<string[]>([]);
  const [newAnnotation, setNewAnnotation] = useState('');

  const getStepIcon = (step: WizardStep) => {
    switch (step) {
      case 'setup': return Upload;
      case 'processing': return Bot;
      case 'generation': return FileText;
    }
  };

  const getReportTypeIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return CreditCard;
      case 'Shield': return Shield;
      case 'Briefcase': return Briefcase;
      case 'User': return User;
      default: return FileText;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const handleUseSampleFile = () => {
    const mockFile = new File([''], 'sample-credit-report.pdf', { type: 'application/pdf' });
    setUploadedFile(mockFile);
  };

  const handleNextStep = async () => {
    if (currentStep === 'setup' && uploadedFile && selectedReportType) {
      setIsProcessing(true);
      setCurrentStep('processing');
      
      // Simulate processing with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProcessingProgress(i);
      }
      
      setIsProcessing(false);
    } else if (currentStep === 'processing') {
      setCurrentStep('generation');
    }
  };

  const handleSaveDraft = () => {
    // Mock save functionality
    alert('Draft saved successfully!');
    navigate('/dashboard');
  };

  const handleExport = (format: 'pdf' | 'word') => {
    // Mock export functionality
    alert(`Exporting as ${format.toUpperCase()}... (Demo only)`);
  };

  const addAnnotation = () => {
    if (newAnnotation.trim()) {
      setAnnotations([...annotations, newAnnotation.trim()]);
      setNewAnnotation('');
    }
  };

  const removeAnnotation = (index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
  };

  const toggleValidationCheck = (key: keyof typeof validationChecks) => {
    setValidationChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const steps = [
    { id: 'setup', label: 'Setup', icon: Upload },
    { id: 'processing', label: 'Processing', icon: Bot },
    { id: 'generation', label: 'Generation', icon: FileText }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const letterPreview = `Dear ${customFields.recipientName},

I am writing to dispute the following information in my credit file. The items listed below are inaccurate or incomplete, and I am requesting that they be removed or corrected.

ACCOUNT INFORMATION:
Account Number: ${customFields.accountNumber}
Dispute Reason: ${customFields.disputeReason}

I have enclosed copies of supporting documentation that verify the inaccuracies of these items. Please investigate these matters and remove or correct the inaccurate information as soon as possible.

Under the Fair Credit Reporting Act, you have 30 days to investigate and respond to this dispute. Please send me written confirmation of the results of your investigation.

Sincerely,

${customFields.yourName}
${customFields.yourAddress}
[Date]

Enclosures: Supporting documentation`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050D25] via-[#0A1B3A] to-[#102B4F] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#4C8DFF] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#5CF0B2] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#4C8DFF] rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#5CF0B2] rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#050D25]" />
              </div>
              <span className="text-2xl font-bold font-space-grotesk">ScoreSweep</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#4C8DFF]/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#4C8DFF]" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold font-space-grotesk">{user?.user_metadata?.full_name || user?.email}</div>
                  <div className="text-xs text-white/60 font-plus-jakarta">{user?.email}</div>
                </div>
              </div>

              <button
                onClick={signOut}
                className="p-2 text-white/60 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = index < currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive ? 'bg-[#4C8DFF] text-white' :
                      isCompleted ? 'bg-[#5CF0B2] text-[#050D25]' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className={`font-semibold font-space-grotesk ${
                        isActive ? 'text-white' : isCompleted ? 'text-[#5CF0B2]' : 'text-white/60'
                      }`}>
                        {step.label}
                      </div>
                      <div className="text-sm text-white/50 font-plus-jakarta">Step {index + 1}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      index < currentStepIndex ? 'bg-[#5CF0B2]' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'New Audit', current: true }
          ]} />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Initial Setup */}
          {currentStep === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold font-space-grotesk mb-4">Create New Audit</h1>
                <p className="text-xl text-white/80 font-plus-jakarta">Set up your audit parameters and upload your report</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Report Type Selection */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold font-space-grotesk mb-6">Select Report Type</h3>
                  <div className="space-y-3">
                    {reportTypes.map((type) => {
                      const IconComponent = getReportTypeIcon(type.icon);
                      return (
                        <label key={type.id} className="flex items-center space-x-4 p-4 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="reportType"
                            value={type.id}
                            checked={selectedReportType === type.id}
                            onChange={(e) => setSelectedReportType(e.target.value)}
                            className="w-4 h-4 text-[#4C8DFF] bg-transparent border-white/30 focus:ring-[#4C8DFF] focus:ring-2"
                          />
                          <div className="w-10 h-10 bg-[#4C8DFF]/20 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-[#4C8DFF]" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white font-space-grotesk">{type.name}</div>
                            <div className="text-sm text-white/60 font-plus-jakarta">{type.description}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Action Selection */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold font-space-grotesk mb-6">Choose Action</h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="actionType"
                        value="new"
                        checked={actionType === 'new'}
                        onChange={(e) => setActionType(e.target.value as 'new')}
                        className="w-4 h-4 text-[#4C8DFF] bg-transparent border-white/30 focus:ring-[#4C8DFF] focus:ring-2"
                      />
                      <div>
                        <div className="font-semibold text-white font-space-grotesk">New Report Request</div>
                        <div className="text-sm text-white/60 font-plus-jakarta">Request a new report from the bureau</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="actionType"
                        value="upload"
                        checked={actionType === 'upload'}
                        onChange={(e) => setActionType(e.target.value as 'upload')}
                        className="w-4 h-4 text-[#4C8DFF] bg-transparent border-white/30 focus:ring-[#4C8DFF] focus:ring-2"
                      />
                      <div>
                        <div className="font-semibold text-white font-space-grotesk">Upload Existing Report</div>
                        <div className="text-sm text-white/60 font-plus-jakarta">Upload a PDF report you already have</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-4 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="actionType"
                        value="draft"
                        checked={actionType === 'draft'}
                        onChange={(e) => setActionType(e.target.value as 'draft')}
                        className="w-4 h-4 text-[#4C8DFF] bg-transparent border-white/30 focus:ring-[#4C8DFF] focus:ring-2"
                      />
                      <div>
                        <div className="font-semibold text-white font-space-grotesk">Save as Draft</div>
                        <div className="text-sm text-white/60 font-plus-jakarta">Save current settings and continue later</div>
                      </div>
                    </label>
                  </div>

                  {actionType === 'new' && (
                    <div className="mt-6 p-4 bg-[#4C8DFF]/10 border border-[#4C8DFF]/20 rounded-lg">
                      <div className="text-sm text-white/80 font-plus-jakarta">
                        <div className="font-semibold text-white mb-2">Report Request Guide:</div>
                        <ul className="space-y-1 text-white/70">
                          <li>• Visit annualcreditreport.com for free reports</li>
                          <li>• Request from all three bureaus (Experian, Equifax, TransUnion)</li>
                          <li>• Download as PDF and return here to upload</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {actionType === 'upload' && (
                    <div className="mt-6">
                      {!uploadedFile ? (
                        <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-[#4C8DFF]/50 transition-colors">
                          <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                          <div className="space-y-2">
                            <div className="font-semibold text-white font-space-grotesk">Upload Report</div>
                            <div className="text-sm text-white/60 font-plus-jakarta">PDF files up to 10MB</div>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="inline-block bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors font-plus-jakarta"
                            >
                              Choose File
                            </label>
                            <div className="text-white/50 font-plus-jakarta">or</div>
                            <button
                              onClick={handleUseSampleFile}
                              className="text-[#5CF0B2] hover:text-[#4AE09A] font-plus-jakarta transition-colors"
                            >
                              Use Sample File
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#5CF0B2]/10 border border-[#5CF0B2]/20 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-[#5CF0B2]" />
                            <div>
                              <div className="font-semibold text-white font-space-grotesk">{uploadedFile.name}</div>
                              <div className="text-sm text-white/60 font-plus-jakarta">Ready for processing</div>
                            </div>
                            <button
                              onClick={() => setUploadedFile(null)}
                              className="ml-auto text-white/60 hover:text-white transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Link to="/dashboard">
                  <button className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-plus-jakarta">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                  </button>
                </Link>

                <div className="flex items-center space-x-4">
                  {actionType === 'draft' ? (
                    <button
                      onClick={handleSaveDraft}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Draft</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextStep}
                      disabled={!selectedReportType || (actionType === 'upload' && !uploadedFile)}
                      className="bg-[#4C8DFF] hover:bg-[#3A7AE4] disabled:bg-[#4C8DFF]/50 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Report Processing */}
          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold font-space-grotesk mb-4">Processing Report</h1>
                <p className="text-xl text-white/80 font-plus-jakarta">AI is analyzing your report and extracting key information</p>
              </div>

              {isProcessing ? (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                  <LoadingSpinner size="lg" color="primary" />
                  <div className="mt-6 space-y-4">
                    <div className="text-xl font-semibold font-space-grotesk">Processing Report...</div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-[#4C8DFF] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-white/60 font-plus-jakarta">{processingProgress}% complete</div>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Extracted Data */}
                  <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    <h3 className="text-xl font-semibold font-space-grotesk mb-6">Extracted Data</h3>
                    
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold font-space-grotesk mb-3">Personal Information</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm font-plus-jakarta">
                          <div>
                            <span className="text-white/60">Name:</span>
                            <span className="text-white ml-2">{mockExtractedData.personalInfo.name}</span>
                          </div>
                          <div>
                            <span className="text-white/60">SSN:</span>
                            <span className="text-white ml-2">{mockExtractedData.personalInfo.ssn}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Address:</span>
                            <span className="text-white ml-2">{mockExtractedData.personalInfo.address}</span>
                          </div>
                          <div>
                            <span className="text-white/60">DOB:</span>
                            <span className="text-white ml-2">{mockExtractedData.personalInfo.dateOfBirth}</span>
                          </div>
                        </div>
                      </div>

                      {/* Accounts */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold font-space-grotesk mb-3">Account Information</h4>
                        <div className="space-y-3">
                          {mockExtractedData.accounts.map((account, index) => (
                            <div key={index} className="bg-white/5 rounded p-3 border border-white/10">
                              <div className="grid md:grid-cols-2 gap-2 text-sm font-plus-jakarta">
                                <div>
                                  <span className="text-white/60">Creditor:</span>
                                  <span className="text-white ml-2">{account.creditor}</span>
                                </div>
                                <div>
                                  <span className="text-white/60">Account:</span>
                                  <span className="text-white ml-2">{account.accountNumber}</span>
                                </div>
                                <div>
                                  <span className="text-white/60">Balance:</span>
                                  <span className="text-white ml-2">{account.balance}</span>
                                </div>
                                <div>
                                  <span className="text-white/60">Status:</span>
                                  <span className="text-white ml-2">{account.status}</span>
                                </div>
                              </div>
                              <div className="mt-2 text-sm font-plus-jakarta">
                                <span className="text-white/60">Payment History:</span>
                                <span className="text-white ml-2">{account.paymentHistory}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Inquiries */}
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold font-space-grotesk mb-3">Recent Inquiries</h4>
                        <div className="space-y-2">
                          {mockExtractedData.inquiries.map((inquiry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm font-plus-jakarta">
                              <span className="text-white">{inquiry.company}</span>
                              <span className="text-white/60">{inquiry.date}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                inquiry.type === 'Hard Inquiry' 
                                  ? 'bg-red-400/20 text-red-400' 
                                  : 'bg-green-400/20 text-green-400'
                              }`}>
                                {inquiry.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validation & Annotations */}
                  <div className="space-y-6">
                    {/* Validation Checklist */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                      <h3 className="text-lg font-semibold font-space-grotesk mb-4">Validation Checklist</h3>
                      <div className="space-y-3">
                        {Object.entries(validationChecks).map(([key, checked]) => (
                          <label key={key} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleValidationCheck(key as keyof typeof validationChecks)}
                              className="w-4 h-4 text-[#5CF0B2] bg-transparent border-white/30 rounded focus:ring-[#5CF0B2] focus:ring-2"
                            />
                            <span className="text-white font-plus-jakarta capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Annotations */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                      <h3 className="text-lg font-semibold font-space-grotesk mb-4">Annotations</h3>
                      
                      <div className="space-y-3 mb-4">
                        {annotations.map((annotation, index) => (
                          <div key={index} className="bg-white/5 rounded p-3 border border-white/10 flex items-start justify-between">
                            <span className="text-sm text-white font-plus-jakarta flex-1">{annotation}</span>
                            <button
                              onClick={() => removeAnnotation(index)}
                              className="text-white/60 hover:text-white transition-colors ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newAnnotation}
                          onChange={(e) => setNewAnnotation(e.target.value)}
                          placeholder="Add annotation..."
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && addAnnotation()}
                        />
                        <button
                          onClick={addAnnotation}
                          className="p-2 bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Save Progress */}
                    <button
                      onClick={handleSaveDraft}
                      className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Progress</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {!isProcessing && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep('setup')}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-plus-jakarta"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Setup</span>
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
                  >
                    <span>Generate Letters</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Letter Generation */}
          {currentStep === 'generation' && (
            <motion.div
              key="generation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold font-space-grotesk mb-4">Generate Dispute Letters</h1>
                <p className="text-xl text-white/80 font-plus-jakarta">Create professional dispute documentation</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Template Selection & Fields */}
                <div className="space-y-6">
                  {/* Template Selection */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                    <h3 className="text-lg font-semibold font-space-grotesk mb-4">Select Template</h3>
                    <div className="space-y-3">
                      {letterTemplates.map((template) => (
                        <label key={template.id} className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="template"
                            value={template.id}
                            checked={selectedTemplate === template.id}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-4 h-4 text-[#4C8DFF] bg-transparent border-white/30 focus:ring-[#4C8DFF] focus:ring-2"
                          />
                          <div>
                            <div className="font-semibold text-white font-space-grotesk">{template.name}</div>
                            <div className="text-sm text-white/60 font-plus-jakarta">{template.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                    <h3 className="text-lg font-semibold font-space-grotesk mb-4">Letter Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">Your Name</label>
                        <input
                          type="text"
                          value={customFields.yourName}
                          onChange={(e) => setCustomFields(prev => ({ ...prev, yourName: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">Your Address</label>
                        <input
                          type="text"
                          value={customFields.yourAddress}
                          onChange={(e) => setCustomFields(prev => ({ ...prev, yourAddress: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">Account Number</label>
                        <input
                          type="text"
                          value={customFields.accountNumber}
                          onChange={(e) => setCustomFields(prev => ({ ...prev, accountNumber: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2 font-plus-jakarta">Dispute Reason</label>
                        <textarea
                          value={customFields.disputeReason}
                          onChange={(e) => setCustomFields(prev => ({ ...prev, disputeReason: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 resize-none font-plus-jakarta"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                    <h3 className="text-lg font-semibold font-space-grotesk mb-4">Export Options</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex-1 bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-4 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>Export PDF</span>
                      </button>
                      <button
                        onClick={() => handleExport('word')}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>Export Word</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-space-grotesk">Letter Preview</h3>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center space-x-2 text-[#5CF0B2] hover:text-[#4AE09A] transition-colors font-plus-jakarta"
                    >
                      <Eye className="w-5 h-5" />
                      <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                    </button>
                  </div>

                  {showPreview && (
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-white/90 font-plus-jakarta leading-relaxed whitespace-pre-wrap">
                        {letterPreview}
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
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Certified mail recommended</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#5CF0B2]/10 border border-[#5CF0B2]/20 rounded-lg">
                      <div className="text-sm text-white/80 font-plus-jakarta">
                        <div className="font-semibold text-white mb-2">Next Steps:</div>
                        <ul className="space-y-1 text-white/70">
                          <li>• Print and sign the letter</li>
                          <li>• Include supporting documentation</li>
                          <li>• Send via certified mail with return receipt</li>
                          <li>• Keep copies for your records</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep('processing')}
                  className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors font-plus-jakarta"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Processing</span>
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSaveDraft}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Draft</span>
                  </button>

                  <Link to="/dashboard">
                    <button className="bg-[#5CF0B2] hover:bg-[#4AE09A] text-[#050D25] px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Audit</span>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AuditWizard;