import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Clock, DollarSign, Mail, Phone, ChevronDown, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const DashboardGenerate: React.FC = () => {
  const [outputType, setOutputType] = useState<'letter' | 'script'>('letter');
  
  const selectedItems = [
    { 
      type: "Bankruptcy", 
      description: "Chapter 7 bankruptcy filed on March 15, 2020",
      bureau: "Experian"
    },
    { 
      type: "Tax Lien", 
      description: "Unpaid federal tax lien filed on July 10, 2013, for $3,250",
      bureau: "Equifax"
    }
  ];

  const letterPreview = `Dear Sir or Madam,

I am writing to dispute the following information in my credit file. The items listed below are inaccurate or incomplete, and I am requesting that they be removed or corrected.

DISPUTED ITEMS:

1. Chapter 7 Bankruptcy filed March 15, 2020 (Experian)
   Reason: Date discrepancy - bankruptcy was actually filed on March 18, 2020

2. Federal Tax Lien for $3,250 filed July 10, 2013 (Equifax)
   Reason: Lien was satisfied and released in 2019 but still showing as active

I have enclosed copies of supporting documentation that verify the inaccuracies of these items. Please investigate these matters and remove or correct the inaccurate information as soon as possible.

Under the Fair Credit Reporting Act, you have 30 days to investigate and respond to this dispute. Please send me written confirmation of the results of your investigation.

Sincerely,

[Your signature will be added here]
[Your printed name]
[Date]

Enclosures: Supporting documentation`;

  const scriptPreview = `PHONE DISPUTE SCRIPT - EXPERIAN

Introduction:
"Hello, I'm calling to dispute some inaccurate information on my credit report. My name is [YOUR NAME] and my Social Security Number is [XXX-XX-XXXX]."

Item 1 - Bankruptcy:
"I need to dispute a Chapter 7 bankruptcy that's listed with an incorrect filing date. Your report shows it was filed on March 15, 2020, but the actual filing date was March 18, 2020. This date discrepancy needs to be corrected."

Item 2 - Tax Lien:
"There's also a federal tax lien from 2013 that's showing as active, but this lien was actually satisfied and released in 2019. It should either be updated to show as satisfied or removed entirely."

Closing:
"Can you please start an investigation into these items? I'd like to receive written confirmation of the dispute and the results once your investigation is complete. What's the reference number for this dispute?"

IMPORTANT NOTES:
- Have your credit report and supporting documents ready
- Take notes during the call including representative name and reference numbers
- Follow up in writing within 24 hours
- Keep records of all communications`;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-space-grotesk">Generate Dispute Documents</h1>
            <p className="text-xl text-white/80 font-plus-jakarta max-w-3xl mx-auto">
              Professional dispute letters and call scripts ready for submission to credit bureaus
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

              {/* Recipient Information */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">
                  {outputType === 'letter' ? 'Recipient' : 'Bureau Contact'}
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-white font-semibold font-space-grotesk">Experian</div>
                    <div className="text-sm text-white/60 font-plus-jakarta mt-1">
                      {outputType === 'letter' 
                        ? 'P.O. Box 4500, Allen, TX 75013' 
                        : '1-888-397-3742 (Dispute Line)'
                      }
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-white font-semibold font-space-grotesk">Equifax</div>
                    <div className="text-sm text-white/60 font-plus-jakarta mt-1">
                      {outputType === 'letter' 
                        ? 'P.O. Box 740256, Atlanta, GA 30374' 
                        : '1-866-349-5191 (Dispute Line)'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              {outputType === 'letter' && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">Delivery Method</h3>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-[#5CF0B2] rounded-full"></div>
                      <span className="text-white font-plus-jakarta font-semibold">Certified Mail</span>
                    </div>
                    <div className="text-sm text-white/60 font-plus-jakarta">
                      Recommended for disputes - provides delivery confirmation
                    </div>
                  </div>
                </div>
              )}

              {/* Items to Dispute */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">Items to Dispute</h3>
                <div className="space-y-3">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-semibold font-space-grotesk">{item.type}</div>
                        <div className="text-sm text-white/60 font-plus-jakarta">{item.bureau}</div>
                      </div>
                      <div className="text-sm text-white/70 font-plus-jakarta">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white font-space-grotesk">
                  {outputType === 'letter' ? 'Letter Preview' : 'Script Preview'}
                </h3>
                <div className="flex items-center space-x-2 text-[#5CF0B2]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-plus-jakarta">Ready</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10 max-h-96 overflow-y-auto">
                <pre className="text-sm text-white/90 font-plus-jakarta leading-relaxed whitespace-pre-wrap">
                  {outputType === 'letter' ? letterPreview : scriptPreview}
                </pre>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-plus-jakarta">Est. 30-day response</span>
                    </div>
                    {outputType === 'letter' && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-plus-jakarta">$8.50 certified mail</span>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  className="w-full bg-[#5CF0B2] hover:bg-[#4AE09A] text-[#050D25] px-6 py-3 rounded-lg font-semibold transition-colors font-plus-jakarta flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
                  disabled
                  whileHover={{ scale: 1 }}
                  whileTap={{ scale: 1 }}
                >
                  <Download className="w-5 h-5" />
                  <span>Download Demo (Disabled)</span>
                </motion.button>

                <p className="text-center text-sm text-white/50 font-plus-jakarta">
                  Download functionality will be available in the full version
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <h3 className="text-xl font-semibold text-white mb-6 font-space-grotesk">Next Steps</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#4C8DFF]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-[#4C8DFF] font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-white font-space-grotesk">
                  {outputType === 'letter' ? 'Print & Sign' : 'Review Script'}
                </h4>
                <p className="text-white/70 text-sm font-plus-jakarta">
                  {outputType === 'letter' 
                    ? 'Print the letter, sign it, and gather supporting documents'
                    : 'Review the script and prepare your supporting documentation'
                  }
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#4C8DFF]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-[#4C8DFF] font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-white font-space-grotesk">
                  {outputType === 'letter' ? 'Send Certified' : 'Make the Call'}
                </h4>
                <p className="text-white/70 text-sm font-plus-jakarta">
                  {outputType === 'letter' 
                    ? 'Mail via certified mail with return receipt requested'
                    : 'Call during business hours and follow the script'
                  }
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#4C8DFF]/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-[#4C8DFF] font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-white font-space-grotesk">Track Progress</h4>
                <p className="text-white/70 text-sm font-plus-jakarta">
                  Monitor responses and follow up if needed after 30 days
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardGenerate;