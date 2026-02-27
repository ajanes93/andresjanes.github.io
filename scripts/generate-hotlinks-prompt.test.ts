import { execSync } from "child_process";
import { writeFileSync } from "fs";

vi.mock("child_process");
vi.mock("fs");

vi.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

const processExitSpy = vi
  .spyOn(process, "exit")
  .mockImplementation(() => undefined as never);

const VALID_RESPONSE =
  "Andres Janes is a Senior Software Engineer at Cision with 10+ years of experience.";

async function runScript(): Promise<void> {
  await import("./generate-hotlinks-prompt");
}

function getExecutedCommand(): string {
  const execCall = vi.mocked(execSync).mock.calls[0];

  return execCall[0] as string;
}

describe("generate-hotlinks-prompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("prompt generation", () => {
    it("includes key profile data in the prompt", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("Andres Janes");
      expect(command).toContain("Senior Software Engineer");
      expect(command).toContain("Cision");
      expect(command).toContain("Vue.js");
    });

    it("includes full work experience details", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("Cision");
      expect(command).toContain("Windsor Telecom");
      expect(command).toContain("Impact Research");
    });

    it("includes recommendations", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("Michael Brainch");
      expect(command).toContain("Jamie Margerison");
      expect(command).toContain("Alastair Bell");
    });

    it("includes education and languages", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("University of the West of England");
      expect(command).toContain("English");
      expect(command).toContain("Spanish");
    });

    it("requests concise output with character limit", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("600 characters");
      expect(command).toContain("ONLY the condensed summary");
    });
  });

  describe("claude CLI execution", () => {
    it("executes claude CLI with correct flags", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      expect(execSync).toHaveBeenCalledTimes(1);

      const command = getExecutedCommand();

      expect(command).toContain("claude -p");
      expect(command).toContain("--output-format text");
    });

    it("uses proper encoding and buffer size", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const execCall = vi.mocked(execSync).mock.calls[0];
      const options = execCall[1];

      expect(options).toEqual({
        encoding: "utf-8",
        maxBuffer: 1024 * 1024,
      });
    });
  });

  describe("successful response and file writing", () => {
    it("writes valid response to file", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      expect(writeFileSync).toHaveBeenCalledTimes(1);

      const writeCall = vi.mocked(writeFileSync).mock.calls[0];
      const filePath = writeCall[0] as string;
      const content = JSON.parse(writeCall[1] as string);

      expect(filePath).toContain("src/data/ai-hotlinks-prompt.json");
      expect(content.profileSummary).toBe(VALID_RESPONSE);
      expect(content.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("trims whitespace from response", async () => {
      vi.mocked(execSync).mockReturnValue(`  ${VALID_RESPONSE}  \n`);
      await runScript();

      const writeCall = vi.mocked(writeFileSync).mock.calls[0];
      const content = JSON.parse(writeCall[1] as string);

      expect(content.profileSummary).toBe(VALID_RESPONSE);
    });
  });

  describe("error handling", () => {
    it("handles empty response", async () => {
      vi.mocked(execSync).mockReturnValue("");
      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating hotlinks prompt:",
        expect.any(Error)
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("handles whitespace-only response", async () => {
      vi.mocked(execSync).mockReturnValue("   \n  ");
      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating hotlinks prompt:",
        expect.any(Error)
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("rejects response exceeding 800 characters", async () => {
      const longResponse = "x".repeat(801);

      vi.mocked(execSync).mockReturnValue(longResponse);
      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating hotlinks prompt:",
        expect.objectContaining({
          message: expect.stringContaining("too long"),
        })
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("handles execSync errors", async () => {
      const execError = new Error("claude: command not found");

      vi.mocked(execSync).mockImplementation(() => {
        throw execError;
      });

      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating hotlinks prompt:",
        execError
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("handles file system write errors", async () => {
      const writeError = new Error("EACCES: permission denied");

      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);

      vi.mocked(writeFileSync).mockImplementation(() => {
        throw writeError;
      });

      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating hotlinks prompt:",
        writeError
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });
});
