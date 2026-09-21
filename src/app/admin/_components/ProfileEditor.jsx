"use client";

import { useEffect, useRef, useState } from "react";
import { apiRequest } from "@/lib/api";

const emptyForm = {
  fullName: "", professionalTitle: "", bio: "", email: "", phone: "",
  location: "", profileImage: "", githubUrl: "", linkedinUrl: "", portfolioUrl: ""
};

export default function ProfileEditor() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await apiRequest("/api/profile");
      if (data && typeof data === "object") {
        setForm({
          fullName: data.fullName || "",
          professionalTitle: data.professionalTitle || "",
          bio: data.bio || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          profileImage: data.profileImage || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          portfolioUrl: data.portfolioUrl || ""
        });
      }
      setLoading(false);
    })();
  }, []);

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
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
        set("profileImage", data.url);
        setStatus("Image uploaded — click Save Profile to apply");
      }
    } catch {
      setStatus("Image upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.fullName.trim()) return setStatus("Full name is required");
    setStatus("Saving...");
    const res = await apiRequest("/api/profile", { method: "PUT", body: JSON.stringify(form) });
    if (!res.ok) return setStatus(res.data.error || "Save failed");
    setStatus("Profile saved");
  }

  if (loading) return <p className="muted">Loading...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "2.2rem" }}>Profile</h1>
      <form className="card form admin-form" onSubmit={submit}>
        <div className="form-grid">
          <label className="field"><span>Full Name *</span>
            <input value={form.fullName} onChange={e => set("fullName", e.target.value)} />
          </label>
          <label className="field"><span>Professional Title</span>
            <input value={form.professionalTitle} onChange={e => set("professionalTitle", e.target.value)} />
          </label>
          <label className="field"><span>Email</span>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} />
          </label>
          <label className="field"><span>Phone</span>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} />
          </label>
          <label className="field"><span>Location</span>
            <input value={form.location} onChange={e => set("location", e.target.value)} />
          </label>

          <div className="span-all">
            <span className="field-label">Profile Image</span>
            <div className="upload-row">
              {form.profileImage && (
                <img src={form.profileImage} alt="Profile preview" className="img-preview" />
              )}
              <div>
                <label className={`btn btn-outline btn-sm upload-btn ${uploading ? "disabled" : ""}`}>
                  {uploading ? "Uploading..." : form.profileImage ? "Change Image" : "Choose Image"}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                    disabled={uploading}
                    style={{ display: "none" }}
                    onChange={e => uploadImage(e.target.files[0])}
                  />
                </label>
                {form.profileImage && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => set("profileImage", "")}>
                    Remove
                  </button>
                )}
                <p className="file-hint">JPG, PNG, WebP, GIF or AVIF · max 5MB</p>
              </div>
            </div>
          </div>

          <label className="field span-all"><span>Bio</span>
            <textarea value={form.bio} onChange={e => set("bio", e.target.value)} />
          </label>
          <label className="field"><span>GitHub URL</span>
            <input value={form.githubUrl} onChange={e => set("githubUrl", e.target.value)} />
          </label>
          <label className="field"><span>LinkedIn URL</span>
            <input value={form.linkedinUrl} onChange={e => set("linkedinUrl", e.target.value)} />
          </label>
          <label className="field"><span>Portfolio URL</span>
            <input value={form.portfolioUrl} onChange={e => set("portfolioUrl", e.target.value)} />
          </label>
        </div>
        <div>
          <button className="btn btn-primary">Save Profile</button>
        </div>
        {status && <p className="muted">{status}</p>}
      </form>
    </div>
  );
}
