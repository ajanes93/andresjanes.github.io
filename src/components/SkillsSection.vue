<script setup lang="ts">
import { Code2 } from 'lucide-vue-next'
import { Badge } from '@/components/ui'

interface Props {
    skills: string[]
}

defineProps<Props>()

const getSkillCategory = (skill: string): 'default' | 'secondary' | 'outline' => {
    const primarySkills = ['Vue.js', 'Vue 3', 'TypeScript', 'Ruby on Rails', 'GraphQL']
    const secondarySkills = ['React', 'Node.js', 'PHP', 'webRTC', 'PWA', 'Tailwind CSS']

    if (primarySkills.some((s) => skill.includes(s))) return 'default'
    if (secondarySkills.some((s) => skill.includes(s))) return 'secondary'
    return 'outline'
}
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
            <Badge
                v-for="skill in skills"
                :key="skill"
                :variant="getSkillCategory(skill)"
                class="px-3 py-1.5 text-sm transition-transform hover:scale-105 cursor-default"
            >
                {{ skill }}
            </Badge>
        </div>
    </div>
</template>
