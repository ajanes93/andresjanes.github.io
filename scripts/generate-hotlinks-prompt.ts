/**
 * Generate a pre-summarised candidate profile for AI hotlinks
 * Uses Claude CLI (Max subscription - no API cost) to condense the full
 * profile into a concise summary that fits within URL length limits.
 *
 * Usage: npm run generate:hotlinks
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

import { createPinia, setActivePinia } from "pinia";

import { useProfileStore } from "../src/stores/profile";

import { callClaude } from "./lib/claude";

interface HotlinksPrompt {
  generatedAt: string;
  profileSummary: string;
}

function buildProfileContext(
  store: ReturnType<typeof useProfileStore>
): string {
  const experiences = store.experience
    .map((exp) => {
      const startYear = exp.startDate.slice(0, 4);
      const endYear = exp.endDate?.slice(0, 4) || "Present";

      return `- ${exp.title} at ${exp.company} (${startYear}-${endYear}): ${exp.description}`;
    })
    .join("\n");

  const recommendations = store.recommendations
    .map((rec) => `- "${rec.text}" —${rec.name}, ${rec.title}`)
    .join("\n");

  const sideProjects = store.personal.sideProjects
    .map((proj) => `${proj.name}: ${proj.description}`)
    .join("; ");

  return `
Name: ${store.name}
Title: ${store.title} at ${store.company}
Location: ${store.location}
Experience: ${store.yearsExperience} years

Summary: ${store.summary}

Skills: ${store.skills.join(", ")}

Work Experience:
${experiences}

Education: ${store.education.map((edu) => `${edu.title}, ${edu.company}`).join("; ")}
Languages: ${store.languages.map((lang) => `${lang.name} (${lang.level})`).join(", ")}

Recommendations:
${recommendations}

Personal: From ${store.personal.origin}. ${store.personal.currentChapter}. Interests: ${store.personal.interests.join(", ")}. Side projects: ${sideProjects}.
`.trim();
}

function buildPrompt(profileContext: string): string {
  return `Condense this developer profile into a tight candidate summary (max 600 characters). Keep all key facts: name, current role, years of experience, core skills, standout achievements, personal touch. Write in third person, plain text, no markdown or bullet points. Be warm but concise.

${profileContext}

Output ONLY the condensed summary text, nothing else.`;
}

function validateResult(text: string): string {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    throw new Error("Empty response from Claude");
  }

  if (trimmed.length > 800) {
    throw new Error(
      `Summary too long (${trimmed.length} chars). Target is under 600.`
    );
  }

  return trimmed;
}

function writePrompt(data: HotlinksPrompt): void {
  const outputPath = resolve(
    import.meta.dirname!,
    "../src/data/ai-hotlinks-prompt.json"
  );

  const content = JSON.stringify(data, null, 2) + "\n";
  writeFileSync(outputPath, content);
}

function getTodayISODate(): string {
  return new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
}

function main(): void {
  console.log("Generating hotlinks prompt summary using Claude Code CLI...\n");

  try {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useProfileStore();

    const profileContext = buildProfileContext(store);
    const prompt = buildPrompt(profileContext);

    const result = callClaude(prompt);
    const profileSummary = validateResult(result);

    const data: HotlinksPrompt = {
      generatedAt: getTodayISODate(),
      profileSummary,
    };

    writePrompt(data);

    console.log("Hotlinks prompt generated successfully!\n");
    console.log(`Length: ${profileSummary.length} characters`);
    console.log(`\n${profileSummary}`);
  } catch (error) {
    console.error("Error generating hotlinks prompt:", error);
    process.exit(1);
  }
}

main();
