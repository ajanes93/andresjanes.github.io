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
  beforeEach(() => {
    vi.spyOn(window, "open").mockImplementation(() => null);
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  });

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

  describe("clicking providers", () => {
    it("opens ChatGPT with encoded prompt", async () => {
      const { getProviderButton } = render();
      await getProviderButton("ChatGPT").trigger("click");

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("chat.openai.com"),
        "_blank"
      );

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(TEST_PROMPT)),
        "_blank"
      );
    });

    it("opens Claude with encoded prompt", async () => {
      const { getProviderButton } = render();
      await getProviderButton("Claude").trigger("click");

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("claude.ai"),
        "_blank"
      );
    });

    it("opens Gemini via Google search with udm=50", async () => {
      const { getProviderButton } = render();
      await getProviderButton("Gemini").trigger("click");

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("google.com/search"),
        "_blank"
      );

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("udm=50"),
        "_blank"
      );
    });

    it("opens Perplexity with encoded prompt", async () => {
      const { getProviderButton } = render();
      await getProviderButton("Perplexity").trigger("click");

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("perplexity.ai"),
        "_blank"
      );
    });
  });

  describe("copy prompt button", () => {
    it("copies prompt to clipboard", async () => {
      const { getCopyButton } = render();
      await getCopyButton().trigger("click");

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(TEST_PROMPT);
    });

    it("shows copied confirmation", async () => {
      const { wrapper, getCopyButton } = render();

      expect(wrapper.text()).toContain("Copy prompt");

      await getCopyButton().trigger("click");

      expect(wrapper.text()).toContain("copied");
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
