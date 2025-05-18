const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

describe('Book API', () => {
    let token;
    let authorId;
    let bookId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'book_lib'
        });

        const res = await request(app).post('/api/auth/register').send({
            email: 'abc@example.com',
            password: 'password',
        });

        // console.log('Register response:', res.body);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();

        token = res.body.data.token.accessToken;

        const authorRes = await request(app)
            .post('/api/author')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'This is author name',
            });
        
        // console.log('Author response:', authorRes.body);
        
        expect(authorRes.statusCode).toBe(201);
        expect(authorRes.body.success).toBe(true);
        expect(authorRes.body.data).toBeDefined();

        authorId = authorRes.body.data._id;
    });

    afterAll(async () => {
        await mongoose.connection.db.collection('books').deleteMany({});
        await mongoose.connection.db.collection('authors').deleteMany({});
        await mongoose.connection.db.collection('refreshtokens').deleteMany({});
        await mongoose.connection.db.collection('users').deleteMany({});
        await mongoose.disconnect();
    });

    test('Should create a new book', async () => {
        const response = await request(app)
            .post('/api/book')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'This is book title',
                publishedYear: 2023,
                genre: 'This is book genre',
                author: authorId,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe('This is book title');

        bookId = response.body.data._id;
    });

    test('Should fetch all books', async () => {
        const response = await request(app)
            .get('/api/book')

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
    })

    test('Should fetch a book by ID', async () => {
        const response = await request(app)
            .get(`/api/book/detail/${bookId}`)

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe(bookId);
    })

    test('Should update a book', async () => {
        const response = await request(app)
            .put(`/api/book/${bookId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated book title',
                publishedYear: 2024,
                genre: 'Updated book genre',
            });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe('Updated book title');
    })

    test('Should delete a book', async () => {
        const response = await request(app)
            .delete(`/api/book/${bookId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Book deleted successfully');
    })
})