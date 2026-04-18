import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../usePortfolioData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Hexagon, Smartphone, Key, Zap, Menu, X, Globe, Github, Download, Users, Briefcase, Code2, Award, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Suspense, lazy } from 'react';

const RichTextEditor = lazy(() => import('@/src/components/RichTextEditor'));

const API_BASE = '/api';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const { data, updateProfile, updateExperiences, updateProjects, updateSkills, updateFeatures, loading } = usePortfolioData();
  const navigate = useNavigate();

  // Navigation Items
  const navItems = [
    { value: 'profile', label: 'Profile', icon: Users },
    { value: 'experience', label: 'Experience', icon: Briefcase },
    { value: 'projects', label: 'Projects', icon: Code2 },
    { value: 'skills', label: 'Skills', icon: Zap },
    { value: 'messages', label: 'Messages', icon: Mail }
  ];

  // Local state for editing before saving
  const [profile, setProfile] = useState(data.profile);
  const [experiences, setExperiences] = useState(data.experiences);
  const [projects, setProjects] = useState(data.projects);
  const [skills, setSkills] = useState(data.skills);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Update local state when data loads from backend
  useEffect(() => {
    if (!loading) {
      setProfile(data.profile);
      setExperiences(data.experiences);
      setProjects(data.projects);
      setSkills(data.skills);
    }
  }, [loading, data]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchMessages();
    }
  }, []);

  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessages(messages.filter(m => m._id !== id));
        toast.success('Message deleted');
      }
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  const handleSaveActiveTab = () => {
    switch (activeTab) {
      case 'profile': handleSaveProfile(); break;
      case 'experience': handleSaveExperiences(); break;
      case 'projects': handleSaveProjects(); break;
      case 'skills': handleSaveSkills(); break;
      case 'messages': fetchMessages(); break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060612]">
        {/* Living Canvas Backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-[2px] w-32 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-400"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 animate-pulse">Synchronizing Node</p>
        </div>
      </div>
    );
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullNumber }),
      });
      const result = await response.json();
      if (response.ok) {
        setOtpSent(true);
        toast.success('Security code sent to your mobile');
      } else {
        toast.error(result.message || 'Verification failed');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullNumber, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', result.token);
        setIsAuthenticated(true);
        toast.success('Access Granted. Welcome back.');
      } else {
        toast.error(result.message || 'Invalid code');
      }
    } catch (err) {
      toast.error('Verification failure');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = () => {
    updateProfile(profile);
    toast.success('Identity Metadata Updated');
  };

  const handleSaveExperiences = () => {
    updateExperiences(experiences);
    toast.success('Operations Registry Updated');
  };

  const handleSaveProjects = () => {
    updateProjects(projects);
    toast.success('Project Repository Updated');
  };

  const handleSaveSkills = () => {
    updateSkills(skills);
    toast.success('Competency Matrix Updated');
  };

  const handleSaveFeatures = () => {
    toast.success('Project Repository Updated');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Asset too large (>5MB)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // Field name remains 'image' as per backend multer config

    try {
      const token = localStorage.getItem('adminToken');
      console.log('🛡️ SENTINELL DEBUG: Token present:', !!token);
      
      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setProfile({ ...profile, [field]: result.url });
        toast.success('Document Transmitted');
      } else {
        const err = await response.json();
        toast.error(err.message || 'Upload Failed');
      }
    } catch (err) {
      toast.error('Transmission Error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060612] flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
        {/* Aurora Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
        </div>
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-1000"></div>

        <Card className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border-white/[0.08] shadow-2xl shadow-black/50 relative z-10 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-8 pb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto w-32 h-32 flex items-center justify-center mb-4"
            >
              <img src="/admin-logo.png" alt="Sentinell Logo" className="w-full h-full object-contain drop-shadow-2xl brightness-125" />
            </motion.div>
            <CardTitle className="text-3xl font-heading font-bold tracking-tight text-white mb-2">Sentinell Gateway</CardTitle>
            <div className="mt-1 mx-auto w-fit">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-4 py-1.5 bg-white/[0.03] rounded-full border border-white/[0.05]">
                Authorised Personnel Only
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2 mb-3 px-1">
                    <Smartphone className="w-3.5 h-3.5 text-violet-400" /> Mobile Number
                  </Label>
                  <div className="flex h-14 bg-white/[0.03] border border-white/[0.1] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500/50 focus-within:border-violet-500/30 transition-all">
                    <div className="bg-white/[0.05] px-5 flex items-center justify-center border-r border-white/[0.05] text-white/40 font-bold text-sm select-none">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="00000 00000"
                      className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-lg font-medium tracking-wider text-white placeholder:text-white/20"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 shadow-xl shadow-violet-600/20 rounded-2xl text-base font-bold group">
                  {isSubmitting ? 'Transmitting...' : (
                    <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                      Request Access Code <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2 text-left">
                  <Label htmlFor="otp" className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2 mb-3 px-1">
                    <Key className="w-3.5 h-3.5 text-cyan-400" /> Security Token
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                    maxLength={6}
                    className="bg-white/[0.03] border-white/[0.1] text-white focus-visible:ring-violet-500/50 h-14 tracking-[1em] text-center text-xl font-bold rounded-2xl placeholder:text-white/10"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 shadow-xl shadow-violet-600/20 rounded-2xl text-base font-bold uppercase tracking-widest text-xs">
                    {isSubmitting ? 'Decrypting...' : 'Verify Identity'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[10px] font-bold text-white/30 hover:text-white transition-colors tracking-widest flex items-center justify-center gap-2 w-full mt-4 uppercase"
                  >
                    Reset Connection
                  </button>
                </div>
              </form>
            )}

            <div className="text-center mt-10 pt-8 border-t border-white/[0.05]">
              <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Return to Command Center
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060612] flex flex-col relative overflow-hidden text-white selection:bg-violet-500/30">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
      </div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-1000"></div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#060612]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-[50]">
        <div className="flex items-center gap-1.5">
          <img src="/admin-logo.png" alt="Logo" className="w-10 h-10 object-contain brightness-125" />
          <span className="font-bold text-xs tracking-widest uppercase">Sentinell <span className="text-violet-400">Admin</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveActiveTab} className="h-8 px-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-violet-500/20 uppercase tracking-widest">Sync</Button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/10"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-y-0 left-0 w-72 bg-[#060612]/95 backdrop-blur-2xl border-r border-white/5 z-[60] flex flex-col shadow-2xl md:hidden"
          >
            <div className="p-8">
              <img src="/admin-logo.png" alt="Logo" className="w-16 h-16 object-contain mb-4 drop-shadow-lg brightness-125" />
              <h1 className="text-xs font-black tracking-widest uppercase italic text-violet-400">Sentinell <span className="text-white block text-[8px] tracking-[0.3em] font-sans not-italic font-bold opacity-40">Command Center</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      setActiveTab(item.value);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === item.value
                      ? 'bg-white/10 text-violet-400 border border-white/10'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${activeTab === item.value ? 'text-violet-400' : 'text-white/40'}`} />
                    {item.label}
                    {item.value === 'messages' && messages.length > 0 && (
                      <span className="ml-auto bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {messages.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5 flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start h-10 rounded-xl border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 px-4 text-[10px] uppercase tracking-widest font-bold" asChild>
                <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Live Site</Link>
              </Button>
              <Button variant="secondary" onClick={handleLogout} className="w-full justify-start h-10 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 px-4 text-[10px] uppercase tracking-widest font-bold border border-transparent">
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#060612]/60 backdrop-blur-md z-[55] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Navigation Header */}
      <div className="hidden md:flex items-center justify-between px-12 py-3 bg-[#060612]/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[40] shadow-2xl shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/admin-logo.png" alt="Logo" className="w-full h-full object-contain brightness-125" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white">Sentinell <span className="text-violet-400">Admin</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[7px] text-white/30 font-bold uppercase tracking-[0.3em]">Authorized Session</span>
              <div className="w-1 h-1 rounded-full bg-violet-400 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleSaveActiveTab}
            className="h-10 px-6 bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 shadow-xl shadow-violet-600/20 rounded-xl font-bold text-[10px] flex items-center gap-2 uppercase tracking-widest"
          >
            <Download className="w-3.5 h-3.5" /> Sync Registry
          </Button>
          <Button variant="outline" className="border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all" asChild>
            <Link to="/">Live Preview</Link>
          </Button>
          <Button variant="secondary" onClick={handleLogout} className="bg-white/5 border border-transparent hover:border-white/10 text-white/40 hover:text-white h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">Logout</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 xl:p-16 max-w-7xl mx-auto w-full relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:flex bg-white/[0.03] border border-white/10 p-1.5 mb-16 shadow-2xl shadow-black/20 rounded-full w-fit mx-auto gap-2 backdrop-blur-xl">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="rounded-full px-10 py-3.5 data-[state=active]:bg-white/10 data-[state=active]:text-violet-400 data-[state=active]:shadow-xl transition-all font-bold text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white border border-transparent data-[state=active]:border-white/10 relative"
              >
                {item.label}
                {item.value === 'messages' && messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-md border-2 border-white min-w-[20px]">
                    {messages.length}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/[0.05] bg-white/[0.02] p-8">
                <CardTitle className="text-xl font-heading font-bold text-white uppercase tracking-widest">Profile Identity</CardTitle>
                <CardDescription className="text-white/30 text-xs font-medium">Core metadata and professional uplink configurations.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Full Identity</Label>
                    <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white placeholder:text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Temporal Origin (DOB)</Label>
                    <Input type="date" value={profile.dob || ''} onChange={e => setProfile({ ...profile, dob: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white invert-calendar-icon" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Career Launch Date</Label>
                    <Input type="date" value={profile.careerStartDate || ''} onChange={e => setProfile({ ...profile, careerStartDate: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Primary Designation</Label>
                    <Input value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Secure Uplink (Email)</Label>
                    <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Executive Summary (Bio)</Label>
                    <Textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="bg-white/[0.03] border-white/[0.1] min-h-[140px] rounded-2xl focus-visible:ring-violet-500/50 text-white resize-none p-5 text-sm leading-relaxed" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Visual ID Link (Avatar)</Label>
                    <div className="flex gap-3">
                      <Input value={profile.photoUrl || ''} onChange={e => setProfile({ ...profile, photoUrl: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl flex-1 focus-visible:ring-violet-500/50 text-white" />
                      <div className="relative w-28 shrink-0">
                        <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'photoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 text-white/60 hover:text-white uppercase tracking-widest text-[9px] font-bold transition-all">Upload</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Brand Artifact (Logo)</Label>
                    <div className="flex gap-3">
                      <Input value={profile.logoUrl || ''} onChange={e => setProfile({ ...profile, logoUrl: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl flex-1 focus-visible:ring-violet-500/50 text-white" />
                      <div className="relative w-28 shrink-0">
                        <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 text-white/60 hover:text-white uppercase tracking-widest text-[9px] font-bold transition-all">Upload</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">GitHub Endpoint</Label>
                    <Input value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">LinkedIn Endpoint</Label>
                    <Input value={profile.linkedin} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Operational Base</Label>
                    <Input value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Professional Protocol (CV)</Label>
                    <div className="flex gap-3">
                      <Input value={profile.resumeUrl || ''} onChange={e => setProfile({ ...profile, resumeUrl: e.target.value })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl flex-1 focus-visible:ring-violet-500/50 text-white" />
                      <div className="relative w-28 shrink-0">
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileUpload(e, 'resumeUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 text-white/60 hover:text-white uppercase tracking-widest text-[9px] font-bold transition-all">Upload CV</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Work Showcase Link</Label>
                    <Input
                      value={profile.workLink || ''}
                      onChange={e => setProfile({ ...profile, workLink: e.target.value })}
                      className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white"
                      placeholder="Redirect URL for 'View My Work' button"
                    />
                    <p className="text-[10px] text-white/20 font-medium px-1">Optional override for the main CTA scroll behavior.</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Research Index (Count)</Label>
                    <Input type="number" value={profile.researchPapersCount || 0} onChange={e => setProfile({ ...profile, researchPapersCount: parseInt(e.target.value) || 0 })} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-[#0b0b1a]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40">
              <CardHeader className="border-b border-white/[0.05] p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-heading font-bold text-white uppercase tracking-widest">Operations Registry</CardTitle>
                  <CardDescription className="text-white/30 text-xs font-medium">Timeline of professional deployment and career nodes.</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    const newId = Date.now().toString();
                    setExperiences([...experiences, { id: newId, role: '', company: '', period: '', description: '', skills: [] }]);
                    setExpandedItems(prev => ({ ...prev, [newId]: true }));
                  }}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Deployment
                </Button>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className={`border border-white/10 rounded-[2rem] relative bg-white/[0.02] group transition-all hover:bg-white/[0.04] hover:border-violet-500/20 ${expandedItems[exp.id] ? 'p-8' : 'p-4 px-8'}`}>
                    <div className={`flex items-center justify-between transition-all duration-300 ${expandedItems[exp.id] ? 'mb-4 border-b border-white/5 pb-6' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs ring-1 ring-violet-500/20">
                          {index + 1}
                        </div>
                        {!expandedItems[exp.id] && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white uppercase tracking-wider">{exp.role || 'New Terminal Node'}</span>
                            <span className="text-[10px] text-white/30 font-medium">@ {exp.company || 'Unassigned'}</span>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost" size="icon"
                          className="h-9 w-9 text-white/20 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                          onClick={() => toggleExpand(exp.id)}
                        >
                          {expandedItems[exp.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-9 w-9 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedItems[exp.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Designation</Label>
                              <Input value={exp.role} onChange={e => {
                                const newExp = [...experiences];
                                newExp[index].role = e.target.value;
                                setExperiences(newExp);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Entity (Company)</Label>
                              <Input value={exp.company} onChange={e => {
                                const newExp = [...experiences];
                                newExp[index].company = e.target.value;
                                setExperiences(newExp);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Operational Zone (Location)</Label>
                              <Input value={exp.location || ''} onChange={e => {
                                const newExp = [...experiences];
                                newExp[index].location = e.target.value;
                                setExperiences(newExp);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Time Cycle (Period)</Label>
                              <Input value={exp.period} onChange={e => {
                                const newExp = [...experiences];
                                newExp[index].period = e.target.value;
                                setExperiences(newExp);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" placeholder="e.g. NOV 2025 - Present" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Stack Index (CSV)</Label>
                              <Input value={exp.skills?.join(', ') || ''} onChange={e => {
                                const newExp = [...experiences];
                                newExp[index].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setExperiences(newExp);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Mission Specs</Label>
                              <Suspense fallback={<div className="h-[200px] w-full bg-white/[0.02] border border-white/10 rounded-xl animate-pulse" />}>
                                <RichTextEditor 
                                  value={exp.description} 
                                  onChange={(val) => {
                                    const newExp = [...experiences];
                                    newExp[index].description = val;
                                    setExperiences(newExp);
                                  }}
                                  placeholder="Detail your professional impact..."
                                />
                              </Suspense>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-[#0b0b1a]/80 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40">
              <CardHeader className="border-b border-white/[0.05] p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-heading font-bold text-white uppercase tracking-widest">Project Repository</CardTitle>
                  <CardDescription className="text-white/30 text-xs font-medium">Live projects and documentation nodes.</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    const newId = Date.now().toString();
                    setProjects([...projects, {
                      id: newId,
                      title: '',
                      description: '',
                      type: 'project',
                      githubLink: '',
                      liveLink: '',
                      image: '',
                      tags: []
                    }]);
                    setExpandedItems(prev => ({ ...prev, [newId]: true }));
                  }}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {projects.map((project, index) => (
                  <div key={project.id} className={`border border-white/10 rounded-[2rem] relative bg-white/[0.02] group transition-all hover:bg-white/[0.04] hover:border-violet-500/20 ${expandedItems[project.id] ? 'p-8' : 'p-4 px-8'}`}>
                    <div className={`flex items-center justify-between transition-all duration-300 ${expandedItems[project.id] ? 'mb-4 border-b border-white/5 pb-6' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs ring-1 ring-cyan-500/20">
                          {index + 1}
                        </div>
                        {!expandedItems[project.id] && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white uppercase tracking-wider">{project.title || 'Undeployed System'}</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] text-white/40 font-bold uppercase tracking-widest border border-white/5">
                              {project.type}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost" size="icon"
                          className="h-9 w-9 text-white/20 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                          onClick={() => toggleExpand(project.id)}
                        >
                          {expandedItems[project.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-9 w-9 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedItems[project.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">System Title</Label>
                              <Input value={project.title} onChange={e => {
                                const newProj = [...projects];
                                newProj[index].title = e.target.value;
                                setProjects(newProj);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Classification</Label>
                              <select
                                value={project.type}
                                onChange={e => {
                                  const newProj = [...projects];
                                  newProj[index].type = e.target.value as 'project' | 'blog';
                                  setProjects(newProj);
                                }}
                                className="flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus-visible:outline-none focus:ring-2 focus:ring-violet-500/50"
                              >
                                <option value="project" className="bg-[#0b0b1a] text-white">Project</option>
                                <option value="blog" className="bg-[#0b0b1a] text-white">Documentation / Blog</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">GitHub Source</Label>
                              <Input value={project.githubLink || ''} onChange={e => {
                                const newProj = [...projects];
                                newProj[index].githubLink = e.target.value;
                                setProjects(newProj);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Live Uplink</Label>
                              <Input value={project.liveLink || ''} onChange={e => {
                                const newProj = [...projects];
                                newProj[index].liveLink = e.target.value;
                                setProjects(newProj);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Image Asset Link</Label>
                              <Input value={project.image || ''} onChange={e => {
                                const newProj = [...projects];
                                newProj[index].image = e.target.value;
                                setProjects(newProj);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Tags (CSV)</Label>
                              <Input value={project.tags?.join(', ') || ''} onChange={e => {
                                const newProj = [...projects];
                                newProj[index].tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                                setProjects(newProj);
                              }} className="bg-white/[0.03] border-white/[0.1] h-12 rounded-xl focus-visible:ring-violet-500/50 text-white" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Project Spec</Label>
                              <Suspense fallback={<div className="h-[200px] w-full bg-white/[0.02] border border-white/10 rounded-xl animate-pulse" />}>
                                <RichTextEditor 
                                  value={project.description} 
                                  onChange={(val) => {
                                    const newProj = [...projects];
                                    newProj[index].description = val;
                                    setProjects(newProj);
                                  }}
                                  placeholder="Describe the system architecture, features, and tech stack..."
                                />
                              </Suspense>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/[0.05] bg-white/[0.02] p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-heading font-bold text-white uppercase tracking-widest">Skill Matrix</CardTitle>
                  <CardDescription className="text-white/30 text-xs font-medium">Efficiency calibration nodes across technical stacks.</CardDescription>
                </div>
                <Button
                  onClick={() => setSkills([...skills, { name: '', level: 50 }])}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90 h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Matrix Node
                </Button>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="p-6 border border-white/10 rounded-2xl relative bg-white/[0.02] group transition-all hover:bg-white/[0.04] hover:border-violet-500/20">
                      <Button
                        variant="ghost" size="icon"
                        className="absolute top-3 right-3 h-8 w-8 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <div className="space-y-4 pr-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">Node Title</Label>
                          <Input value={skill.name} onChange={e => {
                            const newSkills = [...skills];
                            newSkills[index].name = e.target.value;
                            setSkills(newSkills);
                          }} className="bg-white/[0.03] border-white/[0.1] h-10 rounded-xl focus-visible:ring-violet-500/50 text-white placeholder:text-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1 flex justify-between">Efficiency <span>{skill.level}%</span></Label>
                          <input
                            type="range"
                            min="0" max="100"
                            value={skill.level}
                            onChange={e => {
                              const newSkills = [...skills];
                              newSkills[index].level = parseInt(e.target.value);
                              setSkills(newSkills);
                            }}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/[0.05] bg-white/[0.02] p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-heading font-bold text-white uppercase tracking-widest">Admin Inbox</CardTitle>
                  <CardDescription className="text-white/30 text-xs font-medium">Incoming transmissions from the global uplink.</CardDescription>
                </div>
                <div className="bg-violet-600/20 text-violet-400 border border-violet-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {messages.length} Synchronized
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {messages.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto border border-white/5 text-white/20">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-[10px]">Registry Empty</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg._id} className="p-8 hover:bg-white/[0.02] transition-all group relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-8 right-8 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                          onClick={() => handleDeleteMessage(msg._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 flex items-center justify-center border border-white/10 shrink-0">
                            <span className="text-lg font-bold text-violet-400">{msg.name[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white mb-1">{msg.name}</h3>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-cyan-400"></span> {msg.email}
                              </span>
                              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">|</span>
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-violet-400"></span> {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                          <h4 className="text-white/80 font-bold text-sm mb-2">{msg.subject}</h4>
                          <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
