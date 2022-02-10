<script setup lang="ts">
import ProfileHeader from './components/ProfileHeader.vue'
import BaseSheet from './components/BaseSheet.vue'
import BaseTooltipButton from './components/BaseTooltipButton.vue'
import InfoSection from './components/InfoSection.vue'
import BaseDetailsSection from './components/BaseDetailsSection.vue'
import BaseChip from './components/BaseChip.vue'
import BaseSection from './components/BaseSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
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

            <hr class="my-6" />

            <template v-for="section in state.details" :key="section.title">
                <info-section class="mb-3" :title="section.title" :items="section.items"></info-section>
                <hr class="my-6" />
            </template>

            <base-details-section>
                <template #title>Skills</template>
                <template #default>
                    <div class="flex flex-row flex-wrap justify-center">
                        <base-chip v-for="skill in state.skills" :key="skill">
                            {{ skill }}
                        </base-chip>
                    </div>
                </template>
            </base-details-section>

            <hr class="my-6" />

            <base-details-section class="print:hidden">
                <template #title>Portfolio</template>
                <template #default>
                    <div class="flex flex-row flex-wrap justify-center">
                        <a v-for="item in state.portfolio" :key="item.href" class="underline" :href="item.href">
                            {{ item.text }}
                        </a>
                    </div>
                </template>
            </base-details-section>
        </template>

        <template #default>
            <base-section class="prose print:max-w-full">
                <template #title>
                    <div class="print:text-center">About Me</div>
                </template>
                <template #default>
                    <p>
                        {{ state.description }}
                    </p>
                </template>
            </base-section>

            <hr class="my-6 print:hidden" />

            <base-section class="space-y-8 print:mt-12">
                <template #title>Experience</template>
                <template #default>
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
                </template>
            </base-section>

            <hr class="my-6" />

            <base-section class="space-y-8">
                <template #title>Education</template>
                <template #default>
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
                </template>
            </base-section>
        </template>
    </base-sheet>
</template>
