<script setup lang="ts">
import {
    mdiBriefcaseOutline,
    mdiCalendarOutline,
    mdiDownload,
    mdiEmail,
    mdiGithub,
    mdiLinkedin,
    mdiMapMarkerOutline,
    mdiStackOverflow
} from '@mdi/js'
import ProfileHeader from './components/ProfileHeader.vue'
import BaseIcon from './components/BaseIcon.vue'
import BaseTooltipButton from './components/BaseTooltipButton.vue'
import { ref } from 'vue'

type Link = {
    text: string
    href: string
    icon: string
    target?: LinkTarget
    download?: boolean | string
}

type TextValueItem = {
    text: string
    value: string
}

type InfoSection = {
    title: string
    items: TextValueItem[]
}

type Skill = {
    text: string
}

type Experience = {
    position: string
    company: string
    location: string
    startDate: string
    endDate?: string
    description: string
    logoPath: string
}

type Education = {
    school: string
    course: string
    result: string
    startDate: string
    endDate: string
    logoPath: string
}

const target = <LinkTarget>'_blank'

const links = ref<Link[]>([
    {
        text: 'LinkedIn',
        href: 'https://www.linkedin.com/in/andresjanes/',
        icon: mdiLinkedin,
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
        href: 'mailto:andresjanes@hotmail.co.uk',
        icon: mdiEmail
    },
    {
        text: 'Download CV',
        href: '/img/profile.webp',
        icon: mdiDownload,
        download: 'andres_cv'
    }
])

const infoSections = ref<InfoSection[]>([
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
])

const skills = ref<Skill[]>([
    {
        text: 'Vue / Vuex / Vue Router'
    },
    {
        text: 'Vuetify'
    },
    {
        text: 'Material Design'
    },
    {
        text: 'webRTC'
    },
    {
        text: 'Websockets'
    },
    {
        text: 'Node / Express'
    },
    {
        text: 'Typescript'
    },
    {
        text: 'PHP'
    },
    {
        text: 'MySQL'
    },
    {
        text: 'Agile'
    },
    {
        text: 'Kanban'
    }
])

const experiences = ref<Experience[]>([
    {
        position: 'Senior Frontend Developer',
        company: 'Windsor Telecom Ltd',
        logoPath: '/img/wt.svg',
        location: 'Remote',
        startDate: new Date('2015-07-27').toISOString(),
        description: `Senior frontend developer leading the frontend efforts within the product development team.
                With a key focus on innovation, helping ensure the technology stack, products, and offerings are cutting edge,
                providing a competitive advantage for the company along with a great user experience for our customers.`
    },
    {
        position: 'Junior Software Developer',
        company: 'Impact Research Ltd',
        logoPath: '/img/imp.svg',
        location: 'London',
        startDate: new Date('2014-09-14').toISOString(),
        endDate: new Date('2015-07-14').toISOString(),
        description: `Working as part of a small dynamic team on ad-hoc quantitative and qualitative research
                projects that deliver actionable business insights into client’s markets which enables them to make key
                strategic decisions. I worked as part of the Advanced Methods Team where I support the Project Delivery Team
                with the integration of advanced analytics and the agile development of intuitive analysis tools for data processing,
                reporting and decision making models, using Visual Basic in Excel. I applied my technical knowledge to other
                business functions such as marketing, website development, social media and IT and ultimately contributed
                to business growth. A key personal achievement was the development of a profiling tool which allowed users
                to produce reports based on the findings of a customer engagement segmentation project. The tool exceeded
                client expectations and was deployed throughout the client’s organisation.`
    },
    {
        position: 'Store Assistant',
        company: "Sainsbury's",
        logoPath: '/img/sains.svg',
        location: 'Bristol',
        startDate: new Date('2011-09-01').toISOString(),
        endDate: new Date('2014-07-01').toISOString(),
        description: `Part time role whilst studying at university.`
    }
])

const education = ref<Education[]>([
    {
        school: 'UWE Bristol',
        course: 'IT Management for Business',
        result: '2:1',
        startDate: new Date('2011-09-01').toISOString(),
        endDate: new Date('2014-07-01').toISOString(),
        logoPath: '/img/uwe.svg'
    }
])
</script>

