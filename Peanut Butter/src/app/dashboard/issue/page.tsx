"use client";

import { useState, useCallback } from "react";
import { useWallet, useAddress } from "@meshsdk/react";
import { mintCredentialNFT } from "@/lib/cardano/mint-credential";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import SkillTag from "@/components/SkillTag";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Brain,
  Eye,
  Coins,
  CheckCircle,
  AlertTriangle,
  Loader2,
  QrCode,
  ExternalLink,
  User,
  Building2,
  GraduationCap,
  Award,
  Calendar,
  Clock,
  Hash,
  X,
  Plus,
} from "lucide-react";

type Step = "upload" | "extract" | "review" | "mint" | "success";

interface ExtractedData {
  recipientName: string;
  organization: string;
  course: string;
  achievement: string;
  issueDate: string;
  certificateId: string;
  skills: string[];
  duration: string;
  issuer: string;
  confidence: number;
  warnings: string[];
}

export default function IssuePage() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [editedData, setEditedData] = useState<ExtractedData | null>(null);
  const [mintResult, setMintResult] = useState<{
    txHash: string;
    shortCode: string;
    verificationUrl: string;
  } | null>(null);
  const [newSkill, setNewSkill] = useState("");

  const { connected, wallet } = useWallet();
  const address = useAddress();

  const steps: { key: Step; label: string; icon: typeof Upload }[] = [
    { key: "upload", label: "Upload", icon: Upload },
    { key: "extract", label: "AI Extract", icon: Brain },
    { key: "review", label: "Review", icon: Eye },
    { key: "mint", label: "Mint", icon: Coins },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setCurrentStep("extract");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("/api/credentials/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("AI extraction failed");

      const data = await res.json();
      setExtractedData(data.metadata);
      setEditedData({ ...data.metadata });
    } catch (error) {
      console.error("AI extraction failed, using template:", error);
      const fallback: ExtractedData = {
        recipientName: "",
        organization: "",
        course: "",
        achievement: "",
        issueDate: new Date().toISOString().split("T")[0],
        certificateId: "",
        skills: [],
        duration: "",
        issuer: "",
        confidence: 0.5,
        warnings: ["AI service offline. Please enter certificate details manually."],
      };
      setExtractedData(fallback);
      setEditedData(fallback);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleMint = async () => {
    if (!editedData || !selectedFile) return;

    if (!connected || !wallet || !address) {
      alert("Please connect your wallet first in the top right navbar!");
      return;
    }

    setCurrentStep("mint");
    setIsProcessing(true);

    try {
      // Step 1: Save to database & upload PDF to IPFS
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      
      const metadata = {
        ...editedData,
        walletAddress: address,
      };
      formData.append("metadata", JSON.stringify(metadata));

      const issueRes = await fetch("/api/credentials/issue", {
        method: "POST",
        body: formData,
      });

      if (!issueRes.ok) {
        const errorData = await issueRes.json();
        throw new Error(errorData.error || "Failed to create DB record");
      }

      const issueData = await issueRes.json();

      // Step 2: Mint the NFT using the connected wallet
      const mintResult = await mintCredentialNFT(wallet, address, {
        recipientName: editedData.recipientName,
        organization: editedData.organization,
        course: editedData.course,
        achievement: editedData.achievement,
        certificateHash: issueData.certificateHash,
        issuedAt: editedData.issueDate,
        skills: editedData.skills,
        shortCode: issueData.shortCode,
        verificationUrl: issueData.verificationUrl,
      });

      // Step 3: Update transaction details in the database
      const updateRes = await fetch("/api/credentials/update-tx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shortCode: issueData.shortCode,
          txHash: mintResult.txHash,
          policyId: mintResult.policyId,
          assetName: mintResult.assetName,
        }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to save transaction details to database");
      }

      setMintResult({
        txHash: mintResult.txHash,
        shortCode: issueData.shortCode,
        verificationUrl: issueData.verificationUrl,
      });

      setCurrentStep("success");
    } catch (error: any) {
      console.error("Minting failed:", error);
      alert(`Minting transaction failed: ${error.message || error}`);
      setCurrentStep("review");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateField = (field: keyof ExtractedData, value: string | string[]) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && editedData) {
      updateField("skills", [...editedData.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    if (editedData) {
      const newSkills = [...editedData.skills];
      newSkills.splice(index, 1);
      updateField("skills", newSkills);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "64px", minHeight: "100vh" }}>
        <div className="container" style={{ paddingTop: "40px", paddingBottom: "40px", maxWidth: "800px" }}>
          {/* Back button */}
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              marginBottom: "24px",
            }}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "32px",
            }}
          >
            Issue New Credential
          </h1>

          {/* Step Indicator */}
          {currentStep !== "success" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
                marginBottom: "40px",
              }}
            >
              {steps.map((step, i) => {
                const isActive = i === currentStepIndex;
                const isCompleted = i < currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        borderRadius: "100px",
                        background: isActive
                          ? "rgba(99, 102, 241, 0.15)"
                          : isCompleted
                          ? "rgba(16, 185, 129, 0.1)"
                          : "transparent",
                        border: `1px solid ${
                          isActive
                            ? "rgba(99, 102, 241, 0.3)"
                            : isCompleted
                            ? "rgba(16, 185, 129, 0.2)"
                            : "var(--color-border)"
                        }`,
                        transition: "var(--transition-base)",
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle size={16} color="var(--color-accent-emerald)" />
                      ) : (
                        <Icon
                          size={16}
                          color={isActive ? "var(--color-accent-primary)" : "var(--color-text-muted)"}
                        />
                      )}
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive
                            ? "var(--color-accent-primary)"
                            : isCompleted
                            ? "var(--color-accent-emerald)"
                            : "var(--color-text-muted)",
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: "1px",
                          background: isCompleted
                            ? "var(--color-accent-emerald)"
                            : "var(--color-border)",
                          margin: "0 8px",
                          transition: "var(--transition-base)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step Content */}
          {currentStep === "upload" && (
            <div className="animate-fade-in">
              <FileUpload
                onFileSelect={handleFileSelect}
                label="Upload Certificate PDF"
                description="AI will automatically extract recipient name, organization, skills, and all metadata"
                isProcessing={isProcessing}
              />

              <div className="glass-card" style={{ padding: "20px", marginTop: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: "var(--color-text-secondary)" }}>
                  What happens next?
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { icon: Brain, text: "AI extracts metadata from your certificate" },
                    { icon: Eye, text: "You review and edit the extracted data" },
                    { icon: Hash, text: "Certificate is hashed (SHA-256) for tamper-proofing" },
                    { icon: Coins, text: "Credential NFT is minted on Cardano" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Icon size={14} color="var(--color-text-muted)" />
                      <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === "extract" && isProcessing && (
            <div className="animate-fade-in" style={{ textAlign: "center", padding: "64px 0" }}>
              <Loader2
                size={40}
                color="var(--color-accent-primary)"
                style={{ animation: "spin 1s linear infinite", margin: "0 auto 24px" }}
              />
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                AI is analyzing your certificate...
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
                Extracting metadata, inferring skills, and checking for anomalies
              </p>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {currentStep === "extract" && !isProcessing && editedData && (
            <div className="animate-fade-in">
              {/* Confidence Bar */}
              <div className="glass-card" style={{ padding: "16px 20px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                    Extraction Confidence
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: editedData.confidence > 0.8 ? "var(--color-accent-emerald)" : "var(--color-accent-amber)" }}>
                    {Math.round(editedData.confidence * 100)}%
                  </span>
                </div>
                <div style={{ height: "6px", borderRadius: "3px", background: "var(--color-bg-secondary)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${editedData.confidence * 100}%`,
                      borderRadius: "3px",
                      background: editedData.confidence > 0.8
                        ? "var(--color-accent-emerald)"
                        : "var(--color-accent-amber)",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>

              {/* Warnings */}
              {editedData.warnings.length > 0 && (
                <div
                  style={{
                    padding: "14px 18px",
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "24px",
                  }}
                >
                  {editedData.warnings.map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <AlertTriangle size={14} color="var(--color-accent-amber)" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "var(--color-accent-amber)" }}>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Editable Fields */}
              <div className="glass-card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "24px" }}>
                  Extracted Metadata
                  <span style={{ fontSize: "12px", fontWeight: 400, color: "var(--color-text-muted)", marginLeft: "8px" }}>
                    Edit any field before minting
                  </span>
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label className="label"><User size={12} style={{ display: "inline", marginRight: 4 }} />Recipient Name</label>
                    <input
                      className="input"
                      value={editedData.recipientName}
                      onChange={(e) => updateField("recipientName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label"><Building2 size={12} style={{ display: "inline", marginRight: 4 }} />Organization</label>
                    <input
                      className="input"
                      value={editedData.organization}
                      onChange={(e) => updateField("organization", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label"><GraduationCap size={12} style={{ display: "inline", marginRight: 4 }} />Course / Program</label>
                    <input
                      className="input"
                      value={editedData.course}
                      onChange={(e) => updateField("course", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label"><Award size={12} style={{ display: "inline", marginRight: 4 }} />Achievement</label>
                    <input
                      className="input"
                      value={editedData.achievement}
                      onChange={(e) => updateField("achievement", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label"><Calendar size={12} style={{ display: "inline", marginRight: 4 }} />Issue Date</label>
                    <input
                      className="input"
                      type="date"
                      value={editedData.issueDate}
                      onChange={(e) => updateField("issueDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label"><Clock size={12} style={{ display: "inline", marginRight: 4 }} />Duration</label>
                    <input
                      className="input"
                      value={editedData.duration}
                      onChange={(e) => updateField("duration", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label"><Hash size={12} style={{ display: "inline", marginRight: 4 }} />Certificate ID</label>
                    <input
                      className="input"
                      value={editedData.certificateId}
                      onChange={(e) => updateField("certificateId", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label"><User size={12} style={{ display: "inline", marginRight: 4 }} />Issuer (Signer)</label>
                    <input
                      className="input"
                      value={editedData.issuer}
                      onChange={(e) => updateField("issuer", e.target.value)}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div style={{ marginTop: "24px" }}>
                  <label className="label">Skills (AI-inferred)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                    {editedData.skills.map((skill, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <SkillTag skill={skill} />
                        <button
                          onClick={() => removeSkill(i)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "2px",
                            color: "var(--color-text-muted)",
                          }}
                          aria-label={`Remove ${skill}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      className="input"
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      style={{ flex: 1 }}
                    />
                    <button className="btn-secondary btn-sm" onClick={addSkill}>
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                <button className="btn-secondary" onClick={() => setCurrentStep("upload")}>
                  <ArrowLeft size={16} />
                  Re-upload
                </button>
                <button className="btn-primary" onClick={() => setCurrentStep("review")}>
                  Review & Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {currentStep === "review" && editedData && (
            <div className="animate-fade-in">
              <div className="glass-card" style={{ padding: "32px", position: "relative", overflow: "hidden" }}>
                {/* Gradient strip */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "var(--gradient-primary)",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Credential Preview</h3>
                  <div className="badge badge-pending">Ready to Mint</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {[
                    { label: "Recipient", value: editedData.recipientName },
                    { label: "Organization", value: editedData.organization },
                    { label: "Course", value: editedData.course },
                    { label: "Achievement", value: editedData.achievement },
                    { label: "Issue Date", value: new Date(editedData.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                    { label: "Duration", value: editedData.duration },
                    { label: "Certificate ID", value: editedData.certificateId },
                    { label: "Signed By", value: editedData.issuer },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: "14px", color: "var(--color-text-primary)", fontWeight: 500 }}>
                        {value || "—"}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--color-border)" }}>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                    Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {editedData.skills.map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                  </div>
                </div>

                {selectedFile && (
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--color-border)" }}>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                      Source Certificate
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <code className="mono" style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                        {selectedFile.name}
                      </code>
                      <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mint info */}
              <div
                className="glass-card"
                style={{ padding: "20px", marginTop: "16px" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <Coins size={18} color="var(--color-accent-primary)" style={{ marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                      Clicking &quot;Mint Credential&quot; will:
                    </p>
                    <ul style={{ margin: "8px 0 0 16px", fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 2 }}>
                      <li>Hash the certificate (SHA-256)</li>
                      <li>Upload the PDF to IPFS via Pinata</li>
                      <li>Mint a credential NFT on Cardano Preprod</li>
                      <li>Generate a QR code and verification link</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                <button className="btn-secondary" onClick={() => setCurrentStep("extract")}>
                  <ArrowLeft size={16} />
                  Edit Fields
                </button>
                <button className="btn-primary" onClick={handleMint} style={{ padding: "14px 32px" }}>
                  <Coins size={18} />
                  Mint Credential
                </button>
              </div>
            </div>
          )}

          {currentStep === "mint" && isProcessing && (
            <div className="animate-fade-in" style={{ textAlign: "center", padding: "64px 0" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "3px solid var(--color-border)",
                  borderTopColor: "var(--color-accent-primary)",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 24px",
                }}
              />
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                Minting Credential on Cardano...
              </h3>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "32px" }}>
                Hashing certificate, uploading to IPFS, and submitting transaction
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "300px", margin: "0 auto" }}>
                {[
                  { text: "Certificate hashed", done: true },
                  { text: "Uploaded to IPFS", done: true },
                  { text: "Minting NFT...", done: false },
                ].map(({ text, done }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {done ? (
                      <CheckCircle size={16} color="var(--color-accent-emerald)" />
                    ) : (
                      <Loader2 size={16} color="var(--color-accent-primary)" style={{ animation: "spin 1s linear infinite" }} />
                    )}
                    <span style={{ fontSize: "14px", color: done ? "var(--color-accent-emerald)" : "var(--color-text-primary)" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {currentStep === "success" && mintResult && editedData && (
            <div className="animate-fade-in" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "2px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <CheckCircle size={36} color="var(--color-accent-emerald)" />
              </div>

              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  letterSpacing: "-0.02em",
                }}
              >
                Credential Minted! 🎉
              </h2>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "32px" }}>
                The credential for {editedData.recipientName} has been minted on Cardano
              </p>

              {/* Result Card */}
              <div className="glass-card" style={{ padding: "28px", textAlign: "left", maxWidth: "500px", margin: "0 auto 24px" }}>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                      Verification Link
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <code className="mono" style={{ fontSize: "13px", color: "var(--color-accent-cyan)" }}>
                        {mintResult.verificationUrl}
                      </code>
                      <a href={`/verify/${mintResult.shortCode}`} target="_blank" rel="noopener noreferrer" className="btn-icon" style={{ width: "28px", height: "28px" }}>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                      Transaction Hash
                    </div>
                    <code className="mono" style={{ fontSize: "12px", color: "var(--color-text-secondary)", wordBreak: "break-all" }}>
                      {mintResult.txHash}
                    </code>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                      Short Code
                    </div>
                    <code className="mono" style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-accent-primary)" }}>
                      {mintResult.shortCode}
                    </code>
                  </div>
                </div>
              </div>

              {/* QR Code placeholder */}
              <div
                className="glass-card"
                style={{
                  padding: "24px",
                  maxWidth: "500px",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    background: "white",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={60} color="#111" />
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>Scan to Verify</p>
                  <p style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                    Share this QR code with the recipient. Anyone can scan it to instantly verify the credential.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                <Link href={`/verify/${mintResult.shortCode}`} className="btn-primary">
                  View Verification Page
                  <ExternalLink size={16} />
                </Link>
                <Link href="/dashboard/issue" className="btn-secondary" onClick={() => {
                  setCurrentStep("upload");
                  setSelectedFile(null);
                  setExtractedData(null);
                  setEditedData(null);
                  setMintResult(null);
                }}>
                  Issue Another
                </Link>
                <Link href="/dashboard" className="btn-secondary">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
