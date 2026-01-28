import { writeFileSync } from "fs";

vi.mock("fs");

function getWrittenContent(callIndex: number = 0): string {
  return vi.mocked(writeFileSync).mock.calls[callIndex][1] as string;
}

describe("writeSitemapXml", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes a sitemap.xml file to the specified output path", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    expect(writeFileSync).toHaveBeenCalledTimes(1);

    expect(vi.mocked(writeFileSync).mock.calls[0][0]).toBe(
      "/output/sitemap.xml"
    );
  });

  it("starts with a valid XML declaration", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    expect(
      getWrittenContent().startsWith('<?xml version="1.0" encoding="UTF-8"?>')
    ).toBe(true);
  });

  it("embeds the profile hash comment", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    expect(getWrittenContent()).toContain(
      "<!-- Profile hash: abc123def456 -->"
    );
  });

  it("includes the urlset root element with sitemap schema namespace", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    const content = getWrittenContent();

    expect(content).toContain(
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
    );

    expect(content).toContain("</urlset>");
  });

  it("includes the site root URL as a location", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    expect(getWrittenContent()).toContain(
      "<loc>https://andresjanes.com/</loc>"
    );
  });

  it("includes the current date as lastmod in YYYY-MM-DD format", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    const today = new Date().toISOString().split("T")[0];
    expect(getWrittenContent()).toContain(`<lastmod>${today}</lastmod>`);
  });

  it("sets changefreq to monthly", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    expect(getWrittenContent()).toContain("<changefreq>monthly</changefreq>");
  });

  it("sets priority to 1.0 for the root URL", async () => {
    const { writeSitemapXml } = await import("./sitemap");
    writeSitemapXml("abc123def456", "/output/sitemap.xml");

    expect(getWrittenContent()).toContain("<priority>1.0</priority>");
  });

  it("uses different hashes when passed different values", async () => {
    const { writeSitemapXml } = await import("./sitemap");

    writeSitemapXml("hash11112222", "/out1");
    writeSitemapXml("hash33334444", "/out2");

    expect(getWrittenContent(0)).toContain("hash11112222");
    expect(getWrittenContent(1)).toContain("hash33334444");
  });

  afterEach(() => {
    vi.resetModules();
  });
});

describe("getSitemapOutputPath", () => {
  it("returns a path ending with public/sitemap.xml", async () => {
    const { getSitemapOutputPath } = await import("./sitemap");

    expect(getSitemapOutputPath()).toMatch(/public\/sitemap\.xml$/);
  });

  afterEach(() => {
    vi.resetModules();
  });
});
