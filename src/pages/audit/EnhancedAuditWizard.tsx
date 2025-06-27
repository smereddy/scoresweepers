import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  User,
  LogOut,
  Bell,
  Settings,
  Upload,
  Bot,
  Search,
  FileText,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { type WorkflowStep, type ReportType } from '../../data/auditWorkflow';
import Breadcrumbs from '../../components/Breadcrumbs';
import AuditSetup from './AuditSetup';
import AuditUpload from './AuditUpload';
import AuditProcessing from './AuditProcessing';
import AuditReview from './AuditReview';
import AuditGeneration from './AuditGeneration';

const EnhancedAuditWizard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('setup');
  const [workflowData, setWorkflowData] = useState<{
    setupData?: any;
    uploadData?: any;
    analysisData?: any;
    reviewData?: any;
    generationData?: any;
  }>({});

  const steps = [
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'processing', label: 'Processing', icon: Bot },
    { id: 'review', label: 'Review', icon: Search },
    { id: 'generation', label: 'Generate', icon: FileText },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleStepComplete = (stepData: any) => {
    const newWorkflowData = { ...workflowData };
    
    switch (currentStep) {
      case 'setup':
        newWorkflowData.setupData = stepData;
        setCurrentStep('upload');
        break;
      case 'upload':
        newWorkflowData.uploadData = stepData;
        setCurrentStep('processing');
        break;
      case 'processing':
        newWorkflowData.analysisData = stepData;
        setCurrentStep('review');
        break;
      case 'review':
        newWorkflowData.reviewData = stepData;
        setCurrentStep('generation');
        break;
      case 'generation':
        newWorkflowData.generationData = stepData;
        // Navigate back to dashboard or show completion
        navigate('/dashboard');
        break;
    }
    
    setWorkflowData(newWorkflowData);
  };

  const handleStepBack = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('setup');
        break;
      case 'processing':
        setCurrentStep('upload');
        break;
      case 'review':
        setCurrentStep('processing');
        break;
      case 'generation':
        setCurrentStep('review');
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'setup':
        return <AuditSetup onNext={handleStepComplete} />;
      
      case 'upload':
        return (
          <AuditUpload 
            reportType={workflowData.setupData?.reportType}
            onNext={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      
      case 'processing':
        return (
          <AuditProcessing 
            reportType={workflowData.setupData?.reportType}
            fileName={workflowData.uploadData?.fileName || 'report.pdf'}
            onNext={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      
      case 'review':
        return (
          <AuditReview 
            reportType={workflowData.setupData?.reportType}
            issues={workflowData.analysisData?.issues || []}
            onNext={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      
      case 'generation':
        return (
          <AuditGeneration 
            reportType={workflowData.setupData?.reportType}
            selectedIssues={workflowData.reviewData?.selectedIssues || []}
            issues={workflowData.analysisData?.issues || []}
            onNext={handleStepComplete}
            onBack={handleStepBack}
          />
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

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
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#5CF0B2] rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#050D25]" />
              </div>
              <span className="text-2xl font-bold font-space-grotesk">ScoreSweep</span>
            </Link>

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
                  <div className="text-sm font-semibold font-space-grotesk">
                    {user?.user_metadata?.full_name || user?.email}
                  </div>
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
              const isAccessible = index <= currentStepIndex;
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

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default EnhancedAuditWizard;