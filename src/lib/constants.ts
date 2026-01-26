/**
 * Skill categories for highlighting in the skills section.
 * PRIMARY: Core skills that should be most prominently displayed
 * SECONDARY: Important but not primary skills
 */
export const SKILL_CATEGORIES = {
  PRIMARY: [
    "Vue.js",
    "Vue 3",
    "TypeScript",
    "Ruby on Rails",
    "GraphQL",
    "Tailwind",
  ] as const,
  SECONDARY: ["React", "Node.js", "PHP", "webRTC", "PWA"] as const,
} as const;

export type SkillVariant = "default" | "secondary" | "outline";

/**
 * Order of skill variants for sorting (lower = higher priority)
 */
export const SKILL_VARIANT_ORDER: Record<SkillVariant, number> = {
  default: 0,
  outline: 2,
  secondary: 1,
} as const;
