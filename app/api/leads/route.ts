import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configure Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID || '');
const table = base.table('Leads');

export async function POST(request: Request) {
  try {
    const { name, email, caseDescription, fileUrl, fileName } = await request.json();
    
    console.log('Received form data:', { name, email, caseDescription, fileUrl, fileName });

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
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
      console.log('Adding attachment to Aggrement field:', { url: fileUrl, filename: fileName || 'document.pdf' });
      
      recordData['Aggrement'] = [
        {
          url: fileUrl,
          filename: fileName || 'document.pdf'
        }
      ];
    }

    console.log('Sending to Airtable:', recordData);

    // Create record in Airtable
    const createdRecord = await table.create(recordData);
    
    console.log('Airtable response:', createdRecord);

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully'
    });
  } catch (error) {
    console.error('Error creating record:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : '';
    
    console.error('Error details:', errorDetails);
    
    return NextResponse.json(
      { error: 'Failed to submit lead', details: errorMessage },
      { status: 500 }
    );
  }
} 