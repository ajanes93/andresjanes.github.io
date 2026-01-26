import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import CardDescription from "./CardDescription.vue";

const render = (options: RenderOptions<typeof CardDescription> = {}) => {
  const wrapper = mount(CardDescription, {
    props: { ...options.props },
    slots: {
      default: "Description text",
      ...options.slots,
    },
  });

  return {
    wrapper,
    getDescription: () => wrapper.findByTestId("card-description"),
  };
};

describe("CardDescription", () => {
  it("renders slot content", () => {
    const { wrapper } = render();
    expect(wrapper.text()).toBe("Description text");
  });

  it("renders custom slot content", () => {
    const { wrapper } = render({
      slots: { default: "Custom description" },
    });

    expect(wrapper.text()).toBe("Custom description");
  });
});
