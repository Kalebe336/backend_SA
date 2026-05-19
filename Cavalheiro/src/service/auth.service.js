const SESSION_COOKIE = 'userLoggedIn';
const EMAIL_COOKIE = 'userEmail';

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

function getMe(req) {
  const cookies = getAuthCookies(req);
  if (!cookies) return { loggedIn: false };
  return { loggedIn: true, email: cookies[EMAIL_COOKIE] || null };
}

function login({ email, password }) {
  // Demo validation. Keep your original rule: password length >= 6
  if (!email || typeof password !== 'string' || password.length < 6) {
    return { ok: false, status: 400, message: 'Dados inválidos' };
  }

  return { ok: true };
}

function logout() {
  return { ok: true };
}

function buildLoginCookies(email) {
  return [
    `${SESSION_COOKIE}=true; Path=/; HttpOnly; SameSite=Lax`,
    `${EMAIL_COOKIE}=${encodeURIComponent(email)}; Path=/; HttpOnly; SameSite=Lax`
  ];
}

function buildLogoutCookies() {
  return [
    `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
    `${EMAIL_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  ];
}

module.exports = {
  getMe,
  login,
  logout,
  buildLoginCookies,
  buildLogoutCookies
};

