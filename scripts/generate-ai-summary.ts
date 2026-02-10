/**
 * Generate AI summary using Claude Code CLI
 * Uses Max subscription - no API cost
 *
 * Usage: npm run generate:summary
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

import { createPinia, setActivePinia } from "pinia";

import { useProfileStore } from "../src/stores/profile";

import { callClaude } from "./lib/claude";

interface AISummary {
  generatedAt: string;
  summary: string;
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

  const personal = store.personal;

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

Personal:
- Originally from: ${personal.origin}
- Current chapter: ${personal.currentChapter}
- Interests: ${personal.interests.join(", ")}
- AI tools enthusiast: ${personal.aiTools.join(", ")}
- Side projects: ${personal.sideProjects.join(", ")}
- Side project status: ${personal.sideProjectStatus}
`.trim();
}

function buildPrompt(profileContext: string, generatedAt: string): string {
  return `You are writing a summary for a developer's portfolio website. The tone should be warm and personable—like a friendly colleague introducing someone—while still being professional.

Based on the profile data below, write a compelling 2-3 sentence summary that:
- Is written in THIRD PERSON (use "Andres" or "he", never "I")
- Feels human and approachable, not like a corporate bio
- Highlights technical expertise (especially Vue.js/TypeScript) without being dry
- Mentions something personal that makes him memorable (like being a new dad or his Colombian roots)
- Captures his professional qualities in a natural way

Avoid corporate buzzwords like "leveraging", "synergy", "passionate", or "results-driven". Write like a real person.

Output ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{"summary": "Your summary here", "generatedAt": "${generatedAt}"}

Profile Data:
${profileContext}`;
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
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useProfileStore();

    const profileContext = buildProfileContext(store);
    const generatedAt = getTodayISODate();
    const prompt = buildPrompt(profileContext, generatedAt);

    const result = callClaude(prompt);
    const parsed = JSON.parse(result.trim());

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
