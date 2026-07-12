"use client";

import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface VerificationBadgeProps {
  status: "verified" | "invalid" | "pending" | "revoked";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const config = {
  verified: {
    icon: CheckCircle,
    label: "Verified",
    color: "var(--color-accent-emerald)",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.2)",
  },
  invalid: {
    icon: XCircle,
    label: "Invalid",
    color: "var(--color-accent-rose)",
    bg: "rgba(244, 63, 94, 0.1)",
    border: "rgba(244, 63, 94, 0.2)",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "var(--color-accent-amber)",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.2)",
  },
  revoked: {
    icon: AlertTriangle,
    label: "Revoked",
    color: "var(--color-accent-rose)",
    bg: "rgba(244, 63, 94, 0.1)",
    border: "rgba(244, 63, 94, 0.2)",
  },
};

const sizes = {
  sm: { icon: 16, font: "13px", padding: "4px 10px", gap: "4px" },
  md: { icon: 20, font: "15px", padding: "8px 16px", gap: "6px" },
  lg: { icon: 32, font: "18px", padding: "12px 24px", gap: "8px" },
};

export default function VerificationBadge({
  status,
  size = "md",
  showLabel = true,
}: VerificationBadgeProps) {
  const { icon: Icon, label, color, bg, border } = config[status];
  const s = sizes[size];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        padding: s.padding,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "100px",
        color: color,
        fontSize: s.font,
        fontWeight: 600,
      }}
    >
      <Icon size={s.icon} />
      {showLabel && <span>{label}</span>}
    </div>
  );
}
