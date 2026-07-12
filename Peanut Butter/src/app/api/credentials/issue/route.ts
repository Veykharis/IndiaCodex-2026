import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashFile, generateShortCode, getVerificationUrl } from "@/lib/utils";
import { uploadPdfToIPFS } from "@/lib/storage/ipfs-service";

/**
 * POST /api/credentials/issue
 * 
 * Issue a new credential:
 * 1. Hash the PDF
 * 2. Upload to IPFS
 * 3. Save credential to database
 * 4. (Client-side: mint NFT via wallet)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get("pdf") as File;
    const metadataJson = formData.get("metadata") as string;

    if (!pdfFile || !metadataJson) {
      return NextResponse.json(
        { error: "PDF file and metadata are required" },
        { status: 400 }
      );
    }

    const metadata = JSON.parse(metadataJson);
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

    // Step 1: Hash the certificate
    const certificateHash = hashFile(pdfBuffer);

    // Step 2: Check for duplicates
    const existing = await prisma.credential.findFirst({
      where: { certificateHash },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "A certificate with this exact content already exists",
          existingId: existing.id,
          shortCode: existing.shortCode,
        },
        { status: 409 }
      );
    }

    // Step 3: Upload to IPFS (if Pinata is configured)
    let pdfIpfsCid: string | null = null;
    let pdfIpfsUrl: string | null = null;

    try {
      if (process.env.PINATA_JWT) {
        const upload = await uploadPdfToIPFS(pdfBuffer, pdfFile.name);
        pdfIpfsCid = upload.cid;
        pdfIpfsUrl = upload.url;
      }
    } catch (ipfsError) {
      console.warn("IPFS upload failed, continuing without:", ipfsError);
    }

    // Step 4: Resolve or create Organization
    const walletAddress = metadata.walletAddress || "addr_test1vrmpxwh446nkl1234567890abcdefghijklmnopqrstuvwxyz";
    const orgName = metadata.organization || "Independent Issuer";
    
    let organization = await prisma.organization.findUnique({
      where: { walletAddress },
    });
    
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: orgName,
          walletAddress,
          logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop",
        },
      });
    }

    // Step 5: Generate short code and create credential
    const shortCode = generateShortCode();
    const verificationUrl = getVerificationUrl(shortCode);

    const credential = await prisma.credential.create({
      data: {
        shortCode,
        recipientName: metadata.recipientName,
        recipientEmail: metadata.recipientEmail || null,
        course: metadata.course || null,
        achievement: metadata.achievement || null,
        skills: JSON.stringify(metadata.skills || []),
        issueDate: new Date(metadata.issueDate),
        duration: metadata.duration || null,
        certificateHash,
        pdfIpfsCid,
        pdfIpfsUrl,
        status: "PENDING",
        organizationId: organization.id,
      },
      include: {
        organization: true,
      },
    });

    return NextResponse.json({
      credential,
      shortCode,
      certificateHash,
      verificationUrl,
      pdfIpfsCid,
      pdfIpfsUrl,
    });
  } catch (error) {
    console.error("Failed to issue credential:", error);
    return NextResponse.json(
      { error: "Failed to issue credential" },
      { status: 500 }
    );
  }
}
