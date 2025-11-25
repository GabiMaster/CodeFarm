const functions = require('firebase-functions');
const express = require('express');

// Crear apps de Express para cada módulo
const authApp = express();
const projectsApp = express();
const filesApp = express();

// Middleware para parsear JSON
authApp.use(express.json());
projectsApp.use(express.json());
filesApp.use(express.json());

// Importar módulos
const authModule = require('./src/modules/auth');
const projectsModule = require('./src/modules/projects');
const filesModule = require('./src/modules/files');

// Usar los routers
authApp.use('/', authModule);
projectsApp.use('/', projectsModule);
filesApp.use('/', filesModule);

// Exportar Cloud Functions
exports.auth = functions.https.onRequest(authApp);
exports.projects = functions.https.onRequest(projectsApp);
exports.files = functions.https.onRequest(filesApp);