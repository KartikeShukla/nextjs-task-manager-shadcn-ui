"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Circle } from "lucide-react";

export default function LeadsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, caseDescription, file });
    // Handle form submission
  };

  const handleClearForm = () => {
    setName("");
    setEmail("");
    setCaseDescription("");
    setFile(null);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">New Leads</h1>
      <div className="border-t border-gray-200 mb-6"></div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input 
              id="name"
              placeholder="Enter name.." 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="caseDescription" className="block text-sm font-medium">
              Case Description
            </label>
            <Textarea
              id="caseDescription"
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="agreement" className="block text-sm font-medium">
              Agreement
            </label>
            <div className="border border-gray-200 rounded-md p-10 text-center">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Circle className="h-5 w-5 mr-2 text-gray-400" />
                Drop files here or{" "}
                <label className="text-blue-500 hover:underline cursor-pointer ml-1" htmlFor="file-upload">
                  browse
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearForm}
              className="text-blue-500 hover:bg-transparent hover:text-blue-600 flex items-center p-0"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear form
            </Button>
            <Button 
              type="submit"
              className="bg-gray-800 hover:bg-gray-700"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 