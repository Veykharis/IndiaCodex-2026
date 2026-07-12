[README (1).md](https://github.com/user-attachments/files/29944171/README.1.md)
# Proofpass — AI-Powered Verifiable Credentials on Cardano

Proofpass is a **digital credential passport** built on the Cardano blockchain. It enables universities, organizations, and bootcamps to issue tamper-proof certificates as Cardano NFTs, which can be instantly verified by anyone without contacting the issuer.

---

## 👥 Team Members

* **Nanduri Chetan**
* **Vankodvath Yekeshwar**
* **Nanduri Adithya**
---

## 🔴 The Problem

Today, paper and PDF certificates are extremely easy to manipulate and fake:
* **Edited internship letters** and fake course completions.
* **Resume inflation** (claiming skills not actually certified).
* **Manual verification overhead**: Recruiters spend days emailing or calling organizations to verify candidate backgrounds.

---

## 🟢 The Solution

Proofpass secures the credentials pipeline from issuance to recruiter validation:
1. **AI Extraction**: Issuers drop a certificate PDF; **Google Gemini 2.5 Flash** automatically extracts the candidate's name, skills, course name, and issue dates.
2. **IPFS Archiving**: The original PDF is securely archived to **Pinata IPFS** for decentralized storage.
3. **Cardano NFT Minting**: A CIP-25 compliant NFT is minted on the Cardano Preprod Testnet, binding the recipient's name, course, and original PDF hash permanently on-chain.
4. **Instant Verification**: Recruiters verify authenticity by simply uploading a PDF certificate or searching by credential shortcode. The system compares the file's SHA-256 hash against the on-chain registry.

---

## 🛠️ Tech Stack

* **Blockchain**: Cardano Preprod Testnet
* **Web3 Integration**: [Mesh SDK](https://meshjs.dev/) & [Blockfrost API Provider](https://blockfrost.io/)
* **AI & Forgery Engine**: Google Gemini 2.5 Flash
* **Decentralized Storage**: IPFS via [Pinata SDK](https://www.pinata.cloud/)
* **Backend Database**: SQLite, Prisma ORM
* **Frontend Framework**: Next.js 16 (App Router, Webpack, TypeScript, TailwindCSS/Vanilla CSS)

---

## 📸 Project Screenshots

### 1. Issuer Dashboard
![Issuer Dashboard](public/screenshots/dashboard.png)

### 2. Connected Web3 Wallet Connection Modal
![Cardano Wallet Connection Modal](public/screenshots/wallet_modal.png)

---

## 📊 Project Presentation & Links

* **Presentation Slides**: [Download Proofpass.pptx](Proofpass.pptx) (Located in the project root folder)
* **Local Landing Page**: `http://localhost:3000`
* **Local Verification Portal**: `http://localhost:3000/verify`

---

## 🚀 Local Installation & Setup

### 1. Clone the project and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables (`.env.local` / `.env`):
Create a `.env` file in the root directory and populate it with your API keys:
```env
# Cardano Network
NEXT_PUBLIC_CARDANO_NETWORK=preprod
BLOCKFROST_API_KEY=your_blockfrost_preprod_project_id

# Google Gemini API
GEMINI_API_KEY=your_google_ai_studio_api_key

# IPFS Pinata
PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud

# SQLite Database
DATABASE_URL="file:./dev.db"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize and Seed SQLite Database:
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run the Dev Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser.
