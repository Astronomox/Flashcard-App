// Vercel serverless function for sending contact emails via EmailJS API
// Reads credentials from Vercel environment variables

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
  const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
  const SERVICE_ID_ENV = process.env.EMAILJS_SERVICE_ID;
  const PUBLIC_KEY_ENV = process.env.EMAILJS_PUBLIC_KEY;

  if (!PRIVATE_KEY) {
    console.error('Missing EMAILJS_PRIVATE_KEY env var');
    return res.status(500).json({ error: 'Server misconfigured', details: 'Missing email service private key' });
  }

  try {
    const { serviceId, templateId, publicKey, name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const emailData = {
      service_id: SERVICE_ID_ENV || serviceId,
      template_id: TEMPLATE_ID || templateId,
      user_id: PUBLIC_KEY_ENV || publicKey,
      accessToken: PRIVATE_KEY,
      template_params: {
        from_name: name,
        from_email: email,
        reply_to: email,
        message: message,
        to_name: 'Admin'
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('EmailJS API error:', response.status, responseText);
      return res.status(500).json({ error: 'Failed to send email', details: responseText });
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('contact handler error', err);
    return res.status(500).json({ error: 'Server error', details: err.message || String(err) });
  }
}
