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
