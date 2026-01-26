import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import BorderBeam from "./BorderBeam.vue";

const render = (options: RenderOptions<typeof BorderBeam> = {}) => {
  const wrapper = mount(BorderBeam, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
  });

  return {
    getBeam: () => wrapper.findByTestId("border-beam"),
    getBeamComponent: () => wrapper.findComponentByTestId("border-beam"),
    wrapper,
  };
};

describe("BorderBeam", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders the border beam", () => {
      const { getBeam } = render();
      expect(getBeam().exists()).toBe(true);
    });
  });

  describe("default props", () => {
    it("uses default anchor value", () => {
      const { getBeamComponent } = render();
      expect(getBeamComponent().props("anchor")).toBe(90);
    });

    it("uses default borderWidth value", () => {
      const { getBeamComponent } = render();
      expect(getBeamComponent().props("borderWidth")).toBe(1.5);
    });

    it("uses default colorFrom value", () => {
      const { getBeamComponent } = render();
      expect(getBeamComponent().props("colorFrom")).toBe("#0066ff");
    });

    it("uses default colorTo value", () => {
      const { getBeamComponent } = render();
      expect(getBeamComponent().props("colorTo")).toBe("#00ccff");
    });

    it("uses default delay value", () => {
      const { getBeamComponent } = render();
      expect(getBeamComponent().props("delay")).toBe(0);
    });

    it("uses default duration value", () => {
      const { getBeamComponent } = render();
      expect(getBeamComponent().props("duration")).toBe(15);
    });

    it("uses default size value", () => {
      const { getBeamComponent } = render();
      expect(getBeamComponent().props("size")).toBe(200);
    });
  });

  describe("custom props", () => {
    it("accepts custom anchor value", () => {
      const { getBeamComponent } = render({ props: { anchor: 45 } });
      expect(getBeamComponent().props("anchor")).toBe(45);
    });

    it("accepts custom borderWidth value", () => {
      const { getBeamComponent } = render({ props: { borderWidth: 2 } });
      expect(getBeamComponent().props("borderWidth")).toBe(2);
    });

    it("accepts custom colorFrom value", () => {
      const { getBeamComponent } = render({ props: { colorFrom: "#ff0000" } });
      expect(getBeamComponent().props("colorFrom")).toBe("#ff0000");
    });

    it("accepts custom colorTo value", () => {
      const { getBeamComponent } = render({ props: { colorTo: "#00ff00" } });
      expect(getBeamComponent().props("colorTo")).toBe("#00ff00");
    });

    it("accepts custom delay value", () => {
      const { getBeamComponent } = render({ props: { delay: 5 } });
      expect(getBeamComponent().props("delay")).toBe(5);
    });

    it("accepts custom duration value", () => {
      const { getBeamComponent } = render({ props: { duration: 10 } });
      expect(getBeamComponent().props("duration")).toBe(10);
    });

    it("accepts custom size value", () => {
      const { getBeamComponent } = render({ props: { size: 300 } });
      expect(getBeamComponent().props("size")).toBe(300);
    });
  });

  describe("custom classes", () => {
    it("applies custom class", () => {
      const { wrapper } = render({ props: { class: "opacity-50" } });
      expect(wrapper.classes()).toContain("opacity-50");
    });
  });
});
