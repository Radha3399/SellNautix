import { useEffect, useState } from "react";

const endpoint = "https://xhtejrbociaisjkkzpma.supabase.co/functions/v1/admin-amazon-seller-leads";
const sessionKey = "sellnautix_admin_session";

const csvValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export default function LeadsAdminPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function callAdmin(action, payload = {}, sessionToken = token) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
      },
      body: JSON.stringify({ action, ...payload })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Request failed.");
    return result;
  }

  async function loadLeads(nextSearch = search, nextOffset = offset, sessionToken = token) {
    if (!sessionToken) return;
    setLoading(true);
    setError("");
    try {
      const result = await callAdmin("list", { search: nextSearch, offset: nextOffset, limit: 25 }, sessionToken);
      setLeads(result.leads || []);
      setTotal(result.total || 0);
      setOffset(nextOffset);
    } catch (requestError) {
      setError(requestError.message || "Unable to load leads.");
      if (/session|log in/i.test(requestError.message || "")) {
        sessionStorage.removeItem(sessionKey);
        setToken("");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedToken = sessionStorage.getItem(sessionKey);
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) loadLeads("", 0, token);
  }, [token]);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await callAdmin("login", { password }, "");
      sessionStorage.setItem(sessionKey, result.token);
      setPassword("");
      setToken(result.token);
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await callAdmin("logout");
    } finally {
      sessionStorage.removeItem(sessionKey);
      setToken("");
      setLeads([]);
      setTotal(0);
    }
  }

  async function exportLeads() {
    setLoading(true);
    setError("");
    try {
      const result = await callAdmin("export", { search });
      const rows = [
        ["Submitted", "Name", "Company", "Email", "Phone", "Services", "Message", "Source"],
        ...(result.leads || []).map((lead) => [
          new Date(lead.submitted_at).toLocaleString(),
          lead.full_name,
          lead.company_name,
          lead.email,
          lead.phone,
          (lead.services || []).join(" | "),
          lead.message,
          lead.source
        ])
      ];
      const file = new Blob([rows.map((row) => row.map(csvValue).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "amazon-seller-leads.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.message || "Unable to export leads.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <main className="admin-login"><section><p className="eyebrow">SellNautix</p><h1>Lead access</h1><p>Sign in to review consultation requests.</p><form onSubmit={login}><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="admin-error" role="alert">{error}</p>}<button className="button" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button></form></section></main>;
  }

  const firstLead = total === 0 ? 0 : offset + 1;
  const lastLead = Math.min(offset + 25, total);
  return <main className="admin-page"><header className="admin-header"><div><a href="/" className="admin-brand">SELLNAUTIX</a><p>Amazon Seller Leads</p></div><button type="button" onClick={logout}>Sign out</button></header><section className="admin-content"><div className="admin-title"><div><p className="eyebrow">Private workspace</p><h1>Consultation leads</h1><p>{total} lead{total === 1 ? "" : "s"} found</p></div><button className="button" type="button" onClick={exportLeads} disabled={loading}>Export CSV ↗</button></div><form className="admin-search" onSubmit={(event) => { event.preventDefault(); loadLeads(search, 0); }}><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, company, email, phone, or message" /><button type="submit" disabled={loading}>Search</button></form>{error && <p className="admin-error" role="alert">{error}</p>}<div className="admin-table-wrap"><table><thead><tr><th>Submitted</th><th>Contact</th><th>Company</th><th>Services</th><th>Message</th></tr></thead><tbody>{loading ? <tr><td colSpan="5">Loading leads…</td></tr> : leads.length === 0 ? <tr><td colSpan="5">No leads match this search.</td></tr> : leads.map((lead) => <tr key={lead.id}><td>{new Date(lead.submitted_at).toLocaleString()}</td><td><strong>{lead.full_name}</strong><a href={`mailto:${lead.email}`}>{lead.email}</a>{lead.phone && <span>{lead.phone}</span>}</td><td>{lead.company_name || "—"}</td><td>{(lead.services || []).join(", ") || "—"}</td><td>{lead.message}</td></tr>)}</tbody></table></div><div className="admin-pagination"><span>{total ? `Showing ${firstLead}–${lastLead} of ${total}` : "No leads"}</span><div><button type="button" disabled={loading || offset === 0} onClick={() => loadLeads(search, Math.max(0, offset - 25))}>Previous</button><button type="button" disabled={loading || offset + 25 >= total} onClick={() => loadLeads(search, offset + 25)}>Next</button></div></div></section></main>;
}
