import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import AvatarFallback from "./AvatarFallback.vue";

const render = (options: RenderOptions<typeof AvatarFallback> = {}) => {
  const wrapper = mount(AvatarFallback, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
    slots: {
      default: "AJ",
      ...options.slots,
    },
  });

  return {
    getFallback: () => wrapper.findByTestId("avatar-fallback"),
    wrapper,
  };
};

describe("AvatarFallback", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders the fallback", () => {
      const { getFallback } = render();
      expect(getFallback().exists()).toBe(true);
    });

    it("renders slot content", () => {
      const { getFallback } = render();
      expect(getFallback().text()).toBe("AJ");
    });

    it("renders custom slot content", () => {
      const { getFallback } = render({
        slots: { default: "JD" },
      });

      expect(getFallback().text()).toBe("JD");
    });

    it("renders icon as slot content", () => {
      const { wrapper } = render({
        slots: { default: "<svg data-testid='user-icon'></svg>" },
      });

      expect(wrapper.html()).toContain("user-icon");
    });
  });

  describe("custom classes", () => {
    it("applies custom class", () => {
      const { wrapper } = render({ props: { class: "text-lg" } });
      expect(wrapper.classes()).toContain("text-lg");
    });
  });
});
