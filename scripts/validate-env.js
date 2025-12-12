#!/usr/bin/env node

// Simple script to validate required environment variables
const fs = require('fs');
const path = require('path');

console.log('Validating environment configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️  Warning: .env file not found!');
  console.log('   Please create a .env file by copying .env.example:');
  console.log('   cp .env.example .env\n');
} else {
  console.log('✅ .env file found\n');
  
  // Read the .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  // Parse environment variables
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
  
  // Check required variables
  const requiredVars = ['HEYGEN_API_KEY', 'HEYGEN_AVATAR_ID'];
  const missingVars = requiredVars.filter(varName => !envVars[varName] || envVars[varName] === `your_${varName.toLowerCase()}_here`);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Warning: Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n   Please update your .env file with valid values.\n');
  } else {
    console.log('✅ All required environment variables are present\n');
  }
}

console.log('Validation complete.');