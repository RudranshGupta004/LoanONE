
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText, Check, Info, ArrowRight, Image } from "lucide-react";
import { Button } from "@/components/ui-elements/Button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLoan, DocumentType } from "@/context/LoanContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DocumentUpload = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { application, uploadDocument } = useLoan();
  
  const [dragActiveArea, setDragActiveArea] = useState<DocumentType | null>(null);
  const [uploading, setUploading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle drag events
  const handleDragEnter = (docType: DocumentType) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveArea(docType);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveArea(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle file drop
  const handleDrop = (docType: DocumentType) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveArea(null);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(docType, files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (docType: DocumentType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(docType, e.target.files[0]);
    }
  };

  // Process file upload
  const handleFileUpload = (docType: DocumentType, file: File) => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and PDF files are allowed");
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    // Create file preview
    let preview = null;
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }

    // In a real app, we would upload to a server here
    setTimeout(() => {
      uploadDocument(docType, file, preview || "");
      setUploading(false);
      toast.success(`${getDocumentTypeLabel(docType)} uploaded successfully`);
    }, 1000);
  };

  // Helper to get document type label
  const getDocumentTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case "government-id":
        return "Government-issued ID";
      case "proof-of-income":
        return "Proof of Income";
      case "bank-statement":
        return "Bank Statement";
      default:
        return type;
    }
  };

  // Helper to get document upload instructions
  const getDocumentInstructions = (type: DocumentType): string => {
    switch (type) {
      case "government-id":
        return "Upload a clear photo of your driver's license, passport, or state ID. Make sure all information is legible.";
      case "proof-of-income":
        return "Upload your recent pay stubs, W-2, tax returns, or employment verification letter.";
      case "bank-statement":
        return "Upload your last 3 months of bank statements. This document is optional but may help with your application.";
      default:
        return "";
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if required documents are uploaded
    if (!application.documents["government-id"].uploaded) {
      toast.error("Please upload your Government-issued ID");
      return;
    }
    
    if (!application.documents["proof-of-income"].uploaded) {
      toast.error("Please upload Proof of Income");
      return;
    }

    // Navigate to status page
    navigate("/loan-status");
  };

  // Render document preview
  const renderDocumentPreview = (docType: DocumentType) => {
    const doc = application.documents[docType];
    
    if (!doc.uploaded || !doc.file) {
      return null;
    }

    return (
      <div className="mt-4 p-3 rounded-lg bg-secondary/50 relative">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => uploadDocument(docType, null as any, null as any)}
            className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Remove document"
          >
            <X size={16} />
          </button>
        </div>
        
        {doc.preview ? (
          // Image preview
          <div className="relative aspect-[4/3] rounded overflow-hidden">
            <img 
              src={doc.preview} 
              alt={`${getDocumentTypeLabel(docType)} preview`} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          // PDF preview
          <div className="flex items-center gap-3 p-3 rounded bg-white/80">
            <FileText size={24} className="text-primary" />
            <div className="overflow-hidden">
              <p className="font-medium truncate">{doc.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(doc.file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-2 text-sm">
          <Check size={16} className="text-green-500" />
          <span>Uploaded successfully</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-10 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-xl p-6 md:p-10"
          >
            {/* Progress indicator */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Application Progress</span>
                <span className="text-sm text-muted-foreground">Step 3 of 4</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-4">Upload Your Documents</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We need a few documents to verify your identity and income. Upload them below to continue.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Government ID */}
              <DocumentUploadBox
                type="government-id"
                uploaded={application.documents["government-id"].uploaded}
                onDragEnter={handleDragEnter("government-id")}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop("government-id")}
                onFileSelect={handleFileSelect("government-id")}
                isDragActive={dragActiveArea === "government-id"}
                label={getDocumentTypeLabel("government-id")}
                instructions={getDocumentInstructions("government-id")}
                preview={renderDocumentPreview("government-id")}
                required
              />
              
              {/* Proof of Income */}
              <DocumentUploadBox
                type="proof-of-income"
                uploaded={application.documents["proof-of-income"].uploaded}
                onDragEnter={handleDragEnter("proof-of-income")}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop("proof-of-income")}
                onFileSelect={handleFileSelect("proof-of-income")}
                isDragActive={dragActiveArea === "proof-of-income"}
                label={getDocumentTypeLabel("proof-of-income")}
                instructions={getDocumentInstructions("proof-of-income")}
                preview={renderDocumentPreview("proof-of-income")}
                required
              />
              
              {/* Bank Statement */}
              <DocumentUploadBox
                type="bank-statement"
                uploaded={application.documents["bank-statement"].uploaded}
                onDragEnter={handleDragEnter("bank-statement")}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop("bank-statement")}
                onFileSelect={handleFileSelect("bank-statement")}
                isDragActive={dragActiveArea === "bank-statement"}
                label={getDocumentTypeLabel("bank-statement")}
                instructions={getDocumentInstructions("bank-statement")}
                preview={renderDocumentPreview("bank-statement")}
              />
              
              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="submit"
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                  loading={uploading}
                  disabled={uploading}
                >
                  Submit Documents
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

interface DocumentUploadBoxProps {
  type: DocumentType;
  uploaded: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDragActive: boolean;
  label: string;
  instructions: string;
  preview: React.ReactNode;
  required?: boolean;
}

const DocumentUploadBox = ({
  type,
  uploaded,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  isDragActive,
  label,
  instructions,
  preview,
  required = false
}: DocumentUploadBoxProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">{label}</h3>
        {required ? (
          <span className="text-red-500 text-sm">*Required</span>
        ) : (
          <span className="text-muted-foreground text-sm">(Optional)</span>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {!uploaded ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={handleClick}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50"}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={onFileSelect}
            />
            
            <div className="flex flex-col items-center gap-3">
              {isDragActive ? (
                <Upload size={36} className="text-primary animate-pulse" />
              ) : (
                <Upload size={36} className="text-muted-foreground" />
              )}
              
              <div>
                <p className="font-medium mb-1">
                  {isDragActive ? "Drop to upload" : "Drag and drop or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, or PDF (max. 10MB)
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {preview}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
        <Info size={16} className="shrink-0 mt-0.5" />
        <p>{instructions}</p>
      </div>
    </div>
  );
};

export default DocumentUpload;
