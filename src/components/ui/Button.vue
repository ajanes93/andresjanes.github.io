<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './button'

interface Props {
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    class?: string
    asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'default',
    asChild: false
})

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class))
</script>

<template>
    <component :is="asChild ? 'span' : 'button'" :class="classes">
        <slot />
    </component>
</template>
