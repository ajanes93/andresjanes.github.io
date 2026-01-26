import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import Badge from "./Badge.vue";

const render = (options: RenderOptions<typeof Badge> = {}) => {
  const wrapper = mount(Badge, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
    slots: {
      default: "Badge Text",
      ...options.slots,
    },
  });

  return { wrapper };
};

describe("Badge", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders slot content", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toBe("Badge Text");
    });

    it("renders custom slot content", () => {
      const { wrapper } = render({
        slots: { default: "Custom Content" },
      });

      expect(wrapper.text()).toBe("Custom Content");
    });
  });

  describe("variants", () => {
    it("applies default variant by default", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("bg-primary");
    });

    it("applies secondary variant", () => {
      const { wrapper } = render({ props: { variant: "secondary" } });
      expect(wrapper.classes()).toContain("bg-secondary");
    });

    it("applies destructive variant", () => {
      const { wrapper } = render({ props: { variant: "destructive" } });
      expect(wrapper.classes()).toContain("bg-destructive");
    });

    it("applies outline variant", () => {
      const { wrapper } = render({ props: { variant: "outline" } });
      expect(wrapper.classes()).toContain("text-foreground");
      expect(wrapper.classes()).not.toContain("bg-primary");
    });
  });

  describe("custom classes", () => {
    it("applies custom class", () => {
      const { wrapper } = render({ props: { class: "custom-class" } });
      expect(wrapper.classes()).toContain("custom-class");
    });

    it("merges custom class with variant classes", () => {
      const { wrapper } = render({
        props: { class: "custom-class", variant: "secondary" },
      });

      expect(wrapper.classes()).toContain("bg-secondary");
      expect(wrapper.classes()).toContain("custom-class");
    });
  });

  describe("base styles", () => {
    it("has inline-flex display", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("inline-flex");
    });

    it("has rounded-full border radius", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("rounded-full");
    });

    it("has border", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("border");
    });

    it("has text-xs font size", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("text-xs");
    });

    it("has font-semibold weight", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("font-semibold");
    });
  });
});
