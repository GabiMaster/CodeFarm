const admin = require('firebase-admin');
const environment = require('./environment');

if (!admin.apps.length) {
  const serviceAccount = require(`../../${environment.CREDENTIALS_PATH_FILE_NAME}`);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: environment.RTDB_FIREBASE_DATABASE_URL,
    storageBucket: environment.DB_BUCKET_NAME
  });
}

// Conectar a emuladores en desarrollo
if (environment.NODE_ENV === 'dev' && process.env.FUNCTIONS_EMULATOR) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = '127.0.0.1:9000';
  console.log('Conectado a emuladores locales');
}

const auth = admin.auth();
const db = admin.database();
const bucket = admin.storage().bucket();

module.exports = { auth, db, bucket, admin };