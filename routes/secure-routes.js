const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.json({
    message: 'Secure route accessed',
    user: req.user
  });
});

module.exports = router;
