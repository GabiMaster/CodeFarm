const functions = require('firebase-functions');
const express = require('express');

// Crear apps de Express para cada módulo
const authApp = express();

// Middleware para parsear JSON
authApp.use(express.json());

// Importar módulos
const authModule = require('./src/modules/auth');

// Usar los routers
authApp.use('/', authModule);

// Exportar Cloud Functions
exports.auth = functions.https.onRequest(authApp);