import React, { useState } from "react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

type FormData = {
  name: string;
  email: string;
  message: string;
};

// Load from environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_jwxd0co";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_60wvnzt";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "ndqVQL5a4jQKAgomK";

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((s) => ({ ...s, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = showLoading("Sending message...");

    try {
      // POST to a serverless endpoint that will use the PRIVATE key to actually send the email.
      // This client-side endpoint includes the public SERVICE_ID and PUBLIC_KEY so the server can validate.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          serviceId: SERVICE_ID,
          templateId: TEMPLATE_ID,
          publicKey: PUBLIC_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.details || data.error || "Server error");
      }

      showSuccess("Message sent — thank you!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      // normalize unknown error
      const msg = err instanceof Error ? err.message : String(err);
      // log to console for developer debugging
      console.error("contact submit error", err);
      showError(msg ?? "Failed to send message");
    } finally {
      dismissToast(toastId);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-2xl font-display font-bold mb-4" style={{ color: 'var(--ink)' }}>Contact me</h1>
      <div className="md:w-1/2">
        <div className="clay-surface p-6">
          <div className="paper-surface" style={{ borderRadius: 'calc(var(--radius) - 3px)' }}>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="label-handwritten block mb-1" style={{ fontSize: '16px' }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="clay-input"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="label-handwritten block mb-1" style={{ fontSize: '16px' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="clay-input"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="label-handwritten block mb-1" style={{ fontSize: '16px' }}>
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="clay-input"
                  placeholder="Your message here..."
                  required
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`clay-btn flex-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
