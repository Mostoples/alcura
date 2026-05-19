#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n📋 Firebase Setup Checker\n');

const checks = [
  {
    name: 'firebase-config.json',
    path: 'firebase-config.json',
    type: 'file'
  },
  {
    name: '.firebaserc',
    path: '.firebaserc',
    type: 'file'
  },
  {
    name: 'firebase.json',
    path: 'firebase.json',
    type: 'file'
  },
  {
    name: 'public directory',
    path: 'public',
    type: 'dir'
  },
  {
    name: 'package.json',
    path: 'package.json',
    type: 'file'
  }
];

let allGood = true;

checks.forEach(check => {
  const fullPath = path.join(__dirname, '..', check.path);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✓ ${check.name}`);
  } else {
    console.log(`✗ ${check.name} - MISSING`);
    allGood = false;
  }
});

console.log('\n');

if (allGood) {
  console.log('✓ All setup files present\n');
  console.log('Next steps:');
  console.log('1. npm install');
  console.log('2. Set GOOGLE_APPLICATION_CREDENTIALS=firebase-config.json');
  console.log('3. npx firebase-tools deploy\n');
} else {
  console.log('✗ Some files are missing\n');
}

process.exit(allGood ? 0 : 1);
