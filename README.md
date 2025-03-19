# Arbitration Institution Contact Form

A Next.js application with Airtable integration and Cloudinary file uploads.

## Features

- **Contact Form**: Clean, user-friendly contact form for arbitration inquiries
- **File Uploads**: Secure file uploads with Cloudinary integration
- **Airtable Integration**: All submissions stored in Airtable with file attachments

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root with the following variables:

```
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_TABLE_NAME=Leads

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Set up Cloudinary

1. Create a [Cloudinary account](https://cloudinary.com/) (free tier available)
2. From your dashboard, copy your Cloud Name, API Key, and API Secret
3. Add these to your `.env.local` file

### 5. Set up Airtable

1. Create an [Airtable account](https://airtable.com/) (free tier available)
2. Create a base with a table called "Leads"
3. Ensure the table has the following fields:
   - Name (text)
   - Email (text)
   - Case Description (text)
   - Aggrement (attachments)
4. Generate an API key from your Airtable account settings
5. Add the API key, Base ID, and table name to your `.env.local` file

### 6. Run the development server

```bash
npm run dev
```

Access the application at [http://localhost:3000](http://localhost:3000)

## Deployment

This application can be deployed on platforms like Vercel or Netlify. Ensure your environment variables are set up in your hosting platform.

## Technologies Used

- Next.js
- Airtable
- Cloudinary
- TailwindCSS
- shadcn/ui
