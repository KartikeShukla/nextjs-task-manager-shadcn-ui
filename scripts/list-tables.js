// This script lists all tables in the specified base
// Run with: node scripts/list-tables.js

require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

// Configure Airtable with your personal access token
Airtable.configure({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
});

async function listTables() {
  try {
    console.log('Checking tables in base:', process.env.AIRTABLE_BASE_ID);

    // Make a request to the meta API to list tables in the base
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tables: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('\nAvailable tables:');
    
    // List all tables with their IDs
    data.tables.forEach(table => {
      console.log(`- ${table.name}`);
      console.log('  Fields:');
      table.fields.forEach(field => {
        console.log(`    - ${field.name} (${field.type})`);
      });
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

listTables(); 