<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAlert } from '@mdi/js'

defineProps({
    path: {
        type: String,
        required: true,
        default: mdiAlert
    },
    color: {
        type: String,
        default: 'white'
    }
})
</script>

<template>
    <svg-icon :class="`text-${color}`" type="mdi" :path="path"></svg-icon>
</template>
