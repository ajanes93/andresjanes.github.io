<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'
import { computed } from 'vue'

const props = defineProps<{
    iconPath?: string
    tooltip?: string
    href?: string
    target?: LinkTarget
    download?: boolean | string
}>()

const hasTooltip = computed(() => Boolean(props.tooltip))
const hasIconPath = computed(() => Boolean(props.iconPath))

const buttonClass = computed(() => ({
    'rounded-full bg-blue-600 p-2 flex flex-col items-center cursor-pointer': true,
    'has-tooltip': hasTooltip
}))
</script>

<template>
    <a :class="buttonClass" :href="href" :target="target" :download="download">
        <base-icon v-if="hasIconPath" :path="iconPath"></base-icon>
        <slot></slot>
        <div v-if="hasTooltip" class="my-9 tooltip">
            {{ tooltip }}
        </div>
    </a>
</template>
