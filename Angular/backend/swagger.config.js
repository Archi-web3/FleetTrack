const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FleetTrack API',
            version: '1.0.0',
            description: 'API Documentation for FleetTrack & e-logbook applications',
            contact: {
                name: 'ACF Tech Team',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local Development Server',
            },
            {
                url: 'https://fleettrack-backend.vercel.app/api',
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js', './models/*.js', './index.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);
module.exports = specs;
