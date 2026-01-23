<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
    class?: string
}

const props = defineProps<Props>()
</script>

<template>
    <span
        :class="
            cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', props.class)
        "
    >
        <slot />
    </span>
</template>
