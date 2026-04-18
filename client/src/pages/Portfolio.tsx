import React, { useState, useEffect, useRef } from 'react';
import { usePortfolioData } from '../usePortfolioData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Clock,
  Briefcase, Code2, Zap, Users, ArrowRight, Download,
  ExternalLink, ChevronRight, Terminal, Globe, Award, Menu, X, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ProjectTagStrip = ({ tags, isExpanded, onToggle }: { tags: string[]; isExpanded: boolean; onToggle: () => void }) => {
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        // Check if the scrollHeight is larger than a single row height
        // A single row with padding/border is roughly 32-36px.
        setHasOverflow(containerRef.current.scrollHeight > 38);
      }
    };

    checkOverflow();
    // Re-check on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tags]);

  return (
    <div className="flex justify-between items-start mb-6 min-h-[40px]">
      <div
        ref={containerRef}
        className={`flex flex-wrap gap-2 transition-all duration-300 ${!isExpanded ? 'max-h-[34px] overflow-hidden' : ''}`}
      >
        {tags?.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-violet-500/10 text-violet-300 text-[10px] font-bold rounded-lg border border-violet-500/20 font-sans whitespace-nowrap">
            {tag}
          </span>
        ))}
      </div>
      {hasOverflow && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className="ml-2 px-1 py-1 text-violet-400 text-[9px] font-black uppercase tracking-tighter hover:text-cyan-400 transition-colors whitespace-nowrap self-start mt-1"
        >
          {isExpanded ? 'Less -' : '+ More'}
        </button>
      )}
    </div>
  );
};

