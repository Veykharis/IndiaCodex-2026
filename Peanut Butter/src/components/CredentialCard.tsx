"use client";

import VerificationBadge from "./VerificationBadge";
import SkillTag from "./SkillTag";
import { Shield, Calendar, Building2, GraduationCap, Award } from "lucide-react";

interface CredentialCardProps {
  recipientName: string;
  organization: string;
  course?: string;
  achievement?: string;
  skills: string[];
  issueDate: string;
  status: "verified" | "pending" | "revoked";
  shortCode?: string;
  onClick?: () => void;
  compact?: boolean;
}

export default function CredentialCard({
  recipientName,
  organization,
  course,
  achievement,
  skills,
  issueDate,
  status,
  shortCode,
  onClick,
  compact = false,
}: CredentialCardProps) {
  const formattedDate = new Date(issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        padding: compact ? "20px" : "28px",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient strip at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: status === "verified"
            ? "linear-gradient(90deg, #10b981, #06b6d4)"
            : status === "pending"
            ? "linear-gradient(90deg, #f59e0b, #f97316)"
            : "linear-gradient(90deg, #f43f5e, #e11d48)",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: compact ? "12px" : "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: compact ? "40px" : "48px",
              height: compact ? "40px" : "48px",
              borderRadius: "12px",
              background: "var(--gradient-primary)",
              flexShrink: 0,
            }}
          >
            <Shield size={compact ? 20 : 24} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: compact ? "16px" : "18px", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.3 }}>
              {recipientName}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <Building2 size={13} color="var(--color-text-muted)" />
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                {organization}
              </span>
            </div>
          </div>
        </div>
        <VerificationBadge
          status={status === "verified" ? "verified" : status === "pending" ? "pending" : "revoked"}
          size="sm"
        />
      </div>

      {/* Details */}
      {!compact && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {course && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <GraduationCap size={14} color="var(--color-text-muted)" />
              <span style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{course}</span>
            </div>
          )}
          {achievement && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={14} color="var(--color-accent-amber)" />
              <span style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{achievement}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={14} color="var(--color-text-muted)" />
            <span style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>{formattedDate}</span>
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: compact ? "0" : "0" }}>
          {skills.slice(0, compact ? 3 : 6).map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
          {skills.length > (compact ? 3 : 6) && (
            <span style={{ fontSize: "12px", color: "var(--color-text-muted)", padding: "4px 8px" }}>
              +{skills.length - (compact ? 3 : 6)} more
            </span>
          )}
        </div>
      )}

      {/* Short code */}
      {shortCode && !compact && (
        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
          <code style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            ID: {shortCode}
          </code>
        </div>
      )}
    </div>
  );
}
