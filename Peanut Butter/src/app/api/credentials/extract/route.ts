import { NextRequest, NextResponse } from "next/server";
import { extractMetadataFromText } from "@/lib/ai/ai-service";
import { runForgeryDetection } from "@/lib/ai/forgery-detection";
import { hashFile } from "@/lib/utils";

/**
 * POST /api/credentials/extract
 *
 * Accept a PDF file, extract text (simplified — in production use PDF.js + Tesseract),
 * then run AI extraction and forgery detection.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get("pdf") as File;

    if (!pdfFile) {
      return NextResponse.json(
        { error: "PDF file is required" },
        { status: 400 }
      );
    }

    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

    // For now, we'll use a simplified text extraction approach.
    // In production, this would use PDF.js for text-native PDFs
    // and Tesseract.js for scanned/image PDFs.
    // 
    // Here, we convert the buffer to string and clean up binary artifacts
    // to simulate text extraction. The AI model handles the rest.
    const rawText = pdfBuffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");

    // If we got meaningful text, proceed with AI extraction
    let extractedMetadata;
    
    if (rawText.trim().length > 50 && process.env.GEMINI_API_KEY) {
      // AI extraction
      extractedMetadata = await extractMetadataFromText(rawText);
    } else {
      // Fallback: return empty template for manual filling
      extractedMetadata = {
        recipientName: "",
        organization: "",
        course: "",
        achievement: "",
        issueDate: new Date().toISOString().split("T")[0],
        certificateId: "",
        skills: [],
        duration: "",
        issuer: "",
        confidence: 0,
        warnings: ["Could not extract text from PDF. Please fill in the fields manually."],
      };
    }

    // Run forgery detection
    let forgeryReport = null;
    try {
      if (process.env.GEMINI_API_KEY) {
        forgeryReport = await runForgeryDetection(pdfBuffer, rawText, {
          recipientName: extractedMetadata.recipientName,
          organization: extractedMetadata.organization,
          issueDate: extractedMetadata.issueDate,
        });
      }
    } catch (forgeryError) {
      console.warn("Forgery detection failed:", forgeryError);
    }

    // Hash the certificate
    const certificateHash = hashFile(pdfBuffer);

    return NextResponse.json({
      metadata: extractedMetadata,
      forgeryReport,
      certificateHash,
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
    });
  } catch (error) {
    console.error("Extraction failed:", error);
    return NextResponse.json(
      { error: "Failed to extract metadata from PDF" },
      { status: 500 }
    );
  }
}
