<script lang="ts" setup>
import BaseIcon from './BaseIcon.vue'
import { mdiCodeNotEqualVariant, mdiOpenInNew } from '@mdi/js'

defineProps<{
    /**
     * The url to the portfolio item
     */
    href: string
    /**
     * The name of the portfolio item
     */
    text: string
    /**
     * The repo url of the portfolio item
     */
    repo: string
}>()
</script>

<template>
    <div class="flex justify-between space-y-1">
        <div class="text-gray-500 w-32">
            <a :href="href">
                {{ text }}
            </a>
        </div>
        <div class="inline-flex">
            <a data-testid="repoLink" :href="repo" class="has-tooltip" target="_blank">
                <base-icon :path="mdiCodeNotEqualVariant" color="blue-600"></base-icon>
                <span class="tooltip">Repo</span>
            </a>
            <a data-testid="siteLink" :href="href" class="ml-2 has-tooltip" target="_blank">
                <base-icon :path="mdiOpenInNew" color="blue-600"></base-icon>
                <span class="tooltip">Open</span>
            </a>
        </div>
    </div>
</template>
