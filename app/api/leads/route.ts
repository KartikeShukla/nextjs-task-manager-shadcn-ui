import Airtable from 'airtable';
import { NextResponse } from 'next/server';

// Configure Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID as string);

const table = base(process.env.AIRTABLE_TABLE_NAME as string);

export async function POST(request: Request) {
  try {
    const { name, email, caseDescription, fileUrl, fileName } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields' },
        { status: 400 }
      );
    }

    // Prepare record data
    const recordData: any = {
      'Name': name,
      'Email': email,
      'Case Description': caseDescription || '',
    };

    // Add file attachment if provided
    if (fileUrl && fileName) {
      recordData['Aggrement'] = [
        {
          url: fileUrl,
          filename: fileName
        }
      ];
    }

    // Create a record in Airtable with exact field names
    const createdRecord = await table.create(recordData);

    return NextResponse.json({ 
      success: true, 
      message: 'Lead submitted successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return NextResponse.json(
      { error: 'Failed to submit form to Airtable' },
      { status: 500 }
    );
  }
} 