const express = require('express');
const router = express.Router();
const bookController = require('../controller/book.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', bookController.getBooks);
// router.get('/:id', bookController.getBook);
router.post('/', auth, bookController.createBook);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
