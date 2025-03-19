import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configure Airtable
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';

// Check for required environment variables
if (!apiKey) {
  console.error('AIRTABLE_API_KEY environment variable is not set');
}

if (!baseId) {
  console.error('AIRTABLE_BASE_ID environment variable is not set');
}

// Configure Airtable client
Airtable.configure({
  apiKey: apiKey,
});

// Only initialize if API key and base ID are available
let base: any = null;
let table: any = null;

if (apiKey && baseId) {
  try {
    base = Airtable.base(baseId);
    table = base.table(tableName);
  } catch (err) {
    console.error('Error initializing Airtable client:', err);
  }
}

export async function POST(request: Request) {
  try {
    // Check if Airtable is configured properly
    if (!apiKey || !baseId || !base || !table) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact the administrator.' 
        },
        { status: 500 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request body. Please send valid JSON.' 
        },
        { status: 400 }
      );
    }

    const { name, email, caseDescription, fileUrl, fileName } = body;
    
    console.log('Received form data:', { name, email, caseDescription, fileUrl, fileName });

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare record data
    const recordData: Record<string, any> = {
      'Name': name,
      'Email': email,
    };

    // Add optional fields if provided
    if (caseDescription) {
      recordData['Case Description'] = caseDescription;
    }

    // Add file attachment if provided
    if (fileUrl) {
      console.log('Adding attachment to Agreement field:', { url: fileUrl, filename: fileName || 'document.pdf' });
      
      recordData['Agreement'] = [
        {
          url: fileUrl,
          filename: fileName || 'document.pdf'
        }
      ];
    }

    console.log('Sending to Airtable:', recordData);

    // Try to create record in Airtable
    try {
      // Create record in Airtable
      const createdRecord = await table.create(recordData);
      
      console.log('Airtable response:', createdRecord);

      return NextResponse.json({
        success: true,
        message: 'Lead submitted successfully'
      });
    } catch (airtableError) {
      console.error('Airtable API error:', airtableError);
      
      // Check for specific Airtable errors and provide user-friendly messages
      const errorMessage = airtableError instanceof Error ? airtableError.message : 'Unknown error';
      
      if (errorMessage.includes('API Key')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Authentication error with database. Please contact the administrator.',
            details: 'Airtable API key issue'
          },
          { status: 500 }
        );
      } else if (errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'The system is experiencing high traffic. Please try again in a few minutes.',
            details: 'Airtable rate limit exceeded'
          },
          { status: 429 }
        );
      } else {
        throw airtableError; // Re-throw to be caught by outer catch block
      }
    }
  } catch (error) {
    console.error('Error creating record:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : '';
    
    console.error('Error details:', errorDetails);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit lead. Please try again later.',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
} 