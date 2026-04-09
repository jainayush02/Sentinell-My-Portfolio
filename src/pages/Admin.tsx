import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../usePortfolioData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Hexagon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const { data, updateProfile, updateExperiences, updateProjects, updateSkills } = usePortfolioData();
  const navigate = useNavigate();

  // Local state for editing before saving
  const [profile, setProfile] = useState(data.profile);
  const [experiences, setExperiences] = useState(data.experiences);
  const [projects, setProjects] = useState(data.projects);
  const [skills, setSkills] = useState(data.skills);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication: accept 'admin123' or any 10-digit number
    const isPassword = loginInput === 'admin123';
    const isMobile = /^\d{10}$/.test(loginInput);
    
    if (isPassword || isMobile) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid credentials. Use "admin123" or a 10-digit number.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateProfile(profile);
    toast.success('Profile updated successfully');
  };

  const handleSaveExperiences = () => {
    updateExperiences(experiences);
    toast.success('Experiences updated successfully');
  };

  const handleSaveProjects = () => {
    updateProjects(projects);
    toast.success('Projects updated successfully');
  };

  const handleSaveSkills = () => {
    updateSkills(skills);
    toast.success('Skills updated successfully');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'logoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-fuchsia-50/50 pointer-events-none" />
        <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl shadow-blue-900/5 relative z-10">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4">
              <Hexagon className="w-7 h-7 fill-white/20" />
            </div>
            <CardTitle className="text-2xl font-heading font-light">Sentinal Admin</CardTitle>
            <CardDescription className="text-slate-500">
              Enter password or mobile number to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="auth" className="text-slate-600">Credentials</Label>
                <Input 
                  id="auth" 
                  type="text" 
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="admin123 or 5551234567" 
                  className="bg-slate-50 border-slate-200 text-slate-900 focus-visible:ring-blue-600"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Login
              </Button>
              <div className="text-center mt-4">
                <Link to="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Hexagon className="w-7 h-7 fill-white/20" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-light tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-500 mt-1 text-sm">Changes made here will instantly reflect on the main website.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100" asChild>
              <Link to="/">View Live Site</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-white border border-slate-200 p-1 mb-8 shadow-sm flex flex-wrap h-auto">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Profile</TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Experience</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Projects & Blogs</TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Skills</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-slate-500">Update your basic details and bio.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={profile.age || ''} onChange={e => setProfile({...profile, age: parseInt(e.target.value) || 0})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Photo URL</Label>
                    <div className="flex gap-2">
                      <Input value={profile.photoUrl || ''} onChange={e => setProfile({...profile, photoUrl: e.target.value})} className="bg-slate-50 border-slate-200 flex-1" />
                      <div className="relative w-24 shrink-0">
                        <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'photoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Button type="button" variant="outline" className="w-full pointer-events-none">Upload</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <div className="flex gap-2">
                      <Input value={profile.logoUrl || ''} onChange={e => setProfile({...profile, logoUrl: e.target.value})} className="bg-slate-50 border-slate-200 flex-1" placeholder="e.g. https://example.com/logo.png" />
                      <div className="relative w-24 shrink-0">
                        <Input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'logoUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Button type="button" variant="outline" className="w-full pointer-events-none">Upload</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input value={profile.github} onChange={e => setProfile({...profile, github: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter URL</Label>
                    <Input value={profile.twitter || ''} onChange={e => setProfile({...profile, twitter: e.target.value})} className="bg-slate-50 border-slate-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-slate-50 border-slate-200 min-h-[150px]" />
                </div>
                <Button onClick={handleSaveProfile} className="bg-blue-600 text-white hover:bg-blue-700">Save Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription className="text-slate-500">Manage your work history.</CardDescription>
                </div>
                <Button 
                  onClick={() => setExperiences([...experiences, { id: Date.now().toString(), role: '', company: '', period: '', description: '', skills: [] }])}
                  variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="p-6 border border-slate-200 rounded-xl relative bg-slate-50">
                    <Button 
                      variant="ghost" size="icon" 
                      className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pr-12">
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={exp.role} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].role = e.target.value;
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={exp.company} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].company = e.target.value;
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>Period</Label>
                        <Input value={exp.period} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].period = e.target.value;
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200" placeholder="e.g. 2020 - Present" />
                      </div>
                      <div className="space-y-2">
                        <Label>Skills (comma separated)</Label>
                        <Input value={exp.skills?.join(', ') || ''} onChange={e => {
                          const newExp = [...experiences];
                          newExp[index].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setExperiences(newExp);
                        }} className="bg-white border-slate-200" placeholder="React, Node.js, AWS" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={exp.description} onChange={e => {
                        const newExp = [...experiences];
                        newExp[index].description = e.target.value;
                        setExperiences(newExp);
                      }} className="bg-white border-slate-200" />
                    </div>
                  </div>
                ))}
                <Button onClick={handleSaveExperiences} className="bg-blue-600 text-white hover:bg-blue-700">Save Experiences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Projects & Blogs</CardTitle>
                  <CardDescription className="text-slate-500">Manage your portfolio items.</CardDescription>
                </div>
                <Button 
                  onClick={() => setProjects([...projects, { id: Date.now().toString(), title: '', description: '', type: 'project' }])}
                  variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-8">
                {projects.map((project, index) => (
                  <div key={project.id} className="p-6 border border-slate-200 rounded-xl relative bg-slate-50">
                    <Button 
                      variant="ghost" size="icon" 
                      className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pr-12">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={project.title} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].title = e.target.value;
                          setProjects(newProj);
                        }} className="bg-white border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <select 
                          value={project.type} 
                          onChange={e => {
                            const newProj = [...projects];
                            newProj[index].type = e.target.value as 'project' | 'blog';
                            setProjects(newProj);
                          }}
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        >
                          <option value="project">Project</option>
                          <option value="blog">Blog</option>
                        </select>
                      </div>
                      
                      {project.type === 'project' && (
                        <>
                          <div className="space-y-2">
                            <Label>GitHub Link</Label>
                            <Input value={project.githubLink || ''} onChange={e => {
                              const newProj = [...projects];
                              newProj[index].githubLink = e.target.value;
                              setProjects(newProj);
                            }} className="bg-white border-slate-200" />
                          </div>
                          <div className="space-y-2">
                            <Label>Live Link</Label>
                            <Input value={project.liveLink || ''} onChange={e => {
                              const newProj = [...projects];
                              newProj[index].liveLink = e.target.value;
                              setProjects(newProj);
                            }} className="bg-white border-slate-200" />
                          </div>
                        </>
                      )}

                      {project.type === 'blog' && (
                        <>
                          <div className="space-y-2">
                            <Label>Blog Link</Label>
                            <Input value={project.link || ''} onChange={e => {
                              const newProj = [...projects];
                              newProj[index].link = e.target.value;
                              setProjects(newProj);
                            }} className="bg-white border-slate-200" />
                          </div>
                          <div className="space-y-2">
                            <Label>Read Time</Label>
                            <Input value={project.readTime || ''} onChange={e => {
                              const newProj = [...projects];
                              newProj[index].readTime = e.target.value;
                              setProjects(newProj);
                            }} className="bg-white border-slate-200" placeholder="e.g. 5 min read" />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label>Image URL (Optional)</Label>
                        <Input value={project.image || ''} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].image = e.target.value;
                          setProjects(newProj);
                        }} className="bg-white border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>Tags (comma separated)</Label>
                        <Input value={project.tags?.join(', ') || ''} onChange={e => {
                          const newProj = [...projects];
                          newProj[index].tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          setProjects(newProj);
                        }} className="bg-white border-slate-200" placeholder="React, Node.js, Design" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={project.description} onChange={e => {
                        const newProj = [...projects];
                        newProj[index].description = e.target.value;
                        setProjects(newProj);
                      }} className="bg-white border-slate-200" />
                    </div>
                  </div>
                ))}
                <Button onClick={handleSaveProjects} className="bg-blue-600 text-white hover:bg-blue-700">Save Projects</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Skills Graph</CardTitle>
                  <CardDescription className="text-slate-500">Manage your skills for the radar chart (0-100).</CardDescription>
                </div>
                <Button 
                  onClick={() => setSkills([...skills, { name: '', level: 50 }])}
                  variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Skill
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-xl relative bg-slate-50 flex flex-col gap-4">
                      <Button 
                        variant="ghost" size="icon" 
                        className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="space-y-2 pr-8">
                        <Label>Skill Name</Label>
                        <Input value={skill.name} onChange={e => {
                          const newSkills = [...skills];
                          newSkills[index].name = e.target.value;
                          setSkills(newSkills);
                        }} className="bg-white border-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <Label>Level ({skill.level})</Label>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={skill.level} 
                          onChange={e => {
                            const newSkills = [...skills];
                            newSkills[index].level = parseInt(e.target.value);
                            setSkills(newSkills);
                          }}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={handleSaveSkills} className="bg-blue-600 text-white hover:bg-blue-700 mt-6">Save Skills</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
