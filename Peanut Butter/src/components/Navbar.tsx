"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Shield, Menu, X, ExternalLink } from "lucide-react";

import { CardanoWallet } from "@meshsdk/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(6, 8, 15, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--color-text-primary)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              background: "var(--gradient-primary)",
              borderRadius: "10px",
            }}
          >
            <Shield size={20} color="white" />
          </div>
          <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Proof<span className="gradient-text">Pass</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="desktop-nav">
          <Link href="/dashboard" className="btn-secondary btn-sm" style={{ textDecoration: "none" }}>
            Issuer Dashboard
          </Link>
          <Link href="/verify" className="btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
            Verify
            <ExternalLink size={14} />
          </Link>
          <Link href="/recruiter" className="btn-secondary btn-sm" style={{ textDecoration: "none" }}>
            Recruiters
          </Link>
          {mounted ? (
            <CardanoWallet label="Connect Wallet" />
          ) : (
            <div style={{ width: 140, height: 38, background: "rgba(99, 102, 241, 0.1)", borderRadius: 8 }} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="btn-icon mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: "none" }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderTop: "1px solid var(--color-border)",
            background: "rgba(6, 8, 15, 0.95)",
          }}
        >
          <Link href="/dashboard" className="btn-secondary" onClick={() => setIsOpen(false)}>
            Issue Credentials
          </Link>
          <Link href="/verify" className="btn-secondary" onClick={() => setIsOpen(false)}>
            Verify Certificate
          </Link>
          <Link href="/dashboard" className="btn-primary" onClick={() => setIsOpen(false)}>
            Launch App
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
