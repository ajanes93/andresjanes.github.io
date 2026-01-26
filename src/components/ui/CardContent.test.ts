import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import CardContent from "./CardContent.vue";

const render = (options: RenderOptions<typeof CardContent> = {}) => {
  const wrapper = mount(CardContent, {
    props: { ...options.props },
    slots: {
      default: "<p>Content</p>",
      ...options.slots,
    },
  });

  return {
    wrapper,
    getContent: () => wrapper.findByTestId("card-content"),
  };
};

describe("CardContent", () => {
  it("renders slot content", () => {
    const { wrapper } = render();
    expect(wrapper.text()).toBe("Content");
  });

  it("renders custom slot content", () => {
    const { wrapper } = render({
      slots: { default: "<span>Custom</span>" },
    });

    expect(wrapper.text()).toBe("Custom");
  });
});
