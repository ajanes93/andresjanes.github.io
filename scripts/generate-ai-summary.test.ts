import { execSync } from "child_process";
import { writeFileSync } from "fs";

vi.mock("child_process");
vi.mock("fs");

vi.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

const processExitSpy = vi
  .spyOn(process, "exit")
  .mockImplementation(() => undefined as never);

const VALID_RESPONSE = JSON.stringify({
  generatedAt: "2026-01-26T00:00:00.000Z",
  summary: "Test summary",
});

async function runScript(): Promise<void> {
  await import("./generate-ai-summary");
}

function getExecutedCommand(): string {
  const execCall = vi.mocked(execSync).mock.calls[0];

  return execCall[0] as string;
}

describe("generate-ai-summary", () => {
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
      expect(command).toContain("10+");
      expect(command).toContain("Vue.js");
      expect(command).toContain("TypeScript");
    });

    it("includes career highlights from experience", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("Cision");
      expect(command).toContain("Windsor Telecom");
    });

    it("includes recommendations", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("Michael Brainch");
      expect(command).toContain("Jamie Margerison");
    });

    it("includes education and languages", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("University of the West of England");
      expect(command).toContain("English");
      expect(command).toContain("Spanish");
    });

    it("specifies JSON output format requirements", async () => {
      vi.mocked(execSync).mockReturnValue(VALID_RESPONSE);
      await runScript();

      const command = getExecutedCommand();

      expect(command).toContain("ONLY valid JSON");
      expect(command).toContain("no markdown");
      expect(command).toContain("no code blocks");
      expect(command).toContain("summary");
      expect(command).toContain("generatedAt");
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

  describe("successful JSON parsing and file writing", () => {
    it("parses valid JSON and writes to file", async () => {
      const mockData = {
        generatedAt: "2026-01-26T00:00:00.000Z",
        summary: "A compelling summary of experience and expertise.",
      };

      vi.mocked(execSync).mockReturnValue(JSON.stringify(mockData));
      await runScript();

      expect(writeFileSync).toHaveBeenCalledTimes(1);

      const writeCall = vi.mocked(writeFileSync).mock.calls[0];
      const filePath = writeCall[0] as string;
      const content = writeCall[1] as string;

      expect(filePath).toContain("src/data/ai-summary.json");
      expect(content).toBe(JSON.stringify(mockData, null, 2) + "\n");
    });

    it("accepts valid JSON with extra fields", async () => {
      const mockData = {
        extraField: "This should be fine",
        generatedAt: "2026-01-26T00:00:00.000Z",
        summary: "A compelling summary.",
      };

      vi.mocked(execSync).mockReturnValue(JSON.stringify(mockData));
      await runScript();

      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(processExitSpy).not.toHaveBeenCalled();
    });
  });

  describe("error handling for invalid JSON", () => {
    it("handles invalid JSON response", async () => {
      vi.mocked(execSync).mockReturnValue("This is not valid JSON");
      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating summary:",
        expect.any(Error)
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("handles JSON with markdown code blocks", async () => {
      const invalidResponse = `\`\`\`json
${JSON.stringify({ generatedAt: "2026-01-26T00:00:00.000Z", summary: "Test" })}
\`\`\``;

      vi.mocked(execSync).mockReturnValue(invalidResponse);
      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating summary:",
        expect.any(Error)
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("handles empty response", async () => {
      vi.mocked(execSync).mockReturnValue("");
      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating summary:",
        expect.any(Error)
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe("error handling for missing required fields", () => {
    const expectedError = expect.objectContaining({
      message: "Invalid JSON structure from Claude",
    });

    it("throws error when summary field is missing", async () => {
      vi.mocked(execSync).mockReturnValue(
        JSON.stringify({ generatedAt: "2026-01-26T00:00:00.000Z" })
      );

      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating summary:",
        expectedError
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("throws error when generatedAt field is missing", async () => {
      vi.mocked(execSync).mockReturnValue(
        JSON.stringify({ summary: "A compelling summary." })
      );

      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating summary:",
        expectedError
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it("throws error when both required fields are missing", async () => {
      vi.mocked(execSync).mockReturnValue(
        JSON.stringify({ someOtherField: "value" })
      );

      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating summary:",
        expectedError
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe("error handling for CLI execution failures", () => {
    it("handles execSync errors", async () => {
      const execError = new Error("claude: command not found");

      vi.mocked(execSync).mockImplementation(() => {
        throw execError;
      });

      await runScript();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error generating summary:",
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
        "Error generating summary:",
        writeError
      );

      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });
});
