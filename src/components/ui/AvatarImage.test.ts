import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import AvatarImage from "./AvatarImage.vue";

const TEST_PROPS = {
  src: "https://example.com/avatar.jpg",
};

const render = (options: RenderOptions<typeof AvatarImage> = {}) => {
  const wrapper = mount(AvatarImage, {
    global: {
      ...options.global,
    },
    props: {
      ...TEST_PROPS,
      ...options.props,
    },
  });

  return {
    getImage: () => wrapper.findByTestId("avatar-image"),
    wrapper,
  };
};

describe("AvatarImage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders the image", () => {
      const { getImage } = render();
      expect(getImage().exists()).toBe(true);
    });

    it("sets the src attribute", () => {
      const { getImage } = render();

      expect(getImage().attributes("src")).toBe(
        "https://example.com/avatar.jpg"
      );
    });

    it("renders with custom src", () => {
      const { getImage } = render({
        props: { src: "https://example.com/custom.png" },
      });

      expect(getImage().attributes("src")).toBe(
        "https://example.com/custom.png"
      );
    });
  });

  describe("alt text", () => {
    it("sets alt attribute when provided", () => {
      const { getImage } = render({ props: { alt: "User avatar" } });
      expect(getImage().attributes("alt")).toBe("User avatar");
    });

    it("has undefined alt when not provided", () => {
      const { getImage } = render();
      expect(getImage().attributes("alt")).toBeUndefined();
    });
  });

  describe("custom classes", () => {
    it("applies custom class", () => {
      const { wrapper } = render({ props: { class: "rounded-none" } });
      expect(wrapper.classes()).toContain("rounded-none");
    });
  });
});
