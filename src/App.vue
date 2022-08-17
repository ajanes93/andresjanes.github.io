<script setup lang="ts">
import ProfileHeader from './components/ProfileHeader.vue'
import BaseSheet from './components/BaseSheet.vue'
import BaseTooltipButton from './components/BaseTooltipButton.vue'
import BaseChip from './components/BaseChip.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import PortfolioItem from './components/PortfolioItem.vue'
import { useStore } from './store'

const { state } = useStore()
</script>

<template>
    <base-sheet>
        <template #sidebar>
            <profile-header class="mb-3"></profile-header>

            <hr class="my-6 print:hidden" />

            <div class="flex w-full justify-center mb-3 print:hidden">
                <base-tooltip-button
                    v-for="link in state.actions"
                    :key="link.href"
                    class="mr-2"
                    :href="link.href"
                    :icon-path="link.icon"
                    :tooltip="link.text"
                    :target="link.target"
                    :download="link.download"
                ></base-tooltip-button>
            </div>

            <hr class="my-6 print:my-3" />

            <template v-for="section in state.details" :key="section.title">
                <div class="space-y-3">
                    <h2 class="details-header">{{ section.title }}</h2>
                    <div v-for="{ text, value } in section.items" :key="text" class="flex justify-between">
                        <div class="text-gray-500">
                            {{ text }}
                        </div>
                        <div class="font-medium text-right text-gray-600">
                            {{ value }}
                        </div>
                    </div>
                </div>
                <hr class="my-6 print:my-3" />
            </template>

            <div>
                <h2 class="details-header mb-3">Skills</h2>
                <div class="flex flex-row flex-wrap justify-center">
                    <base-chip v-for="skill in state.skills" :key="skill">
                        {{ skill }}
                    </base-chip>
                </div>
            </div>

            <hr class="my-6 print:hidden" />

            <div class="space-y-3 print:hidden">
                <h2 class="details-header">Portfolio</h2>
                <portfolio-item
                    v-for="item in state.portfolio"
                    :key="item.href"
                    :href="item.href"
                    :text="item.text"
                    :repo="item.repo"
                ></portfolio-item>
            </div>
        </template>

        <template #default>
            <div class="space-y-6 print:space-y-3 print:mb-3">
                <h2 class="section-header">About Me</h2>
                <p class="text-gray-600">
                    {{ state.description }}
                </p>
            </div>

            <hr class="my-6 print:hidden" />

            <div class="space-y-6 print:space-y-3 print:mb-3">
                <h2 class="section-header">Experience</h2>
                <experience-section
                    v-for="item in state.experience"
                    :key="item.company"
                    :company="item.company"
                    :location="item.location"
                    :start-date="item.startDate"
                    :end-date="item.endDate"
                    :title="item.title"
                    :logo-path="item.logoPath"
                    :description="item.description"
                ></experience-section>
            </div>

            <hr class="my-6 print:hidden" />

            <div class="space-y-6 print:space-y-3">
                <h2 class="section-header">Education</h2>
                <experience-section
                    v-for="item in state.education"
                    :key="item.company"
                    :company="item.company"
                    :location="item.location"
                    :start-date="item.startDate"
                    :end-date="item.endDate"
                    :title="item.title"
                    :logo-path="item.logoPath"
                    :description="item.description"
                ></experience-section>
            </div>
        </template>
    </base-sheet>
</template>

<style>
.details-header {
    @apply text-lg font-medium text-center;
}

.section-header {
    @apply text-xl font-bold text-blue-600;
}

@media print {
    body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
}
</style>
