import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import CardTitle from "./CardTitle.vue";

const render = (options: RenderOptions<typeof CardTitle> = {}) => {
  const wrapper = mount(CardTitle, {
    props: { ...options.props },
    slots: {
      default: "Title",
      ...options.slots,
    },
  });

  return {
    wrapper,
    getTitle: () => wrapper.findByTestId("card-title"),
  };
};

describe("CardTitle", () => {
  it("renders slot content", () => {
    const { wrapper } = render();
    expect(wrapper.text()).toBe("Title");
  });

  it("renders custom slot content", () => {
    const { wrapper } = render({
      slots: { default: "Custom Title" },
    });

    expect(wrapper.text()).toBe("Custom Title");
  });
});
