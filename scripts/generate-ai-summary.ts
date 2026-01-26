/**
 * Generate AI summary using Claude Code CLI
 * Uses Max subscription - no API cost
 *
 * Usage: npm run generate:summary
 */

import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { resolve } from "path";

import { createPinia, setActivePinia } from "pinia";

import { useProfileStore } from "../src/stores/profile";

interface AISummary {
  generatedAt: string;
  summary: string;
}

function getProfileStore() {
  const pinia = createPinia();
  setActivePinia(pinia);

  return useProfileStore();
}

function formatExperience(exp: {
  company: string;
  description: string;
  endDate?: string;
  startDate: string;
  title: string;
}): string {
  const startYear = exp.startDate.slice(0, 4);
  const endYear = exp.endDate?.slice(0, 4) || "Present";
  const firstSentence = exp.description.split(".")[0];

  return `- ${exp.title} at ${exp.company} (${startYear}-${endYear}): ${firstSentence}`;
}

function buildProfileContext(
  store: ReturnType<typeof useProfileStore>
): string {
  const topExperiences = store.experience
    .slice(0, 3)
    .map(formatExperience)
    .join("\n");

  const recommendations = store.recommendations
    .map((rec) => `- "${rec.text.slice(0, 100)}..." - ${rec.name}`)
    .join("\n");

  const education = store.education
    .map((edu) => `${edu.title} - ${edu.company}`)
    .join(", ");

  const languages = store.languages
    .map((lang) => `${lang.name} (${lang.level})`)
    .join(", ");

  return `
Name: ${store.name}
Title: ${store.title} at ${store.company}
Location: ${store.location}
Experience: ${store.yearsExperience} years

Summary:
${store.summary}

Key Skills: ${store.skills.join(", ")}

Career Highlights:
${topExperiences}

Recommendations:
${recommendations}

Education: ${education}
Languages: ${languages}
`.trim();
}

function buildPrompt(profileContext: string, generatedAt: string): string {
  return `You are writing a professional summary for a portfolio website. Based on the profile data below, write a compelling 2-3 sentence executive summary that highlights:
- Years of experience and current role
- Core technical expertise (especially Vue.js/TypeScript)
- Leadership experience and key achievements
- Professional qualities mentioned in recommendations

Output ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{"summary": "Your summary here", "generatedAt": "${generatedAt}"}

Profile Data:
${profileContext}`;
}

function callClaude(prompt: string): string {
  return execSync(`claude -p ${JSON.stringify(prompt)} --output-format text`, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024,
  });
}

function validateSummary(data: unknown): asserts data is AISummary {
  const parsed = data as Partial<AISummary>;

  if (!parsed.summary || !parsed.generatedAt) {
    throw new Error("Invalid JSON structure from Claude");
  }
}

function writeSummary(summary: AISummary): void {
  const outputPath = resolve(
    import.meta.dirname!,
    "../src/data/ai-summary.json"
  );

  const content = JSON.stringify(summary, null, 2) + "\n";
  writeFileSync(outputPath, content);
}

function getTodayISODate(): string {
  return new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
}

function main(): void {
  console.log("Generating AI summary using Claude Code CLI...\n");

  try {
    const store = getProfileStore();
    const profileContext = buildProfileContext(store);
    const generatedAt = getTodayISODate();
    const prompt = buildPrompt(profileContext, generatedAt);

    const result = callClaude(prompt);
    const parsed: unknown = JSON.parse(result.trim());

    validateSummary(parsed);
    writeSummary(parsed);

    console.log("Summary generated successfully!\n");
    console.log(JSON.stringify(parsed, null, 2));
  } catch (error) {
    console.error("Error generating summary:", error);
    process.exit(1);
  }
}

main();
