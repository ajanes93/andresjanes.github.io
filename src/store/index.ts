import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { DetailsItem, ExperienceItem, Link, PortfolioLink } from '../../types'
import { mdiDownload, mdiEmail, mdiGithub, mdiGitlab, mdiLinkBox, mdiLinkedin, mdiStackOverflow } from '@mdi/js'

export interface State {
    actions: Link[]
    details: DetailsItem[]
    skills: string[]
    experience: ExperienceItem[]
    education: ExperienceItem[]
    portfolio: PortfolioLink[]
    description: string
}

const target = '_blank'

function formatDate(value: string): string {
    return new Date(value).toISOString()
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        actions: [
            {
                text: 'LinkedIn',
                href: 'https://www.linkedin.com/in/andresjanes/',
                icon: mdiLinkedin,
                target
            },
            {
                text: 'GitLab',
                href: 'https://gitlab.com/andresjanes',
                icon: mdiGitlab,
                target
            },
            {
                text: 'GitHub',
                href: 'https://github.com/ajanes93',
                icon: mdiGithub,
                target
            },
            {
                text: 'Stack Overflow',
                href: 'https://stackoverflow.com/users/12912603/andres-janes',
                icon: mdiStackOverflow,
                target
            },
            {
                text: 'Email',
                href: 'mailto:dev@andresjanes.com',
                icon: mdiEmail
            },
            {
                text: 'Download CV',
                href: '/doc/cv_andres_janes.pdf',
                icon: mdiDownload,
                download: 'cv_andres_janes.pdf'
            }
        ],
        details: [
            {
                title: 'Details',
                items: [
                    {
                        text: 'Location',
                        value: 'Lincoln'
                    },
                    {
                        text: 'Experience',
                        value: '6+ Years'
                    },
                    {
                        text: 'Availability',
                        value: '3 Months'
                    },
                    {
                        text: 'Remote Only',
                        value: 'Yes'
                    }
                ]
            },
            {
                title: 'Languages',
                items: [
                    {
                        text: 'English',
                        value: 'Fluent'
                    },
                    {
                        text: 'Spanish',
                        value: 'Fluent'
                    }
                ]
            }
        ],
        skills: [
            'Vue / Vuex / Vue Router',
            'Vuetify',
            'Docker',
            'Cypress',
            'Jest',
            'Gitlab CI/CD',
            'Material Design',
            'webRTC',
            'Websockets',
            'PWA',
            'Node / Express',
            'Typescript',
            'PHP',
            'MySQL',
            'Agile',
            'Kanban'
        ],
        experience: [
            {
                title: 'Senior Frontend Developer',
                company: 'Windsor Telecom Ltd',
                logoPath: '/img/wt.svg',
                location: 'Remote',
                startDate: formatDate('2015-07-27'),
                description: `Worked as the frontend lead within an agile team using the Kanban approach.  Led the adoption
                of Vue within the business, and have owned and delivered a number of products, ranging from in-house CRM
                and admin UIs, to portals that allow customers to manage their cloud telephony services.  Most recently I
                worked on and delivered a webRTC soft phone PWA which is now being sold and used by a large part of the
                customer base.`
            },
            {
                title: 'Junior Software Developer',
                company: 'Impact Research Ltd',
                logoPath: '/img/imp.svg',
                location: 'London',
                startDate: formatDate('2014-09-14'),
                endDate: formatDate('2015-07-14'),
                description: `Worked as part of a small dynamic team on ad-hoc quantitative and qualitative research projects.  
                I supported the Project Delivery Team with the integration of advanced analytics and the agile development
                of intuitive analysis tools for data processing, reporting and decision making models, using Visual Basic in Excel.
                I applied my technical knowledge to other business functions such as marketing, website development, social media and IT.`
            },
            {
                title: 'Store Assistant',
                company: "Sainsbury's",
                logoPath: '/img/sains.svg',
                location: 'Bristol',
                startDate: formatDate('2011-09-01'),
                endDate: formatDate('2014-07-01'),
                description: `Part time role whilst studying at university.`
            }
        ],
        education: [
            {
                title: 'IT Management for Business',
                company: 'UWE Bristol',
                location: 'Bristol',
                description: '2:1',
                startDate: formatDate('2011-09-01'),
                endDate: formatDate('2014-07-01'),
                logoPath: '/img/uwe.svg'
            }
        ],
        description: `I'm an experienced web developer, with a passion for technology. I have primarily worked in
        agile environments using Vue as the frontend framework and Vuetify as the design framework.
        I have worked on a variety of projects ranging from admin UIs for in-house systems, to
        webRTC soft clients. I enjoy keeping up to date with the latest technologies, challenging
        myself, to improve my knowledge and deliver greater value.`,
        portfolio: [
            {
                text: 'Personal CV',
                href: 'https://andresjanes.gitlab.io',
                repo: 'https://gitlab.com/andresjanes/andresjanes.gitlab.io'
            },
            {
                text: 'Wedding Website',
                href: 'https://xiomiandsanti.com',
                repo: 'https://gitlab.com/andresjanes/wedding'
            },
            {
                text: 'Vuetify Snackbar Queue',
                href: 'https://codesandbox.io/s/vuetify-snackbar-queue-s6pt2',
                repo: 'https://github.com/ajanes93/vuetify-snackbar-queue'
            }
        ]
    }
})

export function useStore() {
    return baseUseStore(key)
}
