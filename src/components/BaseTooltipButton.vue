<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'
import { computed } from 'vue'
import { LinkTarget } from '../../types'

const props = defineProps<{
    /**
     * The link download attribute
     */
    download?: boolean | string
    /**
     * The href to link to
     */
    href?: string
    /**
     * The path to the icon svg
     */
    iconPath?: string
    /**
     * The link target attribute i.e. '_blank' | '_self' | '_parent' | '_top'
     */
    target?: LinkTarget
    /**
     * The tooltip text
     */
    tooltip?: string
}>()

const hasTooltip = computed(() => Boolean(props.tooltip))
const hasIconPath = computed(() => Boolean(props.iconPath))

const buttonClass = computed(() => ({
    'rounded-full bg-blue-500 hover:bg-blue-400 p-2 flex flex-col items-center cursor-pointer': true,
    'has-tooltip': hasTooltip
}))
</script>

<template>
    <a data-testid="buttonLink" :class="buttonClass" :href="href" :target="target" :download="download">
        <base-icon v-if="hasIconPath" :path="iconPath"></base-icon>
        <!-- @slot default -->
        <slot></slot>
        <div v-if="hasTooltip" class="my-9 tooltip">
            {{ tooltip }}
        </div>
    </a>
</template>
