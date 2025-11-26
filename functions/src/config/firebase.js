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

const auth = admin.auth();
const db = admin.database();
const bucket = admin.storage().bucket();

module.exports = { auth, db, bucket, admin };