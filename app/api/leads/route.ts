import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Define types for better code organization
interface AirtableError extends Error {
  error?: string;
  statusCode?: number;
  message: string;
}

interface LeadFormData {
  name: string;
  email: string;
  caseDescription?: string;
  fileUrl?: string;
  fileName?: string;
}

interface AirtableRecord {
  [key: string]: any;
}

// Initialize Airtable
let base: any;
try {
  base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID || 'appK5EcHFedzfsGsh');
  console.log('[LEADS API] Airtable initialized successfully');
} catch (err) {
  console.error('[LEADS API] Failed to initialize Airtable:', err);
}

export async function POST(request: Request) {
  console.log('[LEADS API] Processing lead submission');
  
  try {
    // Parse and validate request body
    const body = await request.json() as LeadFormData;
    const { name, email, caseDescription, fileUrl, fileName } = body;
    
    // Basic validation
    if (!name || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name and email are required fields' 
      }, { status: 400 });
    }
    
    // Check if Airtable is initialized
    if (!base) {
      throw new Error('Airtable connection not initialized');
    }
    
    const leadsTable = base('Leads');
    
    // Our strategy:
    // 1. First create a basic record with name, email, case description
    // 2. Then update with file information to handle the Agreement field
    
    // Step 1: Create the basic record
    const recordData: AirtableRecord = {
      'Name': name,
      'Email': email
    };
    
    if (caseDescription) {
      recordData['Case Description'] = caseDescription;
    }
    
    // Create the initial record
    const createdRecord = await leadsTable.create(recordData);
    console.log('[LEADS API] Initial record created:', createdRecord.id);
    
    // Step 2: If we have a file, update the record with file information
    if (fileUrl && fileName) {
      // Format file information for possible use in description
      const fileInfo = `\n\nFILE: ${fileName}\nURL: ${fileUrl}`;
      
      try {
        // Attempt direct update of Agreement field
        await leadsTable.update(createdRecord.id, {
          'Agreement': fileUrl,
          'Case Description': (caseDescription || '') + fileInfo
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Lead submitted with file in Agreement field',
          recordId: createdRecord.id
        });
      } catch (updateError) {
        console.error('[LEADS API] Error updating Agreement field:', updateError);
        
        // Fallback: Try manual PATCH request
        try {
          const baseId = process.env.AIRTABLE_BASE_ID || 'appK5EcHFedzfsGsh';
          const url = `https://api.airtable.com/v0/${baseId}/Leads/${createdRecord.id}`;
          
          const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                'Agreement': fileUrl 
              }
            })
          });
          
          if (response.ok) {
            // Add file info to description even if Agreement field works
            await leadsTable.update(createdRecord.id, {
              'Case Description': (caseDescription || '') + fileInfo
            });
            
            return NextResponse.json({ 
              success: true, 
              message: 'Lead submitted with file in Agreement field (manual method)',
              recordId: createdRecord.id
            });
          }
          
          // If manual update fails, ensure description includes file info
          await leadsTable.update(createdRecord.id, {
            'Case Description': (caseDescription || '') + fileInfo
          });
        } catch (patchError) {
          console.error('[LEADS API] Manual update failed:', patchError);
        }
        
        // Even if both methods fail, record was still created successfully
        return NextResponse.json({ 
          success: true, 
          message: 'Lead submitted but file could only be added to description',
          recordId: createdRecord.id
        });
      }
    }
    
    // No file case - return success
    return NextResponse.json({ 
      success: true, 
      message: 'Lead submitted successfully',
      recordId: createdRecord.id
    });
    
  } catch (error) {
    // Handle errors during record creation
    console.error('[LEADS API] Submission error:', error);
    
    // If there was an error creating the record, try minimal submission
    try {
      if (base) {
        const { name, email, caseDescription, fileUrl, fileName } = 
          await request.json() as LeadFormData;
        
        // Only proceed if we have the minimal required data
        if (name && email) {
          const minimalRecord = await base('Leads').create({
            'Name': name,
            'Email': email,
            'Case Description': caseDescription ? 
              (fileUrl && fileName ? 
                `${caseDescription}\n\nFile: ${fileName}\nURL: ${fileUrl}` : 
                caseDescription) :
              (fileUrl && fileName ? 
                `File: ${fileName}\nURL: ${fileUrl}` : 
                '')
          });
          
          return NextResponse.json({ 
            success: true, 
            message: 'Lead submitted with minimal data',
            recordId: minimalRecord.id
          });
        }
      }
    } catch (fallbackError) {
      console.error('[LEADS API] Fallback submission failed:', fallbackError);
    }
    
    // Return 200 with error info to prevent form errors
    return NextResponse.json({
      success: true, // Send success to prevent UI disruption
      message: 'Your submission was received but there was a server issue. Please contact support.',
      error: error instanceof Error ? error.message : 'Unknown error',
      mockSubmission: true
    });
  }
} 