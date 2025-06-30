import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  CheckCircle, 
  X, 
  Upload, 
  Search, 
  FileText, 
  Shield, 
  Bot, 
  Edit3,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  Zap,
  File,
  AlertTriangle,
  Clock,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  Award,
  Mail,
  Phone,
  Heart,
  Coffee
} from 'lucide-react';
import { supabase, type WaitlistEntry } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import StripeCheckout from '../components/StripeCheckout';
import { stripeProducts } from '../stripe-config';

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
};

// Animated section wrapper
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function LandingPage() {
  const { user, isUsingMockAuth, isDemoMode } = useAuth();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string>('');

  // In demo mode, don't auto-redirect to dashboard
  if (user && !isDemoMode) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');

    // Validate inputs
    if (!name.trim()) {
      setSubmitError('Please enter your name');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    if (!email.trim()) {
      setSubmitError('Please enter your email');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSubmitError('Please enter a valid email address');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // If using mock auth or demo mode, simulate waitlist submission
    if (isUsingMockAuth || isDemoMode) {
      console.log('📝 Mock waitlist submission:', { name, email, note });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setTimeout(() => {
        setIsWaitlistOpen(false);
        setName('');
        setEmail('');
        setNote('');
        setSubmitStatus('idle');
        setSubmitError('');
      }, 2000);
      
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📝 Submitting waitlist entry...');
      
      // Create the waitlist entry object
      const waitlistEntry: WaitlistEntry = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        note: note.trim() || null
      };
      
      // Insert into Supabase
      const { error } = await supabase
        .from('beta_waitlist')
        .insert([waitlistEntry]);

      if (error) {
        console.error('❌ Supabase error:', error);
        
        // Handle specific error cases
        if (error.code === '23505') { // Unique constraint violation
          setSubmitError('This email is already on our waitlist!');
        } else {
          setSubmitError('Something went wrong. Please try again.');
        }
        
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Waitlist entry successful!');
      setSubmitStatus('success');
      setTimeout(() => {
        setIsWaitlistOpen(false);
        setName('');
        setEmail('');
        setNote('');
        setSubmitStatus('idle');
        setSubmitError('');
      }, 2000);

    } catch (error: any) {
      console.error('💥 Error adding to waitlist:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqData = [
    {
      question: "What types of reports does ScoreSweep analyze?",
      answer: "ScoreSweep analyzes credit reports from all three major bureaus (Experian, Equifax, TransUnion) as well as LexisNexis consumer reports. Our AI can identify errors in personal information, account details, payment history, and public records."
    },
    {
      question: "How accurate is the AI error detection?",
      answer: "Our AI models achieve 95%+ accuracy in identifying potential errors and inconsistencies. The system is trained on thousands of credit reports and continuously learns from new patterns. However, you always have final control over which items to dispute."
    },
    {
      question: "Does ScoreSweep store my SSN or sensitive data?",
      answer: "No—original PDFs auto-delete after 30 days; only redacted text & your selections persist. We never store Social Security Numbers, account numbers, or other sensitive identifiers. All data is encrypted in transit and at rest."
    },
    {
      question: "How long does the dispute process take?",
      answer: "Credit bureaus are legally required to investigate disputes within 30 days. Most disputes are resolved within 2-4 weeks. ScoreSweep generates legally compliant dispute letters that maximize your chances of successful removal."
    },
    {
      question: "Can I customize the dispute letters?",
      answer: "Yes! While our AI generates professional dispute letters automatically, you can review and edit them before sending. You can also add personal notes or specific details to strengthen your case."
    },
    {
      question: "Is there a limit to how many items I can dispute?",
      answer: "During the beta, you can dispute up to 10 items per report upload. We recommend focusing on the most impactful errors first, as disputing too many items at once can sometimes trigger additional scrutiny from bureaus."
    }
  ];

  // Get the donation product
  const donationProduct = stripeProducts.find(product => product.name === 'Donation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050D25] via-[#0A1B3A] to-[#102B4F] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#4C8DFF] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#5CF0B2] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#4C8DFF] rounded-full blur-3xl"></div>
      </div>

      {/* Sticky Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#5CF0B2] rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#050D25]" />
            </div>
            <span className="text-2xl font-bold font-space-grotesk">ScoreSweep</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-white/90 hover:text-white transition-colors font-plus-jakarta"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('beta-perks')}
              className="text-white/90 hover:text-white transition-colors font-plus-jakarta"
            >
              Beta Perks
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-white/90 hover:text-white transition-colors font-plus-jakarta"
            >
              FAQ
            </button>
            {!isDemoMode && (
              <Link 
                to="/login"
                className="text-white/90 hover:text-white transition-colors font-plus-jakarta"
              >
                Sign In
              </Link>
            )}
          </div>

          <Link to={isDemoMode ? "/dashboard" : "/login"}>
            <motion.button
              className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(76,141,255,0.3)] font-plus-jakarta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDemoMode ? 'Try Demo' : 'Try the Demo'}
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div variants={fadeUpVariants}>
                  <div className="inline-flex items-center space-x-2 bg-[#5CF0B2]/20 border border-[#5CF0B2]/30 rounded-full px-4 py-2 mb-6">
                    <div className="w-2 h-2 bg-[#5CF0B2] rounded-full animate-pulse"></div>
                    <span className="text-[#5CF0B2] font-semibold text-sm font-plus-jakarta">
                      {isDemoMode ? 'Demo Mode - Try Now!' : 'Private Beta Now Open'}
                    </span>
                  </div>
                </motion.div>

                <motion.h1 
                  variants={fadeUpVariants}
                  className="text-5xl xl:text-6xl font-bold leading-tight font-space-grotesk"
                >
                  Erase Credit Report Errors with 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4C8DFF] to-[#5CF0B2]"> AI Precision</span>
                </motion.h1>

                <motion.p 
                  variants={fadeUpVariants}
                  className="text-xl text-white/90 leading-relaxed font-plus-jakarta max-w-lg"
                >
                  Upload reports, spot errors in seconds, and auto-generate dispute letters with GPT-4o & Bedrock. 
                  {isDemoMode ? ' Try the full demo experience now!' : ' Join 2,000+ beta users boosting their credit scores.'}
                </motion.p>

                <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setIsWaitlistOpen(true)}
                    className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(76,141,255,0.4)] font-plus-jakarta inline-flex items-center justify-center space-x-2"
                  >
                    <span>Join Private Beta</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <Link to="/dashboard">
                    <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 font-plus-jakarta inline-flex items-center justify-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>View Demo</span>
                    </button>
                  </Link>
                </motion.div>

                <motion.div variants={fadeUpVariants} className="flex items-center space-x-6 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#5CF0B2]" />
                    <span className="font-plus-jakarta">Bank-level security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-[#5CF0B2]" />
                    <span className="font-plus-jakarta">30-second analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-[#5CF0B2]" />
                    <span className="font-plus-jakarta">95% accuracy</span>
                  </div>
                </motion.div>

                {isDemoMode && (
                  <motion.div variants={fadeUpVariants} className="bg-[#5CF0B2]/10 border border-[#5CF0B2]/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-[#5CF0B2] mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold font-plus-jakarta">Demo Mode Active</span>
                    </div>
                    <p className="text-white/80 font-plus-jakarta text-sm">
                      Experience the full ScoreSweep workflow with sample data. No authentication required!
                    </p>
                  </motion.div>
                )}
              </div>

              <motion.div 
                variants={fadeUpVariants}
                className="relative"
              >
                <div className="relative mx-auto max-w-2xl">
                  <div className="bg-gradient-to-b from-slate-700/60 to-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:shadow-[0_0_40px_rgba(76,141,255,0.2)] transition-all duration-300">
                    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg p-6 aspect-video relative overflow-hidden backdrop-blur-sm">
                      <div className="space-y-3">
                        <div className="h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-3/4"></div>
                        <div className="h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-full"></div>
                        <div className="h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-5/6"></div>
                        <div className="h-3 bg-gradient-to-r from-red-500/70 to-red-400/70 rounded w-2/3"></div>
                        <div className="h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-4/5"></div>
                        <div className="h-3 bg-gradient-to-r from-red-500/70 to-red-400/70 rounded w-3/5"></div>
                        <div className="h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-full"></div>
                        <div className="h-3 bg-gradient-to-r from-slate-600 to-slate-500 rounded w-2/3"></div>
                      </div>
                      
                      <div className="absolute bottom-6 right-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#4C8DFF] to-[#5CF0B2] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Search className="w-6 h-6 text-[#4C8DFF]" />
                          </div>
                          <CheckCircle className="w-6 h-6 text-white absolute bottom-1 right-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 bg-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUpVariants} className="text-center mb-16">
              <h2 className="text-4xl xl:text-5xl font-bold mb-6 font-space-grotesk">How ScoreSweep Works</h2>
              <p className="text-xl text-white/90 font-plus-jakarta max-w-3xl mx-auto">
                Three simple steps to identify and dispute credit report errors with AI precision
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Step 1: Upload */}
              <motion.div variants={fadeUpVariants} className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#4C8DFF]/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Upload className="w-10 h-10 text-[#4C8DFF]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#5CF0B2] rounded-full flex items-center justify-center text-[#050D25] font-bold text-sm">1</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-space-grotesk">Upload & Secure</h3>
                  <p className="text-white/80 font-plus-jakarta leading-relaxed">
                    Drag & drop your credit report PDF. Bank-level encryption protects your data, 
                    and files auto-delete after 30 days.
                  </p>
                </div>

                {/* Mini Example Screen */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
                  <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg p-4 aspect-video relative overflow-hidden">
                    <div className="border-2 border-dashed border-[#4C8DFF]/60 rounded-lg h-full flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-[#4C8DFF]/30 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-[#4C8DFF]" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white mb-1">Drop your credit report here</div>
                        <div className="text-xs text-white/80">PDF format • Max 10MB • Encrypted</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2: AI Analysis */}
              <motion.div variants={fadeUpVariants} className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#5CF0B2]/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Bot className="w-10 h-10 text-[#5CF0B2]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#5CF0B2] rounded-full flex items-center justify-center text-[#050D25] font-bold text-sm">2</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-space-grotesk">AI Analysis</h3>
                  <p className="text-white/80 font-plus-jakarta leading-relaxed">
                    GPT-4o & Bedrock scan every line for errors, inconsistencies, and outdated information 
                    with 95% accuracy in under 30 seconds.
                  </p>
                </div>

                {/* Mini Example Screen */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
                  <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg p-4 aspect-video relative overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">AI Audit Results</div>
                        <div className="flex items-center space-x-1 text-[#5CF0B2]">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">95% confidence</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-red-500/20 border border-red-500/30 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-xs text-white">Incorrect Payment History</span>
                          </div>
                        </div>
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-xs text-white">Outdated Account Info</span>
                          </div>
                        </div>
                        <div className="bg-red-500/20 border border-red-500/30 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-xs text-white">Duplicate Entry</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3: Generate Letters */}
              <motion.div variants={fadeUpVariants} className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#4C8DFF]/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Edit3 className="w-10 h-10 text-[#4C8DFF]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#5CF0B2] rounded-full flex items-center justify-center text-[#050D25] font-bold text-sm">3</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-space-grotesk">Generate & Send</h3>
                  <p className="text-white/80 font-plus-jakarta leading-relaxed">
                    Review AI findings, customize dispute letters, and export professional documentation 
                    ready for bureau submission.
                  </p>
                </div>

                {/* Mini Example Screen */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
                  <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg p-4 aspect-video relative overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">Letter Preview</div>
                        <div className="flex items-center space-x-1 text-[#5CF0B2]">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Ready</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded p-3 space-y-2">
                        <div className="h-2 bg-white/30 rounded w-full"></div>
                        <div className="h-2 bg-white/30 rounded w-4/5"></div>
                        <div className="h-2 bg-white/30 rounded w-full"></div>
                        <div className="h-2 bg-white/30 rounded w-3/4"></div>
                        <div className="h-2 bg-white/30 rounded w-5/6"></div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-[#4C8DFF] text-white text-xs py-1 px-2 rounded">
                          Export PDF
                        </button>
                        <button className="flex-1 bg-white/20 text-white text-xs py-1 px-2 rounded">
                          Export Word
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Beta Perks Section */}
      <section id="beta-perks" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUpVariants} className="text-center mb-16">
              <h2 className="text-4xl xl:text-5xl font-bold mb-6 font-space-grotesk">
                {isDemoMode ? 'Demo Features' : 'Private Beta Perks'}
              </h2>
              <p className="text-xl text-white/90 font-plus-jakarta max-w-3xl mx-auto">
                {isDemoMode 
                  ? 'Experience all the features ScoreSweep has to offer'
                  : 'Early access benefits for our founding users'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeUpVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:shadow-[0_0_40px_rgba(92,240,178,0.1)] transition-all duration-300">
                <div className="w-16 h-16 bg-[#5CF0B2]/30 rounded-full flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-[#5CF0B2]" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-space-grotesk">
                  {isDemoMode ? 'Full Demo Access' : 'Free Forever Access'}
                </h3>
                <p className="text-white/80 font-plus-jakarta">
                  {isDemoMode 
                    ? 'Try all features with sample data to see how ScoreSweep works.'
                    : 'Beta users get lifetime free access to core features, even after we launch paid tiers.'
                  }
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:shadow-[0_0_40px_rgba(92,240,178,0.1)] transition-all duration-300">
                <div className="w-16 h-16 bg-[#4C8DFF]/30 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-[#4C8DFF]" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-space-grotesk">
                  {isDemoMode ? 'AI-Powered Analysis' : 'Direct Founder Access'}
                </h3>
                <p className="text-white/80 font-plus-jakarta">
                  {isDemoMode 
                    ? 'Experience our GPT-4o and AWS Bedrock powered error detection system.'
                    : 'Weekly office hours, feature requests, and direct feedback channel with our founding team.'
                  }
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:shadow-[0_0_40px_rgba(92,240,178,0.1)] transition-all duration-300">
                <div className="w-16 h-16 bg-[#5CF0B2]/30 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-[#5CF0B2]" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-space-grotesk">
                  {isDemoMode ? 'Professional Letters' : 'Priority Features'}
                </h3>
                <p className="text-white/80 font-plus-jakarta">
                  {isDemoMode 
                    ? 'Generate professional dispute letters and phone scripts ready for submission.'
                    : 'First access to new AI models, advanced analytics, and premium dispute strategies.'
                  }
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:shadow-[0_0_40px_rgba(92,240,178,0.1)] transition-all duration-300">
                <div className="w-16 h-16 bg-[#4C8DFF]/30 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-[#4C8DFF]" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-space-grotesk">
                  {isDemoMode ? 'Secure Processing' : 'Enhanced Security'}
                </h3>
                <p className="text-white/80 font-plus-jakarta">
                  {isDemoMode 
                    ? 'See how we protect your data with bank-level encryption and automatic deletion.'
                    : 'Advanced encryption, SOC 2 compliance, and dedicated security monitoring for beta users.'
                  }
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:shadow-[0_0_40px_rgba(92,240,178,0.1)] transition-all duration-300">
                <div className="w-16 h-16 bg-[#5CF0B2]/30 rounded-full flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-[#5CF0B2]" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-space-grotesk">
                  {isDemoMode ? 'Complete Workflow' : 'Founder Badge'}
                </h3>
                <p className="text-white/80 font-plus-jakarta">
                  {isDemoMode 
                    ? 'Experience the complete audit workflow from upload to dispute letter generation.'
                    : 'Special recognition as a founding user, plus exclusive swag and beta completion certificate.'
                  }
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:shadow-[0_0_40px_rgba(92,240,178,0.1)] transition-all duration-300">
                <div className="w-16 h-16 bg-[#4C8DFF]/30 rounded-full flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8 text-[#4C8DFF]" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-space-grotesk">
                  {isDemoMode ? 'No Registration' : '1-on-1 Support'}
                </h3>
                <p className="text-white/80 font-plus-jakarta">
                  {isDemoMode 
                    ? 'Try ScoreSweep immediately without creating an account or providing personal information.'
                    : 'Personal onboarding calls and dedicated support channel for any questions or issues.'
                  }
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Support Us Section */}
      {!isDemoMode && donationProduct && (
        <section className="relative z-10 py-10 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <motion.div variants={fadeUpVariants} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
                <div className="w-16 h-16 bg-[#4C8DFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-[#4C8DFF]" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-space-grotesk">Support ScoreSweep</h3>
                <p className="text-white/80 font-plus-jakarta mb-6 max-w-xl mx-auto">
                  Help us build the future of credit repair technology. Your donation supports our development team and helps keep ScoreSweep accessible to everyone.
                </p>
                
                <div className="max-w-xs mx-auto">
                  <StripeCheckout 
                    product={donationProduct}
                    requireAuth={false}
                    className="mb-4"
                  >
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                      <Coffee className="w-5 h-5" />
                      <span className="font-plus-jakarta">Buy Us a Coffee - {donationProduct.price}</span>
                    </div>
                  </StripeCheckout>
                  
                  <p className="text-sm text-white/60 font-plus-jakarta">
                    No account required. Powered by Stripe secure checkout.
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-20 px-6 bg-white/10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <motion.div variants={fadeUpVariants} className="text-center mb-16">
              <h2 className="text-4xl xl:text-5xl font-bold mb-6 font-space-grotesk">Frequently Asked Questions</h2>
              <p className="text-xl text-white/90 font-plus-jakarta">
                Everything you need to know about ScoreSweep
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeUpVariants}
                  className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <span className="font-semibold text-white font-space-grotesk">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-white/80" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/80" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-white/80 font-plus-jakarta leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <motion.div variants={fadeUpVariants} className="bg-gradient-to-r from-[#4C8DFF]/30 to-[#5CF0B2]/30 backdrop-blur-xl rounded-2xl border border-white/20 p-12">
              <h2 className="text-3xl font-bold mb-6 font-space-grotesk">
                {isDemoMode ? 'Ready to Try ScoreSweep?' : 'Ready to Fix Your Credit Report?'}
              </h2>
              <p className="text-xl text-white/90 mb-8 font-plus-jakarta">
                {isDemoMode 
                  ? 'Experience the full ScoreSweep workflow with our interactive demo'
                  : 'Join thousands of users who\'ve already improved their credit scores with AI-powered error detection'
                }
              </p>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <button
                     onClick={() => setIsWaitlistOpen(true)}
                     className="bg-[#4C8DFF] hover:bg-[#3A7AE4] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(76,141,255,0.4)] font-plus-jakarta inline-flex items-center justify-center space-x-2"
                   >
                     <span>Join Private Beta</span>
                     <ArrowRight className="w-5 h-5" />
                   </button>
                  
                  <Link to="/dashboard">
                    <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 font-plus-jakarta inline-flex items-center justify-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>Try Demo</span>
                    </button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#5CF0B2]" />
                    <span className="font-plus-jakarta">
                      {isDemoMode ? 'No registration required' : 'Free forever access'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-[#5CF0B2]" />
                    <span className="font-plus-jakarta">
                      {isDemoMode ? 'Full feature access' : 'No credit card required'}
                    </span>
                  </div>
                </div>

                {isDemoMode && (
                  <p className="text-sm text-white/80 font-plus-jakarta">
                    Demo mode active - Experience ScoreSweep with sample data
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <motion.div variants={fadeUpVariants} className="text-white/80 font-plus-jakarta">
                © 2025 ScoreSweep · {isDemoMode ? 'Demo Mode' : 'Private Beta'} · Contact hello@scoresweep.org
              </motion.div>
              <motion.div variants={fadeUpVariants} className="text-white/80 font-plus-jakarta">
                Built for Bolt World's Largest Hackathon
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <AnimatePresence>
        {isWaitlistOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsWaitlistOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white font-space-grotesk">Join Private Beta</h3>
                <button
                  onClick={() => setIsWaitlistOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[#5CF0B2]/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-[#5CF0B2]" />
                  </div>
                  <h4 className="text-xl font-semibold text-white font-space-grotesk">You're In!</h4>
                  <p className="text-white/80 font-plus-jakarta">
                    Welcome to the ScoreSweep private beta. We'll send you access details within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2 font-plus-jakarta">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                      placeholder="Enter your full name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2 font-plus-jakarta">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 font-plus-jakarta"
                      placeholder="Enter your email"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="note" className="block text-sm font-medium text-white/90 mb-2 font-plus-jakarta">
                      What's your biggest credit challenge? (Optional)
                    </label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-[#5CF0B2] focus:ring-2 focus:ring-[#5CF0B2]/20 resize-none font-plus-jakarta"
                      placeholder="Tell us about your credit goals..."
                      disabled={isSubmitting}
                    />
                  </div>

                  {submitError && (
                    <div className="text-red-400 text-sm font-plus-jakarta bg-red-400/15 border border-red-400/30 rounded-lg p-3">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#4C8DFF] hover:bg-[#3A7AE4] disabled:bg-[#4C8DFF]/50 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(76,141,255,0.3)] font-plus-jakarta flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Private Beta</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-white/80 font-plus-jakarta">
                    Free forever access • No spam • Unsubscribe anytime
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;