import type { Metadata } from "next";
import "./globals.css";
import "@meshsdk/react/styles.css";

export const metadata: Metadata = {
  title: "ProofPass — AI-Powered Verifiable Credentials on Cardano",
  description:
    "Create tamper-proof digital credentials as Cardano NFTs. AI extracts metadata from certificates, and anyone can verify them instantly via QR code.",
  keywords: [
    "ProofPass",
    "Cardano",
    "verifiable credentials",
    "NFT",
    "certificate verification",
    "blockchain",
    "AI",
  ],
  openGraph: {
    title: "ProofPass — Verifiable Credentials on Cardano",
    description:
      "Create tamper-proof digital credentials backed by Cardano blockchain and AI.",
    type: "website",
  },
};

import WalletProvider from "@/components/WalletProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-grid">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
