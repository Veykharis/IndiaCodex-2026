import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/credentials/verify/[shortCode]
 *
 * Public endpoint — verify a credential by short code.
 * Returns credential data + on-chain verification status.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    const credential = await prisma.credential.findUnique({
      where: { shortCode },
      include: {
        organization: {
          select: {
            name: true,
            logo: true,
            website: true,
          },
        },
      },
    });

    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found", verified: false },
        { status: 404 }
      );
    }

    // Parse skills from JSON string
    let skills: string[] = [];
    try {
      skills = JSON.parse(credential.skills);
    } catch {
      skills = [];
    }

    // Determine verification status
    const isVerified = credential.status === "MINTED" && !!credential.txHash;
    const isRevoked = credential.status === "REVOKED";

    return NextResponse.json({
      verified: isVerified && !isRevoked,
      status: credential.status,
      credential: {
        shortCode: credential.shortCode,
        recipientName: credential.recipientName,
        organization: credential.organization.name,
        organizationLogo: credential.organization.logo,
        course: credential.course,
        achievement: credential.achievement,
        skills,
        issueDate: credential.issueDate.toISOString(),
        duration: credential.duration,
        certificateHash: credential.certificateHash,
        txHash: credential.txHash,
        policyId: credential.policyId,
        assetName: credential.assetName,
        pdfIpfsUrl: credential.pdfIpfsUrl,
        createdAt: credential.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Verification lookup failed:", error);
    return NextResponse.json(
      { error: "Verification failed", verified: false },
      { status: 500 }
    );
  }
}
