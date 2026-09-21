const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash
    }
  });

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      fullName: "Your Name",
      professionalTitle: "Full Stack Developer",
      bio: "I build modern web applications using Next.js, React, PostgreSQL and JavaScript.",
      email: "your@email.com",
      location: "Kerala, India",
      githubUrl: "https://github.com/yourusername",
      linkedinUrl: "https://linkedin.com/in/yourusername"
    }
  });

  const skills = [
    ["Python", "Backend", 85],
    ["React.js", "Frontend", 85],
    ["Next.js", "Frontend", 85],
    ["PostgreSQL", "Database", 80],
    ["JavaScript", "Frontend", 85],
    ["HTML/CSS", "Frontend", 90]
  ];

  for (const [name, category, proficiency] of skills) {
    await prisma.skill.create({ data: { name, category, proficiency } });
  }

  const project = await prisma.project.create({
    data: {
      title: "StayFinder",
      shortDescription: "A web-based rental management platform.",
      description: "A portfolio project demonstrating property listing, user and owner workflows, and administration.",
      category: "Web Application",
      featured: true,
      githubUrl: "https://github.com/yourusername/stayfinder"
    }
  });

  const projectSkills = await prisma.skill.findMany({
    where: { name: { in: ["React.js", "Next.js", "PostgreSQL", "Python"] } }
  });

  for (const skill of projectSkills) {
    await prisma.projectTechnology.create({
      data: { projectId: project.id, technologyId: skill.id }
    });
  }

  await prisma.education.create({
    data: {
      degree: "MCA",
      institution: "Your Institution",
      fieldOfStudy: "Computer Applications",
      startYear: 2025,
      endYear: 2027
    }
  });
}

main().finally(() => prisma.$disconnect());