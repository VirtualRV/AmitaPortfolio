const CLOUD_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/afebddc';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    // If someone calls GET /api/contact, return current submissions
    try {
      const getRes = await fetch(`${CLOUD_BIN_URL}?t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (getRes.ok) {
        const data = await getRes.json();
        return res.status(200).json(data);
      }
    } catch (e) {}
    return res.status(200).json([]);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        payload = {};
      }
    }

    const submission = {
      name: payload.name || 'Anonymous',
      email: payload.email || 'N/A',
      company: payload.company || 'N/A',
      services: payload.services || 'Graphic & Branding',
      timeline: payload.timeline || 'Standard',
      details: payload.details || '',
      receivedAt: new Date().toISOString()
    };

    let submissions = [];
    try {
      const getRes = await fetch(`${CLOUD_BIN_URL}?t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (getRes.ok) {
        submissions = await getRes.json();
      }
    } catch (e) {
      console.warn('Failed to fetch existing before append:', e);
    }

    if (!Array.isArray(submissions)) {
      submissions = [];
    }

    submissions.unshift(submission);

    // Save back to cloud store
    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissions)
    });

    return res.status(200).json({
      success: true,
      message: 'Brief successfully saved to live records',
      totalSubmissions: submissions.length,
      submission
    });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Internal server error saving submission' });
  }
};