export default function Portfolio() {
  const { data, loading } = usePortfolioData();
  const { profile, experiences, projects, skills, features } = data;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllProj, setShowAllProj] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [expandedExperiences, setExpandedExperiences] = useState<Record<string, boolean>>({});
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  const toggleProjectExpansion = (id: string) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTagExpansion = (id: string) => {
    setExpandedTags(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExperienceExpansion = (id: string) => {
    setExpandedExperiences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [activeTab, setActiveTab] = useState('profile');
  const API_BASE = '/api';


  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        toast.success("Message transmitted. I'll calibrate a response shortly.");
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error("Transmission failure. System re-calibration required.");
      }
    } catch (err) {
      toast.error('Network uplink unreachable');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const actualProjects = projects.filter(p => p.type === 'project');
  const blogs = projects.filter(p => p.type === 'blog');

  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateExperience = (startDateString: string) => {
    if (!startDateString) return "0.0";
    const startDate = new Date(startDateString);
    const today = new Date();

    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years}.${months}`;
  };


  // Section Observer
  useEffect(() => {
    const sections = ['profile', 'experience', 'skills', 'projects', 'blogs', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveTab(id);
          }
        });
      }, {
        threshold: [0.5],
        rootMargin: '-10% 0px -10% 0px'
      });

      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o?.disconnect());
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060612]">
        {/* 🎨 Living Canvas Backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[40%] w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="h-[1.5px] w-48 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-400"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 animate-pulse">Initializing System</p>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-violet-400/30">Sentinell Neural Interface</p>
          </div>
        </div>
      </div>
    );
  }

  const currentAge = calculateAge(profile.dob);
  const yearsOfExperience = calculateExperience(profile.careerStartDate);
  const totalProjects = actualProjects.length;
  const totalBlogs = blogs.length;

  return (
    <div className="min-h-screen text-white font-sans selection:bg-violet-500/30 relative">

      {/* 🎯 Section Dots Indicator */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3 items-center p-3 rounded-full bg-white/[0.02] backdrop-blur-sm border border-white/[0.05]">
        {['profile', 'experience', 'skills', 'projects', 'contact'].map((section) => {
          const isActive = activeTab === section;
          return (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="group relative flex items-center justify-center p-2 cursor-pointer"
              aria-label={`Scroll to ${section}`}
            >
              {/* Tooltip */}
              <span className="absolute right-full mr-4 px-2.5 py-1 rounded bg-white/[0.03] backdrop-blur-xl border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl">
                {section}
              </span>

              <motion.div
                animate={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  backgroundColor: isActive ? '#a78bfa' : 'rgba(255, 255, 255, 0.2)',
                  boxShadow: isActive ? '0 0 8px #22d3ee, 0 0 16px #22d3eeaa' : 'none',
                }}
                transition={{ duration: 0.3 }}
                className="rounded-full"
              />
            </button>
          );
        })}
      </div>

      {/* 💎 Aurora Glass Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#060612] overflow-hidden">
        {/* SVG Noise Texture Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay z-10">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* Static Aurora Decorative Blobs */}
        <div className="absolute -top-[10%] -left-[5%] w-[800px] h-[800px] rounded-full bg-violet-500/8 blur-[160px]"></div>
        <div className="absolute -bottom-[5%] -right-[5%] w-[600px] h-[600px] rounded-full bg-cyan-500/6 blur-[140px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="fixed top-0 w-full z-50 bg-[#060612]/80 backdrop-blur-xl border-b border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-2.5 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                <img
                  src={profile.logoUrl || "/logo.png"}
                  alt="Logo"
                  className="w-full h-full object-contain drop-shadow-md brightness-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl tracking-[0.2em] font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 leading-none uppercase" style={{ fontFamily: "var(--font-heading)" }}>Sentinell</span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-white/40 font-medium">By</span>
                  <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-sans)" }}>Kryonex Studio</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex gap-2 mr-4">
                <a href={profile.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-violet-400 hover:border-violet-400/30 transition-all cursor-pointer">
                  <Github className="w-5 h-5" />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-violet-400 hover:border-violet-400/30 transition-all cursor-pointer">
                  <Linkedin className="w-5 h-5" />
                </a>
                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-violet-400 hover:border-violet-400/30 transition-all cursor-pointer">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-violet-400 hover:border-violet-400/30 transition-all cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </motion.header>

        {/* Mobile Sidebar - Separated to ensure solid background and fixed position */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-[260px] bg-[#0c0c1e] z-[110] shadow-2xl p-6 flex flex-col border-l border-white/[0.08]"
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Sentinell</span>
                  <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-4 flex-1">
                  {['profile', 'experience', 'skills', 'projects', 'contact'].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        scrollToSection(item);
                        setIsMenuOpen(false);
                      }}
                      className="block text-lg font-bold text-white/80 hover:text-violet-400 transition-colors capitalize"
                    >
                      {item}
                    </button>
                  ))}
                </nav>

                <div className="pt-6 border-t border-white/[0.08] space-y-4">
                  <div className="flex gap-3 mb-4">
                    <a href={profile.github} className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/60"><Github className="w-5 h-5" /></a>
                    <a href={profile.linkedin} className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/60"><Linkedin className="w-5 h-5" /></a>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-white/10 bg-white/5 font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all shadow-sm cursor-pointer"
                    onClick={() => {
                      if (profile.workLink) {
                        const url = profile.workLink.startsWith('http')
                          ? profile.workLink
                          : `https://${profile.workLink}`;
                        window.open(url, '_blank');
                      } else {
                        scrollToSection('projects');
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                      View My Work
                    </span>
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-white/10 bg-white/5 font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all shadow-sm group"
                    onClick={() => {
                      if (profile.resumeUrl) {
                        window.open(profile.resumeUrl, '_blank');
                      } else {
                        toast.error('Resume not yet uploaded');
                      }
                    }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                      Download CV
                    </span>
                    <Download className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                  </Button>
                  <a href="/admin" className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-bold text-white/30 hover:text-violet-400 transition-colors uppercase tracking-[0.2em] mt-2">
                    <Terminal className="w-3 h-3" /> Admin Portal
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-32">
          {/* Hero Section */}
          <section id="profile" className="max-w-7xl mx-auto px-6 mb-24 relative overflow-visible">
            <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:w-1/2 space-y-8"
              >
                <div>
                  <h3 className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-3">
                    Welcome to my portfolio
                  </h3>
                  <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.2] mb-4">
                    Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">{profile.name}</span>
                  </h1>
                  <h2 className="text-base md:text-2xl font-medium text-white/80">
                    {profile.title}
                  </h2>
                  <p className="mt-6 text-sm md:text-lg text-white/60 leading-relaxed max-w-xl">
                    {profile.bio}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/5 h-12 px-8 shadow-sm flex items-center gap-2 font-bold cursor-pointer text-base transition-all hover:bg-white/10"
                    onClick={() => {
                      if (profile.workLink) {
                        const url = profile.workLink.startsWith('http')
                          ? profile.workLink
                          : `https://${profile.workLink}`;
                        window.open(url, '_blank');
                      } else {
                        scrollToSection('projects');
                      }
                    }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                      View My Work
                    </span>
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/5 h-12 px-8 shadow-sm flex items-center gap-2 font-bold cursor-pointer text-base transition-all hover:bg-white/10 group"
                    onClick={() => {
                      if (profile.resumeUrl) {
                        window.open(profile.resumeUrl, '_blank');
                      } else {
                        toast.error('Resume not yet uploaded by author');
                      }
                    }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                      Download CV
                    </span>
                    <Download className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </motion.div>

              {/* Right: Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/2 flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-[160px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[300px]">
                  <div className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-white/[0.04] backdrop-blur-xl p-2 sm:p-2.5 shadow-2xl shadow-violet-500/10 border border-white/10 relative z-10 transition-transform hover:scale-[1.02] duration-500">
                    <div className="w-full aspect-[3/4] rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden relative bg-white/[0.03]">
                      <img
                        src={profile.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"}
                        alt=""
                        className="w-full h-full object-cover object-top grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                        onError={(e: any) => e.target.style.display = 'none'}
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 z-20 bg-[#060612]/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl shadow-violet-500/20 border border-white/10 flex flex-col items-center justify-center animate-bounce-slow">
                    <span className="text-base sm:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 tracking-tighter drop-shadow-sm">{yearsOfExperience}+</span>
                    <span className="text-[7px] sm:text-[9px] font-bold text-white/60 tracking-widest uppercase">Years Exp</span>
                  </div>

                  <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#060612]/60 backdrop-blur-xl rounded-full px-2.5 sm:px-6 py-2 sm:py-3 shadow-xl shadow-violet-500/20 border border-white/10 flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                    <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-violet-500"></span>
                    </span>
                    <span className="text-[9px] sm:text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 tracking-wide uppercase">Open to work</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-7xl mx-auto px-6 mb-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-white/[0.08] text-center">
                <div className="text-xl sm:text-4xl font-bold text-white mb-2">{yearsOfExperience}+</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Years Experience</div>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-white/[0.08] text-center">
                <div className="text-xl sm:text-4xl font-bold text-white mb-2">{totalProjects}</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Projects Done</div>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-white/[0.08] text-center">
                <div className="text-xl sm:text-4xl font-bold text-white mb-2">{profile.researchPapersCount || 0}</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Research Papers</div>
              </div>
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-white/[0.08] text-center">
                <div className="text-xl sm:text-4xl font-bold text-white mb-2">{currentAge}</div>
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Years Old</div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="max-w-7xl mx-auto px-6 mb-16 sm:mb-20 lg:mb-24">
            <div className="text-center mb-16">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Work Experience</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 mx-auto rounded-full"></div>
            </div>

            <div className="relative border-l-2 border-violet-500/20 ml-3 sm:ml-5 space-y-12">
              <AnimatePresence mode="popLayout">
                {(showAllExp ? experiences : experiences.slice(0, 2)).map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative pl-6 sm:pl-8 md:pl-12"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[17px] sm:-left-[21px] top-2 w-10 h-10 rounded-xl bg-white/[0.05] border border-violet-400/20 shadow-sm flex items-center justify-center text-violet-400 backdrop-blur-md">
                      <Briefcase className="w-5 h-5" />
                    </div>

                    <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-white/[0.08] shadow-xl shadow-black/20 hover:border-violet-400/20 transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{exp.role}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-violet-400 font-medium">{exp.company}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-white/40 text-sm">{exp.location}</span>
                          </div>
                        </div>
                        <div className="px-4 py-1.5 bg-white/[0.05] rounded-full border border-white/10 text-white/60 text-xs font-bold whitespace-nowrap self-start md:self-center">
                          {exp.period}
                        </div>
                      </div>
                      <div className="relative">
                        <p className={`text-white/60 leading-relaxed transition-all duration-300 ${!expandedExperiences[exp.id] ? 'line-clamp-3 md:line-clamp-none' : ''}`}>
                          {exp.description}
                        </p>
                        {exp.description.length > 150 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleExperienceExpansion(exp.id);
                            }}
                            className="md:hidden text-violet-400 text-xs font-bold mt-2 hover:text-cyan-400 transition-colors uppercase tracking-widest"
                          >
                            {expandedExperiences[exp.id] ? 'Less -' : 'More +'}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-center mt-12">
              <Button
                variant="ghost"
                onClick={() => setShowAllExp(!showAllExp)}
                className="text-white/60 hover:text-white hover:bg-white/5 font-bold tracking-wide uppercase text-xs"
              >
                {showAllExp ? 'Show Less' : 'View Full History'}
              </Button>
            </div>
          </section>

          {/* Skills Section */}
          {skills.length > 0 && (
            <section id="skills" className="max-w-7xl mx-auto px-6 mb-16 sm:mb-20 lg:mb-24">
              <div className="text-center mb-16">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Core Competencies</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {skills.map((skill, index) => {
                  const name = skill.name.toLowerCase();
                  let iconUrl = "";

                  if (name.includes('python')) iconUrl = "https://cdn.simpleicons.org/python/a78bfa";
                  else if (name.includes('generative ai') || name.includes('llm') || name.includes('openai')) iconUrl = "https://cdn.simpleicons.org/openai/a78bfa";
                  else if (name.includes('machine learning') || name.includes('scikit')) iconUrl = "https://cdn.simpleicons.org/scikitlearn/a78bfa";
                  else if (name.includes('tensorflow')) iconUrl = "https://cdn.simpleicons.org/tensorflow/a78bfa";
                  else if (name.includes('pytorch')) iconUrl = "https://cdn.simpleicons.org/pytorch/a78bfa";
                  else if (name.includes('langchain')) iconUrl = "https://cdn.simpleicons.org/chainlink/a78bfa";
                  else if (name.includes('vector') || name.includes('graph') || name.includes('db') || name.includes('sql')) iconUrl = "https://cdn.simpleicons.org/mongodb/a78bfa";
                  else if (name.includes('docker')) iconUrl = "https://cdn.simpleicons.org/docker/a78bfa";
                  else if (name.includes('cloud') || name.includes('aws') || name.includes('gcp')) iconUrl = "https://cdn.simpleicons.org/amazonaws/a78bfa";
                  else iconUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name)}&background=1e1b4b&color=a78bfa&bold=true`;

                  return (
                    <motion.div
                      key={skill.id || index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="bg-white/[0.04] backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/[0.06] hover:border-violet-400/30 transition-all hover:shadow-xl hover:shadow-violet-500/5 group"
                    >
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/[0.05] flex items-center justify-center p-2 sm:p-3 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                        <img
                          src={iconUrl}
                          alt={skill.name}
                          className="w-full h-full object-contain brightness-125"
                          onError={(e: any) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name)}&background=1e1b4b&color=a78bfa&bold=true`}
                        />
                      </div>
                      <h3 className="text-sm sm:text-lg font-bold text-white mt-3 sm:mt-4 mb-1.5 sm:mb-2 line-clamp-1">{skill.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-bold text-white/40">{skill.level}%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Projects Section */}
          <section id="projects" className="max-w-7xl mx-auto px-6 mb-16 sm:mb-20 lg:mb-24">
            <div className="text-center mb-16">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">Featured Projects</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 mx-auto rounded-full"></div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {(showAllProj ? actualProjects : actualProjects.slice(0, 2)).map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group"
                  >
                    <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl sm:rounded-[2rem] overflow-hidden hover:border-violet-400/20 transition-all shadow-2xl shadow-black/20 h-full flex flex-col">
                      <CardContent className="p-5 sm:p-8 lg:p-10 flex flex-col h-full">
                        <ProjectTagStrip
                          tags={project.tags || []}
                          isExpanded={expandedTags[project.id]}
                          onToggle={() => toggleTagExpansion(project.id)}
                        />

                        <h3 className="text-xl sm:text-3xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors tracking-tight leading-none">{project.title}</h3>
                        <div className="relative mb-6 flex-grow">
                          <p className={`text-sm sm:text-base text-white/60 leading-relaxed transition-all duration-300 ${!expandedProjects[project.id] ? 'line-clamp-3 sm:line-clamp-none' : ''}`}>
                            {project.description}
                          </p>
                          {project.description.length > 120 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleProjectExpansion(project.id);
                              }}
                              className="lg:hidden text-violet-400 text-xs font-bold mt-2 hover:text-cyan-400 transition-colors uppercase tracking-widest"
                            >
                              {expandedProjects[project.id] ? 'Less -' : 'More +'}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-end pt-6 border-t border-white/[0.06] mt-auto">
                          <div className="flex gap-6">
                            {project.githubLink && (
                              <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-white/40 hover:text-violet-400 transition-colors flex items-center gap-2 group cursor-pointer" title="GitHub Repository">
                                <span className="text-[10px] font-bold font-sans">Source code</span>
                                <Github className="w-5 h-5" />
                              </a>
                            )}
                            {project.liveLink && (
                              <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-2 group cursor-pointer" title="Live Demo">
                                <span className="text-[10px] font-bold font-sans">Live preview</span>
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {actualProjects.length > 2 && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={() => setShowAllProj(!showAllProj)}
                  variant="ghost"
                  className="rounded-full px-8 py-6 text-white/60 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs transition-all"
                >
                  {showAllProj ? 'Show Less' : `View All ${actualProjects.length} Projects`}
                </Button>
              </div>
            )}
          </section>

          {/* Technical Blog Section */}
          {blogs.length > 0 && (
            <section id="blogs" className="max-w-7xl mx-auto px-6 mb-16 sm:mb-20 lg:mb-24">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h3 className="text-sm font-bold text-violet-400 tracking-widest uppercase mb-2">Thoughts</h3>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white">Technical Blog</h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 mt-4 rounded-full"></div>
                </div>
                <a href="#" className="hidden md:flex items-center text-violet-400 font-medium hover:text-cyan-400 transition-colors">
                  All Articles <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <a href={blog.link || '#'} className="block h-full group cursor-pointer">
                      <Card className="h-full bg-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/20 hover:border-violet-400/20 transition-all">
                        <div className="w-full h-48 overflow-hidden bg-white/[0.02] relative">
                          {blog.image ? (
                            <img src={blog.image} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" onError={(e: any) => e.target.style.display = 'none'} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-violet-500/10 to-cyan-500/10 flex items-center justify-center">
                              <Code2 className="w-12 h-12 text-violet-400/30" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {blog.tags.map((tag, i) => (
                                <span key={i} className="px-2.5 py-0.5 bg-violet-500/10 text-violet-300 text-xs font-medium rounded-full border border-violet-500/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors line-clamp-2">{blog.title}</h3>
                          <p className="text-white/60 text-sm mb-6 line-clamp-3">{blog.description}</p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
                            <span className="text-xs text-white/40 flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {blog.readTime || '5 min read'}
                            </span>
                            <span className="text-sm font-medium text-violet-400 flex items-center group-hover:text-cyan-400 transition-colors">
                              Read <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Mobile All Articles Button */}
              <div className="mt-8 flex justify-center md:hidden">
                <a href="#" className="flex items-center gap-2 text-violet-400 font-bold text-sm tracking-wide uppercase hover:text-cyan-400 transition-all">
                  View all articles <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-sm font-bold text-violet-400 tracking-widest mb-2">Get In Touch</h3>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4">Let's Work Together</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 mx-auto rounded-full mb-6"></div>
              <p className="text-white/60 max-w-2xl mx-auto">
                Have a project in mind or want to discuss opportunities? {profile.name.split(' ')[0]} is ready for collaboration.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left: Info */}
              <div className="lg:w-1/3 space-y-6">
                <div className="bg-white/[0.04] backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-violet-400">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Email Me</h4>
                      <p className="text-white font-medium">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-violet-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest">Location</h4>
                      <p className="text-white font-medium">{profile.location || 'Remote / Worldwide'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.04] backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/20">
                  <h4 className="text-sm font-bold text-white mb-4">Connect on Social</h4>
                  <div className="flex gap-4">
                    <a href={profile.github} className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/60 hover:text-violet-400 hover:bg-white/[0.08] transition-all border border-white/5">
                      <Github className="w-6 h-6" />
                    </a>
                    <a href={profile.linkedin} className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/60 hover:text-violet-400 hover:bg-white/[0.08] transition-all border border-white/5">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:w-2/3">
                <Card className="bg-white/[0.03] backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-white/[0.08]">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Your Name</label>
                          <Input
                            placeholder="John Doe"
                            className="h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus-visible:ring-violet-500 placeholder:text-white/20"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus-visible:ring-violet-500 placeholder:text-white/20"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Subject</label>
                        <Input
                          placeholder="How can I help you?"
                          className="h-14 bg-white/[0.05] border-white/10 text-white rounded-2xl focus-visible:ring-violet-500 placeholder:text-white/20"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Message</label>
                        <Textarea
                          placeholder="Tell me about your project..."
                          className="min-h-[160px] bg-white/[0.05] border-white/10 text-white rounded-2xl focus-visible:ring-violet-500 placeholder:text-white/20 resize-none"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-lg shadow-xl shadow-violet-500/25 border-0 hover:opacity-90 transition-all"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Sending...
                          </span>
                        ) : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        {/* Footer Pill Navigation */}
        <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto overflow-x-auto no-scrollbar hidden lg:block">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 p-1.5 rounded-full flex items-center gap-0.5 sm:gap-1 min-w-max mx-auto relative">
            {[
              { id: 'profile', label: 'Profile', icon: Users },
              { id: 'experience', label: 'Experience', icon: Briefcase },
              { id: 'skills', label: 'Skills', icon: Terminal },
              { id: 'projects', label: 'Projects', icon: Zap },
              ...(blogs.length > 0 ? [{ id: 'blogs', label: 'Blog', icon: Code2 }] : []),
              { id: 'contact', label: 'Contact', icon: Mail }
            ].map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setActiveTab(item.id);
                  }}
                  className={`relative p-2.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 group cursor-pointer ${isActive ? 'text-white' : 'text-white/60 hover:text-white'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 border border-white/10 rounded-full shadow-lg z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 lg:hidden ${isActive ? 'text-violet-400' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className={`hidden lg:block relative z-10 ${isActive && item.id === 'contact' ? 'bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400' : isActive ? 'text-white' : ''}`} style={{ fontFamily: "var(--font-heading)" }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Link - Hidden on mobile/tablet as it is already in the sidebar */}
        <div className="fixed bottom-4 right-6 z-50 hidden lg:block">
          <a href="/admin" className="text-[10px] font-black text-white/30 hover:text-violet-400 transition-all flex items-center gap-1 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-heading)" }}>
            <Terminal className="w-3 h-3" /> Admin Portal
          </a>
        </div>
      </div>
    </div>
  );
}
