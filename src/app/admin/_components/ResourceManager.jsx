"use client";

import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";

const resources = {
  skills: {
    title: "Skills",
    endpoint: "/api/skills",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "category", label: "Category" },
      { key: "proficiency", label: "Proficiency (%)", type: "number" },
      { key: "icon", label: "Icon URL" }
    ],
    columns: ["name", "category", "proficiency", "icon"]
  },
  education: {
    title: "Education",
    endpoint: "/api/education",
    fields: [
      { key: "degree", label: "Degree", required: true },
      { key: "institution", label: "Institution", required: true },
      { key: "fieldOfStudy", label: "Field of Study" },
      { key: "startYear", label: "Start Year", type: "number" },
      { key: "endYear", label: "End Year", type: "number" },
      { key: "description", label: "Description", type: "textarea" }
    ],
    columns: ["degree", "institution", "fieldOfStudy", "startYear", "endYear"]
  },
  certifications: {
    title: "Certifications",
    endpoint: "/api/certifications",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "issuingOrganization", label: "Issuing Organization" },
      { key: "issueDate", label: "Issue Date", type: "date" },
      { key: "credentialId", label: "Credential ID" },
      { key: "credentialUrl", label: "Credential URL" },
      { key: "certificateImage", label: "Certificate Image URL", placeholder: "https://example.com/certificate.jpg" }
    ],
    columns: ["name", "issuingOrganization", "issueDate", "credentialUrl"]
  },
  resume: {
    title: "Resume",
    endpoint: "/api/resume",
    listEndpoint: "/api/resume?all=1",
    fields: [
      { key: "fileName", label: "File Name" },
      { key: "fileUrl", label: "File URL", required: true },
      { key: "isActive", label: "Active (shown on website)", type: "checkbox", default: true }
    ],
    columns: ["fileName", "fileUrl", "isActive", "uploadedAt"],
    labels: { uploadedAt: "Uploaded" }
  }
};

function initialForm(fields) {
  return Object.fromEntries(fields.map(f => [f.key, f.default !== undefined ? f.default : ""]));
}

function toInputValue(field, value) {
  if (value === null || value === undefined) return "";
  if (field.type === "checkbox") return Boolean(value);
  if (field.type === "date") return String(value).slice(0, 10);
  return value;
}

function buildBody(fields, form) {
  const body = {};
  for (const f of fields) {
    const raw = form[f.key];
    if (f.type === "checkbox") body[f.key] = Boolean(raw);
    else if (f.type === "number") body[f.key] = raw === "" || raw === null ? null : Number(raw);
    else body[f.key] = raw === "" || raw === null ? null : raw;
  }
  return body;
}

function formatCell(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleDateString();
  return String(value);
}

function columnLabel(config, key) {
  if (config.labels && config.labels[key]) return config.labels[key];
  const field = config.fields.find(f => f.key === key);
  if (field) return field.label.replace(/\s*\(.*\)$/, "");
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export default function ResourceManager({ resource }) {
  const config = resources[resource];
  const base = config.itemEndpoint || config.endpoint;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(() => initialForm(config.fields));
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function load() {
    setLoading(true);
    const { data } = await apiRequest(config.listEndpoint || config.endpoint);
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function reset() {
    setEditingId(null);
    setForm(initialForm(config.fields));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm(Object.fromEntries(config.fields.map(f => [f.key, toInputValue(f, item[f.key])])));
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    for (const f of config.fields) {
      if (f.required && !String(form[f.key] ?? "").trim()) {
        setStatus(`${f.label} is required`);
        return;
      }
    }
    setStatus("Saving...");
    const res = await apiRequest(editingId ? `${base}/${editingId}` : config.endpoint, {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(buildBody(config.fields, form))
    });
    if (!res.ok) return setStatus(res.data.error || "Save failed");
    setStatus("Saved");
    reset();
    await load();
  }

  async function uploadCertificateFile(file, key) {
    if (!file) return;
    setUploading(true);
    setStatus("Uploading file...");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(data.error || "Upload failed");
      } else {
        set(key, data.url);
        setStatus("File uploaded — click Save to apply");
      }
    } catch {
      setStatus("Upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function remove(id) {
    if (!confirm("Delete this entry?")) return;
    const res = await apiRequest(`${base}/${id}`, { method: "DELETE" });
    if (!res.ok) return setStatus(res.data.error || "Delete failed");
    if (editingId === id) reset();
    await load();
  }

  return (
    <div>
      <div className="toolbar">
        <h1 style={{ fontSize: "2.2rem" }}>{config.title}</h1>
        {editingId && (
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { reset(); setStatus(""); }}>
            + Add New Instead
          </button>
        )}
      </div>

      <form className="card form admin-form" onSubmit={submit}>
        <h2 style={{ fontSize: "1.15rem" }}>{editingId ? `Editing #${editingId}` : "Add New"}</h2>
        <div className="form-grid">
          {config.fields.map(f => {
            if (f.type === "textarea") {
              return (
                <label key={f.key} className="field span-all">
                  <span>{f.label}{f.required ? " *" : ""}</span>
                  <textarea value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
                </label>
              );
            }
            if (f.type === "checkbox") {
              return (
                <label key={f.key} className="field-check span-all">
                  <input type="checkbox" checked={Boolean(form[f.key])} onChange={e => set(f.key, e.target.checked)} />
                  <span>{f.label}</span>
                </label>
              );
            }
            if (f.type === "image") {
              const val = form[f.key];
              const isPdf = typeof val === "string" && val.toLowerCase().endsWith(".pdf");
              return (
                <div key={f.key} className="span-all">
                  <span className="field-label">{f.label}{f.required ? " *" : ""}</span>
                  <div className="upload-row">
                    {val && !isPdf && <img src={val} alt="Preview" className="img-preview" />}
                    {val && isPdf && <a href={val} target="_blank" rel="noreferrer" className="link-sm">View PDF</a>}
                    <div>
                      <label className={`btn btn-outline btn-sm upload-btn ${uploading ? "disabled" : ""}`}>
                        {uploading ? "Uploading..." : val ? "Change File" : "Choose File"}
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf"
                          disabled={uploading}
                          style={{ display: "none" }}
                          onChange={e => uploadCertificateFile(e.target.files[0], f.key)}
                        />
                      </label>
                      {val && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => set(f.key, "")}>
                          Remove
                        </button>
                      )}
                      <p className="file-hint">JPG, PNG, WebP, GIF, AVIF or PDF · max 5MB</p>
                      <input
                        type="text"
                        placeholder="Or paste URL"
                        value={val}
                        onChange={e => set(f.key, e.target.value)}
                        style={{ marginTop: "8px" }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <label key={f.key} className="field">
                <span>{f.label}{f.required ? " *" : ""}</span>
                <input
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                />
              </label>
            );
          })}
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
            <tr>
              {config.columns.map(c => <th key={c}>{columnLabel(config, c)}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={config.columns.length + 1} className="muted">{loading ? "Loading..." : "No entries yet"}</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className={editingId === item.id ? "row-editing" : ""}>
                {config.columns.map(c => <td key={c}>{formatCell(item[c])}</td>)}
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
