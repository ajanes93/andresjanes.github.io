import { mount } from "@vue/test-utils";
import type { Component } from "vue";

import type { RenderOptions } from "@/test/utils";

import * as IconExports from "./index";

const icons = Object.entries(IconExports).map(([name, component]) => ({
  component: component as Component,
  name,
}));

const render = (
  component: Component,
  options: RenderOptions<Component> = {}
) => {
  const wrapper = mount(component, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
  });

  return {
    wrapper,
    getSvg: () => wrapper.findByTestId("icon-svg"),
  };
};

describe.each(icons)("$name", ({ component }) => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders an svg element", () => {
      const { getSvg } = render(component);
      expect(getSvg().exists()).toBe(true);
    });

    it("has correct xmlns attribute", () => {
      const { getSvg } = render(component);
      expect(getSvg().attributes("xmlns")).toBe("http://www.w3.org/2000/svg");
    });

    it("uses currentColor for fill", () => {
      const { getSvg } = render(component);
      expect(getSvg().attributes("fill")).toBe("currentColor");
    });

    it("contains a path element", () => {
      const { getSvg } = render(component);
      expect(getSvg().html()).toContain("<path");
    });
  });

  describe("class prop", () => {
    it("applies custom class to svg", () => {
      const { getSvg } = render(component, {
        props: { class: "custom-class" },
      });

      expect(getSvg().classes()).toContain("custom-class");
    });

    it("applies multiple classes", () => {
      const { getSvg } = render(component, {
        props: { class: "w-6 h-6 text-blue-500" },
      });

      expect(getSvg().classes()).toContain("w-6");
      expect(getSvg().classes()).toContain("h-6");
      expect(getSvg().classes()).toContain("text-blue-500");
    });

    it("renders without class prop", () => {
      const { getSvg } = render(component);
      expect(getSvg().exists()).toBe(true);
    });
  });
});
