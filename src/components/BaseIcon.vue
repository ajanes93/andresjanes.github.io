<script setup lang="ts">
import { mdiAlert } from '@mdi/js'

defineProps({
    /**
     * The color of the icon
     */
    color: {
        type: String,
        default: 'white'
    },
    /**
     * The path to the icon svg
     */
    path: {
        type: String,
        required: true,
        default: mdiAlert
    },
    /**
     * The icon size
     */
    size: {
        type: Number,
        default: 24
    },
    /**
     * The viewbox style
     */
    viewbox: {
        type: String,
        default: '0 0 24 24'
    }
})
</script>

<template>
    <svg :class="`text-${color}`" :width="size" :height="size" :viewBox="viewbox">
        <path :d="path" />
    </svg>
</template>

<style scoped>
path {
    fill: currentColor;
}
</style>
