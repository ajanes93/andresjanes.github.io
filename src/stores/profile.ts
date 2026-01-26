import { defineStore } from "pinia";

export interface ExperienceItem {
  company: string;
  description: string;
  endDate?: string;
  location: string;
  logoPath: string;
  skills?: string[];
  startDate: string;
  title: string;
}

export interface Language {
  level: string;
  name: string;
}

export interface LLMProvider {
  color: string;
  icon: string;
  id: string;
  name: string;
  url: string;
}

export interface Recommendation {
  linkedInUrl: string;
  name: string;
  text: string;
  title: string;
}

export interface SocialLink {
  href: string;
  icon: string;
  name: string;
}

export interface ProfileState {
  availability: string;
  avatarPath: string;
  company: string;
  education: ExperienceItem[];
  experience: ExperienceItem[];
  languages: Language[];
  llmProviders: LLMProvider[];
  location: string;
  name: string;
  pronouns: string;
  recommendations: Recommendation[];
  skills: string[];
  socials: SocialLink[];
  summary: string;
  title: string;
  yearsExperience: string;
}

export const useProfileStore = defineStore("profile", {
  getters: {
    getCandidateSummaryPrompt: (state): string => {
      const formatExperience = (exp: ExperienceItem): string => {
        const dateRange = `${exp.startDate} - ${exp.endDate || "Present"}`;
        const skills = exp.skills?.join(", ") || "N/A";

        return `### ${exp.title} at ${exp.company}\n${dateRange} | ${exp.location}\n${exp.description}\nSkills: ${skills}`;
      };

      const formatEducation = (edu: ExperienceItem): string =>
        `### ${edu.title}\n${edu.company}, ${edu.location}\n${edu.description}`;

      const formatLanguage = (lang: Language): string =>
        `${lang.name}: ${lang.level}`;

      const formatRecommendation = (rec: Recommendation): string =>
        `"${rec.text}" - ${rec.name}, ${rec.title}`;

      const formatSocialLink = (social: SocialLink): string =>
        `- ${social.name}: ${social.href}`;

      const nonEmailSocials = state.socials.filter((s) => s.icon !== "mail");

      const context = `
# About Andres Janes

## Current Role
${state.title} at ${state.company}
Location: ${state.location}
Experience: ${state.yearsExperience} years

## Professional Summary
${state.summary}

## Technical Skills
${state.skills.join(", ")}

## Work Experience
${state.experience.map(formatExperience).join("\n\n")}

## Education
${state.education.map(formatEducation).join("\n\n")}

## Languages
${state.languages.map(formatLanguage).join(", ")}

## Recommendations
${state.recommendations.map(formatRecommendation).join("\n\n")}

## Online Presence
${nonEmailSocials.map(formatSocialLink).join("\n")}
- Portfolio: https://andresjanes.com
`.trim();

      return `Based on the following candidate profile, provide a comprehensive summary that would help a hiring manager understand if this candidate would be a good fit for a senior software engineering role.

${context}

Please provide:
1. A brief executive summary (2-3 sentences)
2. Key technical strengths
3. Notable achievements and experience highlights
4. Recommended role types and team dynamics`;
    },
  },

  state: (): ProfileState => ({
    availability: "Open to opportunities",
    avatarPath: "/img/profile.webp",
    company: "Cision",
    education: [
      {
        company: "University of the West of England",
        description: "Bachelor's Degree - 2:1",
        endDate: "2014-07-01",
        location: "Bristol, UK",
        logoPath: "/img/uwe.svg",
        startDate: "2011-09-01",
        title: "BSc IT Management for Business (ITMB)",
      },
    ],
    experience: [
      {
        company: "Cision",
        description: `Senior Software Engineer on Cision One, an enterprise media monitoring platform used by Fortune 500 companies for real-time media intelligence. Contributing full-stack features using Vue.js 3, Ruby on Rails, and GraphQL APIs. Working with Elasticsearch for search infrastructure and GCP for cloud deployments.`,
        location: "Remote, UK",
        logoPath: "/img/cision.jpeg",
        skills: ["Vue.js", "Ruby on Rails", "GraphQL", "Elasticsearch", "GCP"],
        startDate: "2023-11-01",
        title: "Senior Software Engineer",
      },
      {
        company: "Cision (Buzzsumo)",
        description: `Senior Software Engineer in the Buzzsumo product team, building features for content discovery and influencer marketing used by content marketers worldwide. Primary focus on frontend development with Vue.js and TypeScript, with PHP/Laravel backend contributions.`,
        endDate: "2023-11-01",
        location: "Remote, UK",
        logoPath: "/img/cision.jpeg",
        skills: ["Vue.js", "PHP / Laravel", "TypeScript"],
        startDate: "2022-06-01",
        title: "Senior Software Engineer",
      },
      {
        company: "Windsor Telecom",
        description: `Led frontend development within an agile Kanban team for a cloud telephony provider. Championed Vue.js adoption across the organization and delivered multiple products including CRM systems, customer portals, and a production webRTC softphone PWA serving thousands of daily users. Reduced call center software costs by transitioning from desktop apps to web-based solutions.`,
        endDate: "2022-06-01",
        location: "Remote, UK",
        logoPath: "/img/wt.svg",
        skills: ["Vue.js", "webRTC", "PWA", "PHP / Laravel", "Websockets"],
        startDate: "2018-07-01",
        title: "Lead Frontend Developer",
      },
      {
        company: "Windsor Telecom",
        description: `Promoted to Senior Web Developer, leading complex projects and mentoring junior developers. Architected and delivered customer-facing billing portals and internal tools using PHP/Laravel and JavaScript. Introduced modern frontend practices and began evaluating Vue.js for future projects.`,
        endDate: "2018-07-01",
        location: "Camberley, Surrey",
        logoPath: "/img/wt.svg",
        skills: ["JavaScript", "PHP / Laravel", "MySQL"],
        startDate: "2017-08-01",
        title: "Senior Web Developer",
      },
      {
        company: "Windsor Telecom",
        description: `Developed and maintained web applications for cloud telephony services, building customer portals and internal tools. Worked across the full stack with PHP/Laravel and JavaScript, integrating with telephony APIs and real-time communication systems.`,
        endDate: "2017-08-01",
        location: "Camberley, Surrey",
        logoPath: "/img/wt.svg",
        skills: ["JavaScript", "PHP / Laravel", "MySQL"],
        startDate: "2015-07-01",
        title: "Web Developer",
      },
      {
        company: "Impact Research Ltd",
        description: `Developed analytics tools and automated data processing solutions for market research projects. Built Excel-based applications using VBA to streamline reporting workflows, reducing manual data processing time significantly.`,
        endDate: "2015-07-01",
        location: "Walton-on-Thames, UK",
        logoPath: "/img/imp.svg",
        skills: ["VBA", "Excel", "Data Analysis"],
        startDate: "2014-09-01",
        title: "Junior Software Developer",
      },
    ],
    languages: [
      { level: "Native", name: "English" },
      { level: "Professional", name: "Spanish" },
    ],
    llmProviders: [
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
        url: "https://gemini.google.com/app",
      },
      {
        color: "#20B2AA",
        icon: "search",
        id: "perplexity",
        name: "Perplexity",
        url: "https://www.perplexity.ai/",
      },
    ],
    location: "Remote, United Kingdom",

    name: "Andres Janes",

    pronouns: "He/Him",

    recommendations: [
      {
        linkedInUrl:
          "https://www.linkedin.com/in/andresjanes/details/recommendations/",
        name: "Michael Brainch",
        text: "Andres is a calm and collected professional, who has demonstrated a willingness (and natural ability) to step outside of his role and support company initiatives, using some of his energizing strengths (critical thinking, detail orientation and resilience) to come up with solutions, not problems, and really add value.",
        title: "Strategy - Engagement - Insight",
      },
      {
        linkedInUrl:
          "https://www.linkedin.com/in/andresjanes/details/recommendations/",
        name: "Jamie Margerison",
        text: "Andres is a professional, efficient, solution orientated developer who it has been a pleasure to work with. Within his role he has happily taken on increasingly challenging tasks - whilst remaining calm, approachable and crucially maintaining a sense of humour.",
        title: "Director",
      },
    ],

    skills: [
      // Frontend
      "Vue.js / Vue 3",
      "TypeScript",
      "Tailwind CSS",
      "PWA",
      "webRTC",
      "Websockets",
      // Backend
      "Ruby on Rails",
      "PHP / Laravel",
      "Node.js",
      "GraphQL",
      "REST APIs",
      // Databases & Search
      "PostgreSQL",
      "MySQL",
      "Elasticsearch",
      // Cloud & DevOps
      "GCP",
      "Docker",
      "CI/CD",
      "Git",
      "Testing (Vitest, Cypress)",
      // Methodology
      "Agile / Kanban",
    ],

    socials: [
      {
        href: "https://www.linkedin.com/in/andresjanes/",
        icon: "linkedin",
        name: "LinkedIn",
      },
      { href: "https://github.com/ajanes93", icon: "github", name: "GitHub" },
      { href: "mailto:dev@andresjanes.com", icon: "mail", name: "Email" },
    ],

    summary: `Senior Software Engineer with 10+ years of experience building production web applications at scale. Currently at Cision developing Cision One, a media monitoring platform serving enterprise clients globally, using Rails and Vue.js.

Core expertise: Vue.js/Vue 3, TypeScript, Ruby on Rails, PHP/Laravel, GraphQL, and real-time applications (webRTC, WebSockets). Experienced with Elasticsearch for search infrastructure and GCP for cloud deployments. Previously led frontend development at Windsor Telecom, where I championed Vue adoption across the organization and shipped a production webRTC softphone PWA serving thousands of daily users.

I thrive in remote-first, agile environments and focus on delivering performant, accessible user experiences. Open to senior and staff-level roles in product-focused teams.`,

    title: "Senior Software Engineer",

    yearsExperience: "10+",
  }),
});
