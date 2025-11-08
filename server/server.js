import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const EMAILJS_CONFIG = {
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  serviceId: process.env.EMAILJS_SERVICE_ID,
  templateId: process.env.EMAILJS_TEMPLATE_ID
};

app.post('/api/contact', async (req, res) => {
  // define variables in outer scope so catch can reference them (fix ReferenceError)
  let serviceId, publicKey, name, email, message;
  try {
    ({ serviceId, publicKey, name, email, message } = req.body || {});

    if (!serviceId || !publicKey || !name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { serviceId, publicKey, name, email, hasMessage: !!message }
      });
    }

    console.log('Attempting to send email with:', {
      serviceId,
      templateId: EMAILJS_CONFIG.templateId,
      publicKey,
      hasPrivateKey: !!EMAILJS_CONFIG.privateKey,
      name,
      email,
      messageLength: message?.length
    });

    // Validate EmailJS credentials
    if (!EMAILJS_CONFIG.privateKey) {
      console.error('Missing EMAILJS_PRIVATE_KEY');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing email service private key'
      });
    }

    // EmailJS API expects different parameter format than what's documented
    const emailData = {
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      accessToken: EMAILJS_CONFIG.privateKey,
      template_params: {
        from_name: name,
        from_email: email,
        reply_to: email,
        message: message,
        to_name: 'Admin'
      }
    };

    console.log('Sending email with config:', {
      service_id: serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      hasUserID: !!emailData.user_id,
      hasAccessToken: !!emailData.accessToken,
      hasParams: !!emailData.template_params,
      to_email: emailData.template_params.to_email
    });

    // First attempt: EmailJS REST API using native fetch (Node.js 18+)
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080',
        'Authorization': `Bearer ${EMAILJS_CONFIG.privateKey}`,
        'X-EmailJS-API-Key': publicKey
      },
      body: JSON.stringify(emailData)
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    if (!response.ok) {
      console.error('EmailJS API error:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: Object.fromEntries(response.headers)
      });
      throw new Error(
        typeof responseData === 'object' && responseData.error 
          ? responseData.error 
          : `EmailJS API error (${response.status}): ${responseText}`
      );
    }

    console.log('EmailJS response:', {
      status: response.status,
      data: responseData
    });

    return res.json({ 
      message: 'Email sent successfully (via EmailJS)',
      response: responseData 
    });
  } catch (error) {
    console.error('Primary email send failed:', error && error.message ? error.message : error);

    // Fallback: try sending with nodemailer using Ethereal (development safe)
    try {
      // dynamic import to avoid adding heavy deps when not needed
      const nodemailer = (await import('nodemailer')).default;

      // create a test account (Ethereal) and send a dev email
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        }
      });

      const mailOptions = {
        from: `${name} <${email}>`,
        to: process.env.DEV_FALLBACK_TO || 'developer@example.com',
        subject: `Contact form message from ${name}`,
        text: message,
        html: `<p>${message}</p><p>From: ${name} &lt;${email}&gt;</p>`
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Fallback email sent via Ethereal:', nodemailer.getTestMessageUrl(info));

      return res.json({ message: 'Email sent via fallback (Ethereal)', previewUrl: nodemailer.getTestMessageUrl(info) });
    } catch (fallbackError) {
      console.error('Fallback email send also failed:', fallbackError);
      return res.status(500).json({
        error: 'Failed to send email with both primary and fallback methods',
        primaryError: error && error.message ? error.message : String(error),
        fallbackError: fallbackError && fallbackError.message ? fallbackError.message : String(fallbackError),
      });
    }
  }
});

const startServer = () => {
  try {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log('EmailJS config:', {
        hasPrivateKey: !!EMAILJS_CONFIG.privateKey,
        hasTemplateId: !!EMAILJS_CONFIG.templateId,
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();