import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import TracingBeam from "./TracingBeam.vue";

const render = (options: RenderOptions<typeof TracingBeam> = {}) => {
  const wrapper = mount(TracingBeam, {
    props: { ...options.props },
    slots: {
      default: "<div>Content</div>",
      ...options.slots,
    },
  });

  return {
    wrapper,
    getBeam: () => wrapper.findByTestId("tracing-beam"),
  };
};

describe("TracingBeam", () => {
  it("renders the container", () => {
    const { getBeam } = render();
    expect(getBeam().exists()).toBe(true);
  });

  it("renders slot content", () => {
    const { wrapper } = render();
    expect(wrapper.text()).toBe("Content");
  });

  it("renders custom slot content", () => {
    const { wrapper } = render({
      slots: { default: "<p>Custom content</p>" },
    });

    expect(wrapper.text()).toBe("Custom content");
  });
});
