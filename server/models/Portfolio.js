import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  id: String,
  role: String,
  company: String,
  period: String,
  description: String,
  location: String,
  skills: [String],
  companyProjects: [{
    _id: false,
    id: String,
    title: String,
    description: String
  }],
  certificates: [{
    _id: false,
    id: String,
    title: String,
    url: String
  }]
});

const projectSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  link: String,
  githubLink: String,
  liveLink: String,
  image: String,
  tags: [String],
  readTime: String,
  type: { type: String, enum: ['project', 'blog'] }
});

const skillSchema = new mongoose.Schema({
  name: String,
  level: Number
});

const featureSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  profile: {
    name: String,
    age: Number,
    photoUrl: String,
    logoUrl: String,
    title: String,
    bio: String,
    email: String,
    phone: String,
    github: String,
    linkedin: String,
    twitter: String,
    location: String,
    dob: String,
    careerStartDate: String,
    resumeUrl: String,
    workLink: String,
    researchPapersCount: { type: Number, default: 0 }
  },
  features: [featureSchema],
  experiences: [experienceSchema],
  projects: [projectSchema],
  skills: [skillSchema]
}, { timestamps: true });

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
