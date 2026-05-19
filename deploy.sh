#!/bin/bash

# Deploy script for Firebase without gcloud
# Usage: ./deploy.sh

export GOOGLE_APPLICATION_CREDENTIALS="firebase-config.json"

# Install dependencies
npm install

# Deploy to Firebase
npx firebase-tools deploy --token $(node -e "
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-config.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'alcura-id'
});
(async () => {
  const credential = admin.credential.cert(serviceAccount);
  const token = await credential.getAccessToken();
  console.log(token.access_token);
})();
")
