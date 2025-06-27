import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, CheckCircle, AlertTriangle, ArrowRight, Search, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const DashboardReview: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState([0, 1]);
  
  const auditItems = [
    { 
      id: 0,
      type: "Bankruptcy", 
      description: "Chapter 7 bankruptcy filed on March 15, 2020", 
      severity: "high",
      reason: "Date discrepancy - bankruptcy was actually filed on March 18, 2020",
      bureau: "Experian",
      impact: "High"
    },
    { 
      id: 1,
      type: "Tax Lien", 
      description: "Unpaid federal tax lien filed on July 10, 2013, for $3,250", 
      severity: "high",
      reason: "Lien was satisfied and released in 2019 but still showing as active",
      bureau: "Equifax",
      impact: "High"
    },
    { 
      id: 2,
      type: "Hard Inquiry", 
      description: "Mortgage application from ABC Bank on September 5, 2021", 
      severity: "medium",
      reason: "Inquiry is older than 2 years and should have been removed",
      bureau: "TransUnion",
      impact: "Medium"
    },
    { 
      id: 3,
      type: "Late Payment", 
      description: "30-day late payment on XYZ Credit Card in June 2022", 
      severity: "low",
      reason: "Payment was actually made on time - bank error",
      bureau: "Experian",
      impact: "Low"
    }
  ];

  const toggleItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

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
            <h1 className="text-4xl font-bold font-space-grotesk">AI Audit Results</h1>
            <p className="text-xl text-white/80 font-plus-jakarta max-w-3xl mx-auto">
              Our AI has analyzed your credit report and identified potential errors. Review and select items to dispute.
            </p>
          </div>

          {/* Analysis Summary */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#5CF0B2]/20 rounded-full flex items-center justify-center">
                  <Bot className="w-7 h-7 text-[#5CF0B2]" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white font-space-grotesk">Analysis Complete</h2>
                  <p className="text-white/60 font-plus-jakarta">Found {auditItems.length} potential issues</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-[#5CF0B2]">
                <CheckCircle className="w-6 h-6" />
                <span className="font-plus-jakarta font-semibold">95% confidence</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {auditItems.filter(item => item.severity === 'high').length}
                </div>
                <div className="text-sm text-white/70 font-plus-jakarta">High Priority</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {auditItems.filter(item => item.severity === 'medium').length}
                </div>
                <div className="text-sm text-white/70 font-plus-jakarta">Medium Priority</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {auditItems.filter(item => item.severity === 'low').length}
                </div>
                <div className="text-sm text-white/70 font-plus-jakarta">Low Priority</div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {auditItems.map((item) => (
                <motion.div
                  key={item.id}
                  className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedItems.includes(item.id) 
                      ? 'bg-[#4C8DFF]/10 border-[#4C8DFF]/50' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => toggleItem(item.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 transition-all ${
                      selectedItems.includes(item.id) 
                        ? 'bg-[#4C8DFF] border-[#4C8DFF]' 
                        : 'border-white/30 hover:border-white/50'
                    }`}>
                      {selectedItems.includes(item.id) && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-white text-lg font-space-grotesk">{item.type}</h3>
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(item.severity)}`}></div>
                          <span className="text-sm text-white/60 font-plus-jakarta">{item.bureau}</span>
                        </div>
                        {item.severity === 'high' && <AlertTriangle className="w-6 h-6 text-red-400" />}
                      </div>
                      
                      <p className="text-white/80 font-plus-jakarta mb-3 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-start space-x-2">
                          <Search className="w-4 h-4 text-[#5CF0B2] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-[#5CF0B2] mb-1">AI Analysis:</div>
                            <div className="text-sm text-white/70 font-plus-jakarta">{item.reason}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-white/60 font-plus-jakarta">
                            Impact: <span className="text-white">{item.impact}</span>
                          </span>
                          <span className="text-white/60 font-plus-jakarta">
                            Bureau: <span className="text-white">{item.bureau}</span>
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
              ))}
            </div>

            {/* Selection Summary */}
            <div className="mt-8 flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-white/80 font-plus-jakarta">
                <span className="font-semibold">{selectedItems.length}</span> items selected for dispute
              </div>
              <div className="text-sm text-white/60 font-plus-jakarta">
                Estimated processing time: 30-45 days
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Link to="/dashboard/generate">
              <motion.button
                className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(76,141,255,0.4)] font-plus-jakarta inline-flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={selectedItems.length === 0}
              >
                <span>Generate Dispute Letters</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            
            {selectedItems.length === 0 && (
              <p className="text-white/60 text-sm mt-2 font-plus-jakarta">
                Select at least one item to continue
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardReview;