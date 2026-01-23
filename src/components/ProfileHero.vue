<script setup lang="ts">
import type { Component } from 'vue'

import { Building2, Clock, ExternalLink, Github, Languages, Linkedin, Mail, MapPin } from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from '@/components/ui'
import type { SocialLink } from '@/stores/profile'

interface Props {
    name: string
    title: string
    company: string
    location: string
    yearsExperience: string
    pronouns: string
    avatarPath: string
    languages: { name: string; level: string }[]
    socials: SocialLink[]
}

defineProps<Props>()

function getSocialIcon(iconName: string): Component {
    const icons: Record<string, Component> = {
        github: Github,
        linkedin: Linkedin,
        gitlab: ExternalLink,
        mail: Mail
    }
    return icons[iconName] || ExternalLink
}
</script>

<template>
    <div class="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 via-blue-600 to-cyan-500 p-1">
        <div class="relative bg-background rounded-xl p-6 md:p-8">
            <div class="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent"></div>

            <div class="relative flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div class="relative">
                    <div class="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50"></div>
                    <Avatar class="w-28 h-28 md:w-32 md:h-32 ring-4 ring-background relative">
                        <AvatarImage :src="avatarPath" :alt="name" />
                        <AvatarFallback class="text-2xl font-bold bg-linear-to-br from-blue-500 to-cyan-500 text-white">
                            {{ name.split(' ').map(n => n[0]).join('') }}
                        </AvatarFallback>
                    </Avatar>
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
                </div>

                <div class="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <div class="flex flex-col md:flex-row md:items-center gap-2">
                            <h1 class="text-3xl md:text-4xl font-bold gradient-text">{{ name }}</h1>
                            <Badge variant="secondary" class="w-fit mx-auto md:mx-0">{{ pronouns }}</Badge>
                        </div>
                        <p class="text-xl text-muted-foreground mt-1">{{ title }}</p>
                    </div>

                    <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                        <span class="flex items-center gap-1.5">
                            <Building2 class="w-4 h-4" />
                            {{ company }}
                        </span>
                        <span class="flex items-center gap-1.5">
                            <MapPin class="w-4 h-4" />
                            {{ location }}
                        </span>
                        <span class="flex items-center gap-1.5">
                            <Clock class="w-4 h-4" />
                            {{ yearsExperience }} years experience
                        </span>
                        <span class="flex items-center gap-1.5">
                            <Languages class="w-4 h-4" />
                            {{ languages.map(l => l.name).join(', ') }}
                        </span>
                    </div>

                    <div class="flex justify-center md:justify-start gap-2">
                        <Button v-for="social in socials" :key="social.name" variant="outline" size="icon" as-child>
                            <a :href="social.href" :target="social.href.startsWith('mailto') ? undefined : '_blank'" :rel="social.href.startsWith('mailto') ? undefined : 'noopener noreferrer'" :aria-label="social.name">
                                <component :is="getSocialIcon(social.icon)" class="w-4 h-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
