const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

describe('Auth Routes', () => {
    beforeEach(async () => {
        // Clear users before each test to ensure clean state
        await User.remove({});
    });

    describe('POST /api/auth/setup', () => {
        it('should create an admin user if none exists', async () => {
            const res = await request(app)
                .post('/api/auth/setup')
                .send({
                    username: 'admin',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.user.username).toBe('admin');
            expect(res.body.user.role).toBe('admin');
        });

        it('should fail if admin already exists', async () => {
            // Create initial admin
            await User.create({
                username: 'admin',
                password: 'password123',
                role: 'admin'
            });

            const res = await request(app)
                .post('/api/auth/setup')
                .send({
                    username: 'admin2',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toMatch(/setup already completed/i);
        });
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user with pending status', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.user.status).toBe('pending');
            // Check DB
            const user = await User.findOne({ username: 'testuser' });
            expect(user).toBeTruthy();
            expect(user.status).toBe('pending');
        });

        it('should fail if username already exists', async () => {
            await User.create({
                username: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    name: 'Test User 2',
                    email: 'test2@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toMatch(/username already exists/i);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            // Must create via route or bcrypt hash manually to match
            // Using route to ensure hashing is correct
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'loginuser',
                    name: 'Login User',
                    email: 'login@example.com',
                    password: 'password123'
                });

            // Activate user manually since register sets to pending
            const user = await User.findOne({ username: 'loginuser' });
            await User.update(user._id, { status: 'active' });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'loginuser',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.user.username).toBe('loginuser');
            // Check for cookie
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should fail if user is pending', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'pendinguser',
                    name: 'Pending User',
                    email: 'pending@example.com',
                    password: 'password123'
                });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'pendinguser',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toMatch(/pending admin approval/i);
        });
    });
});
