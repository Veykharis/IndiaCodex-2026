import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PinataSDK } from "pinata";

export async function GET(request: NextRequest) {
  const results: Record<string, any> = {
    env: {
      blockfrost: {
        present: !!process.env.BLOCKFROST_API_KEY,
        prefix: process.env.BLOCKFROST_API_KEY
          ? process.env.BLOCKFROST_API_KEY.slice(0, 10) + "..."
          : null,
      },
      gemini: {
        present: !!process.env.GEMINI_API_KEY,
        prefix: process.env.GEMINI_API_KEY
          ? process.env.GEMINI_API_KEY.slice(0, 10) + "..."
          : null,
      },
      pinata: {
        present: !!process.env.PINATA_JWT,
        prefix: process.env.PINATA_JWT
          ? process.env.PINATA_JWT.slice(0, 15) + "..."
          : null,
      },
    },
    services: {
      blockfrost: { success: false, details: null },
      gemini: { success: false, details: null },
      pinata: { success: false, details: null },
    },
  };

  // Test 1: Blockfrost API check
  if (process.env.BLOCKFROST_API_KEY) {
    try {
      const response = await fetch(
        "https://cardano-preprod.blockfrost.io/api/v0/blocks/latest",
        {
          headers: {
            project_id: process.env.BLOCKFROST_API_KEY,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        results.services.blockfrost.success = true;
        results.services.blockfrost.details = {
          blockHeight: data.height,
          blockHash: data.hash,
        };
      } else {
        const text = await response.text();
        results.services.blockfrost.details = `Blockfrost responded with status ${response.status}: ${text}`;
      }
    } catch (e: any) {
      results.services.blockfrost.details = `Error: ${e.message || e}`;
    }
  } else {
    results.services.blockfrost.details = "API key missing";
  }

  // Test 2: Gemini API check
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent("Reply with the word OK.");
      const response = await result.response;
      const text = response.text()?.trim();
      
      if (text === "OK" || text?.toLowerCase().includes("ok")) {
        results.services.gemini.success = true;
        results.services.gemini.details = { response: text };
      } else {
        results.services.gemini.details = `Unexpected response: ${text}`;
      }
    } catch (e: any) {
      results.services.gemini.details = `Error: ${e.message || e}`;
    }
  } else {
    results.services.gemini.details = "API key missing";
  }

  // Test 3: Pinata IPFS check
  if (process.env.PINATA_JWT) {
    try {
      const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway:
          process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud",
      });
      const file = new File(["ProofPass service validation test file"], "test.txt", {
        type: "text/plain",
      });
      const upload = await pinata.upload.public.file(file);
      if (upload && upload.cid) {
        results.services.pinata.success = true;
        results.services.pinata.details = {
          cid: upload.cid,
          size: upload.size,
        };
      } else {
        results.services.pinata.details = "Upload returned no CID";
      }
    } catch (e: any) {
      results.services.pinata.details = `Error: ${e.message || e}`;
    }
  } else {
    results.services.pinata.details = "JWT missing";
  }

  return NextResponse.json(results);
}
