"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Shield,
  Cpu,
  QrCode,
  FileCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  Zap,
  ScanLine,
  Brain,
  Link2,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        className="bg-glow"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 60%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
          className="animate-float"
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "5%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 60%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            pointerEvents: "none",
            animationDelay: "2s",
          }}
          className="animate-float"
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            {/* Badge */}
            <div
              className="animate-fade-in"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: "100px",
                fontSize: "13px",
                color: "var(--color-accent-primary)",
                marginBottom: "32px",
              }}
            >
              <Sparkles size={14} />
              Powered by Cardano Blockchain & AI
            </div>

            {/* Headline */}
            <h1
              className="animate-slide-up stagger-1"
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: "24px",
              }}
            >
              Certificates you can{" "}
              <span className="gradient-text">actually verify</span>
            </h1>

            {/* Subtitle */}
            <p
              className="animate-slide-up stagger-2"
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                maxWidth: "600px",
                margin: "0 auto 40px",
              }}
            >
              ProofPass creates tamper-proof digital credentials as Cardano NFTs.
              AI extracts metadata, blockchain anchors the proof, and anyone can
              verify instantly — no middleman needed.
            </p>

            {/* CTA Buttons */}
            <div
              className="animate-slide-up stagger-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Link href="/dashboard" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                Start Issuing
                <ArrowRight size={18} />
              </Link>
              <Link href="/verify" className="btn-secondary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                <ScanLine size={18} />
                Verify a Certificate
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className="animate-fade-in stagger-5"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                marginTop: "48px",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: Lock, text: "Tamper-proof" },
                { icon: Globe, text: "Publicly verifiable" },
                { icon: Zap, text: "Instant verification" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Icon size={14} color="var(--color-accent-emerald)" />
                  <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" style={{ position: "relative" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              How it <span className="gradient-text">works</span>
            </h2>
            <p style={{ fontSize: "16px", color: "var(--color-text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
              Three simple steps from certificate to verifiable proof
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {[
              {
                step: "01",
                icon: FileCheck,
                title: "Upload Certificate",
                description:
                  "The issuer uploads a PDF certificate. AI automatically extracts the recipient name, organization, skills, and all metadata — no manual entry needed.",
                accent: "var(--color-accent-primary)",
              },
              {
                step: "02",
                icon: Cpu,
                title: "Mint on Cardano",
                description:
                  "The certificate is hashed and a credential NFT is minted on Cardano. The PDF goes to IPFS, while the proof is anchored immutably on-chain.",
                accent: "var(--color-accent-secondary)",
              },
              {
                step: "03",
                icon: QrCode,
                title: "Verify Instantly",
                description:
                  "Every credential gets a QR code and verification link. Anyone can scan it to instantly confirm authenticity — no issuer contact required.",
                accent: "var(--color-accent-cyan)",
              },
            ].map(({ step, icon: Icon, title, description, accent }) => (
              <div
                key={step}
                className="glass-card"
                style={{
                  padding: "32px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "20px",
                    fontSize: "64px",
                    fontWeight: 800,
                    color: "rgba(148, 163, 184, 0.06)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `${accent}15`,
                    border: `1px solid ${accent}30`,
                    marginBottom: "20px",
                  }}
                >
                  <Icon size={24} color={accent} />
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "10px",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI FEATURES ===== */}
      <section className="section" style={{ background: "var(--color-bg-secondary)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 14px",
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--color-accent-secondary)",
                marginBottom: "20px",
              }}
            >
              <Brain size={14} />
              AI-Powered
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              AI that <span className="gradient-text">actually helps</span>
            </h2>
            <p style={{ fontSize: "16px", color: "var(--color-text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
              Not just a buzzword — AI automates extraction, detects fraud, and organizes credential data.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {[
              {
                icon: ScanLine,
                title: "OCR Extraction",
                description: "Upload any PDF certificate. AI reads the text, extracts fields, and structures the data automatically.",
              },
              {
                icon: Shield,
                title: "Forgery Detection",
                description: "AI checks for edited text, missing signatures, misaligned logos, and inconsistent fonts.",
              },
              {
                icon: Sparkles,
                title: "Skill Inference",
                description: "From 'Advanced Machine Learning', AI derives Python, TensorFlow, Deep Learning, and more.",
              },
              {
                icon: Link2,
                title: "Duplicate Detection",
                description: "Uploading the same certificate twice? AI flags it instantly to prevent fraud.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass-card"
                style={{ padding: "28px" }}
              >
                <Icon
                  size={22}
                  color="var(--color-accent-secondary)"
                  style={{ marginBottom: "16px" }}
                />
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>{title}</h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CARDANO ===== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "64px",
              alignItems: "center",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 14px",
                  background: "rgba(6, 182, 212, 0.1)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--color-accent-cyan)",
                  marginBottom: "20px",
                }}
              >
                <Link2 size={14} />
                Blockchain
              </div>
              <h2
                style={{
                  fontSize: "clamp(28px, 3vw, 36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                  lineHeight: 1.2,
                }}
              >
                Why <span className="gradient-text">Cardano</span>?
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                }}
              >
                Without blockchain, the issuer could alter or delete records. With
                Cardano, the proof remains verifiable forever — no central database,
                no single point of failure.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  "Immutable proof of issuance",
                  "Public, permissionless verification",
                  "No central database dependency",
                  "Transparent audit trail",
                  "Credential ownership by recipient",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={18} color="var(--color-accent-emerald)" />
                    <span style={{ fontSize: "14px", color: "var(--color-text-primary)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual card mockup */}
            <div
              className="glass-card animate-pulse-glow"
              style={{
                padding: "32px",
                borderRadius: "var(--radius-xl)",
                background: "linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(30, 41, 59, 0.4))",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "var(--gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield size={22} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600 }}>ProofPass Credential</div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>Verified on Cardano</div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "20px" }}>
                <div style={{ display: "grid", gap: "12px" }}>
                  {[
                    { label: "Recipient", value: "Yekeshwar Naik" },
                    { label: "Course", value: "AI & Machine Learning" },
                    { label: "Issuer", value: "Govt. Institute of Electronics" },
                    { label: "Status", value: "✅ Verified" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "2px" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: "14px", color: "var(--color-text-primary)" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--color-border)" }}>
                {["Python", "Machine Learning", "Blockchain"].map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "3px 10px",
                      fontSize: "11px",
                      borderRadius: "100px",
                      background: "rgba(6, 182, 212, 0.1)",
                      border: "1px solid rgba(6, 182, 212, 0.2)",
                      color: "var(--color-accent-cyan)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section" style={{ background: "var(--color-bg-secondary)" }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: "64px 48px",
              textAlign: "center",
              maxWidth: "800px",
              margin: "0 auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "500px",
                height: "300px",
                background: "var(--gradient-glow)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "16px",
                }}
              >
                Ready to make certificates <span className="gradient-text">trustworthy</span>?
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--color-text-secondary)",
                  marginBottom: "32px",
                  maxWidth: "500px",
                  margin: "0 auto 32px",
                }}
              >
                Start issuing verifiable credentials today. Connect your wallet and
                create your first ProofPass in minutes.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/dashboard" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                  Launch App
                  <ChevronRight size={18} />
                </Link>
                <Link href="/verify" className="btn-secondary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                  Verify Credential
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          padding: "48px 0",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={14} color="white" />
              </div>
              <span style={{ fontSize: "15px", fontWeight: 600 }}>ProofPass</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
              © 2026 ProofPass. Built on Cardano. Powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
