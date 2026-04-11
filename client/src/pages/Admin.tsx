import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../usePortfolioData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Hexagon, Smartphone, Key, Zap, Menu, X, Globe, Github, Download, Users, Briefcase, Code2, Award, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fafbfc]">
        {/* 🎨 Living Canvas Backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-100/30 blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-[2px] w-32 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-blue-600"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">Synchronizing Node</p>
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
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
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
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans text-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-fuchsia-50/50 pointer-events-none" />
        <Card className="w-full max-w-md bg-white border-slate-200 shadow-2xl shadow-blue-500/10 relative z-10 rounded-[2rem] overflow-hidden">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="mx-auto w-64 h-64 flex items-center justify-center mb-1">
              <img src="/admin-logo.png" alt="Sentinell Logo" className="w-full h-full object-contain drop-shadow-2xl brightness-110" />
            </div>
            <CardTitle className="text-3xl font-heading font-medium tracking-tight text-slate-900">Sentinell Gateway</CardTitle>
            <div className="mt-1 mx-auto w-fit">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Access is only allowed to Ayush 😂
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile Number
                  </Label>
                  <div className="flex h-14 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all">
                    <div className="bg-slate-200/40 px-5 flex items-center justify-center border-r border-slate-200 text-slate-600 font-bold text-sm select-none">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="00000 00000"
                      className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-lg font-medium tracking-wider"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 shadow-xl shadow-blue-600/20 rounded-2xl text-base font-semibold group">
                  {isSubmitting ? 'Transmitting...' : (
                    <span className="flex items-center justify-center gap-2">
                      Request Access Code <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2 text-left">
                  <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                    <Key className="w-3.5 h-3.5" /> Login Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-blue-600 h-14 tracking-[0.6em] text-center text-xl font-bold rounded-2xl"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 shadow-xl shadow-blue-600/20 rounded-2xl text-base font-semibold">
                    {isSubmitting ? 'Decrypting...' : 'Verify Identity'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors tracking-widest flex items-center justify-center gap-2 w-full mt-4"
                  >
                    Reset Connection
                  </button>
                </div>
              </form>
            )}

            <div className="text-center mt-10 pt-8 border-t border-slate-100/60">
              <Link to="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Return to Command Center
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-[50]">
        <div className="flex items-center gap-1.5">
          <img src="/admin-logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          <span className="font-bold text-sm tracking-tighter uppercase">Sentinell <span className="text-blue-600">Admin</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveActiveTab} className="h-9 px-4 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20">Sync</Button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-lg"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-[60] flex flex-col shadow-2xl md:hidden"
          >
            <div className="p-8">
              <img src="/admin-logo.png" alt="Logo" className="w-20 h-20 object-contain mb-6 drop-shadow-lg" />
              <h1 className="text-sm font-black tracking-tight" style={{ fontFamily: "'Anta', sans-serif" }}>Sentinell <span className="text-blue-600 italic block text-[9px] tracking-widest font-sans">Admin Nexus</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      setActiveTab(item.value);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === item.value
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === item.value ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                    {item.value === 'messages' && messages.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm min-w-[20px] text-center">
                        {messages.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start h-11 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 px-4" asChild>
                <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Live Site</Link>
              </Button>
              <Button variant="secondary" onClick={handleLogout} className="w-full justify-start h-11 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 px-4">
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Navigation Header */}
      <div className="hidden md:flex items-center justify-between px-12 py-4 bg-white border-b border-slate-100 sticky top-0 z-[40] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-28 h-28 flex items-center justify-center">
            <img src="/admin-logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-md brightness-105" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase" style={{ fontFamily: "'Anta', sans-serif" }}>Sentinell <span className="text-blue-600 font-sans tracking-normal font-black">Admin</span></h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Authorised</span>
              <span className="text-[9px] text-black font-black uppercase tracking-widest">Ayush Session</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSaveActiveTab}
            className="h-10 px-6 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 rounded-xl font-bold text-xs flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Sync Registry
          </Button>
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100 h-10 px-4 rounded-xl font-bold text-xs" asChild>
            <Link to="/">Live Preview</Link>
          </Button>
          <Button variant="secondary" onClick={handleLogout} className="bg-slate-200 text-slate-700 hover:bg-slate-300 h-10 px-4 rounded-xl font-bold text-xs">Logout</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 lg:p-12 xl:p-16 max-w-7xl mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:flex bg-slate-50 border border-slate-200 p-2 mb-12 shadow-sm rounded-full w-fit mx-auto gap-3">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="rounded-full px-12 py-4 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all font-bold text-sm tracking-wide text-slate-500 hover:text-slate-900 border border-transparent data-[state=active]:border-slate-100 relative"
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-xl">Profile Setup</CardTitle>
                <CardDescription className="text-slate-500">Your professional details shown on the website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Full Name</Label>
                    <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Date of Birth</Label>
                    <Input type="date" value={profile.dob || ''} onChange={e => setProfile({ ...profile, dob: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Career Start Date</Label>
                    <Input type="date" value={profile.careerStartDate || ''} onChange={e => setProfile({ ...profile, careerStartDate: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Specialization</Label>
                    <Input value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Secure Email</Label>
                    <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold">Short Bio</Label>
                    <Textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="bg-slate-50 border-slate-200 min-h-[120px] rounded-xl focus-visible:ring-blue-600 resize-none p-4" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Profile Photo Link</Label>
                    <div className="flex gap-3">
                      <Input value={profile.photoUrl || ''} onChange={e => setProfile({ ...profile, photoUrl: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl flex-1 focus-visible:ring-blue-600" />
                      <div className="relative w-28 shrink-0">
                        <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'photoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50">Upload</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Logo Link</Label>
                    <div className="flex gap-3">
                      <Input value={profile.logoUrl || ''} onChange={e => setProfile({ ...profile, logoUrl: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl flex-1 focus-visible:ring-blue-600" />
                      <div className="relative w-28 shrink-0">
                        <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50">Upload</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">GitHub Connectivity</Label>
                    <Input value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">LinkedIn Connectivity</Label>
                    <Input value={profile.linkedin} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Current Headquarters</Label>
                    <Input value={profile.location || ''} onChange={e => setProfile({ ...profile, location: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold">Professional Resume (PDF/DOCX)</Label>
                    <div className="flex gap-3">
                      <Input value={profile.resumeUrl || ''} onChange={e => setProfile({ ...profile, resumeUrl: e.target.value })} className="bg-slate-50 border-slate-200 h-12 rounded-xl flex-1 focus-visible:ring-blue-600" placeholder="Paste link or upload below" />
                      <div className="relative w-28 shrink-0">
                        <Input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileUpload(e, 'resumeUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50">Upload CV</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold">Research Papers Published (Count)</Label>
                    <Input type="number" value={profile.researchPapersCount || 0} onChange={e => setProfile({ ...profile, researchPapersCount: parseInt(e.target.value) || 0 })} className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Work Experience</CardTitle>
                  <CardDescription className="text-slate-500">Timeline of your professional journey.</CardDescription>
                </div>
                <Button
                  onClick={() => setExperiences([...experiences, { id: Date.now().toString(), role: '', company: '', period: '', description: '', skills: [] }])}
                  className="bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="p-8 border border-slate-100 rounded-3xl relative bg-slate-50/50 group transition-all hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5">
                    <Button
                      variant="ghost" size="icon"
                      className="absolute top-6 right-6 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pr-12">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Job Title</Label>
                        <Input value={exp.role} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].role = e.target.value;
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Company Name</Label>
                        <Input value={exp.company} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].company = e.target.value;
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Time Period</Label>
                        <Input value={exp.period} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].period = e.target.value;
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" placeholder="e.g. NOV 2025 - Present" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Core Stack (CSV)</Label>
                        <Input value={exp.skills?.join(', ') || ''} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-slate-700 font-semibold">Deployment Summary</Label>
                        <Textarea value={exp.description} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].description = e.target.value;
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200 min-h-[100px] rounded-xl p-4 resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Project Repository</CardTitle>
                  <CardDescription className="text-slate-500">Live projects and documentation.</CardDescription>
                </div>
                <Button
                  onClick={() => setProjects([...projects, {
                    id: Date.now().toString(),
                    title: '',
                    description: '',
                    type: 'project',
                    githubLink: '',
                    liveLink: '',
                    image: '',
                    tags: []
                  }])}
                  className="bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {projects.map((project, index) => (
                  <div key={project.id} className="p-8 border border-slate-100 rounded-3xl relative bg-slate-50/50 group transition-all hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5">
                    <Button
                      variant="ghost" size="icon"
                      className="absolute top-6 right-6 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pr-12">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">System Title</Label>
                        <Input value={project.title} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].title = e.target.value;
                          setProjects(newProj);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Classification</Label>
                        <select
                          value={project.type}
                          onChange={e => {
                            const newProj = [...projects];
                            newProj[index].type = e.target.value as 'project' | 'blog';
                            setProjects(newProj);
                          }}
                          className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <option value="project">Project</option>
                          <option value="blog">Documentation / Blog</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">GitHub Source</Label>
                        <Input value={project.githubLink || ''} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].githubLink = e.target.value;
                          setProjects(newProj);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Live Uplink</Label>
                        <Input value={project.liveLink || ''} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].liveLink = e.target.value;
                          setProjects(newProj);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Image Asset Link</Label>
                        <Input value={project.image || ''} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].image = e.target.value;
                          setProjects(newProj);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold">Tags (CSV)</Label>
                        <Input value={project.tags?.join(', ') || ''} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          setProjects(newProj);
                        }} className="bg-white border-slate-200 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-slate-700 font-semibold">Project Spec</Label>
                        <Textarea value={project.description} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].description = e.target.value;
                          setProjects(newProj);
                        }} className="bg-white border-slate-200 min-h-[100px] rounded-xl p-4 resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Competency Matrix</CardTitle>
                  <CardDescription className="text-slate-500">Skill level distribution metrics.</CardDescription>
                </div>
                <Button
                  onClick={() => setSkills([...skills, { name: '', level: 50 }])}
                  className="bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Competency
                </Button>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="p-6 border border-slate-100 rounded-2xl relative bg-slate-50/50 hover:bg-white transition-all hover:shadow-lg hover:shadow-blue-900/5">
                      <Button
                        variant="ghost" size="icon"
                        className="absolute top-3 right-3 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="space-y-4 pr-6">
                        <div className="space-y-1">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Skill</Label>
                          <Input value={skill.name} onChange={e => {
                            const newSkills = [...skills];
                            newSkills[index].name = e.target.value;
                            setSkills(newSkills);
                          }} className="bg-white border-slate-200 h-10 rounded-lg" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Efficiency ({skill.level}%)</Label>
                          <input
                            type="range"
                            min="0" max="100"
                            value={skill.level}
                            onChange={e => {
                              const newSkills = [...skills];
                              newSkills[index].level = parseInt(e.target.value);
                              setSkills(newSkills);
                            }}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Admin Inbox</CardTitle>
                  <CardDescription className="text-slate-500">Incoming transmissions from the uplink.</CardDescription>
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {messages.length} Messages
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {messages.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Uplink silent. No new messages detected.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg._id} className="p-6 border border-slate-100 rounded-3xl bg-white hover:border-blue-100 transition-all group relative shadow-sm hover:shadow-md">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-sm font-bold text-slate-900">{msg.name}</span>
                              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{msg.email}</span>
                              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                            <div>
                              <h4 className="text-slate-900 font-bold text-lg mb-1">{msg.subject}</h4>
                              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors md:self-start shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
