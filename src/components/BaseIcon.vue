<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'
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
    }
})
</script>

<template>
    <svg-icon :class="`text-${color}`" type="mdi" :path="path"></svg-icon>
</template>
