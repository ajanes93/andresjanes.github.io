import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import AnimatedBeam from "./AnimatedBeam.vue";

vi.mock("@vueuse/core", () => ({
  useResizeObserver: vi.fn(),
}));

function createMockElement(rect: Partial<DOMRect>): HTMLElement {
  const element = document.createElement("div");

  element.getBoundingClientRect = vi.fn(() => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  }));

  return element;
}

const TEST_PROPS = {
  containerRef: createMockElement({
    height: 500,
    left: 0,
    top: 0,
    width: 800,
  }),
  endRef: createMockElement({
    height: 50,
    left: 600,
    top: 200,
    width: 100,
  }),
  startRef: createMockElement({
    height: 50,
    left: 100,
    top: 100,
    width: 100,
  }),
};

function render(options: RenderOptions<typeof AnimatedBeam> = {}) {
  const wrapper = mount(AnimatedBeam, {
    props: {
      ...TEST_PROPS,
      ...options.props,
    },
  });

  return {
    wrapper,
    svg: () => wrapper.findByTestId("animated-beam"),
    backgroundPath: () => wrapper.findByTestId("beam-background-path"),
    animatedPath: () => wrapper.findByTestId("beam-animated-path"),
    gradient: () => wrapper.findByTestId("beam-gradient"),
  };
}

