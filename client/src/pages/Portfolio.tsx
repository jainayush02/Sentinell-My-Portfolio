import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../usePortfolioData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Clock,
  Briefcase, Code2, Zap, Users, ArrowRight, Download,
  ExternalLink, ChevronRight, Terminal, Globe, Award, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Portfolio() {
  const { data, loading } = usePortfolioData();
  const { profile, experiences, projects, skills, features } = data;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllProj, setShowAllProj] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

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

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">Sentinell Studio Initializing</p>
        </div>
      </div>
    );
  }

  const currentAge = calculateAge(profile.dob);
  const yearsOfExperience = calculateExperience(profile.careerStartDate);
  const totalProjects = actualProjects.length;
  const totalBlogs = blogs.length;

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-blue-500/30 relative">
      {/* 💎 The Living Canvas Background Art */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#fcfdfe] overflow-hidden">
        {/* ✨ SVG Noise Texture (Total Creativity) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>

        {/* 🎨 Living Mesh Orbs */}
        <div className="absolute -top-[10%] -left-[5%] w-[700px] h-[700px] rounded-full bg-blue-400/10 blur-[130px] animate-[pulse_8s_infinite]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-fuchsia-400/10 blur-[120px] animate-[pulse_12s_infinite]"></div>
        <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-blue-300/15 blur-[100px] animate-[pulse_10s_infinite]"></div>
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-indigo-200/20 blur-[90px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-0.5 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
              <img
                src={profile.logoUrl || "/logo.png"}
                alt="Logo"
                className="w-full h-full object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl tracking-[0.2em] font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-fuchsia-600 leading-none uppercase" style={{ fontFamily: "'Anta', sans-serif" }}>Sentinell Studio</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[10px] text-slate-500 font-medium">By</span>
                <span className="text-[10px] text-black font-black uppercase tracking-[0.2em]">Ayush Studio</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              <a href={profile.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              {profile.twitter && (
                <a href={profile.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 h-11 px-6 shadow-sm flex items-center gap-2 group"
              onClick={() => {
                if (profile.resumeUrl) {
                  window.open(profile.resumeUrl, '_blank');
                } else {
                  toast.error('Resume not yet uploaded by author');
                }
              }}
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Download CV
            </Button>
            <Button onClick={() => scrollToSection('projects')} className="rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white hover:opacity-90 h-11 px-6 shadow-lg shadow-blue-500/25 border-0">
              View My Work <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900"
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
              className="fixed top-0 right-0 h-full w-[260px] bg-white z-[110] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-fuchsia-600 tracking-tight" style={{ fontFamily: "'Anta', sans-serif" }}>Sentinell Studio</span>
                <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
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
                    className="block text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors capitalize"
                  >
                    {item}
                  </button>
                ))}
              </nav>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex gap-3 mb-4">
                  <a href={profile.github} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900"><Github className="w-5 h-5" /></a>
                  <a href={profile.linkedin} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900"><Linkedin className="w-5 h-5" /></a>
                </div>
                <Button
                  className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm shadow-lg shadow-blue-500/20 font-bold"
                  onClick={() => {
                    if (profile.resumeUrl) {
                      window.open(profile.resumeUrl, '_blank');
                    } else {
                      toast.error('Resume not yet uploaded');
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" /> Download CV
                </Button>
                <a href="/admin" className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest mt-2">
                  <Terminal className="w-3 h-3" /> Admin Portal
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-32 pb-32">
        {/* Hero Section */}
        <section id="profile" className="max-w-7xl mx-auto px-6 mb-24">
          <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/2 space-y-8"
            >
              <div>
                <h3 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">
                  Welcome to my portfolio
                </h3>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-slate-900 leading-[1.1] mb-4">
                  Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-fuchsia-600">{profile.name}</span>
                </h1>
                <h2 className="text-lg md:text-2xl font-medium text-slate-700">
                  {profile.title}
                </h2>
                <p className="mt-6 text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
              </div>

            </motion.div>

            {/* Right: Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px]">
                <div className="rounded-[2rem] overflow-hidden bg-white p-2.5 shadow-2xl shadow-blue-500/10 border border-slate-100 relative z-10 transition-transform hover:scale-[1.02] duration-500">
                  <div className="w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden relative bg-slate-50">
                    <img
                      src={profile.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute -top-3 -left-3 z-20 bg-white rounded-2xl p-3 shadow-xl shadow-blue-500/10 border border-slate-100 flex flex-col items-center justify-center animate-bounce-slow">
                  <span className="text-xl font-bold text-blue-600 tracking-tighter">{yearsOfExperience}+</span>
                  <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Years Exp</span>
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl shadow-blue-500/10 border border-slate-100 flex items-center gap-3 whitespace-nowrap">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Open to work</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{yearsOfExperience}+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Years Experience</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{totalProjects}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Projects Done</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{profile.researchPapersCount || 0}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Research Papers</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{currentAge}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Years Old</div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Work Experience</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative border-l-2 border-blue-100 ml-5 space-y-12">
            <AnimatePresence mode="popLayout">
              {(showAllExp ? experiences : experiences.slice(0, 2)).map((exp, index) => (
                <motion.div
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative pl-8 md:pl-12"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[21px] top-2 w-10 h-10 rounded-xl bg-white border-2 border-blue-100 shadow-sm flex items-center justify-center text-blue-600">
                    <Briefcase className="w-5 h-5" />
                  </div>

                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full w-fit">
                        <Clock className="w-4 h-4 mr-2" />
                        {exp.period}
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {exp.description.split('\n').filter(line => line.trim()).map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 leading-relaxed text-[15px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          <span>{point.trim()}</span>
                        </li>
                      ))}
                    </ul>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {experiences.length > 2 && (
            <div className="mt-12 flex justify-center">
              <Button
                onClick={() => setShowAllExp(!showAllExp)}
                variant="outline"
                className="rounded-full px-8 py-6 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all"
              >
                {showAllExp ? 'Show Less' : `View All ${experiences.length} Experiences`}
              </Button>
            </div>
          )}
        </section>

        {/* Skills Section */}
        {skills.length > 0 && (
          <section id="skills" className="max-w-7xl mx-auto px-6 mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Core Competencies</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skills.map((skill, index) => {
                const name = skill.name.toLowerCase();
                let iconUrl = "";

                // Grease-match keywords for high reliability
                if (name.includes('python')) iconUrl = "https://cdn.simpleicons.org/python/3776AB";
                else if (name.includes('generative ai') || name.includes('llm') || name.includes('openai')) iconUrl = "https://cdn.simpleicons.org/openai/412991";
                else if (name.includes('machine learning') || name.includes('scikit')) iconUrl = "https://cdn.simpleicons.org/scikitlearn/F89939";
                else if (name.includes('tensorflow')) iconUrl = "https://cdn.simpleicons.org/tensorflow/FF6F00";
                else if (name.includes('pytorch')) iconUrl = "https://cdn.simpleicons.org/pytorch/EE4C2C";
                else if (name.includes('langchain')) iconUrl = "https://cdn.simpleicons.org/chainlink/375BD2";
                else if (name.includes('vector') || name.includes('graph') || name.includes('db') || name.includes('sql')) iconUrl = "https://cdn.simpleicons.org/mongodb/47A248";
                else if (name.includes('docker')) iconUrl = "https://cdn.simpleicons.org/docker/2496ED";
                else if (name.includes('cloud') || name.includes('aws') || name.includes('gcp')) iconUrl = "https://cdn.simpleicons.org/amazonaws/232F3E";
                else iconUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name)}&background=f1f5f9&color=2563eb&bold=true`;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white p-7 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/20 flex items-center gap-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all group min-h-[100px]"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                      <img
                        src={iconUrl}
                        alt={skill.name}
                        className="w-full h-full object-contain"
                        onError={(e: any) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name)}&background=f1f5f9&color=2563eb&bold=true`}
                      />
                    </div>
                    <span className="font-bold text-slate-900 text-lg tracking-tight leading-tight">{skill.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects Section */}
        <section id="projects" className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Featured Projects</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mx-auto rounded-full"></div>
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
                >
                  <Card className="h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
                    {project.image && (
                      <div className="w-full h-48 overflow-hidden bg-slate-100">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{project.title}</h3>
                      <p className="text-slate-600 mb-6 line-clamp-3">{project.description}</p>

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-8">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider rounded-lg border border-slate-100/50">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {(project.githubLink || project.liveLink) && (
                        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-50">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 h-11 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 group"
                            >
                              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" /> Repository
                            </a>
                          )}
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 h-11 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 group"
                            >
                              <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Live Demo
                            </a>
                          )}
                        </div>
                      )}
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
                variant="outline"
                className="rounded-full px-8 py-6 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all"
              >
                {showAllProj ? 'Show Less' : `View All ${actualProjects.length} Projects`}
              </Button>
            </div>
          )}
        </section>

        {/* Technical Blog Section */}
        {blogs.length > 0 && (
          <section id="blogs" className="max-w-7xl mx-auto px-6 mb-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h3 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">Thoughts</h3>
                <h2 className="text-4xl font-heading font-bold text-slate-900">Technical Blog</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mt-4 rounded-full"></div>
              </div>
              <a href="#" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                All Articles <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <a href={blog.link || '#'} className="block h-full group">
                    <Card className="h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all">
                      <div className="w-full h-48 overflow-hidden bg-slate-100 relative">
                        {blog.image ? (
                          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-fuchsia-100 flex items-center justify-center">
                            <Code2 className="w-12 h-12 text-blue-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map((tag, i) => (
                              <span key={i} className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                        <p className="text-slate-600 text-sm mb-6 line-clamp-3">{blog.description}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                          <span className="text-xs text-slate-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {blog.readTime || '5 min read'}
                          </span>
                          <span className="text-sm font-medium text-blue-600 flex items-center">
                            Read <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-sm font-bold text-blue-600 tracking-widest mb-2">Get In Touch</h3>
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Let's Work Together</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Have a project in mind or want to discuss opportunities? {profile.name.split(' ')[0]} is ready for collaboration.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Info Cards */}
            <div className="lg:w-1/3 space-y-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Email</h4>
                  <p className="text-slate-600 text-sm">{profile.email}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Location</h4>
                  <p className="text-slate-600 text-sm">{profile.location}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Response Time</h4>
                  <p className="text-slate-600 text-sm">Within 24 hours</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 rounded-2xl border border-blue-100 mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h4 className="font-semibold text-slate-900">Available for hire</h4>
                </div>
                <p className="text-sm text-slate-600">Currently open to full-time roles, contract work, and interesting side projects.</p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:w-2/3">
              <Card className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <CardContent className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Name *</label>
                        <Input
                          required
                          value={contactForm.name}
                          onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Your name"
                          className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email *</label>
                        <Input
                          required
                          type="email"
                          value={contactForm.email}
                          onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="your@email.com"
                          className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Subject *</label>
                      <Input
                        required
                        value={contactForm.subject}
                        onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="What's this about?"
                        className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Message *</label>
                      <Textarea
                        required
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell me about your project..."
                        className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 min-h-[150px] rounded-xl resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/25 border-0 text-base font-medium"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          <Mail className="w-5 h-5 mr-2" /> Send Message
                        </>
                      )}
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
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50 p-1.5 md:p-2 rounded-full flex items-center gap-1 min-w-max mx-auto">
          <button onClick={() => scrollToSection('profile')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Profile
          </button>
          <button onClick={() => scrollToSection('experience')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Experience
          </button>
          <button onClick={() => scrollToSection('skills')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Skills
          </button>
          <button onClick={() => scrollToSection('projects')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Projects
          </button>
          {blogs.length > 0 && (
            <button onClick={() => scrollToSection('blogs')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              Blog
            </button>
          )}
          <button onClick={() => scrollToSection('contact')} className="px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent hover:bg-blue-50 transition-all border border-blue-100/50">
            Contact
          </button>
        </div>
      </div>

      {/* Admin Link - Hidden on mobile/tablet as it is already in the sidebar */}
      <div className="fixed bottom-4 right-6 z-50 hidden lg:block">
        <a href="/admin" className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1">
          <Terminal className="w-3 h-3" /> Admin
        </a>
      </div>
    </div>
    </div>
  );
}
