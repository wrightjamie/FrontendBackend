const request = require('supertest');
const app = require('../../index');
const SiteMeta = require('../../models/SiteMeta');
const User = require('../../models/User');

describe('Site Routes', () => {
    let adminCookie;

    beforeAll(async () => {
        // Setup Admin
        await User.remove({});
        await request(app).post('/api/auth/setup').send({
            username: 'admin',
            password: 'password123'
        });
        const loginRes = await request(app).post('/api/auth/login').send({
            username: 'admin',
            password: 'password123'
        });
        adminCookie = loginRes.headers['set-cookie'];
    });

    describe('GET /api/site/meta', () => {
        it('should return site metadata', async () => {
            const res = await request(app).get('/api/site/meta');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('title');
        });
    });

    describe('PUT /api/site/meta', () => {
        it('should allow admin to update metadata', async () => {
            const res = await request(app)
                .put('/api/site/meta')
                .set('Cookie', adminCookie)
                .send({
                    title: 'New Site Title'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('New Site Title');

            // Verify persistence
            const check = await request(app).get('/api/site/meta');
            expect(check.body.title).toBe('New Site Title');
        });

        it('should deny non-admin', async () => {
            const res = await request(app)
                .put('/api/site/meta')
                .send({
                    title: 'Hacker Title'
                });

            expect(res.statusCode).toEqual(401);
        });
    });
});
