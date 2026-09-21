"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

const emptyForm = {
  title: "", category: "", shortDescription: "", description: "",
  imageUrl: "", githubUrl: "", liveUrl: "", featured: false
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [techIds, setTechIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");

  async function load() {
    setLoading(true);
    const [p, s] = await Promise.all([
      apiRequest("/api/projects"),
      apiRequest("/api/skills")
    ]);
    setProjects(Array.isArray(p.data) ? p.data : []);
    setSkills(Array.isArray(s.data) ? s.data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
    setTechIds([]);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      category: p.category || "",
      shortDescription: p.shortDescription || "",
      description: p.description || "",
      imageUrl: p.imageUrl || "",
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      featured: Boolean(p.featured)
    });
    setTechIds((p.technologies || []).map(t => t.technologyId));
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleTech(id) {
    setTechIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setStatus("Title is required");
    setStatus("Saving...");
    const body = { ...form, technologyIds: techIds };
    const res = await apiRequest(editingId ? `/api/projects/${editingId}` : "/api/projects", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(body)
    });
    if (!res.ok) return setStatus(res.data.error || "Save failed");
    setStatus("Saved");
    reset();
    await load();
  }

  async function remove(id) {
    if (!confirm("Delete this project?")) return;
    const res = await apiRequest(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) return setStatus(res.data.error || "Delete failed");
    if (editingId === id) reset();
    await load();
  }

  return (
    <div>
      <div className="toolbar">
        <h1 style={{ fontSize: "2.2rem" }}>Projects</h1>
        {editingId && (
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { reset(); setStatus(""); }}>
            + Add New Instead
          </button>
        )}
      </div>

      <form className="card form admin-form" onSubmit={submit}>
        <h2 style={{ fontSize: "1.15rem" }}>{editingId ? `Editing #${editingId}` : "Add New"}</h2>
        <div className="form-grid">
          <label className="field"><span>Title *</span>
            <input value={form.title} onChange={e => set("title", e.target.value)} />
          </label>
          <label className="field"><span>Category</span>
            <input value={form.category} onChange={e => set("category", e.target.value)} />
          </label>
          <label className="field span-all"><span>Short Description</span>
            <input value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} />
          </label>
          <label className="field span-all"><span>Description</span>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} />
          </label>
          <label className="field"><span>Image URL</span>
            <input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} />
          </label>
          <label className="field"><span>GitHub URL</span>
            <input value={form.githubUrl} onChange={e => set("githubUrl", e.target.value)} />
          </label>
          <label className="field"><span>Live Demo URL</span>
            <input value={form.liveUrl} onChange={e => set("liveUrl", e.target.value)} />
          </label>
          <div className="span-all">
            <label className="field-check">
              <input type="checkbox" checked={Boolean(form.featured)} onChange={e => set("featured", e.target.checked)} />
              <span>Featured project (shown prominently on the website)</span>
            </label>
          </div>
          {skills.length > 0 && (
            <div className="span-all">
              <span className="field-label">Technologies Used</span>
              <div className="tech-picker">
                {skills.map(s => (
                  <label key={s.id} className={`tech-chip ${techIds.includes(s.id) ? "selected" : ""}`}>
                    <input
                      type="checkbox"
                      checked={techIds.includes(s.id)}
                      onChange={() => toggleTech(s.id)}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          {skills.length === 0 && (
            <p className="muted span-all">Add skills first to link technologies to projects.</p>
          )}
        </div>
        <div>
          <button className="btn btn-primary">Save</button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={() => { reset(); setStatus(""); }}>Cancel</button>
          )}
        </div>
        {status && <p className="muted">{status}</p>}
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Technologies</th><th>Featured</th><th>Links</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={6} className="muted">{loading ? "Loading..." : "No entries yet"}</td></tr>
            ) : projects.map(p => (
              <tr key={p.id} className={editingId === p.id ? "row-editing" : ""}>
                <td>{p.title}</td>
                <td>{p.category || "—"}</td>
                <td>
                  {(p.technologies || []).length === 0 ? "—" :
                    <span>{p.technologies.map(t => t.technology.name).join(", ")}</span>}
                </td>
                <td>{p.featured ? "Yes" : "No"}</td>
                <td>
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="link-sm">GitHub</a>}
                  {" "}
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="link-sm">Live</a>}
                  {!p.githubUrl && !p.liveUrl && "—"}
                </td>
                <td className="actions-cell">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Edit</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
