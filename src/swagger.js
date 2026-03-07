// src/swagger.js
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Anime Review API",
    description: "API documentation for VyomRealm / Anime Project",
  },
  schemes: ["http", "https"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter your Bearer token in the format: Bearer <token>",
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

swaggerAutogen()(outputFile, routes, doc);
