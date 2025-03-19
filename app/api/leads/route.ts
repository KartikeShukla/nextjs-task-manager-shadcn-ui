import Airtable from 'airtable';
import { NextResponse } from 'next/server';

// Configure Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID as string);

const table = base(process.env.AIRTABLE_TABLE_NAME as string);

export async function POST(request: Request) {
  try {
    const { name, email, caseDescription, fileUrl } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields' },
        { status: 400 }
      );
    }

    // Create a record in Airtable with exact field names
    const record = await table.create({
      'Name': name,
      'Email': email,
      'Case Description': caseDescription || '',
      // Note: Handling attachments properly would require uploading the file first
      // and then referencing the URL, which is beyond the scope of this example
      // 'Aggrement': fileUrl ? [{ url: fileUrl }] : [],
    });

    return NextResponse.json({ success: true, record: record.getId() }, { status: 201 });
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return NextResponse.json(
      { error: 'Failed to submit form to Airtable' },
      { status: 500 }
    );
  }
} 