<template>
    <div class="w-full">
        <div class="container mx-auto max-w-screen-lg">
            <main id="wrapper" class="flex flex-col md:flex-row md:m-12 shadow-2xl">
                <div id="sidebar" class="w-full md:max-w-xs p-8 bg-blue-100">
                    <div class="px-2 mb-3">
                        <profile-header class="mb-3"></profile-header>

                        <div class="flex w-full justify-center">
                            <base-tooltip-button
                                v-for="link in links"
                                :key="link.href"
                                class="mr-2"
                                :href="link.href"
                                :icon-path="link.icon"
                                :tooltip="link.text"
                                :target="link.target"
                                :download="link.download"
                            ></base-tooltip-button>
                        </div>
                    </div>

                    <div v-for="{ title, items } in infoSections" :key="title" class="px-2 mb-3">
                        <h2 class="text-lg font-semibold text-center mb-4">
                            {{ title }}
                        </h2>
                        <div class="space-y-3">
                            <div v-for="{ text, value } in items" :key="text" class="flex justify-between">
                                <div class="text-gray-500">
                                    {{ text }}
                                </div>
                                <div class="font-medium text-right text-gray-600">
                                    {{ value }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-2 mb-3">
                        <h2 class="text-lg font-semibold text-center mb-4">Skills</h2>
                        <div class="flex flex-wrap justify-center">
                            <span
                                v-for="skill in skills"
                                :key="skill.text"
                                class="bg-blue-600 text-white px-2 py-1 rounded-full m-0.5 text-sm"
                            >
                                {{ skill.text }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="w-full p-12">
                    <div class="prose">
                        <h2 class="text-xl font-bold text-blue-800">About Me</h2>
                        <p>
                            I'm an experienced web developer, with a passion for technology. I have primarily worked in
                            agile environments using Vue as the frontend framework and Vuetify as the design framework.
                            I have worked on a variety of projects ranging from admin UIs for in-house systems, to
                            webRTC soft clients. I enjoy keeping up to date with the latest technologies, challenging
                            myself, to improve my knowledge and deliver greater value.
                        </p>
                    </div>
                    <hr class="my-6" />
                    <h2 class="text-xl font-bold text-blue-800 mb-6">Experience</h2>
                    <div v-for="experience in experiences" :key="experience.company" class="flex items-start mb-6">
                        <div class="flex shrink-0 p-1 rounded shadow-blue-400 shadow-sm">
                            <img width="40" :src="experience.logoPath" />
                        </div>

                        <div class="ml-4 w-full space-y-5">
                            <div class="flex content-between">
                                <div class="space-y-1.5">
                                    <div class="font-medium">
                                        {{ experience.position }}
                                    </div>
                                    <div class="flex space-x-5">
                                        <div class="flex items-center">
                                            <base-icon color="black" :path="mdiBriefcaseOutline"></base-icon>
                                            <span class="text-xs ml-1">{{ experience.company }}</span>
                                        </div>
                                        <div class="flex items-center">
                                            <base-icon color="black" :path="mdiMapMarkerOutline"></base-icon>
                                            <span class="text-xs ml-1">{{ experience.location }}</span>
                                        </div>
                                        <div class="flex items-center">
                                            <base-icon color="black" :path="mdiCalendarOutline"></base-icon>
                                            <span class="text-xs ml-1">99 yrs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="text-gray-600 prose">
                                {{ experience.description }}
                            </p>
                        </div>
                    </div>

                    <hr class="my-6" />

                    <h2 class="text-xl font-bold text-blue-800 mb-6">Education</h2>
                    <div v-for="item in education" :key="item.school" class="flex items-start">
                        <div class="flex shrink-0 rounded shadow-blue-400 shadow-sm">
                            <img width="48" :src="item.logoPath" />
                        </div>

                        <div class="ml-4 w-full space-y-5">
                            <div class="flex content-between">
                                <div class="space-y-1.5">
                                    <div class="font-medium">
                                        {{ item.course }}
                                    </div>
                                    <div class="flex space-x-5">
                                        <div class="flex items-center">
                                            <base-icon color="black" :path="mdiBriefcaseOutline"></base-icon>
                                            <span class="text-xs ml-1">{{ item.school }}</span>
                                        </div>
                                        <div class="flex items-center">
                                            <base-icon color="black" :path="mdiMapMarkerOutline"></base-icon>
                                            <span class="text-xs ml-1">Bristol</span>
                                        </div>
                                        <div class="flex items-center">
                                            <base-icon color="black" :path="mdiCalendarOutline"></base-icon>
                                            <span class="text-xs ml-1">2011 - 2014</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="text-gray-600">
                                {{ item.result }}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
