const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Importar módulos
const authModule = require('./src/modules/auth');
const projectsModule = require('./src/modules/projects');
const filesModule = require('./src/modules/files');
const usersModule = require('./src/modules/users');
const notificationsModule = require('./src/modules/notifications');

// Crear app Express
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Conectar rutas
app.use('/auth', authModule);
app.use('/projects', projectsModule);
app.use('/files', filesModule);
app.use('/users', usersModule);
app.use('/notifications', notificationsModule);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'CodeFarm API funcionando correctamente',
    endpoints: {
      auth: '/auth (register, login, change-password)',
      projects: '/projects (CRUD)',
      files: '/files (CRUD)',
      users: '/users (GET, PUT)',
      notifications: '/notifications (GET)'
    }
  });
});

// Exportar función única para Firebase
exports.api = functions.https.onRequest(app);