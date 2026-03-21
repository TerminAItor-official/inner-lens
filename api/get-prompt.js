const questions = require('../lib/questions.json');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const prompts = questions.opening;

  // Avoid repeating the last-seen prompt if ?last=O03 is provided
  const lastId = req.query?.last || null;
  const candidates = lastId ? prompts.filter((p) => p.id !== lastId) : prompts;
  const pool = candidates.length > 0 ? candidates : prompts;

  const prompt = pool[Math.floor(Math.random() * pool.length)];

  res.status(200).json({ id: prompt.id, text: prompt.text });
};
