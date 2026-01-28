import { mount } from "@vue/test-utils";

import type { PersonalInfo } from "@/stores/profile";
import type { RenderOptions } from "@/test/utils";

import BeyondTheCode from "./BeyondTheCode.vue";

const TEST_PROPS: PersonalInfo = {
  aiTools: ["Claude Code", "Cursor", "GitHub Copilot"],
  currentChapter: "New dad to Arianna (2025)",
  interests: ["Craft beer", "Discovering good restaurants", "Travelling"],
  origin: "Colombia",
  sideProjectStatus: "Paused for nappies",
};

const render = (options: RenderOptions<typeof BeyondTheCode> = {}) => {
  const wrapper = mount(BeyondTheCode, {
    global: {
      ...options.global,
    },
    props: {
      personal: TEST_PROPS,
      ...options.props,
    },
  });

  return {
    wrapper,
    getSection: () => wrapper.findByTestId("beyond-the-code-section"),
    getCodeEditorHeader: () => wrapper.findByTestId("code-editor-header"),
    getCodeContent: () => wrapper.findByTestId("code-content"),
  };
};

describe("BeyondTheCode", () => {
  describe("rendering", () => {
    it("renders section with correct testid", () => {
      const { getSection } = render();
      expect(getSection().exists()).toBe(true);
    });

    it("shows the section title", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Beyond the Code");
    });

    it("renders the code editor header with filename", () => {
      const { getCodeEditorHeader } = render();
      expect(getCodeEditorHeader().exists()).toBe(true);
      expect(getCodeEditorHeader().text()).toContain("andres.config.ts");
    });

    it("renders code editor header with traffic light controls", () => {
      const { getCodeEditorHeader } = render();
      const dots = getCodeEditorHeader().findAll(".rounded-full");
      expect(dots.length).toBe(3);
    });

    it("renders code content area", () => {
      const { getCodeContent } = render();
      expect(getCodeContent().exists()).toBe(true);
    });
  });

  describe("personal info display", () => {
    it("displays origin from props", () => {
      const { getCodeContent } = render();
      expect(getCodeContent().text()).toContain("Colombia 🇨🇴");
    });

    it("displays currentChapter from props", () => {
      const { getCodeContent } = render();

      expect(getCodeContent().text()).toContain("New dad to Arianna (2025) 👶");
    });

    it("displays sideProjectStatus as a comment", () => {
      const { getCodeContent } = render();
      expect(getCodeContent().text()).toContain("// Paused for nappies");
    });

    it("shows origin with correct property name", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();
      expect(text).toMatch(/origin:\s*"Colombia 🇨🇴"/);
    });

    it("shows currentChapter with correct property name", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();

      expect(text).toMatch(
        /currentChapter:\s*"New dad to Arianna \(2025\) 👶"/
      );
    });
  });

  describe("interests array", () => {
    it("displays all interests from props array", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();

      expect(text).toContain("Craft beer");
      expect(text).toContain("Discovering good restaurants");
      expect(text).toContain("Travelling");
    });

    it("displays interests under correct property name", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();
      expect(text).toMatch(/interests:\s*\[/);
    });

    it("handles single interest", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            interests: ["Coding"],
          },
        },
      });

      expect(getCodeContent().text()).toContain("Coding");
    });

    it("handles empty interests array", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            interests: [],
          },
        },
      });

      const text = getCodeContent().text();
      expect(text).toMatch(/interests:\s*\[\s*\]/);
    });
  });

  describe("AI tools array", () => {
    it("displays all aiTools from props array", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();

      expect(text).toContain("Claude Code");
      expect(text).toContain("Cursor");
      expect(text).toContain("GitHub Copilot");
    });

    it("displays AI tools under currentlyExploring property", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();
      expect(text).toMatch(/currentlyExploring:\s*\[/);
    });

    it("handles single AI tool", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            aiTools: ["ChatGPT"],
          },
        },
      });

      expect(getCodeContent().text()).toContain("ChatGPT");
    });

    it("handles empty AI tools array", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            aiTools: [],
          },
        },
      });

      const text = getCodeContent().text();
      expect(text).toMatch(/currentlyExploring:\s*\[\s*\]/);
    });
  });

  describe("with different props", () => {
    it("renders different origin", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            origin: "Argentina",
          },
        },
      });

      expect(getCodeContent().text()).toContain("Argentina 🇨🇴");
      expect(getCodeContent().text()).not.toContain("Colombia");
    });

    it("renders different currentChapter", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            currentChapter: "Exploring the world",
          },
        },
      });

      expect(getCodeContent().text()).toContain("Exploring the world 👶");
      expect(getCodeContent().text()).not.toContain("New dad to Arianna");
    });

    it("renders different sideProjectStatus", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            sideProjectStatus: "Always building",
          },
        },
      });

      expect(getCodeContent().text()).toContain("// Always building");
      expect(getCodeContent().text()).not.toContain("Paused for nappies");
    });

    it("renders different interests", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            interests: ["Reading", "Hiking", "Photography"],
          },
        },
      });

      const text = getCodeContent().text();
      expect(text).toContain("Reading");
      expect(text).toContain("Hiking");
      expect(text).toContain("Photography");
      expect(text).not.toContain("Craft beer");
    });

    it("renders different AI tools", () => {
      const { getCodeContent } = render({
        props: {
          personal: {
            ...TEST_PROPS,
            aiTools: ["Gemini", "Perplexity"],
          },
        },
      });

      const text = getCodeContent().text();
      expect(text).toContain("Gemini");
      expect(text).toContain("Perplexity");
      expect(text).not.toContain("Claude Code");
    });
  });

  describe("code structure", () => {
    it("shows TypeScript const declaration", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();
      expect(text).toMatch(/const\s+andres\s*=\s*\{/);
    });

    it("shows export default statement", () => {
      const { getCodeContent } = render();
      expect(getCodeContent().text()).toContain("export default andres");
    });

    it("shows sideProjects property as undefined", () => {
      const { getCodeContent } = render();
      const text = getCodeContent().text();
      expect(text).toMatch(/sideProjects:\s*undefined/);
    });

    it("shows introductory comment", () => {
      const { getCodeContent } = render();

      expect(getCodeContent().text()).toContain(
        "// The person behind the commits"
      );
    });
  });
});
