import jsPDF from "jspdf";

import type { ProfileState } from "@/stores/profile";

import { formatDate, generateFilename, useCvGenerator } from "./useCvGenerator";

const createMockProfile = (
  overrides: Partial<ProfileState> = {}
): ProfileState => ({
  availability: "Available",
  avatarPath: "/img/profile.webp",
  company: "Test Company",
  education: [
    {
      company: "Test University",
      description: "Bachelor's Degree",
      endDate: "2020-06-01",
      location: "Test City",
      logoPath: "/img/test.svg",
      startDate: "2016-09-01",
      title: "BSc Computer Science",
    },
  ],
  experience: [
    {
      company: "Company A",
      description: "Worked on various projects",
      location: "Remote",
      logoPath: "/img/company-a.svg",
      skills: ["TypeScript", "Vue.js"],
      startDate: "2023-01-15",
      title: "Senior Developer",
    },
    {
      company: "Company B",
      description: "Built web applications",
      endDate: "2023-01-01",
      location: "Office",
      logoPath: "/img/company-b.svg",
      skills: ["JavaScript", "React"],
      startDate: "2020-06-01",
      title: "Developer",
    },
  ],
  languages: [
    { level: "Native", name: "English" },
    { level: "Fluent", name: "Spanish" },
  ],
  llmProviders: [],
  location: "Test Location",
  name: "Test Person",
  pronouns: "They/Them",
  recommendations: [],
  skills: ["TypeScript", "Vue.js", "React", "Node.js", "GraphQL"],
  socials: [
    {
      href: "https://linkedin.com/in/test",
      icon: "linkedin",
      name: "LinkedIn",
    },
    { href: "mailto:test@example.com", icon: "mail", name: "Email" },
    { href: "https://github.com/test", icon: "github", name: "GitHub" },
  ],
  summary: "A skilled developer with experience in various technologies.",
  title: "Software Engineer",
  yearsExperience: "5+",
  ...overrides,
});

describe("formatDate", () => {
  it("formats ISO date to month and year", () => {
    expect(formatDate("2023-11-15")).toBe("Nov 2023");
    expect(formatDate("2020-01-01")).toBe("Jan 2020");
    expect(formatDate("2023-12-25")).toBe("Dec 2023");
  });

  it("handles year boundaries", () => {
    expect(formatDate("2024-01-01")).toBe("Jan 2024");
    expect(formatDate("2023-12-31")).toBe("Dec 2023");
  });
});

describe("generateFilename", () => {
  it("generates filename from name", () => {
    expect(generateFilename("John Doe")).toBe("cv_john_doe.pdf");
    expect(generateFilename("Madonna")).toBe("cv_madonna.pdf");
  });

  it("collapses multiple spaces", () => {
    expect(generateFilename("John  Middle  Doe")).toBe(
      "cv_john_middle_doe.pdf"
    );
  });

  it("handles special characters", () => {
    expect(generateFilename("José María García")).toBe(
      "cv_josé_maría_garcía.pdf"
    );
  });
});

