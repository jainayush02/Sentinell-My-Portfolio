import React, { useState } from 'react';
import { usePortfolioData } from '../usePortfolioData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Github, Linkedin, Twitter, Mail, MapPin, Clock, 
  Briefcase, Code2, Zap, Users, ArrowRight, Download,
  ExternalLink, ChevronRight, Terminal, Globe
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Portfolio() {
  const { data } = usePortfolioData();
  const { profile, experiences, projects, skills } = data;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllExp, setShowAllExp] = useState(false);
  const [showAllProj, setShowAllProj] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent successfully! I will get back to you soon.');
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const actualProjects = projects.filter(p => p.type === 'project');
  const blogs = projects.filter(p => p.type === 'blog');

  // Calculate stats
  const yearsOfExperience = Math.max(0, profile.age - 22); // Rough estimate
  const totalProjects = actualProjects.length;
  const totalBlogs = blogs.length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.logoUrl && !profile.logoUrl.includes('placeholder') ? (
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain scale-110" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <linearGradient id="coreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  <path d="M50 5 C 80 5, 95 25, 95 25 C 95 60, 50 95, 50 95 C 50 95, 5 60, 5 25 C 5 25, 20 5, 50 5 Z" fill="url(#shieldGrad)" />
                  <path d="M15 30 C 35 50, 65 50, 85 30 C 75 70, 50 85, 50 85 C 50 85, 25 70, 15 30 Z" fill="#ffffff" opacity="0.2" />
                  <circle cx="50" cy="45" r="18" fill="url(#coreGrad)" />
                  <circle cx="45" cy="40" r="6" fill="#ffffff" opacity="0.8" filter="blur(1px)" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-serif italic text-2xl tracking-wider font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-fuchsia-600 leading-none">Sentinal</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">
                from <span className="text-slate-900 font-bold">Ayush Studio</span>
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
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
            <Button variant="outline" className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 h-11 px-6">
              <Download className="w-4 h-4 mr-2" /> Download CV
            </Button>
            <Button onClick={() => scrollToSection('projects')} className="rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white hover:opacity-90 h-11 px-6 shadow-lg shadow-blue-500/25 border-0">
              View My Work <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

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
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-slate-900 leading-[1.1] mb-4">
                  Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-fuchsia-600">{profile.name}</span>
                </h1>
                <h2 className="text-xl md:text-2xl font-medium text-slate-700">
                  {profile.title}
                </h2>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
              </div>

              {/* 2x2 Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">Clean Code</h4>
                  <p className="text-sm text-slate-500">Writing maintainable, well-documented code is a core principle.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 mb-4">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">Full-Stack</h4>
                  <p className="text-sm text-slate-500">Comfortable from pixel-perfect UIs to distributed backend systems.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">Performance</h4>
                  <p className="text-sm text-slate-500">Obsessed with speed — both in shipping features and app performance.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">Collaboration</h4>
                  <p className="text-sm text-slate-500">Thriving in cross-functional teams and mentoring junior engineers.</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Photo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-md lg:w-1/2"
            >
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-100 to-fuchsia-100 p-2 shadow-2xl shadow-blue-900/5">
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                  <img 
                    src={profile.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              
              {/* Badges */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center animate-bounce-slow">
                <span className="text-2xl font-bold text-blue-600">{yearsOfExperience}+</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Years</span>
              </div>
              
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-3 whitespace-nowrap">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-slate-700">Open to work</span>
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
              <div className="text-4xl font-bold text-slate-900 mb-2">{totalBlogs}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Articles Written</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">{profile.age}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Years Old</div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="max-w-4xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Work Experience</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative border-l-2 border-blue-100 ml-4 md:ml-8 space-y-12">
            {(showAllExp ? experiences : experiences.slice(0, 2)).map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {exp.description}
                  </p>
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

        {/* Projects Section */}
        <section id="projects" className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Featured Projects</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(showAllProj ? actualProjects : actualProjects.slice(0, 2)).map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
                  {project.image && (
                    <div className="w-full h-48 overflow-hidden bg-slate-100">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{project.title}</h3>
                    <p className="text-slate-600 mb-6 line-clamp-3">{project.description}</p>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100">
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                          <Github className="w-4 h-4 mr-2" /> Code
                        </a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                          <Globe className="w-4 h-4 mr-2" /> Live Demo
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

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
            <h3 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">Get In Touch</h3>
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Let's Work Together</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-fuchsia-600 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Have a project in mind or want to discuss opportunities? I'd love to hear from you.
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
                  <p className="text-slate-600 text-sm">{profile.location || 'San Francisco, CA'}</p>
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
                        <Input required placeholder="Your name" className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email *</label>
                        <Input required type="email" placeholder="your@email.com" className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Subject *</label>
                      <Input required placeholder="What's this about?" className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Message *</label>
                      <Textarea required placeholder="Tell me about your project..." className="bg-slate-50 border-slate-200 focus-visible:ring-blue-600 min-h-[150px] rounded-xl resize-none" />
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
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto overflow-x-auto no-scrollbar">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50 p-1.5 md:p-2 rounded-full flex items-center gap-1 min-w-max mx-auto">
          <button onClick={() => scrollToSection('profile')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Profile
          </button>
          <button onClick={() => scrollToSection('experience')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Experience
          </button>
          <button onClick={() => scrollToSection('projects')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Projects
          </button>
          {blogs.length > 0 && (
            <button onClick={() => scrollToSection('blogs')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              Blog
            </button>
          )}
          <button onClick={() => scrollToSection('contact')} className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            Contact
          </button>
        </div>
      </div>

      {/* Admin Link */}
      <div className="fixed bottom-4 right-6 z-50">
        <a href="/admin" className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1">
          <Terminal className="w-3 h-3" /> Admin
        </a>
      </div>
    </div>
  );
}
