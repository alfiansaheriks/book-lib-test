const Book = require('../models/book.model');

const getBooks = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const books = await Book.find()
            .populate('author', 'name')
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            page: Number(page),
            limit: Number(limit),
            total: await Book.countDocuments(),
            totalPages: Math.ceil(await Book.countDocuments() / limit),
            data: books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

const createBook = async (req, res) => {
    const { title, publishedYear, author, genre } = req.body;
    try {
        const book = new Book({ title, publishedYear, author, genre });
        await book.save();
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, publishedYear, author, genre } = req.body;
    try {
        const book = await Book.findByIdAndUpdate(id, { title, publishedYear, author, genre }, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: book,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook
}