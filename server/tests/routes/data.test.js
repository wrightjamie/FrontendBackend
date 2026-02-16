const request = require('supertest');
const app = require('../../index');
const DataType = require('../../models/DataType');
const DataEntity = require('../../models/DataEntity');
const User = require('../../models/User');

describe('Data Routes', () => {
    let adminCookie;
    let typeId;

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

    beforeEach(async () => {
        await DataType.remove({});
        await DataEntity.remove({});

        // Create a basic Data Type
        const type = await DataType.create({
            name: 'Test Type',
            slug: 'test-type',
            fields: [{ name: 'title', type: 'text', label: 'Title' }],
            permissions: { canAdd: true, canEdit: true, canDelete: true }
        });
        typeId = type._id;
    });

    describe('GET /api/data/types', () => {
        it('should list all data types', async () => {
            const res = await request(app).get('/api/data/types');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].slug).toBe('test-type');
        });
    });

    describe('POST /api/data/entities/:typeId', () => {
        it('should create a new entity', async () => {
            const res = await request(app)
                .post(`/api/data/entities/${typeId}`)
                .set('Cookie', adminCookie)
                .send({
                    title: 'Test Entity'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toBe('Test Entity');
            expect(res.body.typeId).toBe(typeId);
        });
    });

    describe('GET /api/data/entities/:typeId', () => {
        it('should list entities for a type', async () => {
            // Create one first
            await DataEntity.create(typeId, { title: 'Existing Entity' });

            const res = await request(app)
                .get(`/api/data/entities/${typeId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe('Existing Entity');
        });
    });
});
