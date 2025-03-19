"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LeadsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error("Name and email are required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For now, just handle the basic form data without actual file upload
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          caseDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Your information has been submitted successfully");
        handleClearForm();
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleClearForm = () => {
    setName("");
    setEmail("");
    setCaseDescription("");
    setFile(null);
    setFileName(null);
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
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input 
                  id="name"
                  placeholder="Enter your full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
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
                  Supporting Documents
                </label>
                <div className="border border-gray-200 rounded-md p-10 text-center bg-gray-50">
                  {fileName ? (
                    <div className="flex flex-col items-center justify-center text-sm">
                      <p className="mb-2">File selected: <span className="font-medium">{fileName}</span></p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setFileName(null);
                        }}
                        disabled={isSubmitting}
                      >
                        Remove file
                      </Button>
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
                        />
                      </label>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Please upload any relevant documents related to your case.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearForm}
                  className="text-blue-500 hover:bg-transparent hover:text-blue-600 flex items-center p-0"
                  disabled={isSubmitting}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear form
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800"
                  disabled={isSubmitting}
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