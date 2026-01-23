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

export interface LLMProvider {
    id: string
    name: string
    icon: string
    color: string
    url: string
    promptParam: string
}

export interface SocialLink {
    name: string
    href: string
    icon: string
}

export const useProfileStore = defineStore('profile', {
    state: () => ({
        name: 'Andres Janes',
        title: 'Senior Software Engineer',
        location: 'Lincolnshire, England, United Kingdom',
        company: 'Cision',
        yearsExperience: '10+',
        availability: 'Open to opportunities',
        pronouns: 'He/Him',

        summary: `Pragmatic, quick-learning, solution-driven developer with over 10 years of experience delivering complex web-based software solutions. A proactive problem solver who consistently exceeds expectations. Currently working as a Senior Software Engineer at Cision, contributing to full-stack development on Cision One, a media monitoring platform built with Rails and Vue.

I specialize in modern JavaScript/TypeScript with deep expertise in Vue.js, and have a strong track record of leading frontend initiatives, from adopting Vue across organizations to delivering production webRTC applications. I thrive in agile, remote-first environments and am passionate about building intuitive, performant user experiences.`,

        languages: [
            { name: 'English', level: 'Native' },
            { name: 'Spanish', level: 'Professional' }
        ],

        skills: [
            'Vue.js / Vue 3',
            'TypeScript',
            'Ruby on Rails',
            'GraphQL',
            'React',
            'Node.js',
            'PHP',
            'webRTC',
            'PWA',
            'Tailwind CSS',
            'Docker',
            'CI/CD',
            'Agile / Kanban',
            'PostgreSQL',
            'MySQL',
            'REST APIs',
            'Websockets',
            'Testing (Vitest, Cypress)',
            'Git'
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
                description: `Worked as the frontend lead within an agile team using the Kanban approach. Led the adoption of Vue within the business, and have owned and delivered a number of products, ranging from in-house CRM and admin UIs, to portals that allow customers to manage their cloud telephony services. Delivered a webRTC soft phone PWA which is now being used by a large part of the customer base.`,
                skills: ['Vue.js', 'webRTC', 'PWA', 'PHP']
            },
            {
                title: 'Senior Web Developer',
                company: 'Windsor Telecom',
                logoPath: '/img/wt.svg',
                location: 'Camberley, Surrey',
                startDate: '2017-08-01',
                endDate: '2018-07-01',
                description: `Promoted to Senior Web Developer, taking on more complex projects and mentoring junior team members while continuing to develop customer-facing applications.`,
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
                description: `Worked as part of a small dynamic team on quantitative and qualitative research projects. Supported the Project Delivery Team with advanced analytics and agile development of intuitive analysis tools using Visual Basic in Excel.`,
                skills: ['VBA', 'Excel', 'Data Analysis']
            }
        ] as ExperienceItem[],

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
        ] as ExperienceItem[],

        socials: [
            { name: 'LinkedIn', href: 'https://www.linkedin.com/in/andresjanes/', icon: 'linkedin' },
            { name: 'GitHub', href: 'https://github.com/ajanes93', icon: 'github' },
            { name: 'GitLab', href: 'https://gitlab.com/andresjanes', icon: 'gitlab' },
            { name: 'Email', href: 'mailto:dev@andresjanes.com', icon: 'mail' }
        ] as SocialLink[],

        llmProviders: [
            {
                id: 'chatgpt',
                name: 'ChatGPT',
                icon: 'sparkles',
                color: '#10A37F',
                url: 'https://chat.openai.com/',
                promptParam: 'q'
            },
            {
                id: 'claude',
                name: 'Claude',
                icon: 'brain',
                color: '#D97757',
                url: 'https://claude.ai/new',
                promptParam: 'q'
            },
            {
                id: 'gemini',
                name: 'Gemini',
                icon: 'gem',
                color: '#4285F4',
                url: 'https://gemini.google.com/app',
                promptParam: 'q'
            },
            {
                id: 'perplexity',
                name: 'Perplexity',
                icon: 'search',
                color: '#20B2AA',
                url: 'https://www.perplexity.ai/',
                promptParam: 'q'
            }
        ] as LLMProvider[],

        recommendations: [
            {
                name: 'Michael Brainch',
                title: 'Strategy - Engagement - Insight',
                text: 'Andres is a calm and collected professional, who has demonstrated a willingness (and natural ability) to step outside of his role and support company initiatives, using some of his energizing strengths (critical thinking, detail orientation and resilience) to come up with solutions, not problems, and really add value.'
            },
            {
                name: 'Jamie Margerison',
                title: 'Director',
                text: 'Andres is a professional, efficient, solution orientated developer who it has been a pleasure to work with. Within his role he has happily taken on increasingly challenging tasks - whilst remaining calm, approachable and crucially maintaining a sense of humour.'
            }
        ]
    }),

    getters: {
        getPromptContext: (state) => {
            return `
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
${state.experience
    .map(
        (exp) => `
### ${exp.title} at ${exp.company}
${exp.startDate} - ${exp.endDate || 'Present'}
${exp.location}
${exp.description}
Skills: ${exp.skills?.join(', ') || 'N/A'}
`
    )
    .join('\n')}

## Education
${state.education
    .map(
        (edu) => `
### ${edu.title}
${edu.company}, ${edu.location}
${edu.description}
`
    )
    .join('\n')}

## Languages
${state.languages.map((l) => `${l.name}: ${l.level}`).join(', ')}

## Recommendations
${state.recommendations.map((r) => `"${r.text}" - ${r.name}, ${r.title}`).join('\n\n')}
`.trim()
        },

        getCandidateSummaryPrompt: (state) => {
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
${state.experience
    .map(
        (exp) => `
### ${exp.title} at ${exp.company}
${exp.startDate} - ${exp.endDate || 'Present'}
${exp.location}
${exp.description}
Skills: ${exp.skills?.join(', ') || 'N/A'}
`
    )
    .join('\n')}

## Education
${state.education
    .map(
        (edu) => `
### ${edu.title}
${edu.company}, ${edu.location}
${edu.description}
`
    )
    .join('\n')}

## Languages
${state.languages.map((l) => `${l.name}: ${l.level}`).join(', ')}

## Recommendations
${state.recommendations.map((r) => `"${r.text}" - ${r.name}, ${r.title}`).join('\n\n')}
`.trim()
            return `Based on the following candidate profile, provide a comprehensive summary that would help a hiring manager understand if this candidate would be a good fit for a senior software engineering role. Include strengths, potential areas of expertise, and what kind of team/company culture they might thrive in.

${context}

Please provide:
1. A brief executive summary (2-3 sentences)
2. Key technical strengths
3. Notable achievements and experience highlights
4. Recommended role types and team dynamics
5. Any potential considerations for hiring managers`
        },

        getInterviewQuestionsPrompt: (state) => {
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
${state.experience
    .map(
        (exp) => `
### ${exp.title} at ${exp.company}
${exp.startDate} - ${exp.endDate || 'Present'}
${exp.location}
${exp.description}
Skills: ${exp.skills?.join(', ') || 'N/A'}
`
    )
    .join('\n')}

## Education
${state.education
    .map(
        (edu) => `
### ${edu.title}
${edu.company}, ${edu.location}
${edu.description}
`
    )
    .join('\n')}

## Languages
${state.languages.map((l) => `${l.name}: ${l.level}`).join(', ')}

## Recommendations
${state.recommendations.map((r) => `"${r.text}" - ${r.name}, ${r.title}`).join('\n\n')}
`.trim()
            return `Based on the following candidate profile, generate tailored interview questions that would help assess their fit for a senior frontend/full-stack engineering role.

${context}

Please provide:
1. 3-4 technical questions based on their stated skills (Vue.js, TypeScript, Rails)
2. 2-3 behavioral questions based on their experience leading frontend initiatives
3. 2 questions about their webRTC/PWA experience
4. 1-2 questions about working in remote, distributed teams`
        }
    }
})
