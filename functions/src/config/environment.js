let nodeEnv = process.env.NODE_ENV || 'dev';

try {
  const functions = require('firebase-functions');
  if (functions.config && functions.config().environment && functions.config().environment.node_env) {
    nodeEnv = functions.config().environment.node_env;
  }
} catch (_error) {
  console.log('functions.config() no disponible en este entorno, usando NODE_ENV');
}

console.log('nodeEnv:', nodeEnv);

let environmentFile;
switch (nodeEnv) {
  case 'production':
  case 'prod':
    environmentFile = '.env';
    break;
  case 'dev':
    environmentFile = '.env.dev';
    break;
  case 'test':
    environmentFile = '.env.test';
    break;
  default:
    environmentFile = '.env.dev';
    break;
}

console.log('Cargando archivo:', environmentFile);

// Cargar variables con override para sobreescribir .env vacío
const result = require('dotenv').config({ path: environmentFile, override: true });

if (result.error) {
  console.error('Error cargando archivo .env:', result.error);
} else {
  console.log('Variables cargadas correctamente');
}

module.exports = {
  NODE_ENV: nodeEnv,
  WEB_API_KEY: process.env.WEB_API_KEY,
  URL_APP: process.env.URL_APP,
  CREDENTIALS_FILE_NAME: process.env.CREDENTIALS_FILE_NAME,
  RTDB_FIREBASE_DATABASE_URL: process.env.RTDB_FIREBASE_DATABASE_URL,
  DB_BUCKET_NAME: process.env.DB_BUCKET_NAME,
  CREDENTIALS_PATH_FILE_NAME: process.env.CREDENTIALS_PATH_FILE_NAME
};