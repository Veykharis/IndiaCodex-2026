"use client";

interface SkillTagProps {
  skill: string;
  variant?: "default" | "verified" | "unverified";
}

export default function SkillTag({ skill, variant = "default" }: SkillTagProps) {
  const styles = {
    default: {
      color: "var(--color-accent-cyan)",
      bg: "rgba(6, 182, 212, 0.1)",
      border: "rgba(6, 182, 212, 0.2)",
    },
    verified: {
      color: "var(--color-accent-emerald)",
      bg: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.2)",
    },
    unverified: {
      color: "var(--color-text-muted)",
      bg: "rgba(100, 116, 139, 0.1)",
      border: "rgba(100, 116, 139, 0.2)",
    },
  };

  const s = styles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: 500,
        borderRadius: "100px",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {variant === "verified" && "✓ "}
      {variant === "unverified" && "✗ "}
      {skill}
    </span>
  );
}
