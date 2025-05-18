const mongoose = require('mongoose');
require('dotenv').config();

const Author = require('../models/author.model');

const authors = Array.from({ length: 30 }).map((_, i) => ({
  name: `Author ${i + 1}`,
}));

const seedAuthors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'book_lib'
    });
    console.log('Connected to DB');

    await Author.deleteMany({});
    console.log('Existing authors deleted');

    await Author.insertMany(authors);
    console.log(`${authors.length} authors inserted`);

    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
};

seedAuthors();
