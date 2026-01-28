import { writeFileSync } from "fs";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";

import { useProfileStore } from "@/stores/profile";

vi.mock("fs");
vi.mock("../lib/claude");

function getProfileState() {
  setActivePinia(createTestingPinia());

  return useProfileStore().$state;
}

const TEST_PROFILE_STATE = getProfileState();

const AI_RESPONSE = `# Andres Janes - Senior Software Engineer

> This llms.txt file provides structured information about Andres Janes.

## Identity
- **Full Name:** Andres Janes
- **Title:** Senior Software Engineer
`;

async function importWithMockedClaude(response: string = AI_RESPONSE) {
  const { callClaude } = await import("../lib/claude");
  vi.mocked(callClaude).mockReturnValue(response);

  const { writeLlmsTxt } = await import("./llms");

  return { callClaude, writeLlmsTxt };
}

function getWrittenContent(): string {
  return vi.mocked(writeFileSync).mock.calls[0][1] as string;
}

describe("writeLlmsTxt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes the generated content to the specified output path", async () => {
    const { writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    expect(writeFileSync).toHaveBeenCalledTimes(1);

    expect(vi.mocked(writeFileSync).mock.calls[0][0]).toBe("/output/llms.txt");
  });

  it("embeds the profile hash comment at the top of the file", async () => {
    const { writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    expect(
      getWrittenContent().startsWith("<!-- Profile hash: abc123def456 -->")
    ).toBe(true);
  });

  it("includes the AI-generated content after the hash comment", async () => {
    const { writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const content = getWrittenContent();
    expect(content).toContain("# Andres Janes - Senior Software Engineer");
    expect(content).toContain("## Identity");
  });

  it("trims whitespace from the AI response before writing", async () => {
    const { writeLlmsTxt } = await importWithMockedClaude(
      "  \n  Trimmed content here  \n  "
    );

    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const content = getWrittenContent();
    expect(content).toContain("Trimmed content here");
    expect(content).not.toContain("  \n  Trimmed content");
  });

  it("calls Claude with a prompt containing the person's name", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("Andres Janes");
  });

  it("calls Claude with a prompt containing the person's title", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("Senior Software Engineer");
  });

  it("calls Claude with a prompt containing work experience details", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("Cision");
    expect(prompt).toContain("Windsor Telecom");
  });

  it("calls Claude with a prompt containing education details", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("University of the West of England");
  });

  it("calls Claude with a prompt containing languages", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("English");
    expect(prompt).toContain("Spanish");
  });

  it("calls Claude with a prompt containing recommendations", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("Michael Brainch");
  });

  it("calls Claude with a prompt containing personal information", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("Colombia");
    expect(prompt).toContain("Coffee");
  });

  it("calls Claude with a prompt containing the email extracted from socials", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("dev@andresjanes.com");
  });

  it("calls Claude with a prompt containing the availability status", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("Open to opportunities");
  });

  it("calls Claude with instructions to use third person", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("third person");
  });

  it("calls Claude with instructions to generate llms.txt format", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("llms.txt");
    expect(prompt).toContain("llmstxt.org");
  });

  it("includes categorized skills in the prompt when skills match known categories", async () => {
    const { callClaude, writeLlmsTxt } = await importWithMockedClaude();
    writeLlmsTxt(TEST_PROFILE_STATE, "abc123def456", "/output/llms.txt");

    const prompt = vi.mocked(callClaude).mock.calls[0][0];
    expect(prompt).toContain("Vue.js");
    expect(prompt).toContain("TypeScript");
    expect(prompt).toContain("Rails");
  });

  it("handles state with no email social link gracefully", async () => {
    const { writeLlmsTxt } = await importWithMockedClaude();

    const stateNoEmail = {
      ...TEST_PROFILE_STATE,
      socials: TEST_PROFILE_STATE.socials.filter(
        (social) => social.icon !== "mail"
      ),
    };

    writeLlmsTxt(stateNoEmail, "abc123def456", "/output/llms.txt");

    expect(writeFileSync).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    vi.resetModules();
  });
});

describe("getLlmsOutputPath", () => {
  it("returns a path ending with public/llms.txt", async () => {
    const { getLlmsOutputPath } = await import("./llms");

    expect(getLlmsOutputPath()).toMatch(/public\/llms\.txt$/);
  });

  afterEach(() => {
    vi.resetModules();
  });
});
