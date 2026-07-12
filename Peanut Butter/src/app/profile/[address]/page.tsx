"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CredentialCard from "@/components/CredentialCard";
import SkillTag from "@/components/SkillTag";
import {
  User,
  Shield,
  ExternalLink,
  Copy,
  CheckCircle,
  Link2,
  Award,
} from "lucide-react";

interface ProfileCredential {
  id: string;
  shortCode: string;
  recipientName: string;
  organization: string;
  course: string;
  achievement: string;
  skills: string[];
  issueDate: string;
  status: string;
}

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const [credentials, setCredentials] = useState<ProfileCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate fetching credentials for a wallet address
    const timer = setTimeout(() => {
      setCredentials([
        {
          id: "1",
          shortCode: "8FH2KS9",
          recipientName: "Yekeshwar Naik",
          organization: "Government Institute of Electronics",
          course: "AI & Machine Learning",
          achievement: "Hackathon Winner",
          skills: ["Python", "Machine Learning", "TensorFlow", "Deep Learning", "Blockchain"],
          issueDate: "2026-07-12",
          status: "MINTED",
        },
        {
          id: "2",
          shortCode: "KP4MN7D",
          recipientName: "Yekeshwar Naik",
          organization: "Cardano Foundation",
          course: "Plutus Pioneer Program",
          achievement: "Completion",
          skills: ["Haskell", "Plutus", "Cardano", "Smart Contracts"],
          issueDate: "2026-05-20",
          status: "MINTED",
        },
        {
          id: "3",
          shortCode: "QR7TY2W",
          recipientName: "Yekeshwar Naik",
          organization: "AWS Training",
          course: "Cloud Solutions Architect",
          achievement: "Certification",
          skills: ["AWS", "Cloud Architecture", "DevOps"],
          issueDate: "2026-03-15",
          status: "MINTED",
        },
      ]);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [address]);

  // Aggregate all unique skills
  const allSkills = Array.from(
    new Set(credentials.flatMap((c) => c.skills))
  );

  const truncatedAddress = address
    ? `${address.slice(0, 12)}...${address.slice(-8)}`
    : "";

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "60px", maxWidth: "900px" }}>
          {/* Profile Header */}
          <div
            className="glass-card animate-fade-in"
            style={{
              padding: "36px",
              marginBottom: "32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                right: "-100px",
                width: "300px",
                height: "300px",
                background: "var(--gradient-glow)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                {/* Avatar */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "20px",
                    background: "var(--gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={32} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                  <h1
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    {credentials[0]?.recipientName || "Credential Holder"}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <code
                      style={{
                        fontSize: "12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "var(--color-text-muted)",
                        background: "var(--color-bg-secondary)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {truncatedAddress}
                    </code>
                    <button
                      onClick={handleCopy}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-text-muted)",
                        padding: "4px",
                      }}
                      title="Copy address"
                    >
                      {copied ? (
                        <CheckCircle size={14} color="var(--color-accent-emerald)" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-accent-primary)" }}>
                    {credentials.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Credentials
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-accent-emerald)" }}>
                    {credentials.filter((c) => c.status === "MINTED").length}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Verified
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-accent-cyan)" }}>
                    {allSkills.length}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Skills
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Overview */}
          {allSkills.length > 0 && (
            <div className="glass-card animate-slide-up stagger-1" style={{ padding: "24px", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Award size={16} color="var(--color-accent-cyan)" />
                <h2 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
                  Verified Skills
                </h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {allSkills.map((skill) => (
                  <SkillTag key={skill} skill={skill} variant="verified" />
                ))}
              </div>
            </div>
          )}

          {/* Share Link */}
          <div className="glass-card animate-slide-up stagger-2" style={{ padding: "16px 20px", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link2 size={16} color="var(--color-accent-primary)" />
              <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                Shareable profile link:
              </span>
              <code
                style={{
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--color-accent-cyan)",
                  flex: 1,
                }}
              >
                {typeof window !== "undefined" ? window.location.href : `/profile/${address}`}
              </code>
            </div>
          </div>

          {/* Credentials Grid */}
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Shield size={18} color="var(--color-accent-primary)" />
            Credentials
          </h2>

          {isLoading ? (
            <div style={{ display: "grid", gap: "16px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer" style={{ height: "180px", borderRadius: "var(--radius-lg)" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {credentials.map((cred) => (
                <a
                  key={cred.id}
                  href={`/verify/${cred.shortCode}`}
                  style={{ textDecoration: "none" }}
                >
                  <CredentialCard
                    recipientName={cred.recipientName}
                    organization={cred.organization}
                    course={cred.course}
                    achievement={cred.achievement}
                    skills={cred.skills}
                    issueDate={cred.issueDate}
                    status={cred.status === "MINTED" ? "verified" : "pending"}
                    shortCode={cred.shortCode}
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
