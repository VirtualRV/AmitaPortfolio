const fs = require('fs');
const path = require('path');

const CLOUD_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/afebddc';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Fetch live updated data from Cloud JSON Store
  try {
    const cloudRes = await fetch(`${CLOUD_BIN_URL}?t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (cloudRes.ok) {
      const data = await cloudRes.json();
      if (Array.isArray(data)) {
        return res.status(200).json(data);
      }
    }
  } catch (err) {
    console.warn('Cloud storage fetch fallback:', err);
  }

  // 2. Fallback to repository JSON file if cloud is unreachable
  try {
    const localFile = path.join(process.cwd(), 'contact-submissions.json');
    if (fs.existsSync(localFile)) {
      const localData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
      return res.status(200).json(localData);
    }
  } catch (e) {}

  return res.status(200).json([]);
};
