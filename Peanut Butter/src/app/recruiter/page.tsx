"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import SkillTag from "@/components/SkillTag";
import {
  Briefcase,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Shield,
  BarChart3,
  AlertTriangle,
} from "lucide-react";

interface SkillVerification {
  skill: string;
  status: "verified" | "not_verified" | "partial";
  credentialShortCode?: string;
  organization?: string;
}

export default function RecruiterPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<SkillVerification[] | null>(null);
  const [candidateName, setCandidateName] = useState("");

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);

    // Simulate AI resume analysis + credential cross-reference
    await new Promise((resolve) => setTimeout(resolve, 3500));

    setCandidateName("Yekeshwar Naik");
    setResults([
      {
        skill: "Python",
        status: "verified",
        credentialShortCode: "8FH2KS9",
        organization: "Government Institute of Electronics",
      },
      {
        skill: "Machine Learning",
        status: "verified",
        credentialShortCode: "8FH2KS9",
        organization: "Government Institute of Electronics",
      },
      {
        skill: "TensorFlow",
        status: "verified",
        credentialShortCode: "8FH2KS9",
        organization: "Government Institute of Electronics",
      },
      {
        skill: "AWS",
        status: "not_verified",
      },
      {
        skill: "Blockchain",
        status: "verified",
        credentialShortCode: "KP4MN7D",
        organization: "Cardano Foundation",
      },
      {
        skill: "Haskell",
        status: "verified",
        credentialShortCode: "KP4MN7D",
        organization: "Cardano Foundation",
      },
      {
        skill: "Docker",
        status: "not_verified",
      },
      {
        skill: "Cloud Architecture",
        status: "verified",
        credentialShortCode: "QR7TY2W",
        organization: "AWS Training",
      },
      {
        skill: "React",
        status: "not_verified",
      },
    ]);

    setIsProcessing(false);
  };

  const verifiedCount = results?.filter((r) => r.status === "verified").length || 0;
  const totalCount = results?.length || 0;
  const verificationRate = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "800px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Briefcase size={28} color="white" />
            </div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Recruiter <span className="gradient-text">Verification</span>
            </h1>
            <p style={{ fontSize: "15px", color: "var(--color-text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
              Upload a candidate&apos;s resume. AI will extract claimed skills and
              cross-reference them against ProofPass verified credentials.
            </p>
          </div>

          {/* Upload */}
          {!results && (
            <div className="animate-fade-in">
              <FileUpload
                onFileSelect={handleFileSelect}
                label="Upload Resume PDF"
                description="AI will extract skills and check them against verified credentials"
                isProcessing={isProcessing}
              />
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Loader2
                size={36}
                color="var(--color-accent-primary)"
                style={{ animation: "spin 1s linear infinite", margin: "0 auto 16px" }}
              />
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
                Analyzing resume and cross-referencing credentials...
              </p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Results */}
          {results && !isProcessing && (
            <div className="animate-fade-in">
              {/* Summary */}
              <div
                className="glass-card"
                style={{ padding: "28px", marginBottom: "24px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "var(--gradient-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={22} color="white" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 600 }}>{candidateName}</h2>
                    <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>Resume Verification Report</p>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  <div style={{ textAlign: "center", padding: "16px", borderRadius: "var(--radius-md)", background: "var(--color-bg-secondary)" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-accent-emerald)" }}>
                      {verifiedCount}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                      Verified
                    </div>
                  </div>
                  <div style={{ textAlign: "center", padding: "16px", borderRadius: "var(--radius-md)", background: "var(--color-bg-secondary)" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-accent-rose)" }}>
                      {totalCount - verifiedCount}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                      Not Verified
                    </div>
                  </div>
                  <div style={{ textAlign: "center", padding: "16px", borderRadius: "var(--radius-md)", background: "var(--color-bg-secondary)" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-accent-primary)" }}>
                      {verificationRate}%
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                      Rate
                    </div>
                  </div>
                </div>

                {/* Verification bar */}
                <div style={{ marginTop: "16px" }}>
                  <div style={{ height: "8px", borderRadius: "4px", background: "var(--color-bg-secondary)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${verificationRate}%`,
                        borderRadius: "4px",
                        background: "linear-gradient(90deg, var(--color-accent-emerald), var(--color-accent-cyan))",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills List */}
              <div className="glass-card" style={{ padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                  <BarChart3 size={16} color="var(--color-accent-primary)" />
                  <h3 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
                    Skill Verification Details
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {results.map((result, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        borderRadius: "var(--radius-md)",
                        background: result.status === "verified"
                          ? "rgba(16, 185, 129, 0.04)"
                          : "rgba(244, 63, 94, 0.04)",
                        border: `1px solid ${
                          result.status === "verified"
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(244, 63, 94, 0.1)"
                        }`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {result.status === "verified" ? (
                          <CheckCircle size={18} color="var(--color-accent-emerald)" />
                        ) : (
                          <XCircle size={18} color="var(--color-accent-rose)" />
                        )}
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 500 }}>{result.skill}</div>
                          {result.organization && (
                            <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                              {result.organization}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <SkillTag
                          skill={result.status === "verified" ? "Verified" : "Not Verified"}
                          variant={result.status === "verified" ? "verified" : "unverified"}
                        />
                        {result.credentialShortCode && (
                          <a
                            href={`/verify/${result.credentialShortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-icon"
                            style={{ width: "28px", height: "28px" }}
                            title="View credential"
                          >
                            <Shield size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "14px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(245, 158, 11, 0.06)",
                  border: "1px solid rgba(245, 158, 11, 0.15)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <AlertTriangle size={16} color="var(--color-accent-amber)" style={{ marginTop: "2px", flexShrink: 0 }} />
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                  &quot;Not Verified&quot; means no matching ProofPass credential was found.
                  The skill may still be valid — the issuer may not use ProofPass yet.
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px" }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setResults(null);
                    setCandidateName("");
                  }}
                >
                  <Search size={16} />
                  Verify Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
