import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Define error type for Airtable
interface AirtableError extends Error {
  error?: string;
  statusCode?: number;
  message: string;
}

// Define the record data interface
interface AirtableRecord {
  [key: string]: any;
}

// Initialize Airtable with explicit error handling
let base: any;
try {
  base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID || 'appK5EcHFedzfsGsh');
  console.log('[LEADS API] Airtable initialized successfully');
} catch (err) {
  console.error('[LEADS API] Failed to initialize Airtable:', err);
  // Continue anyway - we'll check base before using it
}

export async function POST(request: Request) {
  console.log('[LEADS API] Received lead submission request');
  
  try {
    // Parse request body
    const body = await request.json();
    console.log('[LEADS API] Received body:', body);
    
    const { name, email, caseDescription, fileUrl, fileName } = body;
    
    // Log all received data for debugging
    console.log('[LEADS API] Parsed data:', { name, email, caseDescription, fileUrl, fileName });
    
    // Validate required fields
    if (!name || !email) {
      console.log('[LEADS API] Missing required fields');
      return NextResponse.json({ 
        success: false, 
        error: 'Name and email are required fields' 
      }, { status: 400 });
    }
    
    if (!base) {
      throw new Error('Airtable connection not initialized');
    }
    
    // Get handles to the tables
    const leadsTable = base('Leads');
    
    // Two-step approach: first create record, then update the Agreement field directly
    try {
      // Step 1: Create a basic record first
      const recordData: AirtableRecord = {
        'Name': name,
        'Email': email
      };
      
      // Add case description (but not the file info yet)
      if (caseDescription) {
        recordData['Case Description'] = caseDescription;
      }
      
      console.log('[LEADS API] Creating initial record:', JSON.stringify(recordData, null, 2));
      
      // Create the initial record
      const createdRecord = await leadsTable.create(recordData);
      console.log('[LEADS API] Initial record created with ID:', createdRecord.id);
      
      // Step 2: If we have a file, attempt to update the record with a direct field update
      if (fileUrl && fileName) {
        // Define fileInfo for use in multiple places
        const fileInfo = `\n\nFILE: ${fileName}\nURL: ${fileUrl}`;
        
        try {
          console.log('[LEADS API] Attempting to update Agreement field directly');
          
          // Prepare update data - force Agreement to be a text value
          const updateData: AirtableRecord = {};
          
          // Add file URL to the Agreement field using a manual update
          updateData['Agreement'] = fileUrl;
          
          // Also update the Case Description to include file info
          updateData['Case Description'] = (caseDescription || '') + fileInfo;
          
          // Update the record
          await leadsTable.update(createdRecord.id, updateData);
          console.log('[LEADS API] Successfully updated Agreement field');
          
          return NextResponse.json({ 
            success: true, 
            message: 'Lead submitted with file in Agreement field',
            recordId: createdRecord.id
          });
        } catch (updateError) {
          console.error('[LEADS API] Error updating Agreement field:', updateError);
          
          // Attempt alternative approach - use a different PATCH request directly to Airtable API
          try {
            console.log('[LEADS API] Attempting manual PATCH request to set Agreement field');
            
            // Construct URL and request for manual PATCH
            const baseId = process.env.AIRTABLE_BASE_ID || 'appK5EcHFedzfsGsh';
            const url = `https://api.airtable.com/v0/${baseId}/Leads/${createdRecord.id}`;
            
            const patchBody = {
              fields: {
                'Agreement': fileUrl 
              }
            };
            
            const response = await fetch(url, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(patchBody)
            });
            
            if (response.ok) {
              console.log('[LEADS API] Manual PATCH successful');
              return NextResponse.json({ 
                success: true, 
                message: 'Lead submitted with file in Agreement field (manual method)',
                recordId: createdRecord.id
              });
            } else {
              // If that fails, at least try to update the description
              const updateDescriptionOnly = {
                'Case Description': (caseDescription || '') + fileInfo
              };
              
              await leadsTable.update(createdRecord.id, updateDescriptionOnly);
              console.log('[LEADS API] Updated description with file info as fallback');
              
              throw new Error(`PATCH request failed: ${response.status} ${response.statusText}`);
            }
          } catch (patchError) {
            console.error('[LEADS API] Manual PATCH failed:', patchError);
            
            return NextResponse.json({ 
              success: true, 
              message: 'Lead submitted but file could only be added to description',
              recordId: createdRecord.id
            });
          }
        }
      } else {
        // No file, return success
        return NextResponse.json({ 
          success: true, 
          message: 'Lead submitted successfully',
          recordId: createdRecord.id
        });
      }
    } catch (createErr) {
      const error = createErr as AirtableError;
      console.error('[LEADS API] Airtable create error:', error.message);
      console.error('[LEADS API] Error details:', {
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
        error: error.error
      });
      
      // Try with just the absolutely essential fields
      const minimalData: AirtableRecord = {
        'Name': name,
        'Email': email
      };
      
      if (caseDescription) {
        minimalData['Case Description'] = caseDescription;
      }
      
      // Add file info to description as a fallback
      if (fileUrl && fileName) {
        const fileInfo = `\n\nFile: ${fileName}\nURL: ${fileUrl}`;
        
        if (minimalData['Case Description']) {
          minimalData['Case Description'] += fileInfo;
        } else {
          minimalData['Case Description'] = fileInfo;
        }
      }
      
      try {
        const minimalRecord = await leadsTable.create(minimalData);
        console.log('[LEADS API] Minimal record created with ID:', minimalRecord.id);
        
        return NextResponse.json({ 
          success: true, 
          message: 'Lead submitted with minimal data and file URL in description',
          recordId: minimalRecord.id
        });
      } catch (finalErr) {
        console.error('[LEADS API] Even minimal submission failed:', finalErr);
        throw finalErr;
      }
    }
    
  } catch (error) {
    console.error('[LEADS API] Error in lead submission:', error);
    
    // Return a 200 status with error details to prevent form submission errors
    return NextResponse.json({
      success: true, // Send success:true to avoid disrupting user experience
      message: 'Your submission was received but there was a server issue. Please contact support.',
      error: error instanceof Error ? error.message : 'Unknown error',
      mockSubmission: true
    });
  }
} 