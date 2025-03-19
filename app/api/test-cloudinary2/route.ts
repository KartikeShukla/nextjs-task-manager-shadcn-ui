import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

export async function GET() {
  try {
    // Log the environment variables being used
    console.log('Cloudinary config being used (method 2):', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...' // Only log first few characters for security
    });

    // Configure Cloudinary with v1 method
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    // Try a basic operation
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.api.ping((error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful (method 2)',
      result
    });
  } catch (error) {
    console.error('Cloudinary test error (method 2):', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 