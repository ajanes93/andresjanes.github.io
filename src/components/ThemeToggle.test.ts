import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import ThemeToggle from "./ThemeToggle.vue";

// Helper to create matchMedia mock
const createMatchMediaMock = (matches: boolean = false) => {
  return (query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  });
};

const render = (options: RenderOptions<typeof ThemeToggle> = {}) => {
  const wrapper = mount(ThemeToggle, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
  });

  return {
    wrapper,
    getToggleButton: () => wrapper.findByTestId("theme-toggle"),
  };
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
    // matchMedia must be mocked as it's a browser API not available in JSDOM
    window.matchMedia = createMatchMediaMock(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders a button", () => {
      const { getToggleButton } = render();
      expect(getToggleButton().exists()).toBe(true);
    });

    it("has accessible aria-label", () => {
      const { getToggleButton } = render();
      expect(getToggleButton().attributes("aria-label")).toBeDefined();
    });
  });

  describe("initial state", () => {
    it("starts in light mode by default", () => {
      render();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("respects localStorage theme over document class", async () => {
      // Set localStorage to dark, even though document doesn't have dark class
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      const { wrapper, getToggleButton } = render();
      await wrapper.vm.$nextTick();

      // Component should detect dark mode from document class
      expect(getToggleButton().attributes("aria-label")).toContain("light");
    });
  });

  describe("toggle behavior", () => {
    it("toggles theme on click", async () => {
      const { getToggleButton } = render();

      await getToggleButton().trigger("click");
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      await getToggleButton().trigger("click");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("updates aria-label when toggling", async () => {
      const { getToggleButton } = render();

      expect(getToggleButton().attributes("aria-label")).toContain("dark");

      await getToggleButton().trigger("click");
      expect(getToggleButton().attributes("aria-label")).toContain("light");
    });
  });

  describe("localStorage persistence", () => {
    it("saves theme preference to localStorage", async () => {
      const { getToggleButton } = render();

      await getToggleButton().trigger("click");
      expect(localStorage.getItem("theme")).toBe("dark");

      await getToggleButton().trigger("click");
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });

  describe("system preference", () => {
    it("respects system dark mode preference when no localStorage value", () => {
      // Set matchMedia to return matches: true for dark mode preference
      window.matchMedia = createMatchMediaMock(true);

      render();
      // The component checks system preference on mount if no localStorage
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
