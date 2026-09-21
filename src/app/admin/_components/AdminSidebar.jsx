"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/profile", "Profile"],
  ["/admin/projects", "Projects"],
  ["/admin/skills", "Skills"],
  ["/admin/education", "Education"],
  ["/admin/experience", "Experience"],
  ["/admin/certifications", "Certifications"],
  ["/admin/resume", "Resume"],
  ["/admin/messages", "Messages"]
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <h2>Admin</h2>
      {links.map(([href, label]) => (
        <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>
      ))}
      <Link href="/">View Website</Link>
      <button type="button" className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
    </aside>
  );
}
