"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Search,
  Shield,
  QrCode,
  ArrowRight,
  ScanLine,
} from "lucide-react";

export default function VerifyLandingPage() {
  const [shortCode, setShortCode] = useState("");
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (shortCode.trim()) {
      router.push(`/verify/${shortCode.trim().toUpperCase()}`);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
        <div
          className="container bg-glow"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div style={{ maxWidth: "500px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
            {/* Icon */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "20px",
                background: "var(--gradient-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 28px",
              }}
              className="animate-pulse-glow"
            >
              <Shield size={32} color="white" />
            </div>

            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Verify a <span className="gradient-text">Credential</span>
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                marginBottom: "36px",
                lineHeight: 1.7,
              }}
            >
              Enter a credential code or scan a QR code to instantly verify
              a ProofPass credential on the Cardano blockchain.
            </p>

            {/* Search Form */}
            <form onSubmit={handleVerify} style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search
                    size={18}
                    color="var(--color-text-muted)"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Enter credential code (e.g., 8FH2KS9)"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value.toUpperCase())}
                    style={{
                      paddingLeft: "42px",
                      fontSize: "16px",
                      padding: "14px 14px 14px 42px",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.1em",
                    }}
                    maxLength={10}
                    id="credential-code-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!shortCode.trim()}
                  style={{
                    padding: "14px 24px",
                    opacity: shortCode.trim() ? 1 : 0.5,
                  }}
                >
                  Verify
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
              <span style={{ fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                or
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
            </div>

            {/* QR Option */}
            <div
              className="glass-card"
              style={{
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "rgba(6, 182, 212, 0.1)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <QrCode size={24} color="var(--color-accent-cyan)" />
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "2px" }}>
                  Scan QR Code
                </p>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                  Each ProofPass credential includes a QR code that links directly
                  to its verification page.
                </p>
              </div>
            </div>

            {/* Demo shortcode hint */}
            <div style={{ marginTop: "24px" }}>
              <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                <ScanLine size={12} style={{ display: "inline", marginRight: 4 }} />
                Try demo code:{" "}
                <button
                  onClick={() => {
                    setShortCode("8FH2KS9");
                    router.push("/verify/8FH2KS9");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-accent-primary)",
                    cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    textDecoration: "underline",
                  }}
                >
                  8FH2KS9
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
