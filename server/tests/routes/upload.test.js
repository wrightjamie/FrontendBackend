const request = require('supertest');
const app = require('../../index');
const path = require('path');
const fs = require('fs');
const User = require('../../models/User');
const Media = require('../../models/Media');

describe('Upload Routes', () => {
    let adminCookie;
    const TEST_UPLOAD_DIR = path.join(__dirname, '../../tests/uploads');

    // Create a dummy image buffer (small 1x1 png)
    const dummyImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwMTQAAAABJRU5ErkJggg==', 'base64');

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

        // Ensure test dir exists/clean
        if (fs.existsSync(TEST_UPLOAD_DIR)) {
            fs.rmSync(TEST_UPLOAD_DIR, { recursive: true, force: true });
        }
    });

    afterAll(() => {
        // Cleanup test uploads
        if (fs.existsSync(TEST_UPLOAD_DIR)) {
            fs.rmSync(TEST_UPLOAD_DIR, { recursive: true, force: true });
        }
    });

    beforeEach(async () => {
        await Media.remove({});
    });

    describe('POST /api/upload', () => {
        it('should upload an image and generate thumbnails', async () => {
            const res = await request(app)
                .post('/api/upload')
                .set('Cookie', adminCookie)
                .attach('image', dummyImage, 'test-image.png');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('filename');
            expect(res.body.variants).toHaveProperty('sm');
            expect(res.body.variants).toHaveProperty('md');

            // Verify file existence
            const filePath = path.join(TEST_UPLOAD_DIR, res.body.filename);
            expect(fs.existsSync(filePath)).toBe(true);

            // Verify thumb existence
            const thumbName = `thumb-${res.body.filename}`;
            const thumbPath = path.join(TEST_UPLOAD_DIR, 'thumbs', thumbName);
            expect(fs.existsSync(thumbPath)).toBe(true);
        });

        it('should reject non-image files', async () => {
            const res = await request(app)
                .post('/api/upload')
                .set('Cookie', adminCookie)
                .attach('image', Buffer.from('text content'), 'test.txt');

            // Multer filter error handler usually returns 400 or 500 depending on implementation
            // The code returns 400 with message
            expect(res.statusCode).not.toEqual(200);
        });
    });

    describe('DELETE /api/upload/:id', () => {
        it('should delete media and files', async () => {
            // Upload first
            const uploadRes = await request(app)
                .post('/api/upload')
                .set('Cookie', adminCookie)
                .attach('image', dummyImage, 'delete-me.png');

            const mediaId = uploadRes.body._id;
            const filename = uploadRes.body.filename;

            // Delete
            const res = await request(app)
                .delete(`/api/upload/${mediaId}`)
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);

            // Verify DB removal
            const check = await Media.findOne(mediaId);
            expect(check).toBeNull();

            // Verify File removal
            const filePath = path.join(TEST_UPLOAD_DIR, filename);
            expect(fs.existsSync(filePath)).toBe(false);
        });
    });

    describe('POST /api/upload/regenerate-thumbs', () => {
        it('should regenerate thumbnails', async () => {
            // Upload first
            await request(app)
                .post('/api/upload')
                .set('Cookie', adminCookie)
                .attach('image', dummyImage, 'regen.png');

            const res = await request(app)
                .post('/api/upload/regenerate-thumbs')
                .set('Cookie', adminCookie);

            expect(res.statusCode).toEqual(200);
            expect(res.body.results.success).toBeGreaterThan(0);
        });
    });
});
