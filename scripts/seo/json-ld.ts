/**
 * JSON-LD structured data template generator
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import type { ProfileState } from "../../src/stores/profile";

import { createHashComment } from "./hash";

const SITE_URL = "https://andresjanes.com";

const ORGANIZATION_URLS: Record<string, string> = {
  Cision: "https://www.cision.com",
  "University of the West of England": "https://www.uwe.ac.uk",
  "Windsor Telecom": "https://www.windsor-telecom.co.uk",
};

const LANGUAGE_ISO_CODES: Record<string, string> = {
  English: "en",
  French: "fr",
  German: "de",
  Portuguese: "pt",
  Spanish: "es",
};

/**
 * Skill expansion map: keys are substrings to match, values are aliases to add
 */
const SKILL_EXPANSIONS: [string, string[]][] = [
  ["Vue.js", ["Vue 3"]],
  ["GCP", ["Google Cloud Platform"]],
  ["PHP / Laravel", ["PHP", "Laravel"]],
  ["Ruby on Rails", ["Rails"]],
  ["Testing", ["Vitest", "Cypress"]],
  ["TypeScript", ["JavaScript"]],
];

function expandSkills(skills: string[]): string[] {
  const expanded = new Set(skills);

  for (const [match, aliases] of SKILL_EXPANSIONS) {
    if (skills.some((skill) => skill.includes(match))) {
      aliases.forEach((alias) => expanded.add(alias));
    }
  }

  return [...expanded].sort();
}

function generatePersonSchema(state: ProfileState): Record<string, unknown> {
  const email =
    state.socials
      .find((social) => social.icon === "mail")
      ?.href.replace("mailto:", "") || "";

  const sameAs = state.socials
    .filter((social) => social.icon !== "mail")
    .map((social) => social.href);

  const [givenName, ...rest] = state.name.split(" ");
  const education = state.education[0];
  const topSkills = state.skills.slice(0, 5).join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressRegion: "United Kingdom",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: education?.company || "",
      url: ORGANIZATION_URLS[education?.company || ""] || "",
    },
    description: `${state.title} with ${state.yearsExperience} years of experience building production web applications. Specializes in ${topSkills}, and real-time applications.`,
    email,
    familyName: rest.join(" "),
    givenName,
    image: `${SITE_URL}/img/profile.webp`,
    jobTitle: state.title,
    knowsAbout: expandSkills(state.skills),
    knowsLanguage: state.languages.map((lang) => ({
      "@type": "Language",
      alternateName:
        LANGUAGE_ISO_CODES[lang.name] || lang.name.toLowerCase().slice(0, 2),
      name: lang.name,
    })),
    name: state.name,
    sameAs,
    url: SITE_URL,
    worksFor: {
      "@type": "Organization",
      name: state.company,
      url: ORGANIZATION_URLS[state.company] || "",
    },
  };
}

function generateWebSiteSchema(state: ProfileState): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    author: {
      "@type": "Person",
      name: state.name,
    },
    description: `Personal portfolio website of ${state.name}, ${state.title}`,
    name: `${state.name} Portfolio`,
    url: SITE_URL,
  };
}

const JSON_LD_REGEX =
  /(?:<!-- Profile hash: [a-f0-9]+ -->\s*)?<!-- JSON-LD Structured Data -->[\s\S]*?<\/script>\s*<!-- WebSite Schema for search engines -->[\s\S]*?<\/script>/;

export function updateIndexHtml(
  state: ProfileState,
  hash: string,
  indexPath: string
): void {
  const content = readFileSync(indexPath, "utf-8");

  if (!JSON_LD_REGEX.test(content)) {
    throw new Error("Could not find JSON-LD section in index.html");
  }

  const personJson = JSON.stringify(generatePersonSchema(state), null, 4);
  const webSiteJson = JSON.stringify(generateWebSiteSchema(state), null, 4);

  const replacement = `${createHashComment(hash)}
        <!-- JSON-LD Structured Data -->
        <script type="application/ld+json">
        ${personJson}
        </script>

        <!-- WebSite Schema for search engines -->
        <script type="application/ld+json">
        ${webSiteJson}
        </script>`;

  writeFileSync(indexPath, content.replace(JSON_LD_REGEX, replacement));
}

export function getIndexHtmlPath(): string {
  return resolve(import.meta.dirname!, "../../index.html");
}
