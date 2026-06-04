import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const resendKey = process.env.RESEND_API_KEY;
const matchFromEmail = process.env.MATCH_FROM_EMAIL || 'FriendType <match@friendtype.io>';

const script = `
if redis.call('SETNX', KEYS[4] .. ARGV[3], ARGV[1]) == 0 then
  return '__EMAIL_EXISTS__'
end
local matchedId = redis.call('LPOP', KEYS[1])
while matchedId do
  local matchedJson = redis.call('GET', KEYS[2] .. matchedId)
  if matchedJson then
    redis.call('SET', KEYS[2] .. ARGV[1], ARGV[2])
    redis.call('SET', KEYS[3] .. ARGV[1], matchedId)
    redis.call('SET', KEYS[3] .. matchedId, ARGV[1])
    return matchedJson
  end
  matchedId = redis.call('LPOP', KEYS[1])
end
redis.call('SET', KEYS[2] .. ARGV[1], ARGV[2])
redis.call('RPUSH', KEYS[1], ARGV[1])
return false
`;

function clean(value) {
  return String(value || '').trim();
}

function normalizeCity(value) {
  return clean(value).toLowerCase().replace(/\s+/g, ' ');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function redis(command) {
  const response = await fetch(redisUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redisToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || 'redis_error');
  return data.result;
}

function emailBody(person, match) {
  const contactLabel = match.contactType === 'wechat' ? 'WeChat' : 'Email';
  return [
    `Hi ${person.email},`,
    '',
    `You matched with a 100% FriendType person: ${match.resultCode} - ${match.resultName}.`,
    `City: ${match.city}`,
    `Age range: ${match.ageRange}`,
    `Their contact (${contactLabel}): ${match.contactValue}`,
    '',
    'They also received your contact. Say hi only if it feels comfortable.',
    '',
    'FriendType',
  ].join('\n');
}

async function sendMatchEmail(to, person, match) {
  if (!resendKey) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: matchFromEmail,
      to,
      subject: `Your FriendType 100% match is here: ${match.resultCode}`,
      text: emailBody(person, match),
    }),
  });
  return response.ok;
}

export async function POST(request) {
  if (!redisUrl || !redisToken || !resendKey) {
    return NextResponse.json({ error: 'matching_not_configured' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const city = clean(body.city);
  const normalizedCity = normalizeCity(city);
  const ageRange = clean(body.ageRange);
  const gender = clean(body.gender);
  const email = clean(body.email).toLowerCase();
  const contactType = clean(body.contactType);
  const contactValue = clean(body.contactValue);
  const resultCode = clean(body.resultCode).toUpperCase();
  const resultName = clean(body.resultName);
  const lang = clean(body.lang) === 'en' ? 'en' : 'zh';

  if (!city || !normalizedCity || !ageRange || !email || !contactValue || !resultCode) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  if (!isEmail(email) || !['email', 'wechat'].includes(contactType)) {
    return NextResponse.json({ error: 'invalid_fields' }, { status: 400 });
  }

  const entry = {
    id: crypto.randomUUID(),
    city,
    normalizedCity,
    ageRange,
    gender,
    email,
    contactType,
    contactValue,
    resultCode,
    resultName,
    lang,
    createdAt: new Date().toISOString(),
  };

  const queueKey = `friendtype:queue:${resultCode}:${normalizedCity}:${ageRange}`;
  const recordPrefix = 'friendtype:entry:';
  const pairPrefix = 'friendtype:pair:';
  const emailPrefix = 'friendtype:email:';
  const matchedJson = await redis(['EVAL', script, 4, queueKey, recordPrefix, pairPrefix, emailPrefix, entry.id, JSON.stringify(entry), email]);

  if (matchedJson === '__EMAIL_EXISTS__') {
    return NextResponse.json({ error: 'already_registered' }, { status: 409 });
  }

  if (!matchedJson) {
    return NextResponse.json({ matched: false });
  }

  const match = JSON.parse(matchedJson);
  const emailSent = await Promise.all([
    sendMatchEmail(entry.email, entry, match),
    sendMatchEmail(match.email, match, entry),
  ]);

  return NextResponse.json({ matched: true, emailSent: emailSent.every(Boolean) });
}
