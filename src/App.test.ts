import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

import type { RenderOptions } from "@/test/utils";

import App from "./App.vue";

const mockDownloadCv = vi.fn();

vi.mock("@/composables/useCvGenerator", () => ({
  useCvGenerator: () => ({
    downloadCv: mockDownloadCv,
    generateCv: vi.fn(),
  }),
}));

const render = (options: RenderOptions<typeof App> = {}) => {
  const pinia = createPinia();
  setActivePinia(pinia);

  // Mock matchMedia for ThemeToggle
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as typeof window.matchMedia;

  const wrapper = mount(App, {
    global: {
      plugins: [pinia],
      ...options.global,
    },
    ...options,
  });

  return {
    wrapper,
    getAppRoot: () => wrapper.findByTestId("app-root"),
    getDownloadButton: () => wrapper.findByTestId("download-cv-button"),
    getEducationCards: () => wrapper.findAllByTestId("education-card"),
    getEducationSection: () => wrapper.findByTestId("education-section"),
    getFooter: () => wrapper.findByTestId("app-footer"),
    getHeader: () => wrapper.findByTestId("app-header"),
    getMainContent: () => wrapper.findByTestId("main-content"),
    getRecommendationCards: () =>
      wrapper.findAllByTestId("recommendation-card"),
    getRecommendationsSection: () =>
      wrapper.findByTestId("recommendations-section"),
    getSkipLink: () => wrapper.findByTestId("skip-link"),
  };
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the app root container", () => {
      const { getAppRoot } = render();
      expect(getAppRoot().exists()).toBe(true);
    });

    it("renders the skip link for accessibility", () => {
      const { getSkipLink } = render();
      expect(getSkipLink().exists()).toBe(true);
      expect(getSkipLink().text()).toBe("Skip to main content");
      expect(getSkipLink().attributes("href")).toBe("#main-content");
    });

    it("renders the header", () => {
      const { getHeader } = render();
      expect(getHeader().exists()).toBe(true);
    });

    it("renders the main content area", () => {
      const { getMainContent } = render();
      expect(getMainContent().exists()).toBe(true);
      expect(getMainContent().attributes("id")).toBe("main-content");
    });

    it("renders the footer", () => {
      const { getFooter } = render();
      expect(getFooter().exists()).toBe(true);
    });
  });

  describe("header", () => {
    it("renders the download CV button", () => {
      const { getDownloadButton } = render();
      expect(getDownloadButton().exists()).toBe(true);

      expect(getDownloadButton().attributes("aria-label")).toBe(
        "Download CV as PDF"
      );
    });

    it("renders the site logo with initials", () => {
      const { getHeader } = render();
      expect(getHeader().text()).toContain("AJ");
    });

    it("renders the site name", () => {
      const { getHeader } = render();
      expect(getHeader().text()).toContain("andresjanes.com");
    });
  });

  describe("education section", () => {
    it("renders the education section", () => {
      const { getEducationSection } = render();
      expect(getEducationSection().exists()).toBe(true);
    });

    it("renders education heading", () => {
      const { getEducationSection } = render();
      expect(getEducationSection().text()).toContain("Education");
    });

    it("renders education cards from store", () => {
      const { getEducationCards } = render();
      expect(getEducationCards().length).toBeGreaterThan(0);
    });
  });

  describe("recommendations section", () => {
    it("renders the recommendations section", () => {
      const { getRecommendationsSection } = render();
      expect(getRecommendationsSection().exists()).toBe(true);
    });

    it("renders recommendations heading", () => {
      const { getRecommendationsSection } = render();
      expect(getRecommendationsSection().text()).toContain("Recommendations");
    });

    it("renders recommendation cards from store", () => {
      const { getRecommendationCards } = render();
      expect(getRecommendationCards().length).toBeGreaterThan(0);
    });

    it("recommendation cards have external link attributes", () => {
      const { getRecommendationCards } = render();
      const firstCard = getRecommendationCards()[0];
      expect(firstCard.attributes("target")).toBe("_blank");
      expect(firstCard.attributes("rel")).toBe("noopener noreferrer");
    });
  });

  describe("footer", () => {
    it("displays the current year", () => {
      const { getFooter } = render();
      const currentYear = new Date().getFullYear().toString();
      expect(getFooter().text()).toContain(currentYear);
    });

    it("displays the copyright notice", () => {
      const { getFooter } = render();
      expect(getFooter().text()).toContain("Andres Janes");
    });

    it("displays the tech stack", () => {
      const { getFooter } = render();
      expect(getFooter().text()).toContain("Vue 3");
      expect(getFooter().text()).toContain("TypeScript");
      expect(getFooter().text()).toContain("Tailwind CSS");
    });

    it("renders the source code link", () => {
      const { getFooter } = render();
      const sourceLink = getFooter().find('a[href*="github.com"]');
      expect(sourceLink.exists()).toBe(true);
      expect(sourceLink.text()).toBe("View Source");
    });
  });

  describe("download CV functionality", () => {
    it("calls downloadCv when button is clicked", async () => {
      const { getDownloadButton } = render();
      await getDownloadButton().trigger("click");

      expect(mockDownloadCv).toHaveBeenCalledTimes(1);

      expect(mockDownloadCv).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: expect.any(Object),
        })
      );
    });
  });
});
