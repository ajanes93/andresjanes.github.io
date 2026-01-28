/**
 * sitemap.xml template generator
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

import { createHashComment } from "./hash";

const SITE_URL = "https://andresjanes.com";

export function writeSitemapXml(hash: string, outputPath: string): void {
  const today = new Date().toISOString().split("T")[0];

  const content = `<?xml version="1.0" encoding="UTF-8"?>
${createHashComment(hash)}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
`;

  writeFileSync(outputPath, content);
}

export function getSitemapOutputPath(): string {
  return resolve(import.meta.dirname!, "../../public/sitemap.xml");
}
