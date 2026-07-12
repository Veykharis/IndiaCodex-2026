"use client";

import { ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface BlockchainProofProps {
  txHash?: string | null;
  policyId?: string | null;
  assetName?: string | null;
  certificateHash: string;
  network?: string;
}

export default function BlockchainProof({
  txHash,
  policyId,
  assetName,
  certificateHash,
  network = "preprod",
}: BlockchainProofProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const scanBaseUrl =
    network === "mainnet"
      ? "https://cardanoscan.io"
      : `https://${network}.cardanoscan.io`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncate = (str: string, chars = 12) => {
    if (str.length <= chars * 2) return str;
    return `${str.slice(0, chars)}...${str.slice(-chars)}`;
  };

  const rows = [
    {
      label: "Certificate Hash",
      value: certificateHash,
      mono: true,
    },
    ...(txHash
      ? [
          {
            label: "Transaction Hash",
            value: txHash,
            link: `${scanBaseUrl}/transaction/${txHash}`,
            mono: true,
          },
        ]
      : []),
    ...(policyId
      ? [
          {
            label: "Policy ID",
            value: policyId,
            mono: true,
          },
        ]
      : []),
    ...(assetName
      ? [
          {
            label: "Asset Name",
            value: assetName,
            mono: true,
          },
        ]
      : []),
  ];

  return (
    <div
      className="glass-card"
      style={{ padding: "24px", overflow: "hidden" }}
    >
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "16px",
        }}
      >
        Blockchain Proof
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {rows.map((row) => (
          <div key={row.label}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              {row.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <code
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                  fontFamily: "'JetBrains Mono', monospace",
                  background: "var(--color-bg-secondary)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {truncate(row.value)}
              </code>
              <button
                onClick={() => copyToClipboard(row.value, row.label)}
                className="btn-icon"
                style={{ width: "32px", height: "32px", flexShrink: 0 }}
                title="Copy to clipboard"
              >
                {copiedField === row.label ? (
                  <CheckCircle size={14} color="var(--color-accent-emerald)" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
              {row.link && (
                <a
                  href={row.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-icon"
                  style={{ width: "32px", height: "32px", flexShrink: 0 }}
                  title="View on CardanoScan"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
