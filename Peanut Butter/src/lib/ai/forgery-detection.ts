import { prisma } from "@/lib/db";
import { hashFile } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in env variables");
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface ForgeryReport {
  isDuplicate: boolean;
  duplicateCredentialId?: string;
  anomalies: AnomalyWarning[];
  riskLevel: "low" | "medium" | "high";
  overallScore: number; // 0 = likely forged, 1 = likely authentic
}

export interface AnomalyWarning {
  type: "duplicate" | "missing_info" | "formatting" | "inconsistency";
  message: string;
  severity: "info" | "warning" | "critical";
}

/**
 * Check if a certificate with the same hash already exists in the database.
 */
export async function checkDuplicate(
  pdfBuffer: Buffer
): Promise<{ isDuplicate: boolean; credentialId?: string }> {
  const hash = hashFile(pdfBuffer);

  const existing = await prisma.credential.findFirst({
    where: { certificateHash: hash },
  });

  if (existing) {
    return { isDuplicate: true, credentialId: existing.id };
  }

  return { isDuplicate: false };
}

/**
 * Analyze extracted text for potential forgery indicators using Gemini.
 */
export async function analyzeForForgery(
  extractedText: string,
  metadata: {
    recipientName: string;
    organization: string;
    issueDate: string;
  }
): Promise<ForgeryReport> {
  const anomalies: AnomalyWarning[] = [];

  // Basic checks
  if (!metadata.recipientName) {
    anomalies.push({
      type: "missing_info",
      message: "No recipient name could be extracted",
      severity: "critical",
    });
  }

  if (!metadata.organization) {
    anomalies.push({
      type: "missing_info",
      message: "No issuing organization could be identified",
      severity: "critical",
    });
  }

  if (!metadata.issueDate) {
    anomalies.push({
      type: "missing_info",
      message: "No issue date found on the certificate",
      severity: "warning",
    });
  }

  // AI-assisted analysis
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are a document authenticity analyst. Analyze the following certificate text for signs of tampering or forgery.

Look for:
- Inconsistent formatting or unusual characters
- Mismatched dates (e.g., future dates, impossible timelines)
- Suspicious language or grammar errors unusual for official documents
- Missing standard certificate elements (signatures, seals, registration numbers)
- Conflicting information within the document

Return JSON:
{
  "anomalies": [
    {
      "type": "formatting" | "inconsistency" | "missing_info",
      "message": "Description of the issue",
      "severity": "info" | "warning" | "critical"
    }
  ],
  "riskLevel": "low" | "medium" | "high",
  "overallScore": 0.0 to 1.0
}

Analyze this certificate text:
${extractedText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    if (content) {
      const aiResult = JSON.parse(content);
      anomalies.push(...(aiResult.anomalies || []));

      return {
        isDuplicate: false,
        anomalies,
        riskLevel: aiResult.riskLevel || "low",
        overallScore: aiResult.overallScore ?? 0.8,
      };
    }
  } catch (error) {
    console.error("AI forgery analysis failed:", error);
  }

  // Fallback if AI analysis fails
  const criticalCount = anomalies.filter(
    (a) => a.severity === "critical"
  ).length;
  return {
    isDuplicate: false,
    anomalies,
    riskLevel: criticalCount > 1 ? "high" : criticalCount > 0 ? "medium" : "low",
    overallScore: criticalCount > 1 ? 0.3 : criticalCount > 0 ? 0.6 : 0.9,
  };
}

/**
 * Full forgery detection pipeline.
 */
export async function runForgeryDetection(
  pdfBuffer: Buffer,
  extractedText: string,
  metadata: {
    recipientName: string;
    organization: string;
    issueDate: string;
  }
): Promise<ForgeryReport> {
  // Step 1: Check for duplicates
  const duplicateCheck = await checkDuplicate(pdfBuffer);

  // Step 2: AI analysis
  const report = await analyzeForForgery(extractedText, metadata);

  if (duplicateCheck.isDuplicate) {
    report.isDuplicate = true;
    report.duplicateCredentialId = duplicateCheck.credentialId;
    report.anomalies.unshift({
      type: "duplicate",
      message:
        "A certificate with the exact same content has already been issued",
      severity: "critical",
    });
    report.riskLevel = "high";
    report.overallScore = Math.min(report.overallScore, 0.2);
  }

  return report;
}
