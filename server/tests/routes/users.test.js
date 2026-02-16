const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

describe('User Routes', () => {
    let adminCookie;
    let viewerCookie;

    beforeAll(async () => {
        // Create Admin
        await request(app).post('/api/auth/setup').send({
            username: 'admin',
            password: 'password123'
        });

        const adminLogin = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'password123'
        });
        adminCookie = adminLogin.headers['set-cookie'];

        // Create Viewer
        const viewerDetails = {
            username: 'viewer',
            name: 'Viewer',
            email: 'viewer@example.com',
            password: 'password123'
        };
        // Register returns pending
        await request(app).post('/api/auth/register').send(viewerDetails);
        const viewerUser = await User.findOne({ username: 'viewer' });
        await User.update(viewerUser._id, { status: 'active' });

        const viewerLogin = await request(app).post('/api/auth/login').send({
            username: 'viewer',
            password: 'password123'
        });
        viewerCookie = viewerLogin.headers['set-cookie'];
    });

    afterAll(async () => {
        await User.remove({});
    });

    describe('GET /api/users', () => {
        it('should allow admin to list users', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        });

        it('should deny non-admin users', async () => {
            const res = await request(app)
                .get('/api/users')
                .set('Cookie', viewerCookie);

            expect(res.statusCode).toEqual(403);
        });
    });

    // Add more tests for update/delete as needed
});
