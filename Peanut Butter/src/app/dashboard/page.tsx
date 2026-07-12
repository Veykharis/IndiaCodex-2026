"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CredentialCard from "@/components/CredentialCard";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Wallet,
  Shield,
  ArrowRight,
} from "lucide-react";

interface Credential {
  id: string;
  shortCode: string;
  recipientName: string;
  organization: string;
  course: string;
  achievement: string;
  skills: string;
  issueDate: string;
  status: string;
  txHash: string | null;
  certificateHash: string;
}

import { useWallet, useAddress, CardanoWallet } from "@meshsdk/react";

export default function DashboardPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { connected, wallet } = useWallet();
  const address = useAddress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!connected || !address) {
      setCredentials([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/credentials?walletAddress=${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.credentials || data.credentials.length === 0) {
          // Fallback to seeded demo credentials if the address is empty
          fetch("/api/credentials?walletAddress=addr_test1vrmpxwh446nkl1234567890abcdefghijklmnopqrstuvwxyz")
            .then((res) => res.json())
            .then((demoData) => {
              const formatted = (demoData.credentials || []).map((c: any) => ({
                ...c,
                organization: "Government Institute of Electronics",
              }));
              setCredentials(formatted);
            });
        } else {
          const formatted = (data.credentials || []).map((c: any) => ({
            ...c,
            organization: "Government Institute of Electronics",
          }));
          setCredentials(formatted);
        }
      })
      .catch((err) => console.error("Error fetching credentials:", err))
      .finally(() => setIsLoading(false));
  }, [connected, address]);

  const filteredCredentials = credentials.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hydration fallback
  if (!mounted) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "3px solid var(--color-border)", borderTopColor: "var(--color-accent-primary)", animation: "spin 1s linear infinite" }} />
          </div>
        </main>
      </>
    );
  }

  // If wallet is not connected, show connect prompt
  if (!connected) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "calc(100vh - 64px)",
              }}
            >
              <div
                className="glass-card"
                style={{
                  padding: "48px",
                  textAlign: "center",
                  maxWidth: "500px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "20px",
                    background: "var(--gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <Wallet size={32} color="white" />
                </div>

                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Connect Your Wallet
                </h1>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    marginBottom: "32px",
                    lineHeight: 1.7,
                  }}
                >
                  Connect your Cardano wallet to start issuing verifiable
                  credentials. Supported wallets: Eternl, Lace, Yoroi, Nami.
                </p>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <CardanoWallet />
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-muted)",
                    marginTop: "16px",
                  }}
                >
                  Please make sure your wallet is set to the Preprod testnet.
                </p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--color-accent-emerald)",
                    boxShadow: "0 0 8px var(--color-accent-emerald)",
                  }}
                />
                <span style={{ fontSize: "12px", color: "var(--color-accent-emerald)", fontWeight: 500 }}>
                  Wallet Connected
                </span>
              </div>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "4px",
                }}
              >
                Issuer Dashboard
              </h1>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
                Manage and issue verifiable credentials
              </p>
            </div>

            <Link
              href="/dashboard/issue"
              className="btn-primary"
              style={{ fontSize: "15px" }}
            >
              <Plus size={18} />
              Issue New Credential
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {[
              { label: "Total Issued", value: credentials.length.toString(), icon: Shield, color: "var(--color-accent-primary)" },
              {
                label: "Minted",
                value: credentials.filter((c) => c.status === "MINTED").length.toString(),
                icon: Shield,
                color: "var(--color-accent-emerald)",
              },
              {
                label: "Pending",
                value: credentials.filter((c) => c.status === "PENDING").length.toString(),
                icon: Shield,
                color: "var(--color-accent-amber)",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
                  </div>
                  <Icon size={24} color={color} style={{ opacity: 0.3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search
                size={16}
                color="var(--color-text-muted)"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                className="input"
                placeholder="Search credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "38px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-icon" title="Filter">
                <Filter size={16} />
              </button>
              <button
                className="btn-icon"
                onClick={() => setViewMode("grid")}
                style={{
                  borderColor: viewMode === "grid" ? "var(--color-accent-primary)" : undefined,
                  color: viewMode === "grid" ? "var(--color-accent-primary)" : undefined,
                }}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className="btn-icon"
                onClick={() => setViewMode("list")}
                style={{
                  borderColor: viewMode === "list" ? "var(--color-accent-primary)" : undefined,
                  color: viewMode === "list" ? "var(--color-accent-primary)" : undefined,
                }}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Credentials */}
          {isLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr",
                gap: "16px",
              }}
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer" style={{ height: "200px", borderRadius: "var(--radius-lg)" }} />
              ))}
            </div>
          ) : filteredCredentials.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(340px, 1fr))" : "1fr",
                gap: "16px",
              }}
            >
              {filteredCredentials.map((cred) => (
                <Link key={cred.id} href={`/verify/${cred.shortCode}`} style={{ textDecoration: "none" }}>
                  <CredentialCard
                    recipientName={cred.recipientName}
                    organization={cred.organization}
                    course={cred.course}
                    achievement={cred.achievement}
                    skills={JSON.parse(cred.skills || "[]")}
                    issueDate={cred.issueDate}
                    status={
                      cred.status === "MINTED"
                        ? "verified"
                        : cred.status === "REVOKED"
                        ? "revoked"
                        : "pending"
                    }
                    shortCode={cred.shortCode}
                    compact={viewMode === "list"}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                padding: "64px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "rgba(99, 102, 241, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Shield size={28} color="var(--color-accent-primary)" />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                No credentials yet
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                  marginBottom: "24px",
                }}
              >
                Issue your first verifiable credential to get started.
              </p>
              <Link href="/dashboard/issue" className="btn-primary">
                <Plus size={16} />
                Issue Credential
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
