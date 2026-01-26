import { defineStore } from 'pinia'

export interface ExperienceItem {
    title: string
    company: string
    location: string
    startDate: string
    endDate?: string
    description: string
    logoPath: string
    skills?: string[]
}

export interface Language {
    name: string
    level: string
}

export interface LLMProvider {
    id: string
    name: string
    icon: string
    color: string
    url: string
}

export interface Recommendation {
    name: string
    title: string
    text: string
    linkedInUrl: string
}

export interface SocialLink {
    name: string
    href: string
    icon: string
}

export interface ProfileState {
    name: string
    title: string
    location: string
    company: string
    yearsExperience: string
    availability: string
    pronouns: string
    avatarPath: string
    summary: string
    languages: Language[]
    skills: string[]
    experience: ExperienceItem[]
    education: ExperienceItem[]
    socials: SocialLink[]
    llmProviders: LLMProvider[]
    recommendations: Recommendation[]
}

export const useProfileStore = defineStore('profile', {
    state: (): ProfileState => ({
        name: 'Andres Janes',
        title: 'Senior Software Engineer',
        location: 'Remote, United Kingdom',
        company: 'Cision',
        yearsExperience: '10+',
        availability: 'Open to opportunities',
        pronouns: 'He/Him',
        avatarPath: '/img/profile.webp',

        summary: `Pragmatic, quick-learning, solution-driven developer with over 10 years of experience delivering complex web-based software solutions. A proactive problem solver who consistently exceeds expectations. Currently working as a Senior Software Engineer at Cision, contributing to full-stack development on Cision One, a media monitoring platform built with Rails and Vue.

I specialize in modern JavaScript/TypeScript with deep expertise in Vue.js, and have a strong track record of leading frontend initiatives, from adopting Vue across organizations to delivering production webRTC applications. I thrive in agile, remote-first environments and am passionate about building intuitive, performant user experiences.`,

        languages: [
            { name: 'English', level: 'Native' },
            { name: 'Spanish', level: 'Professional' }
        ],

        skills: [
            // Frontend
            'Vue.js / Vue 3',
            'React',
            'TypeScript',
            'Tailwind CSS',
            'PWA',
            'webRTC',
            'Websockets',
            // Backend
            'Ruby on Rails',
            'Node.js',
            'PHP',
            'GraphQL',
            'REST APIs',
            // Databases
            'PostgreSQL',
            'MySQL',
            // DevOps & Tools
            'Docker',
            'CI/CD',
            'Git',
            'Testing (Vitest, Cypress)',
            // Methodology
            'Agile / Kanban'
        ],

        experience: [
            {
                title: 'Senior Software Engineer',
                company: 'Cision',
                logoPath: '/img/cision.jpeg',
                location: 'Remote, UK',
                startDate: '2023-11-01',
                description: `Senior software engineer working on Cision One, a media monitoring platform. Collaborating with the main team in Australia, I contribute to the full-stack development, supporting a Rails and Vue application.`,
                skills: ['Vue.js', 'Ruby on Rails', 'GraphQL']
            },
            {
                title: 'Senior Software Engineer',
                company: 'Cision (Buzzsumo)',
                logoPath: '/img/cision.jpeg',
                location: 'Remote, UK',
                startDate: '2022-06-01',
                endDate: '2023-11-01',
                description: `Senior software engineer working in the Buzzsumo product team with a primary focus on the frontend, building features for content discovery and influencer marketing tools.`,
                skills: ['Vue.js', 'PHP', 'TypeScript']
            },
            {
                title: 'Lead Frontend Developer',
                company: 'Windsor Telecom',
                logoPath: '/img/wt.svg',
                location: 'Remote, UK',
                startDate: '2018-07-01',
                endDate: '2022-06-01',
                description: `Led frontend development within an agile Kanban team. Championed Vue adoption across the organization and delivered multiple products including CRM systems, customer portals, and a production webRTC softphone PWA used by thousands of customers.`,
                skills: ['Vue.js', 'webRTC', 'PWA', 'PHP']
            },
            {
                title: 'Senior Web Developer',
                company: 'Windsor Telecom',
                logoPath: '/img/wt.svg',
                location: 'Camberley, Surrey',
                startDate: '2017-08-01',
                endDate: '2018-07-01',
                description: `Promoted to Senior Web Developer, leading complex projects and mentoring junior developers while continuing to develop customer-facing applications.`,
                skills: ['JavaScript', 'PHP', 'MySQL']
            },
            {
                title: 'Web Developer',
                company: 'Windsor Telecom',
                logoPath: '/img/wt.svg',
                location: 'Camberley, Surrey',
                startDate: '2015-07-01',
                endDate: '2017-08-01',
                description: `Developed and maintained web applications for cloud telephony services, working across the full stack with PHP and JavaScript.`,
                skills: ['JavaScript', 'PHP', 'MySQL']
            },
            {
                title: 'Junior Software Developer',
                company: 'Impact Research Ltd',
                logoPath: '/img/imp.svg',
                location: 'Walton-on-Thames, UK',
                startDate: '2014-09-01',
                endDate: '2015-07-01',
                description: `Worked in a dynamic team on research projects, developing analytics tools and data processing solutions using VBA and supporting various business functions.`,
                skills: ['VBA', 'Excel', 'Data Analysis']
            }
        ],

        education: [
            {
                title: 'BSc IT Management for Business (ITMB)',
                company: 'University of the West of England',
                location: 'Bristol, UK',
                description: "Bachelor's Degree - 2:1",
                startDate: '2011-09-01',
                endDate: '2014-07-01',
                logoPath: '/img/uwe.svg'
            }
        ],

        socials: [
            { name: 'LinkedIn', href: 'https://www.linkedin.com/in/andresjanes/', icon: 'linkedin' },
            { name: 'GitHub', href: 'https://github.com/ajanes93', icon: 'github' },
            { name: 'Email', href: 'mailto:dev@andresjanes.com', icon: 'mail' }
        ],

        llmProviders: [
            {
                id: 'chatgpt',
                name: 'ChatGPT',
                icon: 'sparkles',
                color: '#10A37F',
                url: 'https://chat.openai.com/'
            },
            {
                id: 'claude',
                name: 'Claude',
                icon: 'brain',
                color: '#D97757',
                url: 'https://claude.ai/new'
            },
            {
                id: 'gemini',
                name: 'Gemini',
                icon: 'gem',
                color: '#4285F4',
                url: 'https://gemini.google.com/app'
            },
            {
                id: 'perplexity',
                name: 'Perplexity',
                icon: 'search',
                color: '#20B2AA',
                url: 'https://www.perplexity.ai/'
            }
        ],

        recommendations: [
            {
                name: 'Michael Brainch',
                title: 'Strategy - Engagement - Insight',
                text: 'Andres is a calm and collected professional, who has demonstrated a willingness (and natural ability) to step outside of his role and support company initiatives, using some of his energizing strengths (critical thinking, detail orientation and resilience) to come up with solutions, not problems, and really add value.',
                linkedInUrl: 'https://www.linkedin.com/in/andresjanes/details/recommendations/'
            },
            {
                name: 'Jamie Margerison',
                title: 'Director',
                text: 'Andres is a professional, efficient, solution orientated developer who it has been a pleasure to work with. Within his role he has happily taken on increasingly challenging tasks - whilst remaining calm, approachable and crucially maintaining a sense of humour.',
                linkedInUrl: 'https://www.linkedin.com/in/andresjanes/details/recommendations/'
            }
        ]
    }),

    getters: {
        getCandidateSummaryPrompt: (state): string => {
            const context = `
# About Andres Janes

## Current Role
${state.title} at ${state.company}
Location: ${state.location}
Experience: ${state.yearsExperience} years

## Professional Summary
${state.summary}

## Technical Skills
${state.skills.join(', ')}

## Work Experience
${state.experience.map((exp: ExperienceItem): string => `
### ${exp.title} at ${exp.company}
${exp.startDate} - ${exp.endDate || 'Present'} | ${exp.location}
${exp.description}
Skills: ${exp.skills?.join(', ') || 'N/A'}
`).join('\n')}

## Education
${state.education.map((edu: ExperienceItem): string => `
### ${edu.title}
${edu.company}, ${edu.location}
${edu.description}
`).join('\n')}

## Languages
${state.languages.map((l: Language): string => `${l.name}: ${l.level}`).join(', ')}

## Recommendations
${state.recommendations.map((r: Recommendation): string => `"${r.text}" - ${r.name}, ${r.title}`).join('\n\n')}

## Online Presence
${state.socials.filter((s: SocialLink): boolean => s.icon !== 'mail').map((s: SocialLink): string => `- ${s.name}: ${s.href}`).join('\n')}
- Portfolio: https://andresjanes.com
`.trim()

            return `Based on the following candidate profile, provide a comprehensive summary that would help a hiring manager understand if this candidate would be a good fit for a senior software engineering role.

${context}

Please provide:
1. A brief executive summary (2-3 sentences)
2. Key technical strengths
3. Notable achievements and experience highlights
4. Recommended role types and team dynamics`
        }
    }
})
