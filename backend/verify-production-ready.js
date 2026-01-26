#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * Run this before deploying to Render
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [];
let allPassed = true;

function check(name, condition, message) {
  const passed = condition();
  checks.push({ name, passed, message });
  if (!passed) allPassed = false;
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed && message) console.log(`   → ${message}`);
}

console.log('\n🔍 Verifying Production Readiness...\n');

// Check 1: package.json exists and has correct start script
check(
  'package.json has production start script',
  () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    return pkg.scripts?.start === 'node index.js';
  },
  'Start script should be "node index.js" not nodemon'
);

// Check 2: Entry file exists
check(
  'Entry file (index.js) exists',
  () => fs.existsSync(path.join(__dirname, 'index.js')),
  'index.js not found'
);

// Check 3: .env is gitignored
check(
  '.env is in .gitignore',
  () => {
    const gitignore = fs.readFileSync(path.join(__dirname, '.gitignore'), 'utf8');
    return gitignore.includes('.env');
  },
  '.env should be in .gitignore to prevent committing secrets'
);

// Check 4: dotenv is installed
check(
  'dotenv is installed',
  () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    return pkg.dependencies?.dotenv;
  },
  'Install dotenv: npm install dotenv'
);

// Check 5: Required dependencies
const requiredDeps = ['express', 'mongoose', 'cors', 'dotenv'];
check(
  'Required dependencies installed',
  () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    return requiredDeps.every(dep => pkg.dependencies?.[dep]);
  },
  `Missing dependencies: ${requiredDeps.join(', ')}`
);

// Check 6: Health route exists
check(
  'Health check route exists',
  () => {
    const indexContent = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
    return indexContent.includes('/api/health') || indexContent.includes('/health');
  },
  'Add a health check route for monitoring'
);

// Check 7: PORT uses environment variable
check(
  'PORT uses process.env.PORT',
  () => {
    const indexContent = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
    return indexContent.includes('process.env.PORT');
  },
  'Use process.env.PORT for dynamic port assignment'
);

// Check 8: CORS is configured
check(
  'CORS is configured',
  () => {
    const indexContent = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
    return indexContent.includes('cors(');
  },
  'Configure CORS for frontend access'
);

// Check 9: No console.log of secrets
check(
  'No secrets logged in code',
  () => {
    const indexContent = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
    const dangerousPatterns = [
      /console\.log.*process\.env\./i,
      /console\.log.*JWT_SECRET/i,
      /console\.log.*MONGO_URI/i,
    ];
    return !dangerousPatterns.some(pattern => pattern.test(indexContent));
  },
  'Remove console.log statements that expose secrets'
);

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All checks passed! Ready for Render deployment.');
  console.log('\nNext steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Create a new Web Service on Render');
  console.log('3. Set Root Directory to: Backend');
  console.log('4. Set Build Command to: npm install');
  console.log('5. Set Start Command to: npm start');
  console.log('6. Add environment variables from .env');
  console.log('7. Deploy!');
} else {
  console.log('❌ Some checks failed. Fix the issues above before deploying.');
  process.exit(1);
}
console.log('='.repeat(50) + '\n');
