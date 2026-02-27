/**
 * Shared Claude CLI utilities
 * Uses Claude Code CLI with Max subscription - no API cost
 */

import { execSync } from "child_process";

/**
 * Calls Claude CLI with the given prompt and returns the text response
 */
export function callClaude(prompt: string): string {
  return execSync(`claude -p ${JSON.stringify(prompt)} --output-format text`, {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024,
  });
}

/**
 * Returns today's date as a midnight UTC ISO string, e.g. "2026-02-27T00:00:00.000Z"
 */
export function getTodayISODate(): string {
  return new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
}
