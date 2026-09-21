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
    title: "StayFinder – Home Rental Management System",
    shortDescription: "Web-based home rental platform connecting Owners and Clients directly.",
    description: "• Developed a web-based home rental management platform connecting property owners and clients directly.\n• Implemented role-based modules for Admin, Owner, and Client.\n• Enabled Owners to add, update, delete, and manage rental property listings.\n• Enabled Clients to search, filter, view, and book available properties.\n• Implemented booking management with booking status and property availability tracking.\n• Developed an Admin dashboard to manage users, owners, properties, bookings, and approvals.\n• Added Owner–Client messaging for direct communication regarding properties and bookings.\n• Designed and integrated a PostgreSQL database for users, properties, bookings, payments, and related information.",
    imageUrl: null,
    githubUrl: "https://github.com/yourusername/stayfinder",
    liveUrl: null,
    category: "Web Application",
    featured: true,
    technologies: [
      { projectId: 1, technologyId: 3, technology: { id: 3, name: "Next.js" } },
      { projectId: 1, technologyId: 2, technology: { id: 2, name: "React.js" } },
      { projectId: 1, technologyId: 5, technology: { id: 5, name: "JavaScript" } },
      { projectId: 1, technologyId: 6, technology: { id: 6, name: "HTML" } },
      { projectId: 1, technologyId: 9, technology: { id: 9, name: "CSS" } },
      { projectId: 1, technologyId: 4, technology: { id: 4, name: "PostgreSQL" } },
      { projectId: 1, technologyId: 10, technology: { id: 10, name: "pgAdmin" } },
    ],
  },
];

export const education = [
  { id: 4, degree: "Master of Computer Application", institution: "AWH Engineering College, Kuttikkattoor", fieldOfStudy: "", startYear: 2025, endYear: 2027 },
  { id: 3, degree: "Bsc Computer Science", institution: "Blossom Arts And Science college, Kondotty", fieldOfStudy: "", startYear: 2018, endYear: 2021 },
];

export const experience = [
  {
    id: 1,
    jobTitle: "Software Testing",
    company: "LeEYE-T Techno Hub, CyberPark (Government of Kerala) — Calicut",
    employmentType: "Internship",
    startDate: "2023-02-01",
    endDate: "2024-05-31",
    currentlyWorking: false,
    location: "Calicut",
    description: "• Performed manual testing of ERP, Textile, and Restaurant web applications.\n• Designed and executed test cases and test scenarios based on functional requirements.\n• Performed Functional, Regression, Retesting, and UI testing.\n• Identified, documented, and reported bugs/defects with relevant details.\n• Verified defect fixes through retesting and regression testing.\n• Tested different modules and user workflows to ensure application functionality and usability.\n• Prepared and maintained test cases, bug reports, and testing documentation.",
    imageUrl: null,
  },
];

export const certifications = [
  {
    id: 1,
    name: "Software Testing — 3 Months Internship",
    issuingOrganization: "Luminar Technolab, Calicut",
    issueDate: "2023-01-30",
    credentialId: null,
    credentialUrl: null,
    certificateImage: null,
  },
];

export const resume = null;

// helper for API routes
export const staticPortfolio = { profile, skills, projects, education, experience, certifications, resume };
