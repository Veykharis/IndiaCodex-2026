import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/credentials/update-tx
 * 
 * Update credential status to MINTED once the on-chain transaction is submitted.
 */
export async function POST(request: NextRequest) {
  try {
    const { shortCode, txHash, policyId, assetName } = await request.json();

    if (!shortCode || !txHash) {
      return NextResponse.json(
        { error: "shortCode and txHash are required" },
        { status: 400 }
      );
    }

    const credential = await prisma.credential.update({
      where: { shortCode },
      data: {
        txHash,
        policyId: policyId || "derived-after-mint",
        assetName: assetName || null,
        status: "MINTED",
      },
    });

    return NextResponse.json({
      success: true,
      credential,
    });
  } catch (error) {
    console.error("Failed to update transaction hash:", error);
    return NextResponse.json(
      { error: "Failed to update transaction hash" },
      { status: 500 }
    );
  }
}
