import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockAudits, type Audit } from '../data/mockData';
import Breadcrumbs from '../components/Breadcrumbs';
import SubscriptionStatus from '../components/SubscriptionStatus';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'date' | 'status') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAudits = mockAudits
    .filter(audit => {
      const matchesSearch = audit.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
      const matchesType = typeFilter === 'all' || audit.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-green-400 bg-green-400/15 border-green-400/30';
      case 'In Progress': return 'text-blue-400 bg-blue-400/15 border-blue-400/30';
      case 'Draft': return 'text-gray-400 bg-gray-400/15 border-gray-400/30';
      case 'Review Required': return 'text-yellow-400 bg-yellow-400/15 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-400/15 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Draft': return <FileText className="w-4 h-4" />;
      case 'Review Required': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const draftAudits = mockAudits.filter(audit => audit.status === 'Draft');
  const recentAudits = mockAudits.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050D25] via-[#0A1B3A] to-[#102B4F] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#4C8DFF] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#5CF0B2] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#4C8DFF] rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/20 backdrop-blur-xl bg-white/10">
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
              <button className="relative p-2 text-white/80 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#4C8DFF]/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#4C8DFF]" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold font-space-grotesk">{user?.user_metadata?.full_name || user?.email}</div>
                  <div className="text-xs text-white/80 font-plus-jakarta">{user?.email}</div>
                </div>
              </div>

              <button
                onClick={signOut}
                className="p-2 text-white/80 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Overview', current: true }]} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-space-grotesk mb-2">Audit Dashboard</h1>
            <p className="text-white/80 font-plus-jakarta">Manage and track your audit reports</p>
          </div>
          
          <Link to="/audit/new">
            <motion.button
              className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(76,141,255,0.3)] font-plus-jakarta inline-flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span>Create New Audit</span>
            </motion.button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#4C8DFF]/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#4C8DFF]" />
              </div>
              <span className="text-2xl font-bold font-space-grotesk">{mockAudits.length}</span>
            </div>
            <div className="text-white/80 font-plus-jakarta">Total Audits</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#5CF0B2]/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#5CF0B2]" />
              </div>
              <span className="text-2xl font-bold font-space-grotesk">
                {mockAudits.filter(a => a.status === 'Complete').length}
              </span>
            </div>
            <div className="text-white/80 font-plus-jakarta">Completed</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-400/30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold font-space-grotesk">
                {mockAudits.filter(a => a.status === 'In Progress').length}
              </span>
            </div>
            <div className="text-white/80 font-plus-jakarta">In Progress</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-400/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-2xl font-bold font-space-grotesk">
                {mockAudits.reduce((sum, audit) => sum + audit.issuesFound, 0)}
              </span>
            </div>
            <div className="text-white/80 font-plus-jakarta">Issues Found</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Audits List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters and Search */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                >
                  <option value="all">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                  <option value="Review Required">Review Required</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                >
                  <option value="all">All Types</option>
                  <option value="Credit Report">Credit Report</option>
                  <option value="Consumer Report">Consumer Report</option>
                  <option value="Employment Screening">Employment Screening</option>
                  <option value="Tenant Screening">Tenant Screening</option>
                </select>
              </div>
            </div>

            {/* Audits Table */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-xl font-semibold font-space-grotesk">All Audits</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th 
                        className="text-left p-4 font-semibold font-space-grotesk cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Audit Name</span>
                          {sortBy === 'name' && (
                            <span className="text-[#5CF0B2]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="text-left p-4 font-semibold font-space-grotesk">Type</th>
                      <th 
                        className="text-left p-4 font-semibold font-space-grotesk cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Status</span>
                          {sortBy === 'status' && (
                            <span className="text-[#5CF0B2]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left p-4 font-semibold font-space-grotesk cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Last Updated</span>
                          {sortBy === 'date' && (
                            <span className="text-[#5CF0B2]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="text-left p-4 font-semibold font-space-grotesk">Progress</th>
                      <th className="text-left p-4 font-semibold font-space-grotesk">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudits.map((audit) => (
                      <tr key={audit.id} className="border-t border-white/20 hover:bg-white/10 transition-colors">
                        
                        <td className="p-4">
                          <div>
                            <div className="font-semibold font-space-grotesk">{audit.name}</div>
                            <div className="text-sm text-white/80 font-plus-jakarta">
                              {audit.issuesFound} issues found
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-white/90 font-plus-jakarta">{audit.type}</span>
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm border font-plus-jakarta ${getStatusColor(audit.status)}`}>
                            {getStatusIcon(audit.status)}
                            <span>{audit.status}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-white/90 font-plus-jakarta">{formatDate(audit.updatedAt)}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-[#5CF0B2] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${audit.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-white/90 font-plus-jakarta">{audit.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-white/80 hover:text-white transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-white/80 hover:text-white transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <SubscriptionStatus />

            {/* Saved Drafts */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold font-space-grotesk mb-4">Saved Drafts</h3>
              <div className="space-y-3">
                {draftAudits.map((audit) => (
                  <div key={audit.id} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="font-semibold font-space-grotesk text-sm mb-1">{audit.name}</div>
                    <div className="text-xs text-white/80 font-plus-jakarta mb-2">
                      {formatDate(audit.updatedAt)}
                    </div>
                    <button className="text-[#5CF0B2] hover:text-[#4AE09A] text-sm font-plus-jakarta transition-colors">
                      Resume →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold font-space-grotesk mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentAudits.map((audit) => (
                  <div key={audit.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      audit.status === 'Complete' ? 'bg-green-400' :
                      audit.status === 'In Progress' ? 'bg-blue-400' :
                      'bg-gray-400'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold font-space-grotesk">{audit.name}</div>
                      <div className="text-xs text-white/80 font-plus-jakarta">{audit.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;