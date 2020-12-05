import path = require('path');
import Config from '../env';

import swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition: any = {
  openapi: '3.0.0',
  info: {
    // API informations (required)
    title: 'Influx Node API', // Title (required)
    version: Config.version, // Version (required)
    description: 'Influx Node Docs', // Description (optional)
  },
  servers: [{ url: `http://${Config.host}:${Config.port}` }],
};

const options: any = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../../../src/**/**/*.ts')], // <-- not in the definition, but in the options
};

export const swaggerSpec: any = swaggerJSDoc(options);
