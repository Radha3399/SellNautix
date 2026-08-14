import { useState } from "react";
import { trackEvent } from "../src/analytics";

const leadEndpoint = "https://xhtejrbociaisjkkzpma.supabase.co/functions/v1/submit-amazon-seller-lead";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"), company: data.get("company"), email: data.get("email"),
          phone: data.get("phone"), marketplace: data.get("marketplace"), services: data.getAll("services"), message: data.get("message"),
          website: data.get("website")
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save your request.");
      trackEvent("contact_form_submit", { form_name: "growth_diagnostic" });
      setSent(true);
    } catch (submissionError) {
      setError(submissionError.message || "Unable to save your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <form className="contact-form" onSubmit={submit}>{sent ? <div className="form-success"><span>✓</span><h3>Thank you. Your consultation request is ready for review.</h3><p>SellNautix will be in touch with the next step.</p></div> : <><label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off" /></label><div className="form-row"><label>Full name<input required name="name" placeholder="Your full name" /></label><label>Company name<input name="company" placeholder="Your company" /></label></div><div className="form-row"><label>Email address<input required name="email" type="email" placeholder="you@company.com" /></label><label>Phone number<input name="phone" type="tel" placeholder="+91" /></label></div><label>Amazon marketplace<input name="marketplace" placeholder="e.g. Amazon.in, Amazon.com" /></label><label>Services interested in<select name="services" multiple size="5" aria-describedby="service-help"><option>Amazon Account Management</option><option>Amazon Listing Optimization</option><option>Amazon Account Reinstatement & Appeals</option><option>Amazon Advertising (PPC)</option><option>Amazon Account Health & Compliance</option><option>Product Compliance & Category Approval</option><option>Variation & Catalog Management</option><option>Amazon Seller Training</option></select><small id="service-help">Hold Ctrl (Windows) or Command (Mac) to choose more than one service.</small></label><label>Message<textarea name="message" required rows="5" placeholder="Products, current challenge, or business goal"></textarea></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button form-button" type="submit" disabled={submitting}>{submitting ? "Sending…" : <>Schedule a Consultation <span>↗</span></>}</button><p className="form-note">No generic pitch. Start with a practical conversation about your next move.</p></>}</form>;
}
