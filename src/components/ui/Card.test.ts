import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import Card from "./Card.vue";

const render = (options: RenderOptions<typeof Card> = {}) => {
  const wrapper = mount(Card, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
    slots: {
      default: '<div data-testid="card-content">Card Content</div>',
      ...options.slots,
    },
  });

  return { wrapper };
};

describe("Card", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders slot content", () => {
      const { wrapper } = render();
      expect(wrapper.findByTestId("card-content").exists()).toBe(true);
      expect(wrapper.text()).toContain("Card Content");
    });

    it("renders custom slot content", () => {
      const { wrapper } = render({
        slots: { default: "<span>Custom Card</span>" },
      });

      expect(wrapper.text()).toBe("Custom Card");
    });
  });

  describe("base styles", () => {
    it("has rounded-xl border radius", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("rounded-xl");
    });

    it("has border", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("border");
    });

    it("has bg-card background", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("bg-card");
    });

    it("has text-card-foreground color", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("text-card-foreground");
    });

    it("has shadow-sm", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("shadow-sm");
    });
  });

  describe("custom classes", () => {
    it("applies custom class", () => {
      const { wrapper } = render({ props: { class: "custom-class" } });
      expect(wrapper.classes()).toContain("custom-class");
    });

    it("merges custom class with base classes", () => {
      const { wrapper } = render({ props: { class: "my-card" } });
      expect(wrapper.classes()).toContain("rounded-xl");
      expect(wrapper.classes()).toContain("my-card");
    });
  });
});
