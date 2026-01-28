/**
 * robots.txt template generator
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

import { createHashComment } from "./hash";

const SITE_URL = "https://andresjanes.com";

export function writeRobotsTxt(hash: string, outputPath: string): void {
  const content = `${createHashComment(hash)}
# robots.txt for ${SITE_URL}
# Generated automatically from profile data

User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
Llms-txt: ${SITE_URL}/llms.txt
Crawl-delay: 1
`;

  writeFileSync(outputPath, content);
}

export function getRobotsOutputPath(): string {
  return resolve(import.meta.dirname!, "../../public/robots.txt");
}
