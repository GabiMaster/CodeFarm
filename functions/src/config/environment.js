let nodeEnv = process.env.NODE_ENV || 'default';

try {
  const functions = require('firebase-functions');
  if (functions.config && functions.config().environment && functions.config().environment.node_env) {
    nodeEnv = functions.config().environment.node_env;
  }
} catch (_error) {
  // Estamos en v2 o local - ignoramos
  console.log('functions.config() no disponible en este entorno, usando NODE_ENV');
}

console.log('nodeEnv:', nodeEnv);

let environmentFile;
switch (nodeEnv) {
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
    environmentFile = '.env.test';
    break;
}

// Cargar variables desde el archivo correspondiente
require('dotenv').config({ path: environmentFile });

module.exports = {
  NODE_ENV: nodeEnv,
  URL_APP: process.env.URL_APP,
  CREDENTIALS_FILE_NAME: process.env.CREDENTIALS_FILE_NAME,
  RTDB_FIREBASE_DATABASE_URL: process.env.RTDB_FIREBASE_DATABASE_URL,
  DB_BUCKET_NAME: process.env.DB_BUCKET_NAME,
  CREDENTIALS_PATH_FILE_NAME: process.env.CREDENTIALS_PATH_FILE_NAME
};