describe("AnimatedBeam", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders nothing when any ref is null", () => {
      expect(
        render({ props: { containerRef: null } })
          .svg()
          .exists()
      ).toBe(false);

      expect(
        render({ props: { startRef: null } })
          .svg()
          .exists()
      ).toBe(false);

      expect(
        render({ props: { endRef: null } })
          .svg()
          .exists()
      ).toBe(false);
    });

    it("renders SVG with all required elements when refs provided", () => {
      const { svg, backgroundPath, animatedPath, gradient } = render();

      expect(svg().exists()).toBe(true);
      expect(svg().attributes("xmlns")).toBe("http://www.w3.org/2000/svg");
      expect(svg().classes()).toContain("pointer-events-none");
      expect(svg().classes()).toContain("absolute");

      expect(backgroundPath().exists()).toBe(true);
      expect(animatedPath().exists()).toBe(true);
      expect(gradient().exists()).toBe(true);
    });

    it("applies custom class", () => {
      const { svg } = render({ props: { class: "custom-class" } });
      expect(svg().classes()).toContain("custom-class");
    });
  });

  describe("gradient ID", () => {
    it("generates unique gradient ID and references it in stroke", () => {
      const { gradient, animatedPath } = render();
      const gradientId = gradient().attributes("id");

      expect(gradientId).toMatch(/^v-\d+$/);
      expect(animatedPath().attributes("stroke")).toBe(`url(#${gradientId})`);
    });
  });

  describe("default props", () => {
    it("applies default styling", () => {
      const { backgroundPath, wrapper } = render();

      expect(backgroundPath().attributes("stroke")).toBe("gray");
      expect(backgroundPath().attributes("stroke-opacity")).toBe("0.2");
      expect(backgroundPath().attributes("stroke-width")).toBe("2");

      const animates = wrapper.findAll("animate");
      expect(animates[0].attributes("dur")).toBe("4s");
    });

    it("applies default gradient colors", () => {
      const { wrapper } = render();
      const stops = wrapper.findAll("stop");

      expect(stops[0].attributes("stop-color")).toBe("#FFAA40");
      expect(stops[1].attributes("stop-color")).toBe("#FFAA40");
      expect(stops[2].attributes("stop-color")).toBe("#9C40FF");
      expect(stops[3].attributes("stop-color")).toBe("#9C40FF");
    });

    it("applies default curvature of 0", () => {
      const { backgroundPath } = render();
      const pathD = backgroundPath().attributes("d");
      expect(pathD).toContain("Q 400,125");
    });
  });

  describe("custom props", () => {
    it("applies custom path styling", () => {
      const { backgroundPath, animatedPath } = render({
        props: { pathColor: "blue", pathOpacity: 0.5, pathWidth: 4 },
      });

      expect(backgroundPath().attributes("stroke")).toBe("blue");
      expect(backgroundPath().attributes("stroke-opacity")).toBe("0.5");
      expect(backgroundPath().attributes("stroke-width")).toBe("4");
      expect(animatedPath().attributes("stroke-width")).toBe("4");
    });

    it("applies custom animation duration", () => {
      const { wrapper } = render({ props: { duration: 2 } });
      const animates = wrapper.findAll("animate");
      expect(animates[0].attributes("dur")).toBe("2s");
    });

    it("applies custom gradient colors", () => {
      const { wrapper } = render({
        props: { gradientStartColor: "#FF0000", gradientStopColor: "#00FF00" },
      });

      const stops = wrapper.findAll("stop");

      expect(stops[0].attributes("stop-color")).toBe("#FF0000");
      expect(stops[2].attributes("stop-color")).toBe("#00FF00");
    });
  });

  describe("SVG dimensions", () => {
    it("sets dimensions from containerRef", () => {
      const { svg } = render();

      expect(svg().attributes("width")).toBe("800");
      expect(svg().attributes("height")).toBe("500");
      expect(svg().attributes("viewBox")).toBe("0 0 800 500");
    });

    it("updates dimensions when container changes", () => {
      const newContainerRef = createMockElement({
        height: 600,
        left: 0,
        top: 0,
        width: 1000,
      });

      const { svg } = render({ props: { containerRef: newContainerRef } });

      expect(svg().attributes("width")).toBe("1000");
      expect(svg().attributes("height")).toBe("600");
      expect(svg().attributes("viewBox")).toBe("0 0 1000 600");
    });
  });

  describe("path calculation", () => {
    it("produces valid quadratic bezier path from center to center", () => {
      const { backgroundPath } = render();
      const pathD = backgroundPath().attributes("d");

      expect(pathD).toMatch(/^M \d+,\d+ Q \d+,\d+ \d+,\d+$/);
      expect(pathD).toMatch(/^M 150,125/); // Start center: (100+50, 100+25)
      expect(pathD).toMatch(/650,225$/); // End center: (600+50, 200+25)
    });

    it("applies curvature to control point", () => {
      const { backgroundPath } = render({ props: { curvature: 50 } });
      const pathD = backgroundPath().attributes("d");
      expect(pathD).toContain("Q 400,75"); // Y = 125 - 50
    });

    it("applies offsets to start and end points", () => {
      const { backgroundPath } = render({
        props: {
          startXOffset: 20,
          startYOffset: 10,
          endXOffset: -20,
          endYOffset: 15,
        },
      });

      const pathD = backgroundPath().attributes("d");

      expect(pathD).toMatch(/^M 170,135/); // (150+20, 125+10)
      expect(pathD).toMatch(/630,240$/); // (650-20, 225+15)
    });

    it("both paths share the same d attribute", () => {
      const { backgroundPath, animatedPath } = render();

      expect(backgroundPath().attributes("d")).toBe(
        animatedPath().attributes("d")
      );
    });
  });

  describe("reverse prop", () => {
    it("controls animation direction for left-to-right beam", () => {
      const normal = render();
      const reversed = render({ props: { reverse: true } });

      expect(normal.wrapper.findAll("animate")[0].attributes("values")).toBe(
        "10%; 110%;"
      );

      expect(reversed.wrapper.findAll("animate")[0].attributes("values")).toBe(
        "90%; -10%;"
      );
    });

    it("controls animation direction for right-to-left beam", () => {
      const endRef = createMockElement({
        height: 50,
        left: 50,
        top: 200,
        width: 100,
      });

      const startRef = createMockElement({
        height: 50,
        left: 600,
        top: 100,
        width: 100,
      });

      const normal = render({ props: { endRef, startRef } });
      const reversed = render({ props: { endRef, startRef, reverse: true } });

      expect(normal.wrapper.findAll("animate")[0].attributes("values")).toBe(
        "90%; -10%;"
      );

      expect(reversed.wrapper.findAll("animate")[0].attributes("values")).toBe(
        "10%; 110%;"
      );
    });

    it("updates x2 animation values consistently with x1", () => {
      const { wrapper } = render();
      const animates = wrapper.findAll("animate");
      const x1Values = animates[0].attributes("values");
      const x2Values = animates[1].attributes("values");

      if (x1Values === "10%; 110%;") {
        expect(x2Values).toBe("0%; 100%;");
      } else {
        expect(x2Values).toBe("100%; 0%;");
      }
    });
  });

  describe("gradient animation", () => {
    it("configures smooth repeating animations", () => {
      const { wrapper } = render();
      const animates = wrapper.findAll("animate");

      expect(animates).toHaveLength(2);

      for (const animate of animates) {
        expect(animate.attributes("calcMode")).toBe("spline");
        expect(animate.attributes("keySplines")).toBe("0.16 1 0.3 1");
        expect(animate.attributes("keyTimes")).toBe("0; 1");
        expect(animate.attributes("repeatCount")).toBe("indefinite");
      }

      expect(animates[0].attributes("attributeName")).toBe("x1");
      expect(animates[1].attributes("attributeName")).toBe("x2");
    });
  });

  describe("gradient stops", () => {
    it("configures four stops with correct offsets and opacity", () => {
      const { wrapper } = render();
      const stops = wrapper.findAll("stop");

      expect(stops).toHaveLength(4);

      expect(stops[0].attributes("stop-opacity")).toBe("0");
      expect(stops[0].attributes("offset")).toBeUndefined();

      expect(stops[1].attributes("stop-opacity")).toBeUndefined();
      expect(stops[1].attributes("offset")).toBeUndefined();

      expect(stops[2].attributes("offset")).toBe("32.5%");
      expect(stops[2].attributes("stop-opacity")).toBeUndefined();

      expect(stops[3].attributes("offset")).toBe("100%");
      expect(stops[3].attributes("stop-opacity")).toBe("0");
    });
  });

  describe("path styling", () => {
    it("applies consistent styling to both paths", () => {
      const { backgroundPath, animatedPath } = render({
        props: { pathWidth: 3 },
      });

      expect(backgroundPath().attributes("stroke-linecap")).toBe("round");
      expect(backgroundPath().attributes("fill")).toBe("none");
      expect(backgroundPath().attributes("stroke-width")).toBe("3");

      expect(animatedPath().attributes("stroke-linecap")).toBe("round");
      expect(animatedPath().attributes("fill")).toBe("none");
      expect(animatedPath().attributes("stroke-width")).toBe("3");
    });

    it("only applies opacity to background path", () => {
      const { backgroundPath, animatedPath } = render();

      expect(backgroundPath().attributes("stroke-opacity")).toBe("0.2");
      expect(animatedPath().attributes("stroke-opacity")).toBeUndefined();
    });
  });
});
