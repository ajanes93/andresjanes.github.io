import { execSync } from "child_process";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";

vi.mock("child_process");

vi.mock("./seo/hash", () => ({
  computeProfileHash: vi.fn(() => "testhash1234"),
  needsRegeneration: vi.fn(() => true),
}));

vi.mock("./seo/robots", () => ({
  getRobotsOutputPath: vi.fn(() => "/public/robots.txt"),
  writeRobotsTxt: vi.fn(),
}));

vi.mock("./seo/sitemap", () => ({
  getSitemapOutputPath: vi.fn(() => "/public/sitemap.xml"),
  writeSitemapXml: vi.fn(),
}));

vi.mock("./seo/llms", () => ({
  getLlmsOutputPath: vi.fn(() => "/public/llms.txt"),
  writeLlmsTxt: vi.fn(),
}));

vi.mock("./seo/json-ld", () => ({
  getIndexHtmlPath: vi.fn(() => "/index.html"),
  updateIndexHtml: vi.fn(),
}));

const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

const processExitSpy = vi
  .spyOn(process, "exit")
  .mockImplementation(() => undefined as never);

async function runScript(): Promise<void> {
  await import("./generate-seo");
}

function setProcessArgs(args: string[]): void {
  Object.defineProperty(process, "argv", {
    configurable: true,
    value: ["node", "generate-seo.ts", ...args],
    writable: true,
  });
}

describe("generate-seo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createTestingPinia());
    setProcessArgs([]);
    processExitSpy.mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("normal generation", () => {
    it("logs the profile hash", async () => {
      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("testhash1234")
      );
    });

    it("calls all four generators when all files need regeneration", async () => {
      const { writeRobotsTxt } = await import("./seo/robots");
      const { writeSitemapXml } = await import("./seo/sitemap");
      const { writeLlmsTxt } = await import("./seo/llms");
      const { updateIndexHtml } = await import("./seo/json-ld");

      await runScript();

      expect(writeRobotsTxt).toHaveBeenCalled();
      expect(writeSitemapXml).toHaveBeenCalled();
      expect(writeLlmsTxt).toHaveBeenCalled();
      expect(updateIndexHtml).toHaveBeenCalled();
    });

    it("passes the computed hash to each generator", async () => {
      const { writeRobotsTxt } = await import("./seo/robots");
      const { writeSitemapXml } = await import("./seo/sitemap");

      await runScript();

      expect(writeRobotsTxt).toHaveBeenCalledWith(
        "testhash1234",
        expect.any(String)
      );

      expect(writeSitemapXml).toHaveBeenCalledWith(
        "testhash1234",
        expect.any(String)
      );
    });

    it("logs a summary of generated files", async () => {
      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Summary")
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Generated")
      );
    });

    it("formats HTML files with prettier after generation", async () => {
      await runScript();

      const execCalls = vi
        .mocked(execSync)
        .mock.calls.map((call) => call[0] as string);

      const prettierCall = execCalls.find((cmd) => cmd.includes("prettier"));

      expect(prettierCall).toBeDefined();
      expect(prettierCall).toContain("/index.html");
    });

    it("does not format non-HTML files with prettier", async () => {
      await runScript();

      const prettierCalls = vi
        .mocked(execSync)
        .mock.calls.map((call) => call[0] as string)
        .filter((cmd) => cmd.includes("prettier"));

      prettierCalls.forEach((cmd) => {
        expect(cmd).not.toContain("robots.txt");
        expect(cmd).not.toContain("sitemap.xml");
        expect(cmd).not.toContain("llms.txt");
      });
    });
  });

  describe("skipped files", () => {
    it("skips files that do not need regeneration", async () => {
      const { needsRegeneration } = await import("./seo/hash");
      const { writeRobotsTxt } = await import("./seo/robots");
      const { writeSitemapXml } = await import("./seo/sitemap");

      vi.mocked(needsRegeneration).mockImplementation(
        (path: string) => path === "/public/robots.txt"
      );

      await runScript();

      expect(writeRobotsTxt).toHaveBeenCalled();
      expect(writeSitemapXml).not.toHaveBeenCalled();
    });

    it("logs that all files are up to date when none need regeneration", async () => {
      const { needsRegeneration } = await import("./seo/hash");
      vi.mocked(needsRegeneration).mockReturnValue(false);

      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("up to date")
      );
    });
  });

  describe("--force flag", () => {
    it("passes the force flag to needsRegeneration", async () => {
      const { needsRegeneration } = await import("./seo/hash");

      setProcessArgs(["--force"]);
      await runScript();

      expect(needsRegeneration).toHaveBeenCalledWith(
        expect.any(String),
        "testhash1234",
        true
      );
    });
  });

  describe("--check-only flag", () => {
    it("exits with code 0 when all files are up to date", async () => {
      const { needsRegeneration } = await import("./seo/hash");
      vi.mocked(needsRegeneration).mockReturnValue(false);

      setProcessArgs(["--check-only"]);
      await runScript();

      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it("exits with code 1 when files need updating", async () => {
      const { needsRegeneration } = await import("./seo/hash");
      vi.mocked(needsRegeneration).mockReturnValue(true);

      setProcessArgs(["--check-only"]);
      await runScript();

      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("lists files that need updating", async () => {
      const { needsRegeneration } = await import("./seo/hash");
      vi.mocked(needsRegeneration).mockReturnValue(true);

      setProcessArgs(["--check-only"]);
      await runScript();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("robots.txt")
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("sitemap.xml")
      );
    });

    it("does not generate any files in check-only mode", async () => {
      const { needsRegeneration } = await import("./seo/hash");
      const { writeRobotsTxt } = await import("./seo/robots");
      const { writeSitemapXml } = await import("./seo/sitemap");
      vi.mocked(needsRegeneration).mockReturnValue(true);

      processExitSpy.mockImplementation(() => {
        throw new Error("__process_exit__");
      });

      setProcessArgs(["--check-only"]);
      await expect(runScript()).rejects.toThrow("__process_exit__");

      expect(writeRobotsTxt).not.toHaveBeenCalled();
      expect(writeSitemapXml).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("exits with code 1 when a generator throws an error", async () => {
      const { writeRobotsTxt } = await import("./seo/robots");

      vi.mocked(writeRobotsTxt).mockImplementation(() => {
        throw new Error("Write failed");
      });

      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error generating"),
        expect.any(Error)
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("logs a warning when prettier fails to format an HTML file", async () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error("prettier not found");
      });

      await runScript();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Warning")
      );
    });
  });
});
