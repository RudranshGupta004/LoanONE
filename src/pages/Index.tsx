
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui-elements/Button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden"
      >
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05)_0%,rgba(255,255,255,0)_60%)]"></div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2"
              >
                Fast. Simple. Secure.
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                Get Your Loan Approved
                <span className="block text-primary">Fast and Easy</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto md:mx-0"
              >
                Streamlined application process, quick approval decisions, and flexible loan options tailored to your financial needs.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              >
                <Button asChild size="lg" icon={<ArrowRight size={16} />} iconPosition="right">
                  <Link to="/login">Get Started</Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative flex justify-center md:justify-end"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/30 to-primary/5 rounded-2xl blur-lg"></div>
                <div className="relative bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                      <h3 className="font-medium">Your Loan Overview</h3>
                      <p className="text-sm text-muted-foreground">Customizable options</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                      <div className="text-2xl font-bold">$25,000</div>
                      <div className="w-full h-2 bg-secondary rounded-full mt-2">
                        <div className="h-full w-3/4 bg-primary rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                        <p className="font-medium">5.99%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Term</p>
                        <p className="font-medium">60 months</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm">Monthly Payment</p>
                        <p className="font-medium">$483.10</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm">Total Interest</p>
                        <p className="font-medium">$3,986</p>
                      </div>
                    </div>
                    
                    <Button className="w-full">Apply Now</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 px-6 bg-secondary/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            >
              Why Choose QuickLoanHub
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Our streamlined process makes getting a loan simple, fast, and stress-free.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Secure Process"
              description="Bank-level security protocols protect your sensitive information throughout the application process."
              delay={0}
            />
            
            <FeatureCard 
              icon={<Clock className="h-6 w-6 text-primary" />}
              title="Fast Approval"
              description="Get pre-approved in minutes and receive your funds as soon as the next business day."
              delay={0.2}
            />
            
            <FeatureCard 
              icon={<CheckCircle className="h-6 w-6 text-primary" />}
              title="Personalized Rates"
              description="We find the best loan terms based on your unique financial situation and needs."
              delay={0.4}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section 
        ref={stepsRef}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Three simple steps to get the funding you need
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number={1}
              title="Complete Application"
              description="Fill out our simple online form with basic information about yourself and your loan needs."
              delay={0}
            />
            
            <StepCard 
              number={2}
              title="Upload Documents"
              description="Securely upload the required documents to verify your identity and financial information."
              delay={0.2}
            />
            
            <StepCard 
              number={3}
              title="Get Approved"
              description="Receive your loan decision quickly, with funds deposited directly to your account upon approval."
              delay={0.4}
            />
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/login">Start Your Application</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section 
        ref={testimonialsRef}
        className="py-20 px-6 bg-secondary/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
            >
              What Our Customers Say
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The process was incredibly smooth. I was approved within hours and had the money in my account by the next day."
              author="Sarah J."
              role="Personal Loan"
              delay={0}
            />
            
            <TestimonialCard 
              quote="I needed funds to expand my business, and QuickLoanHub made it so easy. Their rates were better than any other lender I found."
              author="Michael T."
              role="Business Loan"
              delay={0.2}
            />
            
            <TestimonialCard 
              quote="After being turned down by traditional banks, QuickLoanHub approved my loan request. Their customer service was excellent throughout."
              author="Jessica M."
              role="Debt Consolidation"
              delay={0.4}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl p-8 md:p-12 lg:p-16 bg-primary text-primary-foreground"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,rgba(0,0,0,0)_60%)]"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mb-8">
                Apply now to check your rate. It only takes a few minutes and won't affect your credit score.
              </p>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/login">
                  Apply Now
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const StepCard = ({ number, title, description, delay }: StepCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="absolute -top-4 -left-2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-medium mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  delay: number;
}

const TestimonialCard = ({ quote, author, role, delay }: TestimonialCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col h-full">
        <blockquote className="flex-1 text-lg text-foreground/80 mb-4 italic">
          "{quote}"
        </blockquote>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
