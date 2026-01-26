import { mount } from "@vue/test-utils";

import type { ExperienceItem } from "@/stores/profile";
import type { RenderOptions } from "@/test/utils";

import ExperienceTimeline from "./ExperienceTimeline.vue";

const TEST_ITEMS: ExperienceItem[] = [
  {
    company: "Tech Corp",
    description: "Leading development projects",
    location: "Remote, UK",
    logoPath: "/img/tech.png",
    skills: ["Vue.js", "TypeScript"],
    startDate: "2023-01-01",
    title: "Senior Developer",
  },
  {
    company: "Startup Inc",
    description: "Building web applications",
    endDate: "2022-12-01",
    location: "London, UK",
    logoPath: "/img/startup.png",
    skills: ["React", "Node.js"],
    startDate: "2020-06-01",
    title: "Developer",
  },
];

const render = (options: RenderOptions<typeof ExperienceTimeline> = {}) => {
  const wrapper = mount(ExperienceTimeline, {
    global: {
      ...options.global,
    },
    props: {
      items: TEST_ITEMS,
      title: "Experience",
      ...options.props,
    },
  });

  return {
    wrapper,
    getCards: () => wrapper.findAllByTestId("card"),
    getLogos: () => wrapper.findAllByTestId("company-logo"),
    getFirstLogo: () => wrapper.findByTestId("company-logo"),
  };
};

describe("ExperienceTimeline", () => {
  describe("rendering", () => {
    it("renders the title", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Experience");
    });

    it("renders custom title", () => {
      const { wrapper } = render({
        props: { items: TEST_ITEMS, title: "Work History" },
      });

      expect(wrapper.text()).toContain("Work History");
    });

    it("renders all experience items", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Senior Developer");
      expect(wrapper.text()).toContain("Developer");
    });

    it("renders company names", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Tech Corp");
      expect(wrapper.text()).toContain("Startup Inc");
    });

    it("renders locations", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Remote, UK");
      expect(wrapper.text()).toContain("London, UK");
    });

    it("renders descriptions", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Leading development projects");
      expect(wrapper.text()).toContain("Building web applications");
    });
  });

  describe("date formatting", () => {
    it("formats dates correctly", () => {
      const { wrapper } = render();
      // Jan 2023 and Jun 2020
      expect(wrapper.text()).toContain("Jan 2023");
      expect(wrapper.text()).toContain("Jun 2020");
    });

    it("shows Present for current positions", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Present");
    });

    it("shows end date for past positions", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Dec 2022");
    });
  });

  describe("duration calculation", () => {
    it("calculates duration for past positions", () => {
      const { wrapper } = render();
      // 2020-06 to 2022-12 = 2 years 6 months
      expect(wrapper.text()).toContain("2 yrs 6 mos");
    });
  });

  describe("sorting", () => {
    it("sorts items by start date (newest first)", () => {
      const { getCards } = render();
      const cards = getCards();
      expect(cards[0].text()).toContain("Senior Developer");
      expect(cards[1].text()).toContain("Developer");
    });
  });

  describe("skills", () => {
    it("renders skills badges", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Vue.js");
      expect(wrapper.text()).toContain("TypeScript");
      expect(wrapper.text()).toContain("React");
      expect(wrapper.text()).toContain("Node.js");
    });
  });

  describe("current badge", () => {
    it("shows Current badge for positions without end date", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Current");
    });
  });

  describe("with empty items", () => {
    it("renders title with no items", () => {
      const { wrapper } = render({ props: { items: [], title: "Experience" } });
      expect(wrapper.text()).toContain("Experience");
    });

    it("renders no cards when items is empty", () => {
      const { getCards } = render({ props: { items: [], title: "Experience" } });
      expect(getCards().length).toBe(0);
    });
  });

  describe("logo rendering", () => {
    it("renders company logo when logoPath is provided", () => {
      const { getLogos } = render();
      expect(getLogos().length).toBe(2);
    });

    it("sets correct alt text for logo", () => {
      const { getFirstLogo } = render();
      expect(getFirstLogo().attributes("alt")).toBe("Tech Corp");
    });
  });
});
