import { mount } from "@vue/test-utils";

import type { SocialLink } from "@/stores/profile";
import type { RenderOptions } from "@/test/utils";

import ProfileHero from "./ProfileHero.vue";

const TEST_PROPS = {
  avatarPath: "/img/avatar.jpg",
  company: "Tech Company",
  languages: [
    { level: "Native", name: "English" },
    { level: "Professional", name: "Spanish" },
  ],
  location: "Remote, UK",
  name: "John Doe",
  pronouns: "He/Him",
  socials: [
    {
      href: "https://linkedin.com/in/johndoe",
      icon: "linkedin",
      name: "LinkedIn",
    },
    { href: "https://github.com/johndoe", icon: "github", name: "GitHub" },
    { href: "mailto:john@example.com", icon: "mail", name: "Email" },
  ] as SocialLink[],
  title: "Software Engineer",
  yearsExperience: "10+",
};

const render = (options: RenderOptions<typeof ProfileHero> = {}) => {
  const wrapper = mount(ProfileHero, {
    global: {
      ...options.global,
    },
    props: {
      ...TEST_PROPS,
      ...options.props,
    },
  });

  return {
    wrapper,
    getAvatarImage: () => wrapper.findByTestId("avatar-image"),
    getSocialLink: (icon: string) =>
      wrapper.findByTestId(`social-link-${icon}`),
    getAllSocialLinks: () => [
      ...wrapper.findAllByTestId("social-link-linkedin"),
      ...wrapper.findAllByTestId("social-link-github"),
      ...wrapper.findAllByTestId("social-link-mail"),
    ],
  };
};

describe("ProfileHero", () => {
  describe("rendering", () => {
    it("renders the name", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("John Doe");
    });

    it("renders the title", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Software Engineer");
    });

    it("renders the company", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Tech Company");
    });

    it("renders the location", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("Remote, UK");
    });

    it("renders years of experience", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("10+");
      expect(wrapper.text()).toContain("years experience");
    });

    it("renders pronouns badge", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("He/Him");
    });
  });

  describe("avatar", () => {
    it("renders avatar with correct src", () => {
      const { getAvatarImage } = render();
      expect(getAvatarImage().attributes("src")).toBe("/img/avatar.jpg");
    });

    it("renders avatar with correct alt", () => {
      const { getAvatarImage } = render();
      expect(getAvatarImage().attributes("alt")).toBe("John Doe");
    });

    it("renders fallback with initials", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("JD");
    });
  });

  describe("languages", () => {
    it("displays languages", () => {
      const { wrapper } = render();
      expect(wrapper.text()).toContain("English");
      expect(wrapper.text()).toContain("Spanish");
    });
  });

  describe("social links", () => {
    it("renders social link buttons", () => {
      const { getAllSocialLinks } = render();
      expect(getAllSocialLinks().length).toBe(3);
    });

    it("sets correct href for social links", () => {
      const { getSocialLink } = render();
      const linkedInLink = getSocialLink("linkedin");
      expect(linkedInLink.exists()).toBe(true);

      expect(linkedInLink.attributes("href")).toBe(
        "https://linkedin.com/in/johndoe"
      );
    });

    it("opens external links in new tab", () => {
      const { getSocialLink } = render();
      const linkedInLink = getSocialLink("linkedin");
      expect(linkedInLink.attributes("target")).toBe("_blank");
      expect(linkedInLink.attributes("rel")).toContain("noopener");
    });

    it("does not open mailto links in new tab", () => {
      const { getSocialLink } = render();
      const mailLink = getSocialLink("mail");
      expect(mailLink.attributes("target")).toBeUndefined();
    });

    it("sets aria-label for accessibility", () => {
      const { getSocialLink } = render();
      const linkedInLink = getSocialLink("linkedin");
      expect(linkedInLink.attributes("aria-label")).toBe("LinkedIn");
    });
  });

  describe("with different props", () => {
    it("renders different name", () => {
      const { wrapper } = render({
        props: { ...TEST_PROPS, name: "Jane Smith" },
      });

      expect(wrapper.text()).toContain("Jane Smith");
      expect(wrapper.text()).toContain("JS");
    });

    it("handles single name", () => {
      const { wrapper } = render({
        props: { ...TEST_PROPS, name: "Madonna" },
      });

      expect(wrapper.text()).toContain("Madonna");
      expect(wrapper.text()).toContain("M");
    });
  });
});
