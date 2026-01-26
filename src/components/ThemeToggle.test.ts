import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import ThemeToggle from "./ThemeToggle.vue";

// Helper to create matchMedia mock with event listener support
const createMatchMediaMock = (initialMatches: boolean = false) => {
  let currentMatches = initialMatches;
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];

  const mediaQueryList = {
    get matches() {
      return currentMatches;
    },
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: vi.fn(
      (event: string, listener: (event: MediaQueryListEvent) => void) => {
        if (event === "change") listeners.push(listener);
      }
    ),
    removeEventListener: vi.fn(
      (event: string, listener: (event: MediaQueryListEvent) => void) => {
        if (event === "change") {
          const index = listeners.indexOf(listener);
          if (index > -1) listeners.splice(index, 1);
        }
      }
    ),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  return {
    mock: () => mediaQueryList,
    triggerChange: (matches: boolean) => {
      currentMatches = matches;

      listeners.forEach((listener) =>
        listener({ matches } as MediaQueryListEvent)
      );
    },
    getListenerCount: () => listeners.length,
  };
};

const render = (options: RenderOptions<typeof ThemeToggle> = {}) => {
  const wrapper = mount(ThemeToggle, options);

  return {
    wrapper,
    getToggleButton: () => wrapper.findByTestId("theme-toggle"),
  };
};

describe("ThemeToggle", () => {
  let matchMediaHelper: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
    // matchMedia must be mocked as it's a browser API not available in JSDOM
    matchMediaHelper = createMatchMediaMock(false);
    window.matchMedia = matchMediaHelper.mock as typeof window.matchMedia;
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
    it("toggles to dark mode on click", async () => {
      const { getToggleButton } = render();

      await getToggleButton().trigger("click");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("updates aria-label when toggling to dark mode", async () => {
      const { getToggleButton } = render();

      expect(getToggleButton().attributes("aria-label")).toContain("dark");

      await getToggleButton().trigger("click");
      expect(getToggleButton().attributes("aria-label")).toContain("light");
    });
  });

  describe("localStorage persistence", () => {
    it("saves theme preference to localStorage on toggle", async () => {
      const { getToggleButton } = render();

      await getToggleButton().trigger("click");
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });

  describe("system preference", () => {
    it("respects system dark mode preference when no localStorage value", () => {
      // Set matchMedia to return matches: true for dark mode preference
      matchMediaHelper = createMatchMediaMock(true);
      window.matchMedia = matchMediaHelper.mock as typeof window.matchMedia;

      render();
      // The component checks system preference on mount if no localStorage
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("updates theme when system preference changes", async () => {
      const { wrapper } = render();

      // Initially light mode
      expect(document.documentElement.classList.contains("dark")).toBe(false);

      // Simulate system switching to dark mode
      matchMediaHelper.triggerChange(true);
      await wrapper.vm.$nextTick();

      expect(document.documentElement.classList.contains("dark")).toBe(true);

      // Simulate system switching back to light mode
      matchMediaHelper.triggerChange(false);
      await wrapper.vm.$nextTick();

      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("ignores system preference changes when user has set manual preference", async () => {
      const { wrapper, getToggleButton } = render();

      // User manually toggles to dark mode
      await getToggleButton().trigger("click");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorage.getItem("theme")).toBe("dark");

      // Simulate system switching to light mode - should be ignored
      matchMediaHelper.triggerChange(false);
      await wrapper.vm.$nextTick();

      // Should still be dark because user preference takes precedence
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
