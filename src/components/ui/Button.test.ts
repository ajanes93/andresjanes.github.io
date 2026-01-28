import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import Button from "./Button.vue";

const render = (options: RenderOptions<typeof Button> = {}) => {
  const wrapper = mount(Button, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
    slots: {
      default: "Click me",
      ...options.slots,
    },
  });

  return { wrapper };
};

describe("Button", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders a button element by default", () => {
      const { wrapper } = render();
      expect(wrapper.element.tagName).toBe("BUTTON");
    });

    it("renders slot content", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toBe("Click me");
    });

    it('has type="button" by default', () => {
      const { wrapper } = render();
      expect(wrapper.attributes("type")).toBe("button");
    });
  });

  describe("asChild", () => {
    it("renders as span when asChild is true", () => {
      const { wrapper } = render({ props: { asChild: true } });
      expect(wrapper.element.tagName).toBe("SPAN");
    });

    it("does not have type attribute when asChild is true", () => {
      const { wrapper } = render({ props: { asChild: true } });
      expect(wrapper.attributes("type")).toBeUndefined();
    });
  });

  describe("variants", () => {
    it("applies default variant by default", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("bg-primary");
    });

    it("applies destructive variant", () => {
      const { wrapper } = render({ props: { variant: "destructive" } });
      expect(wrapper.classes()).toContain("bg-destructive");
    });

    it("applies outline variant", () => {
      const { wrapper } = render({ props: { variant: "outline" } });
      expect(wrapper.classes()).toContain("border");
      expect(wrapper.classes()).toContain("bg-background");
    });

    it("applies secondary variant", () => {
      const { wrapper } = render({ props: { variant: "secondary" } });
      expect(wrapper.classes()).toContain("bg-secondary");
    });

    it("applies ghost variant", () => {
      const { wrapper } = render({ props: { variant: "ghost" } });
      expect(wrapper.classes()).not.toContain("bg-primary");
    });

    it("applies link variant", () => {
      const { wrapper } = render({ props: { variant: "link" } });
      expect(wrapper.classes()).toContain("underline-offset-4");
    });
  });

  describe("sizes", () => {
    it("applies default size", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("h-10");
      expect(wrapper.classes()).toContain("px-4");
    });

    it("applies sm size", () => {
      const { wrapper } = render({ props: { size: "sm" } });
      expect(wrapper.classes()).toContain("h-9");
    });

    it("applies lg size", () => {
      const { wrapper } = render({ props: { size: "lg" } });
      expect(wrapper.classes()).toContain("h-11");
    });

    it("applies icon size", () => {
      const { wrapper } = render({ props: { size: "icon" } });
      expect(wrapper.classes()).toContain("size-10");
    });
  });

  describe("custom classes", () => {
    it("applies custom class", () => {
      const { wrapper } = render({ props: { class: "custom-class" } });
      expect(wrapper.classes()).toContain("custom-class");
    });

    it("merges custom class with variant classes", () => {
      const { wrapper } = render({
        props: { class: "my-button", variant: "secondary" },
      });

      expect(wrapper.classes()).toContain("bg-secondary");
      expect(wrapper.classes()).toContain("my-button");
    });
  });

  describe("base styles", () => {
    it("has inline-flex display", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("inline-flex");
    });

    it("has items-center", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("items-center");
    });

    it("has justify-center", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("justify-center");
    });

    it("has rounded-md", () => {
      const { wrapper } = render();
      expect(wrapper.classes()).toContain("rounded-md");
    });
  });

  describe("events", () => {
    it("emits click event", async () => {
      const { wrapper } = render();
      await wrapper.trigger("click");
      expect(wrapper.emitted("click")).toHaveLength(1);
    });
  });
});
