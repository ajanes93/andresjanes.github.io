import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import CardHeader from "./CardHeader.vue";

const render = (options: RenderOptions<typeof CardHeader> = {}) => {
  const wrapper = mount(CardHeader, {
    props: { ...options.props },
    slots: {
      default: "<h2>Header</h2>",
      ...options.slots,
    },
  });

  return {
    wrapper,
    getHeader: () => wrapper.findByTestId("card-header"),
  };
};

describe("CardHeader", () => {
  it("renders slot content", () => {
    const { wrapper } = render();
    expect(wrapper.text()).toBe("Header");
  });

  it("renders custom slot content", () => {
    const { wrapper } = render({
      slots: { default: "<span>Custom Header</span>" },
    });

    expect(wrapper.text()).toBe("Custom Header");
  });
});
