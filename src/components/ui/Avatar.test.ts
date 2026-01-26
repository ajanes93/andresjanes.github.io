import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import Avatar from "./Avatar.vue";

const render = (options: RenderOptions<typeof Avatar> = {}) => {
  const wrapper = mount(Avatar, {
    global: {
      ...options.global,
    },
    props: {
      ...options.props,
    },
    slots: {
      default: "<div>Avatar Content</div>",
      ...options.slots,
    },
  });

  return {
    getAvatar: () => wrapper.findByTestId("avatar"),
    wrapper,
  };
};

describe("Avatar", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders the avatar", () => {
      const { getAvatar } = render();
      expect(getAvatar().exists()).toBe(true);
    });

    it("renders slot content", () => {
      const { wrapper } = render();
      expect(wrapper.html()).toContain("Avatar Content");
    });

    it("renders custom slot content", () => {
      const { wrapper } = render({
        slots: { default: "<img src='avatar.jpg' />" },
      });

      expect(wrapper.html()).toContain("avatar.jpg");
    });
  });

  describe("custom classes", () => {
    it("applies custom class", () => {
      const { wrapper } = render({ props: { class: "custom-avatar" } });
      expect(wrapper.classes()).toContain("custom-avatar");
    });
  });
});
