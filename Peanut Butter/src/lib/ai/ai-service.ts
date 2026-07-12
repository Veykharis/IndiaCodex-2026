import { GoogleGenerativeAI } from "@google/generative-ai";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in env variables");
  }
  return new GoogleGenerativeAI(apiKey);
};

export interface ExtractedMetadata {
  recipientName: string;
  organization: string;
  course: string;
  achievement: string;
  issueDate: string;
  certificateId: string;
  skills: string[];
  duration: string;
  issuer: string;
  confidence: number;
  warnings: string[];
}

/**
 * Extract structured metadata from certificate text using Gemini 1.5 Flash.
 */
export async function extractMetadataFromText(
  text: string
): Promise<ExtractedMetadata> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `You are an AI assistant that extracts structured metadata from certificate text.
Extract the following fields from the provided certificate text and return them as JSON:

{
  "recipientName": "Full name of the certificate recipient",
  "organization": "Name of the issuing organization",
  "course": "Course or program name",
  "achievement": "Type of achievement (e.g., Completion, Winner, Distinction)",
  "issueDate": "Date in ISO format (YYYY-MM-DD)",
  "certificateId": "Any certificate/serial number found",
  "skills": ["Array of specific technical skills mentioned or inferable"],
  "duration": "Duration of the course/program if mentioned",
  "issuer": "Name of the person who signed/issued the certificate",
  "confidence": 0.95,
  "warnings": ["Array of any issues detected"]
}

Rules:
- For skills, infer specific technical skills from the course/achievement description.
  Example: "Advanced Machine Learning" → ["Python", "TensorFlow", "Machine Learning", "Deep Learning"]
- If a field is not found, use an empty string or empty array.
- Set confidence between 0 and 1 based on how clearly the information was extracted.
- Add warnings for: missing dates, unclear organization names, missing signatures, suspicious formatting, or any anomalies.

Certificate text:
${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  if (!content) {
    throw new Error("No response from Gemini model");
  }

  const parsed = JSON.parse(content) as ExtractedMetadata;

  return {
    recipientName: parsed.recipientName || "",
    organization: parsed.organization || "",
    course: parsed.course || "",
    achievement: parsed.achievement || "",
    issueDate: parsed.issueDate || new Date().toISOString().split("T")[0],
    certificateId: parsed.certificateId || "",
    skills: parsed.skills || [],
    duration: parsed.duration || "",
    issuer: parsed.issuer || "",
    confidence: parsed.confidence ?? 0.5,
    warnings: parsed.warnings || [],
  };
}

/**
 * Infer additional skills from course/achievement description.
 */
export async function inferSkills(
  course: string,
  achievement: string
): Promise<string[]> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `You extract specific technical skills from course/achievement descriptions.
Return a JSON object with a "skills" array of strings.
Be specific — not just "Programming" but "Python", "JavaScript", etc.
Include tools, frameworks, and methodologies.
Return 3-8 skills maximum.

Course: ${course}
Achievement: ${achievement}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();
  if (!content) return [];

  const parsed = JSON.parse(content);
  return parsed.skills || [];
}
