
const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
  info: {
    version: '3.0.0',  // by default: '1.0.0'
    title: 'SKLLUX API',
    description: 'The API for Skillux app'
  },
  components: {
    schemas: {
        User: {
          id: 2,
          $fullName: "John Doe",
          $username: "john12",
          $email: "john12@gmail.com",
          isAdmin: false,
          profilePicture: null,
          updatedAt: "2024-05-24T17:19:47.472Z",
          createdAt: "2024-05-24T17:19:47.472Z",
          profession: null,
          $password : "$2b$10$V7c9I6/P5nh79jfg7F8B9urb4K0wxpgR6rEIAKo9fny9F4f2T6OrW",
          $birth:"2011/12/23"
        },
        LoginDto: {
            $username: 'john12',
            $password: "passer123",
            email: 'john12@gmail.com'
        },
        LoginResponseDto:{
          success: "Login successful",
          user: {
            "id": 2,
            "fullName": "John Doe",
            "username": "john12",
            "email": "john12@gmail.com",
            "isAdmin": false,
            "profilePicture": null
          },
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJoZWxsZmVlZm8iLCJlbWFpbCI6Im91c3NleW5vdTc4MTIyN0BnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzE2NTY5OTYwLCJleHAiOjE3MTY1NzA4NjB9.B7zHEPJdosR0JAhHHtJpcYXPRvnfLxrNtqGJ48RVT0Y",
          expire: "15m"
        },
        RegisterDto:{
          username : "john12",
          fullName:"John Doe",
          password:"passer123",
          email:"john12@gmail.com",
          birth:"2012-04-04"
        },
        RegisterResponseDto:{
          success: "Registration successful",
          user: { "$ref": "#/components/schemas/User" }

        }
    }
  },
  host: 'localhost:5050'
};

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);