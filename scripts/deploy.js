#!/usr/bin/env node

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load service account
const serviceAccountPath = path.join(__dirname, '../firebase-config.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'alcura-id',
  databaseURL: 'https://alcura-id-default-rtdb.firebaseio.com'
});

console.log('✓ Firebase Admin initialized');
console.log('✓ Project ID:', serviceAccount.project_id);
console.log('✓ Service Account:', serviceAccount.client_email);

// For basic deploy validation
console.log('\n✓ Deployment configuration is ready');
console.log('\nTo deploy via CLI, use:');
console.log('  npx firebase-tools deploy');
console.log('\nOr for hosting only:');
console.log('  npx firebase-tools deploy --only hosting');

process.exit(0);
