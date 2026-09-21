import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { staticPortfolio } from "@/lib/staticData";
import Link from "next/link";

export const dynamic = "force-static";

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const projects = staticPortfolio.projects.length;
  const skills = staticPortfolio.skills.length;
  const messages = 0;
  const unreadMessages = 0;
  const education = staticPortfolio.education.length;
  const experience = staticPortfolio.experience.length;
  const certifications = staticPortfolio.certifications.length;
  const resumes = staticPortfolio.resume ? 1 : 0;

  const stats = [
    ["Projects", projects, "/admin/projects"],
    ["Skills", skills, "/admin/skills"],
    ["Education", education, "/admin/education"],
    ["Experience", experience, "/admin/experience"],
    ["Certifications", certifications, "/admin/certifications"],
    ["Resumes", resumes, "/admin/resume"],
    ["Messages", `${unreadMessages} unread / ${messages}`, "/admin/messages"]
  ];

  return (
    <div>
      <h1 style={{ fontSize: "2.2rem" }}>Welcome back{admin.username ? `, ${admin.username}` : ""}</h1>
      <p className="muted">Manage every section of your portfolio from here — no database tools needed.</p>
      <div className="grid cards" style={{ marginTop: 24 }}>
        {stats.map(([label, value, href]) => (
          <Link key={label} href={href} className="card stat-card">
            <h3>{label}</h3>
            <p style={{ fontSize: "2rem", margin: 0 }}>{value}</p>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Quick Start</h3>
        <ol style={{ lineHeight: 2 }}>
          <li>Update your <Link href="/admin/profile" className="link-sm">Profile</Link> with your real details</li>
          <li>Add your <Link href="/admin/skills" className="link-sm">Skills</Link></li>
          <li>Showcase your <Link href="/admin/projects" className="link-sm">Projects</Link> and link technologies to them</li>
          <li>Add <Link href="/admin/education" className="link-sm">Education</Link>, <Link href="/admin/experience" className="link-sm">Experience</Link> and <Link href="/admin/certifications" className="link-sm">Certifications</Link></li>
          <li>Upload a <Link href="/admin/resume" className="link-sm">Resume</Link> link and mark it active</li>
        </ol>
      </div>
    </div>
  );
}
