"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await apiRequest("/api/messages");
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleRead(m) {
    const res = await apiRequest(`/api/messages/${m.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: m.status === "read" ? "unread" : "read" })
    });
    if (!res.ok) return setStatus(res.data.error || "Update failed");
    await load();
  }

  async function remove(id) {
    if (!confirm("Delete this message?")) return;
    const res = await apiRequest(`/api/messages/${id}`, { method: "DELETE" });
    if (!res.ok) return setStatus(res.data.error || "Delete failed");
    await load();
  }

  const unreadCount = messages.filter(m => m.status !== "read").length;

  return (
    <div>
      <div className="toolbar">
        <h1 style={{ fontSize: "2.2rem" }}>Messages</h1>
        <p className="muted">{loading ? "" : `${messages.length} total · ${unreadCount} unread`}</p>
      </div>

      {status && <p className="muted">{status}</p>}

      {messages.length === 0 ? (
        <p className="muted">{loading ? "Loading..." : "No messages yet. Messages sent through the contact form appear here."}</p>
      ) : (
        <div className="grid cards">
          {messages.map(m => (
            <article className={`card ${m.status !== "read" ? "message-unread" : ""}`} key={m.id}>
              <div className="toolbar">
                <h3>{m.subject || "No subject"}</h3>
                <span className={`badge ${m.status === "read" ? "badge-read" : "badge-unread"}`}>
                  {m.status === "read" ? "Read" : "Unread"}
                </span>
              </div>
              <p><strong>{m.name}</strong> — {m.email}{m.company ? ` (${m.company})` : ""}</p>
              <p>{m.message}</p>
              <small className="muted">{new Date(m.createdAt).toLocaleString()}</small>
              <div style={{ marginTop: 12 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleRead(m)}>
                  Mark as {m.status === "read" ? "unread" : "read"}
                </button>
                <a className="btn btn-outline btn-sm" href={`mailto:${m.email}`}>Reply</a>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(m.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