describe("useCvGenerator", () => {
  describe("composable structure", () => {
    it("returns generateCv function", () => {
      const { generateCv } = useCvGenerator();

      expect(generateCv).toBeDefined();
      expect(typeof generateCv).toBe("function");
    });

    it("returns downloadCv function", () => {
      const { downloadCv } = useCvGenerator();

      expect(downloadCv).toBeDefined();
      expect(typeof downloadCv).toBe("function");
    });
  });

  describe("generateCv", () => {
    it("returns a jsPDF document and filename", () => {
      const { generateCv } = useCvGenerator();
      const result = generateCv({ profile: createMockProfile() });

      expect(result.doc).toHaveProperty("save");
      expect(result.doc).toHaveProperty("text");
      expect(result.doc).toHaveProperty("addPage");
      expect(result.filename).toBe("cv_test_person.pdf");
    });

    it("uses provided doc instance", () => {
      const { generateCv } = useCvGenerator();
      const providedDoc = new jsPDF();

      const result = generateCv({
        profile: createMockProfile(),
        doc: providedDoc,
      });

      expect(result.doc).toBe(providedDoc);
    });

    it("generates correct filename", () => {
      const { generateCv } = useCvGenerator();

      const result = generateCv({
        profile: createMockProfile({ name: "Jane Smith" }),
      });

      expect(result.filename).toBe("cv_jane_smith.pdf");
    });

    it("generates multi-page PDF for many experience items", () => {
      const { generateCv } = useCvGenerator();

      const profile = createMockProfile({
        experience: Array.from({ length: 15 }, (_, i) => ({
          company: `Company ${i}`,
          description: "A description that takes up space ".repeat(10),
          endDate: i < 14 ? "2023-01-01" : undefined,
          location: "Location",
          logoPath: "/img/logo.svg",
          skills: ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"],
          startDate: "2020-01-01",
          title: `Position ${i}`,
        })),
      });

      const result = generateCv({ profile });

      expect(result.doc.getNumberOfPages()).toBeGreaterThan(1);
    });

    it("handles empty arrays", () => {
      const { generateCv } = useCvGenerator();

      expect(() =>
        generateCv({ profile: createMockProfile({ experience: [] }) })
      ).not.toThrow();

      expect(() =>
        generateCv({ profile: createMockProfile({ education: [] }) })
      ).not.toThrow();

      expect(() =>
        generateCv({ profile: createMockProfile({ skills: [] }) })
      ).not.toThrow();

      expect(() =>
        generateCv({ profile: createMockProfile({ languages: [] }) })
      ).not.toThrow();

      expect(() =>
        generateCv({ profile: createMockProfile({ socials: [] }) })
      ).not.toThrow();
    });

    it("handles missing or empty skills in experience", () => {
      const { generateCv } = useCvGenerator();

      const experienceWithoutSkills = {
        company: "Company",
        description: "Work",
        location: "Office",
        logoPath: "/img/logo.svg",
        startDate: "2023-01-01",
        title: "Worker",
      };

      expect(() =>
        generateCv({
          profile: createMockProfile({ experience: [experienceWithoutSkills] }),
        })
      ).not.toThrow();

      expect(() =>
        generateCv({
          profile: createMockProfile({
            experience: [{ ...experienceWithoutSkills, skills: [] }],
          }),
        })
      ).not.toThrow();
    });

    it("handles current position without end date", () => {
      const { generateCv } = useCvGenerator();

      const currentJob = {
        company: "Current Company",
        description: "Doing great work",
        location: "Remote",
        logoPath: "/img/current.svg",
        startDate: "2023-01-01",
        title: "Engineer",
      };

      expect(() =>
        generateCv({ profile: createMockProfile({ experience: [currentJob] }) })
      ).not.toThrow();
    });

    it("handles long text content", () => {
      const { generateCv } = useCvGenerator();

      expect(() =>
        generateCv({
          profile: createMockProfile({
            summary: "This is a very long summary. ".repeat(50),
          }),
        })
      ).not.toThrow();

      expect(() =>
        generateCv({
          profile: createMockProfile({
            skills: ["A Very Long Skill Name That Might Overflow", "Short"],
          }),
        })
      ).not.toThrow();
    });

    it("handles different social combinations", () => {
      const { generateCv } = useCvGenerator();

      expect(() =>
        generateCv({
          profile: createMockProfile({
            socials: [
              { href: "mailto:only@email.com", icon: "mail", name: "Email" },
            ],
          }),
        })
      ).not.toThrow();

      expect(() =>
        generateCv({
          profile: createMockProfile({
            socials: [
              {
                href: "https://linkedin.com/in/test",
                icon: "linkedin",
                name: "LinkedIn",
              },
            ],
          }),
        })
      ).not.toThrow();

      expect(() =>
        generateCv({
          profile: createMockProfile({
            socials: [
              {
                href: "https://github.com/test",
                icon: "github",
                name: "GitHub",
              },
            ],
          }),
        })
      ).not.toThrow();
    });
  });
});
