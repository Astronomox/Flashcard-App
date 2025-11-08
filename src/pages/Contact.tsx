import React, { useState } from "react";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

type FormData = {
  name: string;
  email: string;
  message: string;
};

// Load from environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_jwxd0co";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_contact_form";
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
      <h1 className="text-2xl font-semibold mb-4">Contact me</h1>
      <div className="md:w-1/2">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Your message here..."
              required
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 font-medium rounded-lg transition-colors duration-300 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? <span>⏳ Sending…</span> : "Send Message"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            This form posts to <code className="font-mono">/api/contact</code>. You should implement a server
            endpoint that uses your private key to relay messages to your email provider. Do not place your
            private key in client-side code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
