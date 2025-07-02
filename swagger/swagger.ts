import { type } from 'os';

const swaggerAutogen = require('swagger-autogen')({
  openapi: '3.0.0',
  autoHeaders: false,
});

const doc = {
  info: {
    title: 'Circle API',
    description: 'Welcome Circle API',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    '@schemas': {
      LoginDTO: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      RegisterDTO: {
        type: 'object',
        properties: {
          fullname: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      ForgotPasswordDTO: {
        type: 'object',
        properties: {
          email: { type: 'string' },
        },
      },
      UpdateUserProfileDTO: {
        type: 'object',
        properties: {
          fullname: { type: 'string' },
          username: { type: 'string' },
          bio: { type: 'string' },
          avatarUrl: { type: 'file' },
          bannerUrl: { type: 'file' },
        },
      },
      ResetPasswordDTO: {
        type: 'object',
        properties: {
          confirmpassword: { type: 'string' },
          newpassword: { type: 'string' },
        },
      },
      CreateThreadDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          images: {
            type: 'file',
          },
        },
      },
      UpdateThreadDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
          images: {
            type: 'file',
          },
        },
      },
      CreateReplyDTO: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
          },
        },
      },
    },
  },
  host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['src/app.ts'];
swaggerAutogen(outputFile, routes, doc);
