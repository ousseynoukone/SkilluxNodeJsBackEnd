// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');


// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'SKILLUX API',
//       version: '1.0.0',
//       description: 'API FOR SKILLUX APP',
//     },
//     servers: [
//       {
//         url: 'http://localhost:5050/api/v1',
//       },
//     ],
//   },
//   apis: ['./src/controllers/auth/*.js'], // Path to the API route files
// };

// const swaggerSpec = swaggerJSDoc(options);

// const swaggerDocs = (app) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// };

// module.exports = swaggerDocs;





const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'SKLLUX API',
    description: 'The API for Skillux app'
  },
  components: {
    schemas: {
        LoginDto: {
            $username: 'John Doe',
            $password: "passer123",
            email: 'test@gmail.com'
        },
    }
  },
  host: 'localhost:5050'
};

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);