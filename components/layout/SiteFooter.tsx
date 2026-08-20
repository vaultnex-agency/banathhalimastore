import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/tokens";
import { MessageCircle } from "lucide-react";

const FOOTER_LINKS = {
  "Customer Care": [
    { label: "Track My Order", href: "#" },
    { label: "Returns & Exchanges", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  About: [
    { label: "Our Story", href: "#" },
    { label: "Craftsmanship", href: "#" },
    { label: "My Account", href: "/account" },
  ],
  Policies: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-5 py-12 md:py-16">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-2">
              <Image
                src="/bh-logo.png"
                alt="Banat Halima Logo"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
              />
              <div>
                <p className="font-heading text-2xl font-semibold text-brand-primary leading-none">
                  {brand.name}
                </p>
                <p className="font-heading text-xs text-brand-text-muted mt-0.5">
                  {brand.nameArabic}
                </p>
              </div>
            </div>
            <p className="text-xs font-body text-brand-text-muted leading-relaxed mb-5">
              {brand.tagline}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 bg-brand-muted rounded-xl hover:bg-brand-accent hover:text-white transition-colors min-h-0 min-w-0"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 bg-brand-muted rounded-xl hover:bg-brand-accent hover:text-white transition-colors min-h-0 min-w-0"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.415V8z"/>
                </svg>
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 bg-brand-muted rounded-xl hover:bg-brand-accent hover:text-white transition-colors min-h-0 min-w-0"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-body font-semibold text-brand-text uppercase tracking-wider mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm font-body text-brand-text-muted hover:text-brand-text transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-brand-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-brand-text-muted">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-body text-brand-text-muted">We accept:</span>
            {["VISA", "MC", "AMEX", "COD"].map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 text-[10px] font-body font-bold border border-brand-border rounded text-brand-text-muted"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
