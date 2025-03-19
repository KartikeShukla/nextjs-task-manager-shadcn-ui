"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Circle, Loader2, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LeadsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    file?: string;
    general?: string;
  }>({});
  
  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      file?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const uploadFile = async () => {
    if (!file) {
      setErrors(prev => ({ ...prev, file: "No file selected" }));
      return null;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: "File size exceeds 10MB limit" }));
      toast.error("File size exceeds 10MB limit");
      return null;
    }
    
    setIsUploading(true);
    setErrors(prev => ({ ...prev, file: undefined }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log("Uploading file:", file.name);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'File upload failed');
      }
      
      console.log("Upload successful:", data);
      
      setFileUrl(data.url);
      toast.success("File uploaded successfully");
      return {
        url: data.url,
        fileName: data.fileName
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      setErrors(prev => ({ ...prev, file: errorMessage }));
      toast.error('Failed to upload file. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let fileData = null;
      
      // Upload file if selected but not yet uploaded
      if (file && !fileUrl) {
        fileData = await uploadFile();
        if (!fileData) {
          setIsSubmitting(false);
          return;
        }
      } else if (file && fileUrl) {
        fileData = {
          url: fileUrl,
          fileName: file.name
        };
      }
      
      const formData = {
        name,
        email,
        caseDescription,
        ...(fileData ? {
          fileUrl: fileData.url,
          fileName: fileData.fileName
        } : {})
      };
      
      console.log("Submitting form data:", formData);
      
      // Submit form data with file URL if available
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        toast.success("Your information has been submitted successfully");
        handleClearForm();
      } else {
        throw new Error(data.error || data.details || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit form";
      setErrors(prev => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Clear file error if present
      setErrors(prev => ({ ...prev, file: undefined }));
      
      console.log("File selected:", selectedFile.name);
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileUrl(null); // Reset file URL when a new file is selected
      
      // Check file size
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: "File size exceeds 10MB limit" }));
        toast.error("File size exceeds 10MB limit");
      }
    }
  };

  const handleClearForm = () => {
    setName("");
    setEmail("");
    setCaseDescription("");
    setFile(null);
    setFileName(null);
    setFileUrl(null);
    setErrors({});
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
                  className={`w-full ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

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
                  className={`w-full ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1 flex items-center">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

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
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="agreement" className="block text-sm font-medium text-gray-700">
                  Supporting Documents (Agreement)
                </label>
                <div className={`border ${errors.file ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} rounded-md p-10 text-center`}>
                  {fileName ? (
                    <div className="flex flex-col items-center justify-center text-sm">
                      <p className="mb-2">File selected: <span className="font-medium">{fileName}</span></p>
                      <div className="flex space-x-3">
                        {!fileUrl && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={uploadFile}
                            disabled={isSubmitting || isUploading}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </>
                            )}
                          </Button>
                        )}
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setFile(null);
                            setFileName(null);
                            setFileUrl(null);
                            setErrors(prev => ({ ...prev, file: undefined }));
                          }}
                          disabled={isSubmitting || isUploading}
                        >
                          Remove
                        </Button>
                      </div>
                      {fileUrl && (
                        <p className="mt-2 text-green-600 text-xs">
                          ✓ File uploaded successfully and will be attached to your submission
                        </p>
                      )}
                      {errors.file && (
                        <p className="mt-2 text-red-600 text-xs flex items-center justify-center">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          {errors.file}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-sm text-gray-500">
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