import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/credentials
 *
 * List credentials for an organization (filtered by wallet address).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress query parameter is required" },
        { status: 400 }
      );
    }

    // Find the organization by wallet address
    const organization = await prisma.organization.findUnique({
      where: { walletAddress },
    });

    if (!organization) {
      return NextResponse.json({
        credentials: [],
        total: 0,
        page,
        limit,
      });
    }

    // Build filter
    const where: Record<string, unknown> = {
      organizationId: organization.id,
    };

    if (status) {
      where.status = status;
    }

    // Fetch credentials with pagination
    const [credentials, total] = await Promise.all([
      prisma.credential.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.credential.count({ where }),
    ]);

    return NextResponse.json({
      credentials,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to list credentials:", error);
    return NextResponse.json(
      { error: "Failed to list credentials" },
      { status: 500 }
    );
  }
}
