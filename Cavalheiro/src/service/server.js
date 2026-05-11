const path = require('path');
const express = require('express');

const app = express();

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie-based auth (demo): the frontend will call /auth/me to know login status.
const SESSION_COOKIE = 'userLoggedIn';
const EMAIL_COOKIE = 'userEmail';

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', '..')));

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map(s => s.trim())
      .filter(Boolean)
      .map(pair => {
        const idx = pair.indexOf('=');
        if (idx === -1) return [pair, ''];
        return [pair.slice(0, idx), decodeURIComponent(pair.slice(idx + 1))];
      })
  );
}

function getAuthCookies(req) {
  const cookies = parseCookies(req);
  if (cookies[SESSION_COOKIE] === 'true') return cookies;
  return null;
}

app.get('/auth/me', (req, res) => {
  const cookies = getAuthCookies(req);
  if (!cookies) return res.json({ loggedIn: false });
  return res.json({ loggedIn: true, email: cookies[EMAIL_COOKIE] || null });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  // Demo validation. Keep your original rule: password length >= 6
  if (!email || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ ok: false, message: 'Dados inválidos' });
  }

  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=true; Path=/; HttpOnly; SameSite=Lax`,
    `${EMAIL_COOKIE}=${encodeURIComponent(email)}; Path=/; HttpOnly; SameSite=Lax`
  ]);

  return res.json({ ok: true });
});

app.post('/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
    `${EMAIL_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  ]);

  return res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

