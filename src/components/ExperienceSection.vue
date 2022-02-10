<script setup lang="ts">
import BaseIconLabel from './BaseIconLabel.vue'
import { format } from 'date-fns'
import { mdiBriefcaseOutline, mdiCalendarOutline, mdiMapMarkerOutline } from '@mdi/js'
import { computed } from 'vue'

const props = defineProps<{
    /**
     * The company name
     */
    company: string
    /**
     * The section description
     */
    description: string
    /**
     * The end date
     */
    endDate?: string
    /**
     * The company location
     */
    location: string
    /**
     * The path to the logo image
     */
    logoPath: string
    /**
     * The start date
     */
    startDate: string
    /**
     * The section title
     */
    title: string
}>()

const duration = computed(() => {
    const startDate = new Date(props.startDate)
    const endDate = props.endDate ? new Date(props.endDate) : new Date()

    return `${format(startDate, 'MMM y')} - ${format(endDate, 'MMM y')}`
})
</script>

<template>
    <div class="flex items-start">
        <div class="flex shrink-0 rounded shadow-blue-400 shadow-sm">
            <img width="48" :src="logoPath" />
        </div>
        <div class="ml-3 w-full space-y-5">
            <div class="flex content-between">
                <div class="space-y-1.5">
                    <div class="font-medium">
                        {{ title }}
                    </div>
                    <div class="flex space-x-5">
                        <base-icon-label :icon-path="mdiBriefcaseOutline" :text="company"></base-icon-label>
                        <base-icon-label :icon-path="mdiMapMarkerOutline" :text="location"></base-icon-label>
                        <base-icon-label :icon-path="mdiCalendarOutline" :text="duration"></base-icon-label>
                    </div>
                </div>
            </div>
            <p class="text-gray-600 prose">
                {{ description }}
            </p>
        </div>
    </div>
</template>
