/**
 * Generate SEO files from profile data
 *
 * Updates robots.txt, sitemap.xml, llms.txt, and JSON-LD in index.html.
 * Only regenerates files when profile data has changed (unless --force).
 *
 * Usage:
 *   npm run generate:seo              # Generate files if profile changed
 *   npm run generate:seo -- --force   # Force regeneration
 *   npm run generate:seo -- --check-only # Check if files need updating (for CI)
 */

import { execSync } from "child_process";

import { createPinia, setActivePinia } from "pinia";

import { useProfileStore } from "../src/stores/profile";

import { computeProfileHash, needsRegeneration } from "./seo/hash";
import { getIndexHtmlPath, updateIndexHtml } from "./seo/json-ld";
import { getLlmsOutputPath, writeLlmsTxt } from "./seo/llms";
import { getRobotsOutputPath, writeRobotsTxt } from "./seo/robots";
import { getSitemapOutputPath, writeSitemapXml } from "./seo/sitemap";

interface SeoFile {
  generate: () => void;
  name: string;
  path: string;
}

function parseArgs(): { checkOnly: boolean; force: boolean } {
  const args = process.argv.slice(2);

  return {
    checkOnly: args.includes("--check-only"),
    force: args.includes("--force"),
  };
}

function formatHtmlFile(filePath: string): void {
  if (!filePath.endsWith(".html")) return;

  try {
    execSync(`npx prettier --write "${filePath}"`, {
      encoding: "utf-8",
      stdio: "pipe",
    });
  } catch {
    console.warn(`  Warning: Could not format ${filePath}`);
  }
}

function main(): void {
  const { checkOnly, force } = parseArgs();

  console.log("SEO Generator");
  console.log("=============\n");

  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useProfileStore();
  const hash = computeProfileHash(store.$state);

  console.log(`Profile hash: ${hash}\n`);

  const files: SeoFile[] = [
    {
      generate: () => writeRobotsTxt(hash, getRobotsOutputPath()),
      name: "robots.txt",
      path: getRobotsOutputPath(),
    },
    {
      generate: () => writeSitemapXml(hash, getSitemapOutputPath()),
      name: "sitemap.xml",
      path: getSitemapOutputPath(),
    },
    {
      generate: () => writeLlmsTxt(store.$state, hash, getLlmsOutputPath()),
      name: "llms.txt (AI)",
      path: getLlmsOutputPath(),
    },
    {
      generate: () => updateIndexHtml(store.$state, hash, getIndexHtmlPath()),
      name: "index.html (JSON-LD)",
      path: getIndexHtmlPath(),
    },
  ];

  const pending = files.filter((file) =>
    needsRegeneration(file.path, hash, force)
  );

  if (checkOnly) {
    if (pending.length === 0) {
      console.log("All SEO files are up to date.\n");
      process.exit(0);
    }

    console.log("The following files need updating:");
    pending.forEach((file) => console.log(`  - ${file.name}`));
    console.log("\nRun 'npm run generate:seo' to update them.\n");
    process.exit(1);
  }

  if (pending.length === 0) {
    console.log("All SEO files are up to date. Use --force to regenerate.\n");

    return;
  }

  console.log(`Generating ${pending.length} file(s)...\n`);

  const generated: string[] = [];

  for (const file of pending) {
    try {
      console.log(`  Generating ${file.name}...`);
      file.generate();
      formatHtmlFile(file.path);
      console.log(`  Done: ${file.path}\n`);
      generated.push(file.name);
    } catch (error) {
      console.error(`  Error generating ${file.name}:`, error);
      process.exit(1);
    }
  }

  const skipped = files
    .filter((file) => !generated.includes(file.name))
    .map((file) => file.name);

  console.log("Summary");
  console.log("-------");

  if (generated.length > 0) {
    console.log(`Generated: ${generated.join(", ")}`);
  }

  if (skipped.length > 0) {
    console.log(`Skipped (up to date): ${skipped.join(", ")}`);
  }

  console.log("");
}

main();
