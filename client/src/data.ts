export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  skills?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  githubLink?: string;
  liveLink?: string;
  image?: string;
  tags?: string[];
  readTime?: string;
  type: 'project' | 'blog';
}

export interface Skill {
  name: string;
  level: number;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    age: number;
    photoUrl: string;
    logoUrl?: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    twitter: string;
    location: String;
    dob: String;
    careerStartDate: String;
    resumeUrl?: String;
    workLink?: string;
    researchPapersCount: number;
  };
  features: Feature[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
}

export const initialData: PortfolioData = {
  profile: {
    name: "Ayush Jain",
    age: 21,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    logoUrl: "/logo.png", // Using the new PNG logo as default
    title: "B.Tech CSE (AI & Analytics) | Final Year",
    bio: "Final-year B.Tech CSE student (AI & Analytics) and AI Intern at Persistent Systems. Experienced in building and optimizing RAG pipelines, LLM agents, and machine learning models using Python and LangChain. Adept at prompt engineering, writing clean code, and collaborating with cross-functional teams to deliver scalable, real-world AI solutions.",
    email: "ayushsancheti098@gmail.com",
    phone: "+91 9685454511",
    github: "https://github.com/jainayush02",
    linkedin: "https://linkedin.com/in/ayush-jain-2322bb214",
    twitter: "",
    location: "Pune, Maharashtra",
    dob: "2003-09-08",
    careerStartDate: "2023-01-01",
    resumeUrl: "",
    workLink: "",
    researchPapersCount: 0
  },
  features: [
    {
      title: "Clean Code",
      description: "Writing maintainable, well-documented code is a core principle.",
      icon: "Code2"
    },
    {
      title: "Full-Stack",
      description: "Comfortable from pixel-perfect UIs to distributed backend systems.",
      icon: "Terminal"
    },
    {
      title: "Performance",
      description: "Obsessed with speed — both in shipping features and app performance.",
      icon: "Zap"
    },
    {
      title: "Collaboration",
      description: "Thriving in cross-functional teams and mentoring junior engineers.",
      icon: "Users"
    }
  ],
  experiences: [
    {
      id: "1",
      role: "AI Intern",
      company: "Persistent Systems Limited",
      period: "NOV 2025 - Present",
      description: "Collaborated with cross-functional teams to integrate Generative AI features and RAG pipelines into real-world enterprise applications. Designed modular ingestion and query services using Docker, ensuring reliable deployment and data persistence through containerized workflows. Wrote clean, efficient, and reusable Python code to optimize document ingestion, indexing, and semantic retrieval efficiency. Researched and explored advanced LLMs, prompt engineering, and agentic frameworks to improve contextual reasoning in production workflows.",
      skills: ["Generative AI", "RAG", "Docker", "Python", "LLMs", "Prompt Engineering"]
    },
    {
      id: "2",
      role: "President - IEEE CIS Student Chapter",
      company: "MIT ADT University",
      period: "Aug 2024 - 2025",
      description: "Led chapter growth by increasing member engagement and fostering enthusiasm for our initiatives. Organized major events connecting students with industry experts to enhance practical learning. Mentored junior members to develop their skills and boost their confidence in projects.",
      skills: ["Leadership", "Event Management", "Mentoring"]
    }
  ],
  projects: [
    {
      id: "1",
      title: "Smart Clinical Case Agent (GenAI Agent System)",
      description: "Built a Smart Clinical Case Agent using Generative AI to assist Clinical Research Associates by automating reporting workflows. Enabled natural-language interpretation of clinical issues (e.g., adverse effects, protocol deviations) and synchronized data in real time with a ServiceNow backend. Implemented intent detection and issue classification to automatically categorize reports and reduce manual processing effort.",
      tags: ["Python", "Google ADK", "LLMs", "REST APIs", "ServiceNow", "Agentic Frameworks"],
      type: "project"
    },
    {
      id: "2",
      title: "NodeRAG — Specialized RAG Framework",
      description: "Developed NodeRAG, a custom RAG framework optimizing document ingestion, indexing, and semantic search pipelines, improving retrieval efficiency by ~35–40% and supporting scalable information retrieval workflows. Architected modular ingestion and query services using Python and Docker. Integrated Neo4j graph database and implemented node-based traversal algorithms.",
      tags: ["Python", "NodeRAG", "Neo4j", "Docker", "Graph Databases", "Semantic Search"],
      type: "project"
    },
    {
      id: "3",
      title: "LangChain-Powered Web Search Chatbot",
      description: "Built a real-time web search chatbot with a Streamlit front-end, powered by an autonomous agent. Engineered a multi-tool LangChain agent with clean, efficient Python code to query sources like DuckDuckGo, Wikipedia, and ArXiv. Achieved high-speed inference using Groq's Llama-3.1 LLM.",
      tags: ["LangChain", "Streamlit", "Python", "Groq API", "Llama 3.1"],
      githubLink: "https://github.com/jainayush02",
      liveLink: "#",
      type: "project"
    },
    {
      id: "4",
      title: "RAG-powered Document Chatbot",
      description: "Developed a conversational RAG (Retrieval-Augmented Generation) application with a Streamlit front-end, allowing users to query multiple uploaded PDF documents. Engineered a history-aware retriever using LangChain to reformulate user prompts based on the ongoing conversation. Utilized Groq's high-speed inference engine with the Gemma2-9b-It model.",
      tags: ["LangChain", "Streamlit", "Python", "Groq API", "Gemma2", "ChromaDB", "Hugging Face"],
      githubLink: "https://github.com/jainayush02",
      liveLink: "#",
      type: "project"
    }
  ],
  skills: [
    { name: "Python / R / SQL", level: 90 },
    { name: "Generative AI & LLMs", level: 95 },
    { name: "Machine Learning", level: 85 },
    { name: "Vector & Graph DBs", level: 80 },
    { name: "LangChain & Frameworks", level: 85 },
    { name: "Cloud (AWS/GCP) & Docker", level: 75 }
  ]
};
