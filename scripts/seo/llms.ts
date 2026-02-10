/**
 * AI-powered llms.txt generator using Claude CLI
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

import type { ExperienceItem, ProfileState } from "../../src/stores/profile";
import { callClaude } from "../lib/claude";

import { createHashComment } from "./hash";

const SITE_URL = "https://andresjanes.com";

const SKILL_CATEGORIES: Record<string, string[]> = {
  Backend: ["Rails", "PHP", "Laravel", "Node.js", "GraphQL", "REST"],
  "Cloud & DevOps": ["GCP", "Docker", "CI/CD", "Git", "Testing"],
  "Databases & Search": ["PostgreSQL", "MySQL", "Elasticsearch"],
  Frontend: [
    "Vue.js",
    "Vue 3",
    "TypeScript",
    "Tailwind CSS",
    "PWA",
    "webRTC",
    "Websockets",
  ],
  Methodology: ["Agile", "Kanban"],
};

function formatDate(dateStr: string | undefined, fallback: string): string {
  if (!dateStr) return fallback;

  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatExperience(exp: ExperienceItem): string {
  const dateRange = `${formatDate(exp.startDate, "")} - ${formatDate(exp.endDate, "Present")}`;
  const skills = exp.skills?.join(", ");

  return `### ${exp.title} at ${exp.company} (${dateRange})
Location: ${exp.location}
${exp.description}
${skills ? `Skills: ${skills}` : ""}`;
}

function categorizeSkills(skills: string[]): string {
  return Object.entries(SKILL_CATEGORIES)
    .map(([category, keywords]) => {
      const matched = skills.filter((skill) =>
        keywords.some((kw) => skill.includes(kw))
      );

      return matched.length
        ? `### ${category}\n${matched.map((skill) => `- ${skill}`).join("\n")}`
        : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function buildProfileContext(state: ProfileState): string {
  const email =
    state.socials
      .find((social) => social.icon === "mail")
      ?.href.replace("mailto:", "") || "";

  const socialLinks = state.socials
    .filter((social) => social.icon !== "mail")
    .map((social) => `- ${social.name}: ${social.href}`)
    .join("\n");

  const experiences = state.experience.map(formatExperience).join("\n\n");

  const education = state.education
    .map(
      (edu) => `### ${edu.title}
${edu.company}, ${edu.location}
Graduated: ${formatDate(edu.endDate, "")}
${edu.description}`
    )
    .join("\n\n");

  const languages = state.languages
    .map((lang) => `- ${lang.name}: ${lang.level}`)
    .join("\n");

  const recommendations = state.recommendations
    .map((rec) => `"${rec.text}" - ${rec.name}, ${rec.title}`)
    .join("\n\n");

  return `
## IDENTITY
- Full Name: ${state.name}
- Title: ${state.title}
- Current Employer: ${state.company}
- Location: ${state.location}
- Pronouns: ${state.pronouns}
- Portfolio: ${SITE_URL}
- Email: ${email}
${socialLinks}

## PROFESSIONAL SUMMARY
${state.summary}

## TECHNICAL SKILLS

${categorizeSkills(state.skills)}

## WORK EXPERIENCE
${experiences}

## EDUCATION
${education}

## LANGUAGES
${languages}

## RECOMMENDATIONS
${recommendations}

## PERSONAL
- Originally from: ${state.personal.origin}
- Current chapter: ${state.personal.currentChapter}
- Interests: ${state.personal.interests.join(", ")}
- AI tools: ${state.personal.aiTools.join(", ")}
- Side projects: ${state.personal.sideProjects.join(", ")}
- Side project status: ${state.personal.sideProjectStatus}

## AVAILABILITY
${state.availability}
`.trim();
}

function buildPrompt(profileContext: string): string {
  return `You are generating an llms.txt file for a developer's portfolio website. This file follows the llmstxt.org specification and is designed to help LLMs understand who this person is.

Generate a comprehensive, well-structured llms.txt file in markdown format based on the profile data below.

REQUIREMENTS:
1. Start with a level-1 heading with the person's name and title
2. Include a blockquote explaining the file's purpose
3. Organize into clear sections: Identity, Professional Summary, Technical Skills, Work Experience, Education, Languages, Recommendations, Unique Value Proposition, Ideal Role Fit, Key Questions, Availability, Contact
4. Use markdown formatting (headers, lists, bold for labels)
5. Write in third person ("Andres is..." not "I am...")
6. Keep it professional but personable
7. Include a "Key Questions This Profile Answers" section with Q&A format
8. Include a "Unique Value Proposition" section highlighting 4-5 differentiators
9. Include an "Ideal Role Fit" section
10. DO NOT include any code blocks, just raw markdown

IMPORTANT: Output ONLY the raw markdown content. No explanations, no code fences, just the llms.txt content.

PROFILE DATA:
${profileContext}`;
}

export function writeLlmsTxt(
  state: ProfileState,
  hash: string,
  outputPath: string
): void {
  const profileContext = buildProfileContext(state);
  const prompt = buildPrompt(profileContext);
  const aiContent = callClaude(prompt).trim();

  writeFileSync(outputPath, `${createHashComment(hash)}\n${aiContent}\n`);
}

export function getLlmsOutputPath(): string {
  return resolve(import.meta.dirname!, "../../public/llms.txt");
}
