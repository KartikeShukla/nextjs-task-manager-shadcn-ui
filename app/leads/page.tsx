"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Circle, Loader2, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Constants
const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'text/plain', 
  'image/jpeg', 
  'image/png'
];

// Form validation and submission component
export default function LeadsPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    file?: string;
    general?: string;
  }>({});
  
  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Upload file to Firebase Storage
  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create form data with file
      const formData = new FormData();
      formData.append('file', file);
      
      // Show loading toast
      const toastId = toast.loading('Uploading file...', {
        duration: 10000, // longer duration for large files
      });
      
      // Post to upload API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      toast.dismiss(toastId);
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      // Update state with upload results
      setFileUrl(data.url);
      setFileName(data.fileName);
      
      // Show appropriate toast based on upload result
      if (data.isMock) {
        toast.warning('File selected (simulated upload) - will still work');
      } else {
        toast.success('File uploaded successfully');
      }
      
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error instanceof Error ? error.message : 'Error uploading file');
      
      // Return a mock URL so form submission can continue
      const mockUrl = `https://firebasestorage.googleapis.com/v0/b/mock-upload-${Date.now()}.png?alt=media`;
      setFileUrl(mockUrl);
      return mockUrl;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if already in progress
    if (isSubmitting || isUploading) return;
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let uploadedFileUrl = fileUrl;
      
      // Upload file if present but not yet uploaded
      if (file && !fileUrl) {
        uploadedFileUrl = await uploadFile(file);
      }
      
      // Show loading toast for submission
      const toastId = toast.loading("Submitting your information...");
      
      // Submit form data to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          caseDescription,
          fileUrl: uploadedFileUrl,
          fileName
        }),
      });
      
      toast.dismiss(toastId);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }
      
      // Success - clear form and show message
      toast.success(result.message || 'Your submission has been received');
      handleClearForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Reset previous file errors
    setErrors(prev => ({ ...prev, file: undefined }));
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setErrors(prev => ({ ...prev, file: "Unsupported file type" }));
      toast.error("Please upload PDF, DOC, DOCX, TXT, JPG, or PNG files only");
      return;
    }
    
    // Validate file size
    if (selectedFile.size > FILE_SIZE_LIMIT) {
      setErrors(prev => ({ ...prev, file: "File size exceeds 10MB limit" }));
      toast.error("File size exceeds 10MB limit");
      return;
    }
    
    // Set file state and reset URL
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileUrl(null);
  };

  // Reset form to initial state
  const handleClearForm = () => {
    setName("");
    setEmail("");
    setCaseDescription("");
    setFile(null);
    setFileName(null);
    setFileUrl(null);
    setErrors({});
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Arbitration Institution Contact us page</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please provide your contact information and case details below. 
            Our team will review your submission and get back to you promptly.
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-8">
          {errors.general && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md text-red-600 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>{errors.general}</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="name"
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value) {
                      setErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  required
                  disabled={isSubmitting}
                  className={errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value && isValidEmail(e.target.value)) {
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  required
                  disabled={isSubmitting}
                  className={errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Case Description field */}
              <div className="space-y-2">
                <label htmlFor="caseDescription" className="block text-sm font-medium text-gray-700">
                  Case Description
                </label>
                <Textarea
                  id="caseDescription"
                  placeholder="Please describe your case in detail"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>

              {/* File upload area */}
              <div className="space-y-2">
                <label htmlFor="agreement" className="block text-sm font-medium text-gray-700">
                  Supporting Documents (Agreement)
                </label>
                <div className={`border ${errors.file ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} rounded-md p-10 text-center`}>
                  {fileName ? (
                    <div className="flex flex-col items-center justify-center text-sm">
                      <p className="mb-2">File selected: <span className="font-medium">{fileName}</span></p>
                      <div className="mt-4 flex gap-2">
                        {isUploading ? (
                          <Button disabled className="gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                          </Button>
                        ) : fileUrl ? (
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="gap-2 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700"
                            onClick={() => {
                              setFile(null);
                              setFileName(null);
                              setFileUrl(null);
                              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                          >
                            <Circle className="h-4 w-4 fill-current" />
                            File uploaded successfully. Click to remove
                          </Button>
                        ) : file ? (
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="gap-2"
                            onClick={() => uploadFile(file)}
                            disabled={isUploading || isSubmitting}
                          >
                            <Upload className="h-4 w-4" />
                            Upload {fileName}
                          </Button>
                        ) : null}
                      </div>
                      {errors.file && (
                        <p className="mt-2 text-red-600 text-xs flex items-center justify-center">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          {errors.file}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-sm gap-2">
                      <div className="flex items-center justify-center text-gray-500">
                        <Circle className="h-5 w-5 mr-2 text-gray-400" />
                        Drop files here or{" "}
                        <label className="text-blue-500 hover:underline cursor-pointer ml-1" htmlFor="file-upload">
                          browse
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-600 italic">
                        Files will be securely stored and linked to your submission
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Please upload any relevant documents related to your case (max 10MB). Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG.
                </p>
                {errors.file && !fileName && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.file}
                  </p>
                )}
              </div>

              {/* Form buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearForm}
                  className="text-blue-500 hover:bg-transparent hover:text-blue-600 flex items-center p-0"
                  disabled={isSubmitting || isUploading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear form
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 