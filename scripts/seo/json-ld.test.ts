import { readFileSync, writeFileSync } from "fs";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";

import { useProfileStore } from "@/stores/profile";

vi.mock("fs");

function getProfileState() {
  setActivePinia(createTestingPinia());

  return useProfileStore().$state;
}

const TEST_PROFILE_STATE = getProfileState();

const INDEX_HTML_WITH_JSON_LD = `<!doctype html>
<html lang="en">
  <head>
    <title>Test</title>

    <!-- Profile hash: oldoldhash123 -->
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    { "old": "person schema" }
    </script>

    <!-- WebSite Schema for search engines -->
    <script type="application/ld+json">
    { "old": "website schema" }
    </script>

    <style>body {}</style>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`;

const INDEX_HTML_WITHOUT_JSON_LD = `<!doctype html>
<html lang="en">
  <head>
    <title>Test</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`;

async function callUpdateIndexHtml(
  state = TEST_PROFILE_STATE,
  html: string = INDEX_HTML_WITH_JSON_LD
): Promise<string> {
  vi.mocked(readFileSync).mockReturnValue(html);

  const { updateIndexHtml } = await import("./json-ld");
  updateIndexHtml(state, "abc123def456", "/path/index.html");

  return vi.mocked(writeFileSync).mock.calls[0][1] as string;
}

describe("updateIndexHtml", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads the index.html file from the specified path", async () => {
    vi.mocked(readFileSync).mockReturnValue(INDEX_HTML_WITH_JSON_LD);

    const { updateIndexHtml } = await import("./json-ld");
    updateIndexHtml(TEST_PROFILE_STATE, "abc123def456", "/path/index.html");

    expect(readFileSync).toHaveBeenCalledWith("/path/index.html", "utf-8");
  });

  it("throws an error when the JSON-LD section is not found", async () => {
    vi.mocked(readFileSync).mockReturnValue(INDEX_HTML_WITHOUT_JSON_LD);

    const { updateIndexHtml } = await import("./json-ld");

    expect(() =>
      updateIndexHtml(TEST_PROFILE_STATE, "abc123def456", "/path/index.html")
    ).toThrow("Could not find JSON-LD section in index.html");
  });

  it("writes the updated HTML back to the same path", async () => {
    await callUpdateIndexHtml();

    expect(writeFileSync).toHaveBeenCalledTimes(1);

    expect(vi.mocked(writeFileSync).mock.calls[0][0]).toBe("/path/index.html");
  });

  it("embeds the current hash comment in the replacement block", async () => {
    // When the hash comment is directly adjacent (no indentation gap) to the
    // JSON-LD comment, the regex captures and replaces it.
    const htmlWithAdjacentHash = INDEX_HTML_WITH_JSON_LD.replace(
      /\n\s*<!-- Profile hash: oldoldhash123 -->\n/,
      "\n<!-- Profile hash: oldoldhash123 -->\n"
    );

    const output = await callUpdateIndexHtml(
      TEST_PROFILE_STATE,
      htmlWithAdjacentHash
    );

    expect(output).toContain("<!-- Profile hash: abc123def456 -->");
  });

  it("generates a Person schema with the correct @type", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"@type": "Person"');
  });

  it("generates a WebSite schema with the correct @type", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"@type": "WebSite"');
  });

  it("includes the person's name in the Person schema", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"name": "Andres Janes"');
  });

  it("splits the name into givenName and familyName", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"givenName": "Andres"');
    expect(output).toContain('"familyName": "Janes"');
  });

  it("includes the job title", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"jobTitle": "Senior Software Engineer"');
  });

  it("includes the email extracted from mailto social link", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"email": "dev@andresjanes.com"');
  });

  it("includes non-email social links in sameAs", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain("https://www.linkedin.com/in/andresjanes/");

    expect(output).toContain("https://github.com/ajanes93");
    expect(output).not.toContain("mailto:");
  });

  it("includes education as alumniOf with known organization URL", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain("University of the West of England");
    expect(output).toContain("https://www.uwe.ac.uk");
    expect(output).toContain('"@type": "EducationalOrganization"');
  });

  it("includes worksFor with known organization URL for Cision", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"name": "Cision"');
    expect(output).toContain("https://www.cision.com");
  });

  it("includes the profile image URL", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain("https://andresjanes.com/img/profile.webp");
  });

  it("expands skills with known aliases", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"Vue 3"');
    expect(output).toContain('"Google Cloud Platform"');
    expect(output).toContain('"PHP"');
    expect(output).toContain('"Laravel"');
    expect(output).toContain('"Rails"');
    expect(output).toContain('"JavaScript"');
    expect(output).toContain('"Vitest"');
    expect(output).toContain('"Cypress"');
  });

  it("includes knowsAbout as a sorted array", async () => {
    const output = await callUpdateIndexHtml();

    const personJsonMatch = output.match(
      /<!-- JSON-LD Structured Data -->\s*<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/
    );

    expect(personJsonMatch).not.toBeNull();

    const personSchema = JSON.parse(personJsonMatch![1]) as Record<
      string,
      unknown
    >;

    const items = personSchema.knowsAbout as string[];

    expect(items).toEqual([...items].sort());
  });

  it("includes language information with ISO codes for known languages", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"alternateName": "en"');
    expect(output).toContain('"alternateName": "es"');
    expect(output).toContain('"name": "English"');
    expect(output).toContain('"name": "Spanish"');
  });

  it("falls back to lowercase first two chars for unknown language codes", async () => {
    const stateWithUnknownLang = {
      ...TEST_PROFILE_STATE,
      languages: [{ level: "Native", name: "Klingon" }],
    };

    const output = await callUpdateIndexHtml(stateWithUnknownLang);

    expect(output).toContain('"alternateName": "kl"');
  });

  it("uses empty string for organization URL when company is not in the lookup map", async () => {
    const stateWithUnknownCompany = {
      ...TEST_PROFILE_STATE,
      company: "Unknown Corp",
    };

    const output = await callUpdateIndexHtml(stateWithUnknownCompany);

    expect(output).toContain('"name": "Unknown Corp"');

    const worksForMatch = output.match(
      /"worksFor":\s*\{[\s\S]*?"url":\s*"([^"]*)"[\s\S]*?\}/
    );

    expect(worksForMatch?.[1]).toBe("");
  });

  it("includes the site URL", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"url": "https://andresjanes.com"');
  });

  it("generates a description mentioning years of experience and top skills", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain("10+ years of experience");
    expect(output).toContain("production web applications");
  });

  it("generates a WebSite schema with the person's name as author", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain('"Andres Janes Portfolio"');

    expect(output).toContain("Personal portfolio website of Andres Janes");
  });

  it("preserves HTML outside the JSON-LD section", async () => {
    const output = await callUpdateIndexHtml();

    expect(output).toContain("<title>Test</title>");
    expect(output).toContain('<div id="app"></div>');
    expect(output).toContain("style>body {}</style>");
  });

  it("handles state with no email social link by using empty string", async () => {
    const stateNoEmail = {
      ...TEST_PROFILE_STATE,
      socials: TEST_PROFILE_STATE.socials.filter(
        (social) => social.icon !== "mail"
      ),
    };

    const output = await callUpdateIndexHtml(stateNoEmail);

    expect(output).toContain('"email": ""');
  });

  afterEach(() => {
    vi.resetModules();
  });
});

describe("getIndexHtmlPath", () => {
  it("returns a path ending with index.html", async () => {
    const { getIndexHtmlPath } = await import("./json-ld");

    expect(getIndexHtmlPath()).toMatch(/index\.html$/);
  });

  afterEach(() => {
    vi.resetModules();
  });
});
