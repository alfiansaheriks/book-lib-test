const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

describe('Auth API', () => {
    let token;
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'book_lib'
        });
    });


    afterAll(async () => {
        await mongoose.connection.db.collection('refreshtokens').deleteMany({});
        await mongoose.connection.db.collection('users').deleteMany({});
        await mongoose.disconnect();
    });

    test('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(201);
    });

    test('should login with valid credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        token = res.body.token.accessToken;
    });

    test('should reject login with wrong password', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'testuser@example.com',
            password: 'wrongpassword',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    test('should reject login with unregistered email', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'notfound@example.com',
            password: 'whatever',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });
});
