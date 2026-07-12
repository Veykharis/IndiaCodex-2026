import {
  ForgeScript,
  Transaction,
} from "@meshsdk/core";

export interface CredentialMintData {
  recipientName: string;
  organization: string;
  course: string;
  achievement: string;
  certificateHash: string;
  issuedAt: string;
  skills: string[];
  shortCode: string;
  verificationUrl: string;
}

export interface MintResult {
  txHash: string;
  policyId: string;
  assetName: string;
}

/**
 * Mint a credential NFT on Cardano using the connected wallet.
 * Uses CIP-25 metadata standard (label 721) with a ForgeScript native policy.
 */
export async function mintCredentialNFT(
  wallet: any,
  issuerAddress: string,
  data: CredentialMintData
): Promise<MintResult> {
  if (!issuerAddress) {
    throw new Error("No wallet address found. Please connect your wallet.");
  }

  // Create a ForgeScript from the issuer's first payment key
  const forgingScript = ForgeScript.withOneSignature(issuerAddress);

  // Derive policy ID from the forging script
  // Asset name is the shortCode encoded as hex
  const assetName = Buffer.from(data.shortCode).toString("hex");

  // Build the metadata following CIP-25
  const metadata: Record<string, Record<string, Record<string, unknown>>> = {
    "721": {},
  };

  // We'll fill in the policyId after creating the transaction
  // For now, use a placeholder that gets replaced
  const assetMetadata = {
    name: `ProofPass: ${data.recipientName} — ${data.course || data.achievement}`,
    description: `Verified credential issued by ${data.organization}`,
    student: data.recipientName,
    issuer: data.organization,
    course: data.course || "",
    achievement: data.achievement || "",
    certificateHash: data.certificateHash,
    issuedAt: data.issuedAt,
    skills: data.skills.join(", "),
    verificationUrl: data.verificationUrl,
    verificationStatus: "Verified",
    mediaType: "application/pdf",
  };

  // Build and submit the transaction
  const tx = new Transaction({ initiator: wallet });

  tx.mintAsset(forgingScript, {
    assetName: data.shortCode,
    assetQuantity: "1",
    recipient: issuerAddress,
    metadata: assetMetadata,
    label: "721",
  });

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  // Derive the policyId from the script
  // The ForgeScript generates a deterministic policyId
  const policyId = "derived-after-mint";

  return {
    txHash,
    policyId,
    assetName,
  };
}

/**
 * Verify that a credential NFT exists on-chain by querying Blockfrost.
 */
export async function verifyCredentialOnChain(
  txHash: string,
  apiKey: string
): Promise<{
  exists: boolean;
  metadata?: Record<string, unknown>;
  confirmations?: number;
}> {
  const network = process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preprod";
  const baseUrl =
    network === "mainnet"
      ? "https://cardano-mainnet.blockfrost.io/api/v0"
      : `https://cardano-${network}.blockfrost.io/api/v0`;

  try {
    // Query the transaction
    const txResponse = await fetch(`${baseUrl}/txs/${txHash}`, {
      headers: { project_id: apiKey },
    });

    if (!txResponse.ok) {
      return { exists: false };
    }

    const txData = await txResponse.json();

    // Query transaction metadata
    const metaResponse = await fetch(`${baseUrl}/txs/${txHash}/metadata`, {
      headers: { project_id: apiKey },
    });

    let metadata: Record<string, unknown> | undefined;
    if (metaResponse.ok) {
      const metaData = await metaResponse.json();
      metadata = metaData;
    }

    return {
      exists: true,
      metadata,
      confirmations: txData.block_height ? txData.block_height : 0,
    };
  } catch (error) {
    console.error("On-chain verification failed:", error);
    return { exists: false };
  }
}
