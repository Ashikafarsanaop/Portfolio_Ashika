import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BriefcaseIcon from "@/components/BriefcaseIcon";
import CustomCursor from "@/components/CustomCursor";
import ScrollToTop from "@/components/ScrollToTop";
import ContactForm from "@/components/ContactForm";
import Reveal3D from "@/components/Reveal3D";
import ThreeHero from "@/components/ThreeHero";

export const dynamic = "force-dynamic";

async function getData() {
  const [profile, skills, projects, education, experience, certifications, resume] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: { name: "asc" } }),
      prisma.project.findMany({
        where: { featured: true },
        include: { technologies: { include: { technology: true } } },
        orderBy: { createdAt: "desc" }
      }),
      prisma.education.findMany({ orderBy: { endYear: "desc" } }),
      prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
      prisma.certification.findMany({ orderBy: { issueDate: "desc" } }),
      prisma.resume.findFirst({ where: { isActive: true }, orderBy: { uploadedAt: "desc" } })
    ]);
  return { profile, skills, projects, education, experience, certifications, resume };
}

export default async function Home() {
  const { profile, skills, projects, education, experience, certifications, resume } = await getData();

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <header className="nav">
        <div className="container nav-inner">
          <Link className="brand" href="/"><BriefcaseIcon size={34} />Portfolio</Link>
          <nav className="nav-links">
            <a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a>
            <a href="#education">Education</a><a href="#experience">Experience</a><a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" style={{ background: "#111827", overflow: "hidden", padding: "110px 0 60px" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <ThreeHero />
          </div>
          {/* subtle dark overlay for readability */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 500px at 22% 28%, rgba(17,24,39,.48), transparent 62%), linear-gradient(180deg, rgba(17,24,39,.32) 0%, rgba(17,24,39,.62) 100%)", zIndex: 1, pointerEvents: "none" }} />
          <div className="hero-3d-bg" aria-hidden="true" style={{ zIndex: 2, opacity: .28 }}>
            <span className="hero-grid-pattern" />
          </div>
          <div className="container hero-grid" style={{ position: "relative", zIndex: 3 }}>
            <div>
              <div className="eyebrow" style={{ color: "#9ca3af" }}>HELLO, I&apos;M</div>
              <h1 style={{ color: "#f3f4f6", textShadow: "0 6px 22px rgba(0,0,0,.55)" }}>{profile?.fullName || "Your Name"}</h1>
              <p className="lead" style={{ color: "#d1d5db" }}>{profile?.professionalTitle || "Full Stack Developer"}</p>
              {resume && <a className="btn btn-primary" href={resume.fileUrl} target="_blank" rel="noreferrer">View Resume</a>}
              <a className="btn btn-outline" href="#contact" style={{ background: "rgba(255,255,255,.08)", color: "#f3f4f6", borderColor: "rgba(255,255,255,.14)" }}>Contact Me</a>
              <div style={{ marginTop: 14, display: "inline-flex", gap: 8, alignItems: "center", padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.10)", fontFamily: "JetBrains Mono, monospace", fontSize: ".68rem", color: "#9ca3af", letterSpacing: ".08em" }}>◎ Interactive 3D • Move mouse to orbit</div>
            </div>
            <div className="profile-wrap">
              <span className="profile-ring" aria-hidden="true" style={{ borderColor: "rgba(255,255,255,.14)" }} />
              {profile?.profileImage ? (
                <img className="profile-headshot" src={profile.profileImage} alt={profile.fullName} style={{ borderColor: "rgba(243,244,246,.92)" }} />
              ) : (
                <div className="profile-headshot profile-headshot-fallback" aria-label="Profile photo placeholder">👤</div>
              )}
            </div>
          </div>
        </section>

        <div className="column-layers">
          <div className="column-main">
            <section id="about" className="section section-alt" style={{ borderRadius:16 }}>
              <div className="container">
                <Reveal3D><h2>About Me</h2></Reveal3D>
                <Reveal3D delay={80}><p className="lead">{profile?.bio}</p></Reveal3D>
              </div>
            </section>

            <section id="skills" className="section">
              <div className="container">
                <Reveal3D><h2>Skills</h2></Reveal3D>
                <Reveal3D delay={80}><div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{skills.map((s,i) => <Reveal3D key={s.id} delay={i*18} as="span" className="tag" style={{ display:"inline-flex" }}>{s.name}{s.proficiency ? ` · ${s.proficiency}%` : ""}</Reveal3D>)}</div></Reveal3D>
              </div>
            </section>

            <section id="projects" className="section section-alt" style={{ borderRadius:16 }}>
              <div className="container">
                <Reveal3D><h2>Featured Projects</h2></Reveal3D>
                <div className="grid cards">
                  {projects.map((p,i) => (
                    <Reveal3D key={p.id} delay={i*70} as="article" className="card">
                      <h3 style={{ color: "#1e3a8a" }}>{p.title}</h3>
                      <p className="muted">{p.shortDescription}</p>
                      <p>{p.description}</p>
                      <div>{p.technologies.map(t => <span className="tag" key={t.technologyId}>{t.technology.name}</span>)}</div>
                      {p.githubUrl && <a className="btn btn-outline" href={p.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
                      {p.liveUrl && <a className="btn btn-primary" href={p.liveUrl} target="_blank" rel="noreferrer">Live Demo</a>}
                    </Reveal3D>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="column-side">
            <section id="education" className="section" style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:16, padding:22 }}>
              <div className="container">
                <Reveal3D><h2>Education</h2></Reveal3D>
                <div className="grid cards" style={{ gridTemplateColumns:"1fr" }}>
                  {education.map((e,i) => <Reveal3D key={e.id} delay={i*70} as="article" className="card"><h3>{e.degree}</h3><p>{e.institution}</p><p className="muted">{e.fieldOfStudy} · {e.startYear} - {e.endYear || "Present"}</p></Reveal3D>)}
                </div>
              </div>
            </section>

            <section id="experience" className="section section-alt" style={{ borderRadius:16 }}>
              <div className="container">
                <Reveal3D><h2 className="section-title"><BriefcaseIcon size={32} /> Experience</h2></Reveal3D>
                <div className="grid cards" style={{ gridTemplateColumns:"1fr" }}>
                  {experience.map((e,i) => (
                    <Reveal3D key={e.id} delay={i*70} as="article" className="card">
                      {e.imageUrl && <img src={e.imageUrl} alt={e.jobTitle} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", marginBottom: "12px", border: "1px solid var(--border)" }} />}
                      <h3>{e.jobTitle}</h3><p>{e.company}</p><p className="muted">{e.employmentType}</p><p>{e.description}</p>
                    </Reveal3D>
                  ))}
                </div>
              </div>
            </section>

            <section className="section" style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:16, padding:22 }}>
              <div className="container">
                <Reveal3D><h2>Certifications</h2></Reveal3D>
                <div className="grid cards" style={{ gridTemplateColumns:"1fr" }}>
                  {certifications.map((c,i) => (
                    <Reveal3D key={c.id} delay={i*70} as="article" className="card">
                      {c.certificateImage && c.certificateImage.toLowerCase().endsWith(".pdf") ? (
                        <a href={c.certificateImage} target="_blank" rel="noreferrer" className="link-sm">View Certificate (PDF)</a>
                      ) : c.certificateImage ? (
                        <img src={c.certificateImage} alt={c.name} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", marginBottom: "12px", border: "1px solid var(--border)" }} />
                      ) : null}
                      <h3>{c.name}</h3>
                      <p>{c.issuingOrganization}</p>
                      {c.credentialUrl && <a className="btn btn-outline" href={c.credentialUrl} target="_blank" rel="noreferrer">Verify</a>}
                      {c.certificateImage && !c.certificateImage.toLowerCase().endsWith(".pdf") && <a className="btn btn-outline" href={c.certificateImage} target="_blank" rel="noreferrer" style={{ marginLeft: "8px" }}>View Image</a>}
                    </Reveal3D>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        <section id="contact" className="section section-alt">
          <div className="container">
            <Reveal3D><h2>Contact Me</h2></Reveal3D>
            <Reveal3D delay={80}><div className="form-3d"><ContactForm /></div></Reveal3D>
            <Reveal3D delay={120}><p className="muted" style={{ marginTop: "12px" }}>{profile?.email}</p></Reveal3D>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} {profile?.fullName || "Portfolio"}
        </div>
      </footer>
    </>
  );
}
