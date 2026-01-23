<script setup lang="ts">
import { computed } from 'vue'

import { Code2 } from 'lucide-vue-next'

import { Badge } from '@/components/ui'

type SkillVariant = 'default' | 'secondary' | 'outline'

interface Props {
    skills: string[]
}

const props = defineProps<Props>()

const primarySkills: string[] = ['Vue.js', 'Vue 3', 'TypeScript', 'Ruby on Rails', 'GraphQL', 'Tailwind']
const secondarySkills: string[] = ['React', 'Node.js', 'PHP', 'webRTC', 'PWA']

function getSkillCategory(skill: string): SkillVariant {
    if (primarySkills.some((s: string): boolean => skill.includes(s))) return 'default'
    if (secondarySkills.some((s: string): boolean => skill.includes(s))) return 'secondary'
    return 'outline'
}

// Sort skills so highlighted ones appear first
const sortedSkills = computed<string[]>((): string[] => {
    return [...props.skills].sort((a: string, b: string): number => {
        const aCategory = getSkillCategory(a)
        const bCategory = getSkillCategory(b)
        const order: Record<SkillVariant, number> = { default: 0, secondary: 1, outline: 2 }
        return order[aCategory] - order[bCategory]
    })
})
</script>

<template>
    <div class="space-y-4">
        <h2 class="text-2xl font-bold flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10">
                <Code2 class="w-5 h-5 text-primary" />
            </div>
            Technical Skills
        </h2>

        <div class="flex flex-wrap gap-2">
            <Badge v-for="skill in sortedSkills" :key="skill" :variant="getSkillCategory(skill)" class="px-3 py-1.5 text-sm transition-transform hover:scale-105 cursor-default">
                {{ skill }}
            </Badge>
        </div>
    </div>
</template>
