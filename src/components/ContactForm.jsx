"use client";

import { useState } from "react";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    const company = form.company.trim();
    const subject = form.subject.trim();

    if (!name) e.name = "Name is required";
    else if (name.length < 2) e.name = "Name must be at least 2 characters";
    else if (name.length > 80) e.name = "Name must be under 80 characters";

    if (!email) e.email = "Email is required";
    else if (!emailRe.test(email)) e.email = "Enter a valid email address";
    else if (email.length > 120) e.email = "Email is too long";

    if (!message) e.message = "Message is required";
    else if (message.length < 10) e.message = "Message must be at least 10 characters";
    else if (message.length > 2000) e.message = "Message must be under 2000 characters";

    if (company && company.length > 100) e.company = "Company must be under 100 characters";
    if (subject && subject.length > 150) e.subject = "Subject must be under 150 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    if (!validate()) {
      setStatus({ type: "error", msg: "Please fix the highlighted fields." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          subject: form.subject.trim() || undefined,
          message: form.message.trim()
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: "error", msg: data.error || "Failed to send. Please try again." });
      } else {
        // Try client-side FormSubmit relay for instant delivery without SMTP (works on deployed domain)
        try{
          await fetch("https://formsubmit.co/ajax/a837c052a0137e3f19ef55312c058399", {
            method:"POST",
            headers:{ "Content-Type":"application/json", "Accept":"application/json" },
            body: JSON.stringify({
              name: form.name.trim(),
              email: form.email.trim(),
              company: form.company.trim(),
              subject: form.subject.trim() || `Portfolio message from ${form.name.trim()}`,
              message: form.message.trim(),
              _subject: form.subject.trim() ? `[Portfolio] ${form.subject.trim()}` : `[Portfolio] New message from ${form.name.trim()}`,
              _template: "table",
              _captcha: "false"
            })
          });
        }catch{}
        setStatus({ type: "success", msg: data.message || "Message sent to ashikafarsanaop@gmail.com! I'll get back to you soon." });
        setForm({ name: "", email: "", company: "", subject: "", message: "" });
        setErrors({});
        if (data.mailto && !data.message?.includes("sent to ashikafarsanaop@gmail.com")) {
          window.location.href = data.mailto;
        }
      }
    } catch {
      setStatus({ type: "error", msg: "Network error. Please try again." });
    }
    setSubmitting(false);
  }

  const fieldStyle = (hasError) => hasError ? { borderColor: "#ef4444" } : undefined;

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div>
        <input
          name="name"
          placeholder="Your name *"
          value={form.name}
          onChange={e => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          style={fieldStyle(errors.name)}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>
      <div>
        <input
          name="email"
          type="email"
          placeholder="Your email *"
          value={form.email}
          onChange={e => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          style={fieldStyle(errors.email)}
        />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>
      <div>
        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={e => update("company", e.target.value)}
          aria-invalid={Boolean(errors.company)}
          style={fieldStyle(errors.company)}
        />
        {errors.company && <p className="field-error">{errors.company}</p>}
      </div>
      <div>
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={e => update("subject", e.target.value)}
          aria-invalid={Boolean(errors.subject)}
          style={fieldStyle(errors.subject)}
        />
        {errors.subject && <p className="field-error">{errors.subject}</p>}
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Message *"
          value={form.message}
          onChange={e => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          style={fieldStyle(errors.message)}
        />
        {errors.message && <p className="field-error">{errors.message}</p>}
      </div>
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send Message"}
      </button>
      {status.msg && (
        <p className={status.type === "success" ? "field-success" : "field-error"} role="status">
          {status.msg}
        </p>
      )}
      <p className="form-hint muted">Messages are sent directly to <a href="mailto:ashikafarsanaop@gmail.com" style={{ color: "var(--primary)", fontWeight:700 }}>ashikafarsanaop@gmail.com</a> • You’ll also get a copy at <code>{form.email || "your email"}</code> as reply-to.</p>
    </form>
  );
}
