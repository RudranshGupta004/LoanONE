
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("bg-secondary py-12 px-6", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">QuickLoanHub</h3>
            <p className="text-muted-foreground text-sm">
              Fast, simple, and secure loan services for your financial needs.
            </p>
          </div>

          <FooterColumn title="Quick Links">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/login">Get Started</FooterLink>
          </FooterColumn>

          <FooterColumn title="Resources">
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </FooterColumn>

          <FooterColumn title="Contact">
            <p className="text-sm text-muted-foreground">
              Email: support@quickloanhub.com
            </p>
            <p className="text-sm text-muted-foreground">
              Phone: (555) 123-4567
            </p>
            <p className="text-sm text-muted-foreground">
              Address: 123 Financial St, Money City, MC 12345
            </p>
          </FooterColumn>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} QuickLoanHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <SocialLink href="https://twitter.com" label="Twitter" />
              <SocialLink href="https://facebook.com" label="Facebook" />
              <SocialLink href="https://linkedin.com" label="LinkedIn" />
              <SocialLink href="https://instagram.com" label="Instagram" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      <nav className="flex flex-col space-y-2">
        {children}
      </nav>
    </div>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
  return (
    <Link
      to={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
};

interface SocialLinkProps {
  href: string;
  label: string;
}

const SocialLink = ({ href, label }: SocialLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default Footer;
