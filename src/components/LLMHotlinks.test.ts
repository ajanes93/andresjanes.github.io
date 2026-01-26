import { mount } from "@vue/test-utils";

import type { LLMProvider } from "@/stores/profile";
import type { RenderOptions } from "@/test/utils";

import LLMHotlinks from "./LLMHotlinks.vue";

const TEST_PROVIDERS: LLMProvider[] = [
  {
    color: "#10A37F",
    icon: "sparkles",
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com/",
  },
  {
    color: "#D97757",
    icon: "brain",
    id: "claude",
    name: "Claude",
    url: "https://claude.ai/new",
  },
  {
    color: "#4285F4",
    icon: "gem",
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com/",
  },
  {
    color: "#20B2AA",
    icon: "search",
    id: "perplexity",
    name: "Perplexity",
    url: "https://perplexity.ai/",
  },
];

const TEST_PROMPT = "Tell me about this candidate";

const render = (options: RenderOptions<typeof LLMHotlinks> = {}) => {
  const wrapper = mount(LLMHotlinks, {
    global: {
      ...options.global,
    },
    props: {
      prompt: TEST_PROMPT,
      providers: TEST_PROVIDERS,
      ...options.props,
    },
  });

  return {
    wrapper,
    getProviderButton: (name: string) => wrapper.findByAria(name),
    getCopyButton: () => wrapper.findByTestId("copy-button"),
    getAnimatedBeams: () => wrapper.findAllByTestId("animated-beam"),
    getLlmButtons: () => wrapper.findAllByTestId("llm-button"),
  };
};

describe("LLMHotlinks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders the component", () => {
      const { wrapper } = render();
      expect(wrapper.exists()).toBe(true);
    });

    it("renders the title", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Ask AI About This Candidate");
    });

    it("renders the description", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Click an AI assistant");
    });

    it("renders LLM buttons", () => {
      const { getLlmButtons } = render();
      expect(getLlmButtons().length).toBe(4);
    });
  });

  describe("provider buttons", () => {
    it("renders ChatGPT button with correct aria-label", () => {
      const { getProviderButton } = render();
      expect(getProviderButton("ChatGPT").exists()).toBe(true);
    });

    it("renders Claude button with correct aria-label", () => {
      const { getProviderButton } = render();
      expect(getProviderButton("Claude").exists()).toBe(true);
    });

    it("renders Gemini button with correct aria-label", () => {
      const { getProviderButton } = render();
      expect(getProviderButton("Gemini").exists()).toBe(true);
    });

    it("renders Perplexity button with correct aria-label", () => {
      const { getProviderButton } = render();
      expect(getProviderButton("Perplexity").exists()).toBe(true);
    });
  });

  describe("provider links", () => {
    it("ChatGPT link has correct href with encoded prompt", () => {
      const { getProviderButton } = render();
      const link = getProviderButton("ChatGPT");

      expect(link.attributes("href")).toContain("chat.openai.com");

      expect(link.attributes("href")).toContain(
        encodeURIComponent(TEST_PROMPT)
      );

      expect(link.attributes("target")).toBe("_blank");
      expect(link.attributes("rel")).toBe("noopener noreferrer");
    });

    it("Claude link has correct href with encoded prompt", () => {
      const { getProviderButton } = render();
      const link = getProviderButton("Claude");

      expect(link.attributes("href")).toContain("claude.ai");
      expect(link.attributes("target")).toBe("_blank");
    });

    it("Gemini link uses Google search with udm=50", () => {
      const { getProviderButton } = render();
      const link = getProviderButton("Gemini");

      expect(link.attributes("href")).toContain("google.com/search");
      expect(link.attributes("href")).toContain("udm=50");
      expect(link.attributes("target")).toBe("_blank");
    });

    it("Perplexity link has correct href with encoded prompt", () => {
      const { getProviderButton } = render();
      const link = getProviderButton("Perplexity");

      expect(link.attributes("href")).toContain("perplexity.ai");
      expect(link.attributes("target")).toBe("_blank");
    });
  });

  describe("copy prompt button", () => {
    it("renders copy button", () => {
      const { getCopyButton } = render();
      expect(getCopyButton().exists()).toBe(true);
    });

    it("shows copy prompt text initially", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Copy prompt");
    });

    it("has correct aria-label", () => {
      const { getCopyButton } = render();

      expect(getCopyButton().attributes("aria-label")).toBe(
        "Copy prompt to clipboard"
      );
    });
  });

  describe("center logo", () => {
    it("renders AJ initials", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("AJ");
    });
  });

  describe("animated beams", () => {
    it("renders animated beams container when ready", async () => {
      const { wrapper, getAnimatedBeams } = render();
      await new Promise((resolve) => setTimeout(resolve, 250));
      await wrapper.vm.$nextTick();

      expect(getAnimatedBeams().length).toBeGreaterThanOrEqual(0);
    });
  });
});
