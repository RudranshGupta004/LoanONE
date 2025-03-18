
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle, ArrowRight, MessageSquare, Download, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui-elements/Button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLoan, LoanStatus as LoanStatusType } from "@/context/LoanContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LoanStatus = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { application, updateStatus } = useLoan();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [loanStatus, setLoanStatus] = useState<LoanStatusType>(application.status);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Simulate document verification process
  useEffect(() => {
    if (isVerifying) {
      const timer = setTimeout(() => {
        setIsVerifying(false);
        setVerificationComplete(true);
        
        // Randomly determine loan status for demonstration
        const outcomes: LoanStatusType[] = ["approved", "declined", "in-review"];
        const randomIndex = Math.floor(Math.random() * outcomes.length);
        const newStatus = outcomes[randomIndex];
        
        // Update loan status
        setLoanStatus(newStatus);
        
        // Prepare additional details based on status
        let statusDetails = {};
        
        if (newStatus === "approved") {
          statusDetails = {
            approvedAmount: application.loanAmount,
            terms: "60 months at 5.99% APR"
          };
          toast.success("Your loan has been approved!");
        } else if (newStatus === "declined") {
          statusDetails = {
            reasonForDecline: "Insufficient income verification"
          };
          toast.error("Your loan application was declined.");
        } else {
          toast.info("Your application needs additional review.");
        }
        
        // Update application status in context
        updateStatus(newStatus, statusDetails);
        
      }, 7000); // Simulate 7-second verification
      
      return () => clearTimeout(timer);
    }
  }, [isVerifying, application.loanAmount, updateStatus]);
  
  // Handle accepting loan offer
  const handleAcceptOffer = () => {
    toast.success("You've accepted the loan offer! Funds will be disbursed shortly.");
    
    // In a real app, this would trigger an API call to process the acceptance
    setTimeout(() => {
      navigate("/");
    }, 3000);
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
                <span className="text-sm text-muted-foreground">Step 4 of 4</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-4">
                {isVerifying
                  ? "Verifying Your Documents"
                  : verificationComplete
                  ? "Loan Application Status"
                  : "Document Verification"
                }
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {isVerifying
                  ? "Our system is reviewing your uploaded documents. This typically takes a few moments."
                  : verificationComplete
                  ? "Review the status of your loan application below."
                  : "We couldn't verify your documents. Please try again."
                }
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              {isVerifying ? (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-secondary"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2">Verifying your documents</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    We're reviewing your ID and financial documents. This helps us make an accurate loan decision.
                  </p>
                  
                  <div className="w-full max-w-md mt-8">
                    <div className="space-y-4">
                      <VerificationStep
                        label="Checking document authenticity"
                        status="complete"
                      />
                      <VerificationStep
                        label="Verifying identity information"
                        status="in-progress"
                      />
                      <VerificationStep
                        label="Analyzing financial documents"
                        status="pending"
                      />
                      <VerificationStep
                        label="Calculating loan options"
                        status="pending"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <LoanStatusResult 
                    status={loanStatus}
                    application={application}
                    onAcceptOffer={handleAcceptOffer}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
};

interface VerificationStepProps {
  label: string;
  status: "pending" | "in-progress" | "complete" | "error";
}

const VerificationStep = ({ label, status }: VerificationStepProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        {status === "pending" && (
          <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
        )}
        {status === "in-progress" && (
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        )}
        {status === "complete" && (
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={14} className="text-green-600" />
          </div>
        )}
        {status === "error" && (
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle size={14} className="text-red-600" />
          </div>
        )}
      </div>
      <div>
        <p className={`text-sm ${status === "in-progress" ? "font-medium" : ""}`}>
          {label}
        </p>
      </div>
    </div>
  );
};

interface LoanStatusResultProps {
  status: LoanStatusType;
  application: any;
  onAcceptOffer: () => void;
}

const LoanStatusResult = ({ status, application, onAcceptOffer }: LoanStatusResultProps) => {
  return (
    <div>
      {status === "approved" && (
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations! Your Loan is Approved</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Based on your application and documents, we're pleased to offer you the following loan:
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                <p className="text-2xl font-bold">{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(application.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                <p className="text-2xl font-bold">5.99% APR</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Term Length</p>
                <p className="text-xl font-bold">60 months</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                <p className="text-xl font-bold">{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                }).format(application.loanAmount * 0.0193)}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Funds will be deposited within 1-2 business days after acceptance.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onAcceptOffer}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  icon={<CheckCircle size={16} />}
                >
                  Accept Offer
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" icon={<Download size={16} />}>
                  Download Agreement
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 mb-1">Next steps</p>
              <p className="text-sm text-blue-700">
                After accepting your offer, we'll send you an email with further instructions to complete the process. Funds will be deposited to your account within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {status === "in-review" && (
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-amber-600 mb-2">Your Application Needs Additional Review</h2>
            <p className="text-muted-foreground text-center max-w-md">
              We need a bit more time to review your application. This is a normal part of our process for some applications.
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
            <h3 className="font-medium text-lg mb-2">What happens next?</h3>
            <ol className="space-y-4 pl-6 list-decimal">
              <li>
                <p>Our loan specialists will review your application and documents within 1-2 business days.</p>
              </li>
              <li>
                <p>You may receive a call or email if we need additional information.</p>
              </li>
              <li>
                <p>Once the review is complete, we'll notify you by email with the decision.</p>
              </li>
            </ol>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                icon={<MessageSquare size={16} />}
              >
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild
                icon={<RefreshCw size={16} />}
              >
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800 mb-1">Application Reference</p>
              <p className="text-sm text-blue-700">
                Your application reference number is <span className="font-mono font-medium">LN-{Date.now().toString().substring(3, 12)}</span>. Please keep this number for your records.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {status === "declined" && (
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Your Loan Application Was Declined</h2>
            <p className="text-muted-foreground text-center max-w-md">
              We're sorry, but we were unable to approve your loan application at this time.
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Reason for Decline</h3>
              <p className="p-3 bg-white/80 rounded border border-gray-200">
                {application.reasonForDecline || "Insufficient income verification"}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">What You Can Do</h3>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <p>Review your application for any errors or missing information.</p>
                </li>
                <li className="flex gap-2">
                  <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <p>Consider applying with a co-signer to strengthen your application.</p>
                </li>
                <li className="flex gap-2">
                  <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <p>Wait 30 days before reapplying to avoid multiple credit inquiries.</p>
                </li>
              </ul>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                icon={<MessageSquare size={16} />}
              >
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild
                icon={<ArrowRight size={16} />}
              >
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <Info size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800 mb-1">Your Credit Rights</p>
              <p className="text-sm text-red-700">
                You have the right to receive a free copy of your credit report. To get a copy of your report, visit <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer" className="underline">AnnualCreditReport.com</a> or call 1-877-322-8228.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanStatus;
