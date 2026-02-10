import { createPinia, setActivePinia } from "pinia";

import { useProfileStore } from "./profile";

describe("useProfileStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("state", () => {
    it("has correct name", () => {
      const store = useProfileStore();
      expect(store.name).toBe("Andres Janes");
    });

    it("has correct title", () => {
      const store = useProfileStore();
      expect(store.title).toBe("Senior Software Engineer");
    });

    it("has correct company", () => {
      const store = useProfileStore();
      expect(store.company).toBe("Cision");
    });

    it("has correct location", () => {
      const store = useProfileStore();
      expect(store.location).toBe("Remote, United Kingdom");
    });

    it("has experience array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.experience)).toBe(true);
      expect(store.experience.length).toBeGreaterThan(0);
    });

    it("has education array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.education)).toBe(true);
      expect(store.education.length).toBeGreaterThan(0);
    });

    it("has skills array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.skills)).toBe(true);
      expect(store.skills.length).toBeGreaterThan(0);
    });

    it("has languages array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.languages)).toBe(true);
      expect(store.languages.length).toBeGreaterThan(0);
    });

    it("has socials array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.socials)).toBe(true);
      expect(store.socials.length).toBeGreaterThan(0);
    });

    it("has llmProviders array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.llmProviders)).toBe(true);
      expect(store.llmProviders.length).toBeGreaterThan(0);
    });

    it("has recommendations array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.recommendations)).toBe(true);
      expect(store.recommendations.length).toBeGreaterThan(0);
    });

    it("has personal info object", () => {
      const store = useProfileStore();
      expect(store.personal).toBeDefined();
      expect(typeof store.personal).toBe("object");
    });
  });

  describe("personal info", () => {
    it("has origin", () => {
      const store = useProfileStore();
      expect(store.personal.origin).toBe("Colombia");
    });

    it("has currentChapter", () => {
      const store = useProfileStore();
      expect(store.personal.currentChapter).toContain("Arianna");
    });

    it("has interests array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.personal.interests)).toBe(true);
      expect(store.personal.interests.length).toBeGreaterThan(0);
    });

    it("has aiTools array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.personal.aiTools)).toBe(true);
      expect(store.personal.aiTools.length).toBeGreaterThan(0);
    });

    it("has sideProjectStatus", () => {
      const store = useProfileStore();
      expect(store.personal.sideProjectStatus).toBeDefined();
    });

    it("has sideProjects array", () => {
      const store = useProfileStore();
      expect(Array.isArray(store.personal.sideProjects)).toBe(true);
      expect(store.personal.sideProjects.length).toBeGreaterThan(0);
    });
  });

  describe("experience items", () => {
    it("have required properties", () => {
      const store = useProfileStore();

      store.experience.forEach((item) => {
        expect(item.title).toBeDefined();
        expect(item.company).toBeDefined();
        expect(item.location).toBeDefined();
        expect(item.startDate).toBeDefined();
        expect(item.description).toBeDefined();
        expect(item.logoPath).toBeDefined();
      });
    });

    it("have valid date formats", () => {
      const store = useProfileStore();
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      store.experience.forEach((item) => {
        expect(item.startDate).toMatch(dateRegex);

        if (item.endDate) {
          expect(item.endDate).toMatch(dateRegex);
        }
      });
    });
  });

  describe("llmProviders", () => {
    it("have required properties", () => {
      const store = useProfileStore();

      store.llmProviders.forEach((provider) => {
        expect(provider.id).toBeDefined();
        expect(provider.name).toBeDefined();
        expect(provider.icon).toBeDefined();
        expect(provider.color).toBeDefined();
        expect(provider.url).toBeDefined();
      });
    });

    it("have valid URLs", () => {
      const store = useProfileStore();

      store.llmProviders.forEach((provider) => {
        expect(provider.url).toMatch(/^https?:\/\//);
      });
    });
  });

  describe("getters", () => {
    describe("getCandidateSummaryPrompt", () => {
      it("returns a string", () => {
        const store = useProfileStore();
        expect(typeof store.getCandidateSummaryPrompt).toBe("string");
      });

      it("includes candidate name", () => {
        const store = useProfileStore();
        expect(store.getCandidateSummaryPrompt).toContain("Andres Janes");
      });

      it("includes work experience", () => {
        const store = useProfileStore();
        expect(store.getCandidateSummaryPrompt).toContain("Work Experience");
      });

      it("includes skills", () => {
        const store = useProfileStore();
        expect(store.getCandidateSummaryPrompt).toContain("Technical Skills");
      });

      it("includes education", () => {
        const store = useProfileStore();
        expect(store.getCandidateSummaryPrompt).toContain("Education");
      });

      it("includes personal info", () => {
        const store = useProfileStore();
        expect(store.getCandidateSummaryPrompt).toContain("Personal");
        expect(store.getCandidateSummaryPrompt).toContain("Colombia");
      });
    });
  });
});
