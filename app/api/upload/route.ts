import { NextResponse } from 'next/server';

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png'
];

// Maximum file size for data URLs (1MB)
// Note: Data URLs have size limitations, especially with Airtable
const MAX_DATA_URL_SIZE = 1 * 1024 * 1024;

// Maximum file size for upload (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// In a real application, you would upload to a storage service like AWS S3,
// Google Cloud Storage, or Cloudinary. For this demo, we'll simulate file upload.
export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type. Please upload PDF, DOC, DOCX, TXT, JPG, or PNG files only.' 
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File size exceeds the 10MB limit' 
        },
        { status: 400 }
      );
    }

    console.log('Received file:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    });

    let publicUrl = "";
    
    // OPTION 1: For testing with SMALL files (under 1MB)
    // Convert the file to a data URL (only works for small files and certain types)
    // This allows testing without needing a file hosting service
    if (file.size <= MAX_DATA_URL_SIZE && (file.type.startsWith('image/') || file.type === 'text/plain')) {
      try {
        // Read the file contents
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Create a data URL
        publicUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
        console.log(`Created data URL for file (length: ${publicUrl.length} chars)`);
      } catch (err) {
        console.error("Error creating data URL:", err);
      }
    }
    
    // OPTION 2: For all other cases, use a fixed public URL
    // If data URL creation failed or file is too large, use a publicly accessible URL
    if (!publicUrl) {
      // This is a publicly accessible PDF that Airtable can access
      publicUrl = "https://web.stanford.edu/class/archive/cs/cs161/cs161.1168/lecture4.pdf";
      console.log(`Using fallback public URL: ${publicUrl}`);
    }

    // Return success with file details
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'File upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 