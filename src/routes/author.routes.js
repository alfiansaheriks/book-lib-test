const express = require('express');
const router = express.Router();
const authorController = require('../controller/author.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, authorController.createAuthor);
router.get('/', authorController.getAuthors);

module.exports = router;