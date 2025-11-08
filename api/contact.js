// Lightweight serverless endpoint example for Vercel/Netlify/AWS Lambda
// This file should be deployed server-side. It reads the private key from
// process.env.CONTACT_PRIVATE_KEY — DO NOT store your private key in client code.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const PRIVATE_KEY = process.env.CONTACT_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    console.error('Missing CONTACT_PRIVATE_KEY env var');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const { serviceId, publicKey, name, email, message } = req.body || {};
    if (!serviceId || !publicKey || !name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // TODO: Replace the following with a real call to your email provider using PRIVATE_KEY.
    // Example: call SendGrid, Mailgun, or your provider's API and pass PRIVATE_KEY server-side.
    console.log('Incoming contact request', { serviceId, publicKey, name, email });

    // Example response — forward to provider here.
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact handler error', err);
    return res.status(500).json({ error: 'server error' });
  }
}
