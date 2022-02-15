<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'
import { computed } from 'vue'

const props = defineProps<{
    /**
     * The path to the icon svg
     */
    iconPath: string
    /**
     * The label text
     */
    text: string
    /**
     * The label tooltip
     */
    tooltip?: string
}>()

const hasTooltip = computed(() => Boolean(props.tooltip))
const iconClass = computed(() => ({
    'flex items-center': true,
    'has-tooltip': hasTooltip
}))
</script>

<template>
    <div :class="iconClass">
        <base-icon color="black" :path="iconPath"></base-icon>
        <span class="text-xs ml-1">
            {{ text }}
        </span>
        <div v-if="hasTooltip" data-testid="tooltip" class="mt-12 tooltip">
            {{ tooltip }}
        </div>
    </div>
</template>
