<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Calendar, Briefcase } from 'lucide-vue-next'
import { Card, Badge } from '@/components/ui'
import type { ExperienceItem } from '@/stores/profile'

interface Props {
    items: ExperienceItem[]
    title: string
    icon?: 'briefcase' | 'graduation'
}

const props = withDefaults(defineProps<Props>(), {
    icon: 'briefcase'
})

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const calculateDuration = (start: string, end?: string) => {
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : new Date()
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth()
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years === 0) {
        return `${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`
    } else if (remainingMonths === 0) {
        return `${years} yr${years !== 1 ? 's' : ''}`
    }
    return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`
}

const sortedItems = computed(() => {
    return [...props.items].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
})
</script>

<template>
    <div class="space-y-6">
        <h2 class="text-2xl font-bold flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10">
                <Briefcase class="w-5 h-5 text-primary" />
            </div>
            {{ title }}
        </h2>

        <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

            <div class="space-y-6">
                <div v-for="item in sortedItems" :key="`${item.company}-${item.startDate}`" class="relative">
                    <!-- Timeline dot -->
                    <div
                        class="absolute left-3 top-6 w-3 h-3 rounded-full border-2 border-primary bg-background z-10 hidden md:block"
                        :class="{ 'bg-primary': !item.endDate }"
                    ></div>

                    <Card class="md:ml-12 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div class="p-5">
                            <div class="flex flex-col md:flex-row md:items-start gap-4">
                                <!-- Company Logo -->
                                <div
                                    class="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0"
                                >
                                    <img
                                        v-if="item.logoPath"
                                        :src="item.logoPath"
                                        :alt="item.company"
                                        class="w-full h-full object-cover"
                                    />
                                    <Briefcase v-else class="w-6 h-6 text-muted-foreground" />
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                        <div>
                                            <h3 class="font-semibold text-lg">{{ item.title }}</h3>
                                            <p class="text-muted-foreground font-medium">{{ item.company }}</p>
                                        </div>
                                        <Badge v-if="!item.endDate" variant="default" class="w-fit">
                                            Current
                                        </Badge>
                                    </div>

                                    <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span class="flex items-center gap-1">
                                            <Calendar class="w-4 h-4" />
                                            {{ formatDate(item.startDate) }} - {{ item.endDate ? formatDate(item.endDate) : 'Present' }}
                                            <span class="text-xs">({{ calculateDuration(item.startDate, item.endDate) }})</span>
                                        </span>
                                        <span class="flex items-center gap-1">
                                            <MapPin class="w-4 h-4" />
                                            {{ item.location }}
                                        </span>
                                    </div>

                                    <p class="mt-3 text-sm text-muted-foreground leading-relaxed">
                                        {{ item.description }}
                                    </p>

                                    <div v-if="item.skills?.length" class="mt-3 flex flex-wrap gap-2">
                                        <Badge v-for="skill in item.skills" :key="skill" variant="secondary">
                                            {{ skill }}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>
