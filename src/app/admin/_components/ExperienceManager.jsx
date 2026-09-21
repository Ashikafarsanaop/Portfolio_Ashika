"use client";

import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

const emptyForm = {
  jobTitle: "", company: "", employmentType: "Full-time",
  startDate: "", endDate: "", currentlyWorking: false, description: "", imageUrl: ""
};

function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export default function ExperienceManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function load() {
    setLoading(true);
    const { data } = await apiRequest("/api/experience");
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      jobTitle: item.jobTitle || "",
      company: item.company || "",
      employmentType: item.employmentType || "Full-time",
      startDate: item.startDate ? String(item.startDate).slice(0, 10) : "",
      endDate: item.endDate ? String(item.endDate).slice(0, 10) : "",
      currentlyWorking: Boolean(item.currentlyWorking),
      description: item.description || "",
      imageUrl: item.imageUrl || ""
    });
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file) {
    if (!file) return;
    setUploading(true);
    setStatus("Uploading image...");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(data.error || "Image upload failed");
      } else {
        set("imageUrl", data.url);
        setStatus("Image uploaded — click Save to apply");
      }
    } catch {
      setStatus("Image upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.jobTitle.trim()) return setStatus("Job title is required");
    if (!form.currentlyWorking && !form.endDate) return setStatus("End date is required unless you are currently working there");
    setStatus("Saving...");
    const body = {
      jobTitle: form.jobTitle,
      company: form.company || null,
      employmentType: form.employmentType || null,
      startDate: form.startDate || null,
      endDate: form.currentlyWorking ? null : form.endDate,
      currentlyWorking: Boolean(form.currentlyWorking),
      description: form.description || null,
      imageUrl: form.imageUrl || null
    };
    const res = await apiRequest(editingId ? `/api/experience/${editingId}` : "/api/experience", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(body)
    });
    if (!res.ok) return setStatus(res.data.error || "Save failed");
    setStatus("Saved");
    reset();
    await load();
  }

  async function remove(id) {
    if (!confirm("Delete this entry?")) return;
    const res = await apiRequest(`/api/experience/${id}`, { method: "DELETE" });
    if (!res.ok) return setStatus(res.data.error || "Delete failed");
    if (editingId === id) reset();
    await load();
  }

  return (
    <div>
      <div className="toolbar">
        <h1 style={{ fontSize: "2.2rem" }}>Experience</h1>
        {editingId && (
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { reset(); setStatus(""); }}>
            + Add New Instead
          </button>
        )}
      </div>

      <form className="card form admin-form" onSubmit={submit}>
        <h2 style={{ fontSize: "1.15rem" }}>{editingId ? `Editing #${editingId}` : "Add New"}</h2>
        <div className="form-grid">
          <label className="field"><span>Job Title *</span>
            <input value={form.jobTitle} onChange={e => set("jobTitle", e.target.value)} />
          </label>
          <label className="field"><span>Company</span>
            <input value={form.company} onChange={e => set("company", e.target.value)} />
          </label>
          <label className="field"><span>Employment Type</span>
            <select value={form.employmentType} onChange={e => set("employmentType", e.target.value)}>
              {employmentTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="field"><span>Start Date</span>
            <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
          </label>
          <label className="field"><span>End Date {!form.currentlyWorking ? "*" : ""}</span>
            <input
              type="date"
              value={form.currentlyWorking ? "" : form.endDate}
              disabled={form.currentlyWorking}
              onChange={e => set("endDate", e.target.value)}
            />
          </label>
          <div className="span-all">
            <label className="field-check">
              <input
                type="checkbox"
                checked={Boolean(form.currentlyWorking)}
                onChange={e => { set("currentlyWorking", e.target.checked); if (e.target.checked) set("endDate", ""); }}
              />
              <span>I currently work here</span>
            </label>
          </div>
          <label className="field span-all"><span>Description</span>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} />
          </label>
          <div className="span-all">
            <span className="field-label">Experience Image</span>
            <div className="upload-row">
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Experience preview" className="img-preview" />
              )}
              <div>
                <label className={`btn btn-outline btn-sm upload-btn ${uploading ? "disabled" : ""}`}>
                  {uploading ? "Uploading..." : form.imageUrl ? "Change Image" : "Choose Image"}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                    disabled={uploading}
                    style={{ display: "none" }}
                    onChange={e => uploadImage(e.target.files[0])}
                  />
                </label>
                {form.imageUrl && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => set("imageUrl", "")}>
                    Remove
                  </button>
                )}
                <p className="file-hint">JPG, PNG, WebP, GIF or AVIF · max 5MB</p>
                <input
                  type="text"
                  placeholder="Or paste image URL"
                  value={form.imageUrl}
                  onChange={e => set("imageUrl", e.target.value)}
                  style={{ marginTop: "8px" }}
                />
              </div>
            </div>
          </div>
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
            <tr><th>Job Title</th><th>Company</th><th>Type</th><th>Period</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} className="muted">{loading ? "Loading..." : "No entries yet"}</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className={editingId === item.id ? "row-editing" : ""}>
                <td>{item.jobTitle}</td>
                <td>{item.company || "—"}</td>
                <td>{item.employmentType || "—"}</td>
                <td>
                  {fmtDate(item.startDate)} – {item.currentlyWorking ? "Present" : fmtDate(item.endDate)}
                </td>
                <td className="actions-cell">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => startEdit(item)}>Edit</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
