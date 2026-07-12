"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  isProcessing?: boolean;
}

export default function FileUpload({
  onFileSelect,
  accept = ".pdf",
  maxSizeMB = 10,
  label = "Upload Certificate PDF",
  description = "Drag and drop your certificate, or click to browse",
  isProcessing = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      // Validate file type
      if (accept && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Please upload a PDF file");
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be under ${maxSizeMB}MB`);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [accept, maxSizeMB, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div
        className={`upload-zone ${isDragging ? "active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        style={{
          opacity: isProcessing ? 0.7 : 1,
          pointerEvents: isProcessing ? "none" : "auto",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ display: "none" }}
          id="file-upload-input"
        />

        {selectedFile ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                background: "rgba(16, 185, 129, 0.1)",
              }}
            >
              {isProcessing ? (
                <div className="shimmer" style={{ width: 40, height: 40, borderRadius: 8 }} />
              ) : (
                <CheckCircle size={28} color="var(--color-accent-emerald)" />
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                <FileText size={16} color="var(--color-text-secondary)" />
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                  {selectedFile.name}
                </span>
                {!isProcessing && (
                  <button
                    onClick={clearFile}
                    className="btn-icon"
                    style={{ width: "24px", height: "24px", border: "none" }}
                    aria-label="Remove file"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                {isProcessing && " — Processing..."}
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                background: isDragging
                  ? "rgba(99, 102, 241, 0.15)"
                  : "rgba(99, 102, 241, 0.08)",
                transition: "var(--transition-base)",
              }}
            >
              <Upload
                size={28}
                color={isDragging ? "var(--color-accent-primary)" : "var(--color-text-muted)"}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                {label}
              </p>
              <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                {description}
              </p>
            </div>
            <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
              PDF only, max {maxSizeMB}MB
            </span>
          </>
        )}
      </div>

      {error && (
        <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--color-accent-rose)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
