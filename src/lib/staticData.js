// Static portfolio data - no DB required. Generated from current DB dump 2026-09-20
export const profile = {
  id: 1,
  fullName: "ASHIKA FARSANA O P",
  professionalTitle: "Master of Computer Application, AWH Engineering college",
  bio: "I am an MCA student with hands-on experience in software testing at Leeyet Techno-Hub, Sahya Cyberpark. I have experience in software testing, test case design, bug identification, defect reporting, and quality assurance.",
  email: "ashikafarsanaop@gmail.com",
  phone: "9037086190",
  location: "Kerala, India",
  profileImage: "/uploads/1789401717208-2675f03576543b99.jpg",
  githubUrl: "https://github.com/yourusername",
  linkedinUrl: "https://linkedin.com/in/yourusername",
  portfolioUrl: null,
};

export const skills = [
  { id: 6, name: "HTML/CSS", category: "Frontend", proficiency: 50 },
  { id: 5, name: "JavaScript", category: "Frontend", proficiency: 50 },
  { id: 3, name: "Next.js", category: "Frontend", proficiency: 50 },
  { id: 7, name: "node.js", category: "Backend", proficiency: 50 },
  { id: 4, name: "PostgreSQL", category: "Database", proficiency: 50 },
  { id: 1, name: "Python", category: "Backend", proficiency: 50 },
  { id: 2, name: "React.js", category: "Frontend", proficiency: 50 },
  { id: 8, name: "Using AI Tools", category: null, proficiency: 80 },
];

export const projects = [
  {
    id: 1,
    title: "StayFinder",
    shortDescription: "A web-based rental management platform.",
    description: "The application enables property owners to publish rental properties while allowing users to search, view, and request suitable accommodations based on their preferences. Every property submitted to the platform is verified and approved by the administrator before it is made available to users, ensuring the authenticity, accuracy, and reliability of the rental information.",
    imageUrl: null,
    githubUrl: "https://github.com/yourusername/stayfinder",
    liveUrl: null,
    category: "Web Application",
    featured: true,
    technologies: [
      { projectId: 1, technologyId: 2, technology: { id: 2, name: "React.js" } },
      { projectId: 1, technologyId: 3, technology: { id: 3, name: "Next.js" } },
      { projectId: 1, technologyId: 4, technology: { id: 4, name: "PostgreSQL" } },
      { projectId: 1, technologyId: 7, technology: { id: 7, name: "node.js" } },
    ],
  },
];

export const education = [
  { id: 4, degree: "Master of Computer Application", institution: "AWH Engineering College, Kuttikkattoor", fieldOfStudy: "", startYear: 2025, endYear: 2027 },
  { id: 3, degree: "Bsc Computer Science", institution: "Blossom Arts And Science college, Kondotty", fieldOfStudy: "", startYear: 2018, endYear: 2021 },
];

export const experience = [];

export const certifications = [];

export const resume = null;

// helper for API routes
export const staticPortfolio = { profile, skills, projects, education, experience, certifications, resume };
