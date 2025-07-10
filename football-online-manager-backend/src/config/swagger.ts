import swaggerJsdoc from 'swagger-jsdoc';
import { ENV } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Football Online Manager API',
      version: '1.0.0',
      description: 'API documentation for Football Online Manager',
    },
    servers: [
      {
        url: `http://localhost:${ENV.PORT}/api`,
        description: 'Development server',
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
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts',
    './src/dtos/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 