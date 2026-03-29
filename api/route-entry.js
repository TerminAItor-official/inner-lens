const Anthropic = require('@anthropic-ai/sdk');
const { ROUTER_SYSTEM_PROMPT } = require('../lib/prompts/router');
const questions = require('../lib/questions.json');

const CRISIS_PATTERNS = [
  /\bsuicid/i,
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bwant to die\b/i,
  /\bdon'?t want to be here\b/i,
  /\bno reason to live\b/i,
  /\bnot worth living\b/i,
  /\bbetter off dead\b/i,
  /\bbetter off without me\b/i,
  /\bcan'?t go on\b/i,
  /\bself.?harm\b/i,
  /\bcut myself\b/i,
  /\bhurt myself\b/i,
  /\bhurting myself\b/i,
  /\bharming myself\b/i,
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MAX_ENTRY_LENGTH = 5000;

function isCrisis(text) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

function getFallbackResponse() {
  const keys = Object.keys(questions.philosophers);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const philosopher = questions.philosophers[key];
  const question = philosopher.questions[Math.floor(Math.random() * philosopher.questions.length)];
  return {
    philosopher: key,
    confidence: 0.5,
    runner_up: null,
    reasoning: 'Fallback due to routing error.',
    question_id: question.id,
    question_text: question.text,
    philosopher_data: {
      name: philosopher.name,
      emoji: philosopher.emoji,
      tagline: philosopher.tagline,
      colors: philosopher.colors,
      intro: philosopher.intro,
    },
  };
}

module.exports = async (req, res) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { entry } = req.body || {};

  if (!entry || typeof entry !== 'string' || entry.trim().length === 0) {
    res.status(400).json({ error: 'entry is required' });
    return;
  }

  if (entry.length > MAX_ENTRY_LENGTH) {
    res.status(400).json({ error: `entry must be ${MAX_ENTRY_LENGTH} characters or fewer` });
    return;
  }

  // Crisis detection — always before AI routing
  if (isCrisis(entry)) {
    res.status(200).json({ crisis: true });
    return;
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: ROUTER_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: entry }],
    });

    const raw = message.content[0]?.text?.trim();
    if (!raw) throw new Error('Empty response from Claude');

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Claude sometimes wraps in markdown fences
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1].trim());
      } else {
        throw new Error('Could not parse routing response as JSON');
      }
    }

    const { philosopher, confidence, runner_up, reasoning, question_id } = parsed;

    const philosopherData = questions.philosophers[philosopher];
    if (!philosopherData) throw new Error(`Unknown philosopher: ${philosopher}`);

    const questionObj = philosopherData.questions.find((q) => q.id === question_id);
    if (!questionObj) throw new Error(`Unknown question_id: ${question_id}`);

    res.status(200).json({
      philosopher,
      confidence,
      runner_up,
      reasoning,
      question_id,
      question_text: questionObj.text,
      philosopher_data: {
        name: philosopherData.name,
        emoji: philosopherData.emoji,
        tagline: philosopherData.tagline,
        colors: philosopherData.colors,
        intro: philosopherData.intro,
      },
    });
  } catch (err) {
    console.error('[route-entry] error:', err.message);
    res.status(200).json(getFallbackResponse());
  }
};
