/**
 * Profile data hashing utilities for change detection
 */

import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";

import type { ProfileState } from "../../src/stores/profile";

const HASH_REGEX = /<!-- Profile hash: ([a-f0-9]+) -->/;

/**
 * Computes SHA-256 hash of SEO-relevant profile fields
 */
export function computeProfileHash(state: ProfileState): string {
  const seoFields = {
    availability: state.availability,
    company: state.company,
    education: state.education,
    experience: state.experience,
    languages: state.languages,
    location: state.location,
    name: state.name,
    personal: state.personal,
    pronouns: state.pronouns,
    recommendations: state.recommendations,
    skills: state.skills,
    socials: state.socials,
    summary: state.summary,
    title: state.title,
    yearsExperience: state.yearsExperience,
  };

  return createHash("sha256")
    .update(JSON.stringify(seoFields))
    .digest("hex")
    .slice(0, 12);
}

/**
 * Creates an HTML comment embedding the profile hash
 */
export function createHashComment(hash: string): string {
  return `<!-- Profile hash: ${hash} -->`;
}

/**
 * Checks if a file needs regeneration based on hash comparison
 */
export function needsRegeneration(
  filePath: string,
  currentHash: string,
  force: boolean
): boolean {
  if (force) return true;
  if (!existsSync(filePath)) return true;

  const content = readFileSync(filePath, "utf-8");
  const match = content.match(HASH_REGEX);

  return match?.[1] !== currentHash;
}
