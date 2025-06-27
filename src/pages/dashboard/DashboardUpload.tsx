import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, File, Lock, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const DashboardUpload: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
      setUploadedFile(pdfFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const handleUseSampleFile = () => {
    // Create a mock file object for demo purposes
    const mockFile = new File([''], 'sample-credit-report.pdf', { type: 'application/pdf' });
    setUploadedFile(mockFile);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-space-grotesk">Upload Your Credit Report</h1>
            <p className="text-xl text-white/80 font-plus-jakarta max-w-2xl mx-auto">
              Securely upload your credit report to begin the AI-powered error detection process
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
                  Drop your credit report here
                </h3>
                <p className="text-white/60 mb-6 font-plus-jakarta text-lg">
                  or click to browse files
                </p>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-white/50 mb-8">
                  <span className="flex items-center space-x-2">
                    <File className="w-5 h-5" />
                    <span>PDF format</span>
                  </span>
                  <span>•</span>
                  <span>Max 10MB</span>
                  <span>•</span>
                  <span className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Encrypted</span>
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
                  onClick={() => setUploadedFile(null)}
                  className="text-white/60 hover:text-white transition-colors font-plus-jakarta"
                >
                  Upload a different file
                </button>
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
                <span>Use Sample File</span>
              </motion.button>
              
              <p className="text-sm text-white/50 mt-2 font-plus-jakarta">
                Try the demo with a sample credit report
              </p>
            </div>
          )}

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

          {/* Continue Button */}
          {uploadedFile && (
            <div className="text-center">
              <Link to="/dashboard/review">
                <motion.button
                  className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(76,141,255,0.4)] font-plus-jakarta inline-flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardUpload;