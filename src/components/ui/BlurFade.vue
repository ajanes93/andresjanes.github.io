<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
    delay?: number
    duration?: number
    blur?: string
    yOffset?: number
}

const props = withDefaults(defineProps<Props>(), {
    delay: 0,
    duration: 0.4,
    blur: '6px',
    yOffset: 6
})

const target = ref<HTMLElement | null>(null)
const isVisible = ref<boolean>(false)

onMounted((): void => {
    const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    isVisible.value = true
                    observer.disconnect()
                }
            })
        },
        { threshold: 0.1, rootMargin: '50px' }
    )

    if (target.value) {
        observer.observe(target.value)
    }
})
</script>

<template>
    <div
        ref="target"
        class="blur-fade"
        :class="{ 'blur-fade--visible': isVisible }"
        :style="{
            '--blur-fade-delay': `${props.delay}s`,
            '--blur-fade-duration': `${props.duration}s`,
            '--blur-fade-blur': props.blur,
            '--blur-fade-y': `${props.yOffset}px`
        }"
    >
        <slot />
    </div>
</template>

<style scoped>
.blur-fade {
    opacity: 0;
    filter: blur(var(--blur-fade-blur));
    transform: translateY(var(--blur-fade-y));
    will-change: opacity, filter, transform;
}

.blur-fade--visible {
    animation: blur-fade-in var(--blur-fade-duration) ease-out var(--blur-fade-delay) forwards;
}

@keyframes blur-fade-in {
    to {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0);
    }
}
</style>
