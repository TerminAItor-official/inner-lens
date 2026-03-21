const Anthropic = require('@anthropic-ai/sdk');
const { REFLECTION_SYSTEM_PROMPT } = require('../lib/prompts/reflection');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MAX_LENGTH = 3000;

const FALLBACK_REFLECTIONS = [
  "Something in what you've written points to a tension you're still sitting with — not a problem to solve, but a truth asking to be held a little longer. The way you described it suggests you already sense what's underneath, even if the words aren't quite there yet. That noticing is worth staying with.",
  "There's a quality of searching in what you've shared — reaching toward something you can feel but haven't fully named. What strikes me is the honesty in how you've let yourself arrive here, in this uncertainty. The question might not be what to do, but what it would mean to stay with not knowing for a little while.",
  "What you've written holds more than one thing at once, and that's not a contradiction — it's the actual texture of what you're living. The feeling you're circling around seems important precisely because it resists being simplified. What happens when you let it be as complicated as it actually is?",
];

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { philosopher, philosopher_name, question, entry, reflection } = req.body || {};

  if (!entry || typeof entry !== 'string' || entry.trim().length === 0) {
    res.status(400).json({ error: 'entry is required' });
    return;
  }

  if (!reflection || typeof reflection !== 'string' || reflection.trim().length === 0) {
    res.status(400).json({ error: 'reflection is required' });
    return;
  }

  if (entry.length > MAX_LENGTH || reflection.length > MAX_LENGTH) {
    res.status(400).json({ error: `entry and reflection must each be ${MAX_LENGTH} characters or fewer` });
    return;
  }

  const userMessage = [
    `Original journal entry:\n${entry.trim()}`,
    philosopher_name ? `Philosopher matched: ${philosopher_name}` : null,
    question ? `Follow-up question asked: ${question}` : null,
    `Person's response to the question:\n${reflection.trim()}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: REFLECTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0]?.text?.trim();
    if (!text) throw new Error('Empty response from Claude');

    res.status(200).json({ reflection: text });
  } catch (err) {
    console.error('[generate-reflection] error:', err.message);
    const fallback = FALLBACK_REFLECTIONS[Math.floor(Math.random() * FALLBACK_REFLECTIONS.length)];
    res.status(200).json({ reflection: fallback });
  }
};
