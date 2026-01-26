import { mount } from "@vue/test-utils";

import type { RenderOptions } from "@/test/utils";

import TextGenerateEffect from "./TextGenerateEffect.vue";

const TEST_PROPS = {
  words: "Hello world test",
};

const render = (options: RenderOptions<typeof TextGenerateEffect> = {}) => {
  const wrapper = mount(TextGenerateEffect, {
    props: { ...TEST_PROPS, ...options.props },
  });

  return {
    wrapper,
    getContainer: () => wrapper.findByTestId("text-generate-effect"),
    getWords: () => wrapper.findAll("span.inline-block"),
  };
};

describe("TextGenerateEffect", () => {
  it("renders the container", () => {
    const { getContainer } = render();
    expect(getContainer().exists()).toBe(true);
  });

  it("splits words into separate spans", () => {
    const { getWords } = render();
    expect(getWords()).toHaveLength(3);
  });

  it("renders each word with non-breaking space", () => {
    const { getWords } = render();
    expect(getWords()[0].text()).toContain("Hello");
    expect(getWords()[1].text()).toContain("world");
    expect(getWords()[2].text()).toContain("test");
  });
});
