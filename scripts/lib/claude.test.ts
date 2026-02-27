import { execSync } from "child_process";

import { callClaude, getTodayISODate } from "./claude";

vi.mock("child_process");

function callClaudeWithMock(prompt: string, returnValue: string = "response") {
  vi.mocked(execSync).mockReturnValue(returnValue);

  const result = callClaude(prompt);

  return {
    command: vi.mocked(execSync).mock.calls[0][0] as string,
    options: vi.mocked(execSync).mock.calls[0][1] as Record<string, unknown>,
    result,
  };
}

describe("callClaude", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("calls execSync with the claude CLI and returns the response", async () => {
    const { result } = await callClaudeWithMock(
      "Write a poem",
      "AI generated response"
    );

    expect(result).toBe("AI generated response");
  });

  it("passes the prompt as a JSON-serialized argument", async () => {
    const { command } = await callClaudeWithMock("Hello world");

    expect(command).toContain("claude -p");
    expect(command).toContain(JSON.stringify("Hello world"));
  });

  it("uses text output format flag", async () => {
    const { command } = await callClaudeWithMock("test prompt");

    expect(command).toContain("--output-format text");
  });

  it("uses utf-8 encoding", async () => {
    const { options } = await callClaudeWithMock("test prompt");

    expect(options.encoding).toBe("utf-8");
  });

  it("sets a 1MB max buffer size", async () => {
    const { options } = await callClaudeWithMock("test prompt");

    expect(options.maxBuffer).toBe(1024 * 1024);
  });

  it("propagates execSync errors to the caller", async () => {
    const cliError = new Error("claude: command not found");

    vi.mocked(execSync).mockImplementation(() => {
      throw cliError;
    });

    const { callClaude } = await import("./claude");

    expect(() => callClaude("test prompt")).toThrow(cliError);
  });

  it("handles prompts containing special characters", async () => {
    const { command } = await callClaudeWithMock(
      'Prompt with "quotes" and $pecial chars'
    );

    expect(command).toContain(
      JSON.stringify('Prompt with "quotes" and $pecial chars')
    );
  });
});

describe("getTodayISODate", () => {
  it("returns a midnight UTC ISO string for today", () => {
    const result = getTodayISODate();
    const today = new Date().toISOString().split("T")[0];

    expect(result).toBe(`${today}T00:00:00.000Z`);
  });

  it("returns a string matching the expected format", () => {
    const result = getTodayISODate();

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
  });
});
