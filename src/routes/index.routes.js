const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const bookRoutes = require('./book.routes');
const authorRoutes = require('./author.routes');

router.use('/auth', authRoutes);
router.use('/book', bookRoutes);
router.use('/author', authorRoutes);

module.exports = router;