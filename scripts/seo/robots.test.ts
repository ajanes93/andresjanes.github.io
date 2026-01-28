import { writeFileSync } from "fs";

vi.mock("fs");

function getWrittenContent(callIndex: number = 0): string {
  return vi.mocked(writeFileSync).mock.calls[callIndex][1] as string;
}

describe("writeRobotsTxt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes a robots.txt file to the specified output path", async () => {
    const { writeRobotsTxt } = await import("./robots");
    writeRobotsTxt("abc123def456", "/output/robots.txt");

    expect(writeFileSync).toHaveBeenCalledTimes(1);

    expect(vi.mocked(writeFileSync).mock.calls[0][0]).toBe(
      "/output/robots.txt"
    );
  });

  it("embeds the profile hash comment at the top", async () => {
    const { writeRobotsTxt } = await import("./robots");
    writeRobotsTxt("abc123def456", "/output/robots.txt");

    expect(
      getWrittenContent().startsWith("<!-- Profile hash: abc123def456 -->")
    ).toBe(true);
  });

  it("includes the site URL in the robots header comment", async () => {
    const { writeRobotsTxt } = await import("./robots");
    writeRobotsTxt("abc123def456", "/output/robots.txt");

    expect(getWrittenContent()).toContain("https://andresjanes.com");
  });

  it("allows all user agents to crawl all pages", async () => {
    const { writeRobotsTxt } = await import("./robots");
    writeRobotsTxt("abc123def456", "/output/robots.txt");

    const content = getWrittenContent();
    expect(content).toContain("User-agent: *");
    expect(content).toContain("Allow: /");
  });

  it("includes a Sitemap directive pointing to sitemap.xml", async () => {
    const { writeRobotsTxt } = await import("./robots");
    writeRobotsTxt("abc123def456", "/output/robots.txt");

    expect(getWrittenContent()).toContain(
      "Sitemap: https://andresjanes.com/sitemap.xml"
    );
  });

  it("includes a Llms-txt directive pointing to llms.txt", async () => {
    const { writeRobotsTxt } = await import("./robots");
    writeRobotsTxt("abc123def456", "/output/robots.txt");

    expect(getWrittenContent()).toContain(
      "Llms-txt: https://andresjanes.com/llms.txt"
    );
  });

  it("includes a Crawl-delay directive", async () => {
    const { writeRobotsTxt } = await import("./robots");
    writeRobotsTxt("abc123def456", "/output/robots.txt");

    expect(getWrittenContent()).toContain("Crawl-delay: 1");
  });

  it("uses different hashes when passed different values", async () => {
    const { writeRobotsTxt } = await import("./robots");

    writeRobotsTxt("aaaa11112222", "/out1");
    writeRobotsTxt("bbbb33334444", "/out2");

    expect(getWrittenContent(0)).toContain("aaaa11112222");
    expect(getWrittenContent(1)).toContain("bbbb33334444");
  });

  afterEach(() => {
    vi.resetModules();
  });
});

describe("getRobotsOutputPath", () => {
  it("returns a path ending with public/robots.txt", async () => {
    const { getRobotsOutputPath } = await import("./robots");

    expect(getRobotsOutputPath()).toMatch(/public\/robots\.txt$/);
  });

  afterEach(() => {
    vi.resetModules();
  });
});
