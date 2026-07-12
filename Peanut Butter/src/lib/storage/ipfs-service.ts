import { PinataSDK } from "pinata";

let pinataInstance: PinataSDK | null = null;

function getPinata(): PinataSDK {
  if (!pinataInstance) {
    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      throw new Error("PINATA_JWT is not set in environment variables");
    }

    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "";

    pinataInstance = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: gateway,
    });
  }

  return pinataInstance;
}

export interface UploadResult {
  cid: string;
  url: string;
}

/**
 * Upload a PDF file to IPFS via Pinata.
 */
export async function uploadPdfToIPFS(
  fileBuffer: Buffer,
  fileName: string
): Promise<UploadResult> {
  const pinata = getPinata();

  const file = new File([new Uint8Array(fileBuffer)], fileName, {
    type: "application/pdf",
  });

  const upload = await pinata.upload.public.file(file);

  const gateway =
    process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";

  return {
    cid: upload.cid,
    url: `https://${gateway}/ipfs/${upload.cid}`,
  };
}

/**
 * Get the IPFS gateway URL for a given CID.
 */
export function getIpfsUrl(cid: string): string {
  const gateway =
    process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
  return `https://${gateway}/ipfs/${cid}`;
}
