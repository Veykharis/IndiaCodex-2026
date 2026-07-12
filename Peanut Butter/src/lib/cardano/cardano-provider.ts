import { BlockfrostProvider } from "@meshsdk/core";

/**
 * Get a configured Blockfrost provider for the current Cardano network.
 */
export function getProvider(): BlockfrostProvider {
  const apiKey = process.env.BLOCKFROST_API_KEY;
  if (!apiKey) {
    throw new Error("BLOCKFROST_API_KEY is not set in environment variables");
  }

  const network = process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preprod";

  // Blockfrost network mapping
  const networkMap: Record<string, string> = {
    preprod: "preprod",
    preview: "preview",
    mainnet: "mainnet",
  };

  return new BlockfrostProvider(apiKey);
}

/**
 * Get the Blockfrost API base URL for direct API calls.
 */
export function getBlockfrostBaseUrl(): string {
  const network = process.env.NEXT_PUBLIC_CARDANO_NETWORK || "preprod";

  const urls: Record<string, string> = {
    preprod: "https://cardano-preprod.blockfrost.io/api/v0",
    preview: "https://cardano-preview.blockfrost.io/api/v0",
    mainnet: "https://cardano-mainnet.blockfrost.io/api/v0",
  };

  return urls[network] || urls.preprod;
}
