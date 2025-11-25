const admin = require('firebase-admin');
const env = require('./environment');

// Inicializar Firebase Admin SDK (Singleton)
if (!admin.apps.length) {
  // Cargar credenciales directamente con ruta relativa
  const serviceAccount = require('../../permissions/codefarm-22225-firebase-adminsdk-fbsvc-fe7f645813.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: env.RTDB_FIREBASE_DATABASE_URL,
    storageBucket: env.DB_BUCKET_NAME
  });
}

const db = admin.database();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  auth,
  storage
};