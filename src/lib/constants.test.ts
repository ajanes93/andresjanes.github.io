import { SKILL_CATEGORIES, SKILL_VARIANT_ORDER } from "./constants";

describe("SKILL_CATEGORIES", () => {
  it("has PRIMARY skills defined", () => {
    expect(SKILL_CATEGORIES.PRIMARY).toContain("Vue.js");
    expect(SKILL_CATEGORIES.PRIMARY).toContain("TypeScript");
    expect(SKILL_CATEGORIES.PRIMARY).toContain("Ruby on Rails");
  });

  it("has SECONDARY skills defined", () => {
    expect(SKILL_CATEGORIES.SECONDARY).toContain("React");
    expect(SKILL_CATEGORIES.SECONDARY).toContain("Node.js");
    expect(SKILL_CATEGORIES.SECONDARY).toContain("PHP");
  });

  it("PRIMARY and SECONDARY skills are arrays", () => {
    expect(Array.isArray(SKILL_CATEGORIES.PRIMARY)).toBe(true);
    expect(Array.isArray(SKILL_CATEGORIES.SECONDARY)).toBe(true);
  });

  it("skills are non-empty strings", () => {
    SKILL_CATEGORIES.PRIMARY.forEach((skill) => {
      expect(typeof skill).toBe("string");
      expect(skill.length).toBeGreaterThan(0);
    });

    SKILL_CATEGORIES.SECONDARY.forEach((skill) => {
      expect(typeof skill).toBe("string");
      expect(skill.length).toBeGreaterThan(0);
    });
  });
});

describe("SKILL_VARIANT_ORDER", () => {
  it("has correct order for variants", () => {
    expect(SKILL_VARIANT_ORDER.default).toBe(0);
    expect(SKILL_VARIANT_ORDER.secondary).toBe(1);
    expect(SKILL_VARIANT_ORDER.outline).toBe(2);
  });

  it("default has highest priority (lowest number)", () => {
    expect(SKILL_VARIANT_ORDER.default).toBeLessThan(
      SKILL_VARIANT_ORDER.secondary
    );

    expect(SKILL_VARIANT_ORDER.secondary).toBeLessThan(
      SKILL_VARIANT_ORDER.outline
    );
  });
});
