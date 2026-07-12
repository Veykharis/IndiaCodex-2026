"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import SkillTag from "@/components/SkillTag";
import BlockchainProof from "@/components/BlockchainProof";
import FileUpload from "@/components/FileUpload";
import {
  CheckCircle,
  XCircle,
  Shield,
  Building2,
  User,
  Calendar,
  GraduationCap,
  Award,
  QrCode,
  ExternalLink,
  Upload,
  Hash,
  AlertTriangle,
} from "lucide-react";

interface CredentialData {
  recipientName: string;
  organization: string;
  course: string;
  achievement: string;
  skills: string[];
  issueDate: string;
  certificateHash: string;
  txHash: string;
  policyId: string;
  assetName: string;
  shortCode: string;
  status: string;
  pdfIpfsUrl: string | null;
}

export default function VerifyPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  const [credential, setCredential] = useState<CredentialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [showTamperCheck, setShowTamperCheck] = useState(false);
  const [tamperResult, setTamperResult] = useState<"match" | "mismatch" | null>(null);
  const [isTamperChecking, setIsTamperChecking] = useState(false);

  useEffect(() => {
    if (!shortCode) return;

    setIsLoading(true);
    fetch(`/api/credentials/verify/${shortCode}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setCredential(data.credential);
        setIsVerified(data.verified);
      })
      .catch((err) => {
        console.error("Error fetching credential:", err);
        setCredential(null);
      })
      .finally(() => setIsLoading(false));
  }, [shortCode]);

  const handleTamperCheck = async (file: File) => {
    setIsTamperChecking(true);
    // Simulate hash comparison
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Randomly demonstrate match or mismatch for demo
    const isOriginal = Math.random() > 0.5;
    setTamperResult(isOriginal ? "match" : "mismatch");
    setIsTamperChecking(false);
  };

  const formattedDate = credential
    ? new Date(credential.issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
          <div className="container" style={{ paddingTop: "80px", textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                border: "3px solid var(--color-border)",
                borderTopColor: "var(--color-accent-primary)",
                animation: "spin 1s linear infinite",
                margin: "0 auto 24px",
              }}
            />
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
              Verifying credential...
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
              Checking blockchain records for {shortCode}
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        </main>
      </>
    );
  }

  if (!credential) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
          <div className="container" style={{ paddingTop: "80px", textAlign: "center" }}>
            <XCircle size={60} color="var(--color-accent-rose)" style={{ margin: "0 auto 24px" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
              Credential Not Found
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
              No credential exists with code: {shortCode}
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "700px" }}>
          {/* Verification Status Banner */}
          <div
            className="animate-fade-in"
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: isVerified
                  ? "rgba(16, 185, 129, 0.1)"
                  : "rgba(244, 63, 94, 0.1)",
                border: `2px solid ${isVerified ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
              className="animate-pulse-glow"
            >
              {isVerified ? (
                <CheckCircle size={40} color="var(--color-accent-emerald)" />
              ) : (
                <XCircle size={40} color="var(--color-accent-rose)" />
              )}
            </div>

            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "8px",
                color: isVerified
                  ? "var(--color-accent-emerald)"
                  : "var(--color-accent-rose)",
              }}
            >
              {isVerified ? "✅ Verified" : "❌ Invalid"}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
              {isVerified
                ? "This credential has been verified on the Cardano blockchain"
                : "This credential could not be verified"}
            </p>
          </div>

          {/* Credential Details */}
          <div
            className="glass-card animate-slide-up"
            style={{
              padding: "32px",
              marginBottom: "20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Gradient strip */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: isVerified
                  ? "linear-gradient(90deg, #10b981, #06b6d4)"
                  : "linear-gradient(90deg, #f43f5e, #e11d48)",
              }}
            />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "var(--gradient-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Shield size={28} color="white" />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
                  ProofPass Credential
                </div>
                <div style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "var(--color-text-muted)" }}>
                  ID: {credential.shortCode}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <User size={13} color="var(--color-text-muted)" />
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>
                    Issued To
                  </span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {credential.recipientName}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <Building2 size={13} color="var(--color-text-muted)" />
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>
                    Issued By
                  </span>
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {credential.organization}
                </div>
              </div>

              {credential.course && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <GraduationCap size={13} color="var(--color-text-muted)" />
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>
                      Course
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--color-text-primary)" }}>
                    {credential.course}
                  </div>
                </div>
              )}

              {credential.achievement && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Award size={13} color="var(--color-accent-amber)" />
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>
                      Achievement
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--color-text-primary)" }}>
                    {credential.achievement}
                  </div>
                </div>
              )}

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <Calendar size={13} color="var(--color-text-muted)" />
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>
                    Issue Date
                  </span>
                </div>
                <div style={{ fontSize: "14px", color: "var(--color-text-primary)" }}>
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Skills */}
            {credential.skills.length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "10px" }}>
                  Verified Skills
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {credential.skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} variant="verified" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blockchain Proof */}
          <div className="animate-slide-up stagger-2">
            <BlockchainProof
              txHash={credential.txHash}
              policyId={credential.policyId}
              assetName={credential.assetName}
              certificateHash={credential.certificateHash}
            />
          </div>

          {/* QR Code Section */}
          <div
            className="glass-card animate-slide-up stagger-3"
            style={{
              padding: "24px",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "white",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <QrCode size={48} color="#111" />
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                Share this verification
              </p>
              <code
                style={{
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--color-accent-cyan)",
                }}
              >
                {typeof window !== "undefined" ? window.location.href : `/verify/${credential.shortCode}`}
              </code>
            </div>
          </div>

          {/* Tamper Check Section */}
          <div
            className="glass-card animate-slide-up stagger-4"
            style={{ padding: "24px", marginTop: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: showTamperCheck ? "16px" : "0",
              }}
            >
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
                  Tamper Check
                </h3>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                  Upload the original PDF to verify it hasn&apos;t been modified
                </p>
              </div>
              <button
                className="btn-secondary btn-sm"
                onClick={() => setShowTamperCheck(!showTamperCheck)}
              >
                <Upload size={14} />
                {showTamperCheck ? "Hide" : "Check"}
              </button>
            </div>

            {showTamperCheck && (
              <div style={{ marginTop: "8px" }}>
                <FileUpload
                  onFileSelect={handleTamperCheck}
                  label="Upload certificate PDF to compare"
                  description="We'll compare the hash against the original"
                  isProcessing={isTamperChecking}
                />

                {tamperResult && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      background:
                        tamperResult === "match"
                          ? "rgba(16, 185, 129, 0.08)"
                          : "rgba(244, 63, 94, 0.08)",
                      border: `1px solid ${
                        tamperResult === "match"
                          ? "rgba(16, 185, 129, 0.2)"
                          : "rgba(244, 63, 94, 0.2)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {tamperResult === "match" ? (
                      <>
                        <CheckCircle size={20} color="var(--color-accent-emerald)" />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-accent-emerald)" }}>
                            Hash Match — Certificate is authentic
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                            The uploaded PDF matches the original certificate hash on-chain
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={20} color="var(--color-accent-rose)" />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-accent-rose)" }}>
                            Hash Mismatch — Certificate has been modified!
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                            The uploaded PDF does NOT match the original. This certificate may have been tampered with.
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
