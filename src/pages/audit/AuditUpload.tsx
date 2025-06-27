import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  File as FileIcon, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  AlertTriangle,
  X
} from 'lucide-react';
import { reportTypeConfigs, type ReportType } from '../../data/auditWorkflow';

interface AuditUploadProps {
  reportType: ReportType;
  onNext: (uploadData: any) => void;
  onBack: () => void;
}

const AuditUpload: React.FC<AuditUploadProps> = ({ reportType, onNext, onBack }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  const config = reportTypeConfigs[reportType];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      validateAndSetFile(pdfFile);
    } else {
      setUploadError('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError('');
    
    // Check file type
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported');
      return;
    }
    
    // Check file size (convert maxFileSize string to bytes)
    const maxSizeStr = config.maxFileSize;
    const maxSizeBytes = parseInt(maxSizeStr) * 1024 * 1024; // Convert MB to bytes
    
    if (file.size > maxSizeBytes) {
      setUploadError(`File size must be less than ${maxSizeStr}`);
      return;
    }
    
    setUploadedFile(file);
  };

  const handleUseSampleFile = () => {
    try {
      // Create a proper File object with sample content
      const sampleFileName = `sample_${reportType}_report.pdf`;
      
      // Create sample PDF content as a Blob
      const sampleContent = new Blob(['%PDF-1.4\nSample PDF content for demo purposes'], { 
        type: 'application/pdf' 
      });
      
      // Create File object properly
      const mockFile = new File([sampleContent], sampleFileName, { 
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      // Validate and set the file
      setUploadedFile(mockFile);
      setUploadError('');
    } catch (error) {
      console.error('Error creating sample file:', error);
      setUploadError('Error creating sample file. Please try uploading a real PDF instead.');
    }
  };

  const handleContinue = () => {
    if (!uploadedFile) return;

    const uploadData = {
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      uploadedAt: new Date().toISOString(),
      processingStatus: 'pending' as const
    };

    onNext(uploadData);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError('');
  };

  const getSampleFileName = () => {
    switch (reportType) {
      case 'credit':
        return 'Sample Credit Report';
      case 'consumer':
        return 'Sample Consumer Report';
      case 'employment':
        return 'Sample Employment Screening';
      case 'tenant':
        return 'Sample Tenant Screening';
      default:
        return 'Sample Report';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold font-space-grotesk mb-4">
          Upload Your {config.name}
        </h2>
        <p className="text-xl text-white/80 font-plus-jakarta">
          Securely upload your report for AI-powered analysis
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
              isDragOver 
                ? 'border-[#4C8DFF] bg-[#4C8DFF]/10' 
                : 'border-white/30 hover:border-[#4C8DFF]/50 hover:bg-white/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="w-20 h-20 bg-[#4C8DFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-[#4C8DFF]" />
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-4 font-space-grotesk">
              Drop your {config.name.toLowerCase()} here
            </h3>
            <p className="text-white/60 mb-6 font-plus-jakarta text-lg">
              or click to browse files
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-white/50 mb-8">
              <span className="flex items-center space-x-2">
                <FileIcon className="w-5 h-5" />
                <span>PDF format only</span>
              </span>
              <span>•</span>
              <span>Max {config.maxFileSize}</span>
              <span>•</span>
              <span className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Bank-level encryption</span>
              </span>
            </div>

            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-[#5CF0B2]/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-[#5CF0B2]" />
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2 font-space-grotesk">
                File Uploaded Successfully
              </h3>
              <p className="text-white/60 font-plus-jakarta">
                {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>

            <div className="bg-[#5CF0B2]/10 border border-[#5CF0B2]/30 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-[#5CF0B2]">
                <CheckCircle className="w-5 h-5" />
                <span className="font-plus-jakarta">Ready for AI analysis</span>
              </div>
            </div>

            <button
              onClick={removeFile}
              className="text-white/60 hover:text-white transition-colors font-plus-jakarta flex items-center space-x-2 mx-auto"
            >
              <X className="w-4 h-4" />
              <span>Upload a different file</span>
            </button>
          </div>
        )}

        {uploadError && (
          <div className="mt-4 flex items-center space-x-2 text-red-400 text-sm font-plus-jakarta bg-red-400/10 border border-red-400/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Sample File Option */}
      {!uploadedFile && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-white/60 mb-4">
            <div className="h-px bg-white/20 w-16"></div>
            <span className="font-plus-jakarta">or</span>
            <div className="h-px bg-white/20 w-16"></div>
          </div>
          
          <motion.button
            onClick={handleUseSampleFile}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 font-plus-jakarta inline-flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Zap className="w-5 h-5" />
            <span>Use {getSampleFileName()}</span>
          </motion.button>
          
          <p className="text-sm text-white/50 mt-2 font-plus-jakarta">
            Try the demo with a sample {config.name.toLowerCase()}
          </p>
        </div>
      )}

      {/* File Requirements */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h4 className="font-semibold text-white mb-4 font-space-grotesk">File Requirements</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70 font-plus-jakarta">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#5CF0B2]" />
            <span>PDF format only</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#5CF0B2]" />
            <span>Maximum {config.maxFileSize}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#5CF0B2]" />
            <span>Text-based (not scanned images)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#5CF0B2]" />
            <span>Recent report (within 90 days)</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-[#5CF0B2]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Lock className="w-5 h-5 text-[#5CF0B2]" />
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2 font-space-grotesk">Your Data is Secure</h4>
            <p className="text-white/70 font-plus-jakarta leading-relaxed">
              All uploads are encrypted in transit and at rest. We automatically delete original files after 30 days, 
              keeping only the redacted analysis results you approve. Your SSN and account numbers are never stored.
            </p>
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
          <span>Back to Setup</span>
        </button>

        <button
          onClick={handleContinue}
          disabled={!uploadedFile}
          className="bg-[#4C8DFF] hover:bg-[#3A7AE4] disabled:bg-[#4C8DFF]/50 text-white px-8 py-4 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center space-x-2"
        >
          <span>Start Analysis</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AuditUpload;