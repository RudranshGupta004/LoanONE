
import React, { createContext, useContext, useState, useReducer } from "react";

// Types for loan application
export type LoanPurpose = 
  | "Personal" 
  | "Business" 
  | "Education" 
  | "Home" 
  | "Auto" 
  | "Debt Consolidation" 
  | "Other";

export type EmploymentStatus = 
  | "Employed" 
  | "Self-Employed" 
  | "Unemployed" 
  | "Retired" 
  | "Student";

export type LoanStatus = 
  | "pending" 
  | "approved" 
  | "declined" 
  | "in-review";

// Document types
export type DocumentType = 
  | "government-id" 
  | "proof-of-income" 
  | "bank-statement";

export interface Document {
  type: DocumentType;
  file: File | null;
  preview: string | null;
  uploaded: boolean;
  verified: boolean;
}

// Application state
export interface LoanApplication {
  fullName: string;
  loanAmount: number;
  purpose: LoanPurpose;
  employmentStatus: EmploymentStatus;
  annualIncome: number;
  documents: {
    [key in DocumentType]: Document;
  };
  status: LoanStatus;
  approvedAmount?: number;
  terms?: string;
  reasonForDecline?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Initial application state
const initialApplication: LoanApplication = {
  fullName: "",
  loanAmount: 0,
  purpose: "Personal",
  employmentStatus: "Employed",
  annualIncome: 0,
  documents: {
    "government-id": {
      type: "government-id",
      file: null,
      preview: null,
      uploaded: false,
      verified: false
    },
    "proof-of-income": {
      type: "proof-of-income",
      file: null,
      preview: null,
      uploaded: false,
      verified: false
    },
    "bank-statement": {
      type: "bank-statement",
      file: null,
      preview: null,
      uploaded: false,
      verified: false
    }
  },
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date()
};

// Action types
type LoanAction = 
  | { type: "UPDATE_PERSONAL_INFO", payload: Partial<Pick<LoanApplication, "fullName" | "loanAmount" | "purpose" | "employmentStatus" | "annualIncome">> }
  | { type: "UPLOAD_DOCUMENT", payload: { type: DocumentType, file: File, preview: string } }
  | { type: "VERIFY_DOCUMENT", payload: { type: DocumentType, verified: boolean } }
  | { type: "UPDATE_STATUS", payload: { status: LoanStatus, details?: Partial<LoanApplication> } }
  | { type: "RESET_APPLICATION" };

// Reducer function
function loanReducer(state: LoanApplication, action: LoanAction): LoanApplication {
  switch (action.type) {
    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        ...action.payload,
        updatedAt: new Date()
      };
    
    case "UPLOAD_DOCUMENT":
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.payload.type]: {
            ...state.documents[action.payload.type],
            file: action.payload.file,
            preview: action.payload.preview,
            uploaded: true,
            verified: false
          }
        },
        updatedAt: new Date()
      };
    
    case "VERIFY_DOCUMENT":
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.payload.type]: {
            ...state.documents[action.payload.type],
            verified: action.payload.verified
          }
        },
        updatedAt: new Date()
      };
    
    case "UPDATE_STATUS":
      return {
        ...state,
        ...action.payload.details,
        status: action.payload.status,
        updatedAt: new Date()
      };
    
    case "RESET_APPLICATION":
      return {
        ...initialApplication,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    
    default:
      return state;
  }
}

// Context type
interface LoanContextType {
  application: LoanApplication;
  updatePersonalInfo: (info: Partial<Pick<LoanApplication, "fullName" | "loanAmount" | "purpose" | "employmentStatus" | "annualIncome">>) => void;
  uploadDocument: (type: DocumentType, file: File, preview: string) => void;
  verifyDocument: (type: DocumentType, verified: boolean) => void;
  updateStatus: (status: LoanStatus, details?: Partial<LoanApplication>) => void;
  resetApplication: () => void;
  allDocumentsUploaded: boolean;
  allDocumentsVerified: boolean;
}

// Create context
const LoanContext = createContext<LoanContextType | undefined>(undefined);

// Provider component
export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [application, dispatch] = useReducer(loanReducer, initialApplication);

  // Helper to check if all documents are uploaded
  const allDocumentsUploaded = Object.values(application.documents)
    .filter(doc => doc.type !== "bank-statement") // Bank statement is optional
    .every(doc => doc.uploaded);

  // Helper to check if all uploaded documents are verified
  const allDocumentsVerified = Object.values(application.documents)
    .filter(doc => doc.uploaded)
    .every(doc => doc.verified);

  // Update personal information
  const updatePersonalInfo = (info: Partial<Pick<LoanApplication, "fullName" | "loanAmount" | "purpose" | "employmentStatus" | "annualIncome">>) => {
    dispatch({ type: "UPDATE_PERSONAL_INFO", payload: info });
  };

  // Upload a document
  const uploadDocument = (type: DocumentType, file: File, preview: string) => {
    dispatch({ type: "UPLOAD_DOCUMENT", payload: { type, file, preview } });
  };

  // Verify a document
  const verifyDocument = (type: DocumentType, verified: boolean) => {
    dispatch({ type: "VERIFY_DOCUMENT", payload: { type, verified } });
  };

  // Update application status
  const updateStatus = (status: LoanStatus, details?: Partial<LoanApplication>) => {
    dispatch({ type: "UPDATE_STATUS", payload: { status, details } });
  };

  // Reset the application
  const resetApplication = () => {
    dispatch({ type: "RESET_APPLICATION" });
  };

  return (
    <LoanContext.Provider
      value={{
        application,
        updatePersonalInfo,
        uploadDocument,
        verifyDocument,
        updateStatus,
        resetApplication,
        allDocumentsUploaded,
        allDocumentsVerified
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

// Custom hook for using the loan context
export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error("useLoan must be used within a LoanProvider");
  }
  return context;
};
