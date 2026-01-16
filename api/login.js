// Vercel Serverless Function for Admin Authentication
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Get credentials from environment variables
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    // Validate credentials
    if (adminEmails.includes(email.toLowerCase()) && password === adminPassword) {
      return res.status(200).json({ 
        success: true,
        message: 'Authentication successful'
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Server error'
    });
  }
}
