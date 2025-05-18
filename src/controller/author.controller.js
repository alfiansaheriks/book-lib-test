const Author = require('../models/author.model');

const getAuthors = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const authors = await Author.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.status(200).json({
            success: true,
            message: 'Authors retrieved successfully',
            page: Number(page),
            limit: Number(limit),
            data: authors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

const createAuthor = async (req, res) => {
    const { name } = req.body;
    try {
        const author = new Author({ name });
        await author.save();
        res.status(201).json({
            success: true,
            message: 'Author created successfully',
            data: author,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

module.exports = {
    getAuthors,
    createAuthor,
}