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

// Maximum file size (10MB)
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

    // In a real app, you would upload the file to a storage service (S3, Firebase, etc.)
    // and get back a URL. For this demo, we'll simulate that with a fake URL.
    
    // Generate a URL that would be accessible by Airtable
    // In production, this would be a real publicly accessible URL
    const timestamp = Date.now();
    const publicUrl = `https://example.com/uploads/${timestamp}_${encodeURIComponent(file.name)}`;
    
    console.log(`File would be uploaded to: ${publicUrl}`);

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