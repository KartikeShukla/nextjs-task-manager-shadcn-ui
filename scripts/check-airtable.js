// This script helps check your Airtable connection and lists your available bases
// Run with: node scripts/check-airtable.js

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

// Configure Airtable with your personal access token
Airtable.configure({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
});

async function listBases() {
  try {
    console.log('Checking Airtable connection...');
    console.log('Using token:', process.env.AIRTABLE_ACCESS_TOKEN.substring(0, 12) + '...');

    // Make a request to the meta API to list available bases
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bases: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('\nAvailable bases:');
    
    // List all bases with their IDs
    data.bases.forEach(base => {
      console.log(`- ${base.name}: ${base.id}`);
    });
    
    console.log('\nTo use a base, add its ID to .env.local as AIRTABLE_BASE_ID');
    console.log('For example: AIRTABLE_BASE_ID=app1234567890');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

listBases(); 