import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import SkillsSection from "./SkillsSection.vue";

const TEST_SKILLS = [
  "Vue.js",
  "Node.js",
  "TypeScript",
  "PHP / Laravel",
  "Docker",
];

const render = (options: RenderOptions<typeof SkillsSection> = {}) => {
  const wrapper = mount(SkillsSection, {
    global: {
      ...options.global,
    },
    props: {
      skills: TEST_SKILLS,
      ...options.props,
    },
  });

  return {
    wrapper,
    getBadge: () => wrapper.findByTestId("badge"),
    getBadges: () => wrapper.findAllByTestId("badge"),
  };
};

describe("SkillsSection", () => {
  describe("rendering", () => {
    it("renders the title", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Technical Skills");
    });

    it("renders all skills", () => {
      const { wrapper } = render();

      TEST_SKILLS.forEach((skill) => {
        expect(wrapper.text()).toContain(skill);
      });
    });

    it("renders correct number of badges", () => {
      const { getBadges } = render();
      expect(getBadges().length).toBe(TEST_SKILLS.length);
    });
  });

  describe("skill categorization", () => {
    it("sorts skills by category", () => {
      const { getBadges } = render();
      const badges = getBadges();
      // Vue.js, TypeScript, PHP / Laravel are primary, Node.js is secondary, Docker is outline
      // After sorting: Vue.js, TypeScript, PHP / Laravel (primary), Node.js (secondary), Docker (outline)
      expect(badges[0].text()).toBe("Vue.js");
      expect(badges[1].text()).toBe("TypeScript");
    });

    it("assigns correct variant to primary skills", () => {
      const { getBadge } = render({ props: { skills: ["Vue.js"] } });
      expect(getBadge().attributes("data-variant")).toBe("default");
    });

    it("assigns correct variant to secondary skills", () => {
      const { getBadge } = render({ props: { skills: ["Node.js"] } });
      expect(getBadge().attributes("data-variant")).toBe("secondary");
    });

    it("assigns correct variant to other skills", () => {
      const { getBadge } = render({ props: { skills: ["Docker"] } });
      expect(getBadge().attributes("data-variant")).toBe("outline");
    });
  });

  describe("with empty skills", () => {
    it("renders no badges when skills is empty", () => {
      const { getBadges } = render({ props: { skills: [] } });
      expect(getBadges().length).toBe(0);
    });

    it("still renders the title", () => {
      const { wrapper } = render({ props: { skills: [] } });
      expect(wrapper.text()).toContain("Technical Skills");
    });
  });

  describe("skill matching", () => {
    it("matches partial skill names for primary", () => {
      const { getBadge } = render({ props: { skills: ["Vue.js / Vue 3"] } });
      expect(getBadge().attributes("data-variant")).toBe("default");
    });

    it("matches partial skill names for secondary", () => {
      const { getBadge } = render({ props: { skills: ["Node.js (Express)"] } });
      expect(getBadge().attributes("data-variant")).toBe("secondary");
    });
  });
});
