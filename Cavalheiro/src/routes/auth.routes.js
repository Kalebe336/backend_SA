const express = require('express');

const authService = require('../service/auth.service');

const router = express.Router();

router.get('/me', (req, res) => {
  const data = authService.getMe(req);
  return res.json(data);
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  const result = authService.login({ email, password });
  if (!result.ok) {
    return res.status(result.status).json({ ok: false, message: result.message });
  }

  res.setHeader('Set-Cookie', authService.buildLoginCookies(email));
  return res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  res.setHeader('Set-Cookie', authService.buildLogoutCookies());
  authService.logout();
  return res.json({ ok: true });
});

module.exports = router;

