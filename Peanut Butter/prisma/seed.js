const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Delete existing records to start clean
  await prisma.credential.deleteMany({});
  await prisma.organization.deleteMany({});

  // Create a default organization
  const organization = await prisma.organization.create({
    data: {
      name: "Government Institute of Electronics",
      walletAddress: "addr_test1vrmpxwh446nkl1234567890abcdefghijklmnopqrstuvwxyz",
      logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop",
      description: "Premier government institute for engineering and technology education.",
      website: "https://www.gie.edu",
    },
  });

  console.log(`Created organization: ${organization.name}`);

  // Create some initial credentials
  const cred1 = await prisma.credential.create({
    data: {
      shortCode: "8FH2KS9",
      recipientName: "Yekeshwar Naik",
      recipientEmail: "yekeshwar@example.com",
      course: "AI & Machine Learning",
      achievement: "Hackathon Winner",
      skills: JSON.stringify(["Python", "Machine Learning", "TensorFlow", "Deep Learning", "Blockchain"]),
      issueDate: new Date("2026-07-12"),
      duration: "6 months",
      certificateHash: "4d8918abf72d7c3e9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f",
      txHash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      policyId: "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
      assetName: "38464832",
      status: "MINTED",
      organizationId: organization.id,
    },
  });

  const cred2 = await prisma.credential.create({
    data: {
      shortCode: "KP4MN7D",
      recipientName: "Yekeshwar Naik",
      recipientEmail: "yekeshwar@example.com",
      course: "Plutus Pioneer Program",
      achievement: "Completion",
      skills: JSON.stringify(["Haskell", "Plutus", "Cardano", "Smart Contracts"]),
      issueDate: new Date("2026-05-20"),
      duration: "2 months",
      certificateHash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      txHash: "e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2",
      policyId: "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
      assetName: "4b50344d",
      status: "MINTED",
      organizationId: organization.id,
    },
  });

  const cred3 = await prisma.credential.create({
    data: {
      shortCode: "QR7TY2W",
      recipientName: "Yekeshwar Naik",
      recipientEmail: "yekeshwar@example.com",
      course: "Cloud Solutions Architect",
      achievement: "Certification",
      skills: JSON.stringify(["AWS", "Cloud Architecture", "DevOps"]),
      issueDate: new Date("2026-03-15"),
      duration: "3 months",
      certificateHash: "8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d",
      txHash: "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      policyId: "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
      assetName: "51523754",
      status: "MINTED",
      organizationId: organization.id,
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
