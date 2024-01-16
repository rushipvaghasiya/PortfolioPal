module.exports = {
  info: {
    title: 'PortfolioPal',
    version: '1.0.1',
    description: 'API documentation',
    contact: {
      email: 'rushipvaghasiya@gmail.com',
    },
  },
  host: 'localhost:8000',
  basePath: '/portfolio',
  apis: ['./src/component/**/*.route.js'],
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};
