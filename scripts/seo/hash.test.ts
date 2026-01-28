import { existsSync, readFileSync } from "fs";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";

import { useProfileStore } from "@/stores/profile";

vi.mock("fs");

function getProfileState() {
  setActivePinia(createTestingPinia());

  return useProfileStore().$state;
}

const TEST_PROFILE_STATE = getProfileState();

describe("computeProfileHash", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a 12-character hexadecimal string", async () => {
    const { computeProfileHash } = await import("./hash");
    const hash = computeProfileHash(TEST_PROFILE_STATE);

    expect(hash).toMatch(/^[a-f0-9]{12}$/);
  });

  it("produces the same hash for identical state", async () => {
    const { computeProfileHash } = await import("./hash");
    const hash1 = computeProfileHash(TEST_PROFILE_STATE);
    const hash2 = computeProfileHash(TEST_PROFILE_STATE);

    expect(hash1).toBe(hash2);
  });

  it("produces a different hash when name changes", async () => {
    const { computeProfileHash } = await import("./hash");
    const original = computeProfileHash(TEST_PROFILE_STATE);

    const modified = computeProfileHash({
      ...TEST_PROFILE_STATE,
      name: "Jane Doe",
    });

    expect(modified).not.toBe(original);
  });

  it("produces a different hash when title changes", async () => {
    const { computeProfileHash } = await import("./hash");
    const original = computeProfileHash(TEST_PROFILE_STATE);

    const modified = computeProfileHash({
      ...TEST_PROFILE_STATE,
      title: "Staff Engineer",
    });

    expect(modified).not.toBe(original);
  });

  it("produces a different hash when skills change", async () => {
    const { computeProfileHash } = await import("./hash");
    const original = computeProfileHash(TEST_PROFILE_STATE);

    const modified = computeProfileHash({
      ...TEST_PROFILE_STATE,
      skills: ["Rust", "Go"],
    });

    expect(modified).not.toBe(original);
  });

  it("produces a different hash when experience changes", async () => {
    const { computeProfileHash } = await import("./hash");
    const original = computeProfileHash(TEST_PROFILE_STATE);

    const modified = computeProfileHash({
      ...TEST_PROFILE_STATE,
      experience: [],
    });

    expect(modified).not.toBe(original);
  });

  it("produces a different hash when socials change", async () => {
    const { computeProfileHash } = await import("./hash");
    const original = computeProfileHash(TEST_PROFILE_STATE);

    const modified = computeProfileHash({
      ...TEST_PROFILE_STATE,
      socials: [],
    });

    expect(modified).not.toBe(original);
  });

  it("is unaffected by fields not included in SEO hash", async () => {
    const { computeProfileHash } = await import("./hash");
    const original = computeProfileHash(TEST_PROFILE_STATE);

    const modified = computeProfileHash({
      ...TEST_PROFILE_STATE,
      avatarPath: "/img/different.webp",
      llmProviders: [],
    });

    expect(modified).toBe(original);
  });

  afterEach(() => {
    vi.resetModules();
  });
});

describe("createHashComment", () => {
  it("formats the hash as an HTML comment", async () => {
    const { createHashComment } = await import("./hash");

    expect(createHashComment("abc123def456")).toBe(
      "<!-- Profile hash: abc123def456 -->"
    );
  });

  it("wraps arbitrary hash strings in the comment format", async () => {
    const { createHashComment } = await import("./hash");
    const comment = createHashComment("deadbeef1234");

    expect(comment).toContain("<!-- Profile hash:");
    expect(comment).toContain("deadbeef1234");
    expect(comment).toContain("-->");
  });
});

describe("needsRegeneration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when force flag is set", async () => {
    const { needsRegeneration } = await import("./hash");
    vi.mocked(existsSync).mockReturnValue(true);

    vi.mocked(readFileSync).mockReturnValue(
      "<!-- Profile hash: abc123def456 -->"
    );

    expect(needsRegeneration("/some/path", "abc123def456", true)).toBe(true);
  });

  it("returns true when the file does not exist", async () => {
    const { needsRegeneration } = await import("./hash");
    vi.mocked(existsSync).mockReturnValue(false);

    expect(needsRegeneration("/nonexistent/path", "abc123def456", false)).toBe(
      true
    );
  });

  it("returns false when the file exists and contains the current hash", async () => {
    const { needsRegeneration } = await import("./hash");
    vi.mocked(existsSync).mockReturnValue(true);

    vi.mocked(readFileSync).mockReturnValue(
      "<!-- Profile hash: abc123def456 -->\nSome content"
    );

    expect(needsRegeneration("/some/path", "abc123def456", false)).toBe(false);
  });

  it("returns true when the file exists but contains an outdated hash", async () => {
    const { needsRegeneration } = await import("./hash");
    vi.mocked(existsSync).mockReturnValue(true);

    vi.mocked(readFileSync).mockReturnValue(
      "<!-- Profile hash: oldoldhash123 -->\nSome content"
    );

    expect(needsRegeneration("/some/path", "abc123def456", false)).toBe(true);
  });

  it("returns true when the file exists but has no hash comment", async () => {
    const { needsRegeneration } = await import("./hash");
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue("No hash comment here");

    expect(needsRegeneration("/some/path", "abc123def456", false)).toBe(true);
  });

  it("reads the file with utf-8 encoding", async () => {
    const { needsRegeneration } = await import("./hash");
    vi.mocked(existsSync).mockReturnValue(true);

    vi.mocked(readFileSync).mockReturnValue(
      "<!-- Profile hash: abc123def456 -->"
    );

    needsRegeneration("/some/path", "abc123def456", false);

    expect(readFileSync).toHaveBeenCalledWith("/some/path", "utf-8");
  });

  it("does not read the file when force is true", async () => {
    const { needsRegeneration } = await import("./hash");

    needsRegeneration("/some/path", "abc123def456", true);

    expect(readFileSync).not.toHaveBeenCalled();
  });

  afterEach(() => {
    vi.resetModules();
  });
});
