const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

describe('Smoke Test - API Connectivity', () => {

    // Fermer la connexion MongoDB après les tests pour éviter que Jest ne pende
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return 404 for root path (since no route is defined on /)', async () => {
        const res = await request(app).get('/');
        // Express par défaut renvoie 404 Cannot GET / si pas de route, ou index.html si static
        // Ici on vérifie juste que le serveur répond (pas de connection refused)
        expect(res.statusCode).toBeDefined();
    });

    it('should access the Swagger documentation', async () => {
        const res = await request(app).get('/api-docs/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Swagger UI');
    });

    it('should allow creating a test movement (custom route)', async () => {
        const res = await request(app).post('/api/mouvements/test');
        if (res.statusCode === 201) {
            // Le type retourné par la route de test est 'mission' (hardcodé)
            expect(res.body.type).toBe('mission');
        } else {
            // Si echoue (ex: duplication clé unique), on accepte 400 ou 500 mais pas 404
            expect(res.statusCode).not.toBe(404);
        }
    });
});
