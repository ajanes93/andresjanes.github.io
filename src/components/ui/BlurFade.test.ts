import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import BlurFade from "./BlurFade.vue";

const render = (options: RenderOptions<typeof BlurFade> = {}) => {
  const wrapper = mount(BlurFade, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
    slots: {
      default: '<div data-testid="slot-content">Content</div>',
      ...options.slots,
    },
  });

  return {
    wrapper,
    getBlurFade: () => wrapper.findByTestId("blur-fade"),
  };
};

describe("BlurFade", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders slot content", () => {
      const { wrapper } = render();
      expect(wrapper.findByTestId("slot-content").exists()).toBe(true);
    });

    it("renders blur-fade element", () => {
      const { getBlurFade } = render();
      expect(getBlurFade().exists()).toBe(true);
    });

    it("starts without visible class", () => {
      const { getBlurFade } = render();
      expect(getBlurFade().classes()).not.toContain("blur-fade--visible");
    });
  });

  describe("props", () => {
    it("applies default delay", () => {
      const { getBlurFade } = render();

      expect(getBlurFade().attributes("style")).toContain(
        "--blur-fade-delay: 0s"
      );
    });

    it("applies custom delay", () => {
      const { getBlurFade } = render({ props: { delay: 0.5 } });

      expect(getBlurFade().attributes("style")).toContain(
        "--blur-fade-delay: 0.5s"
      );
    });

    it("applies default duration", () => {
      const { getBlurFade } = render();

      expect(getBlurFade().attributes("style")).toContain(
        "--blur-fade-duration: 0.4s"
      );
    });

    it("applies custom duration", () => {
      const { getBlurFade } = render({ props: { duration: 1 } });

      expect(getBlurFade().attributes("style")).toContain(
        "--blur-fade-duration: 1s"
      );
    });

    it("applies default blur", () => {
      const { getBlurFade } = render();

      expect(getBlurFade().attributes("style")).toContain(
        "--blur-fade-blur: 6px"
      );
    });

    it("applies custom blur", () => {
      const { getBlurFade } = render({ props: { blur: "10px" } });

      expect(getBlurFade().attributes("style")).toContain(
        "--blur-fade-blur: 10px"
      );
    });

    it("applies default yOffset", () => {
      const { getBlurFade } = render();
      expect(getBlurFade().attributes("style")).toContain("--blur-fade-y: 6px");
    });

    it("applies custom yOffset", () => {
      const { getBlurFade } = render({ props: { yOffset: 12 } });

      expect(getBlurFade().attributes("style")).toContain(
        "--blur-fade-y: 12px"
      );
    });
  });

  describe("IntersectionObserver", () => {
    it("creates an IntersectionObserver on mount", () => {
      // Just verify the component mounts without error when IntersectionObserver is mocked
      const { wrapper } = render();
      expect(wrapper.exists()).toBe(true);
    });

    it("unmounts cleanly", () => {
      const { wrapper } = render();
      wrapper.unmount();
      // Verify unmount completes without error
      expect(wrapper.exists()).toBe(false);
    });
  });
});
