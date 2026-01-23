<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, ref } from 'vue'

interface Props {
    words: string
    filter?: boolean
    duration?: number
    delay?: number
    class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
    duration: 0.7,
    delay: 0,
    filter: true
})

const scope = ref<HTMLElement | null>(null)
const wordsArray = computed<string[]>(() => props.words.split(' '))

const spanStyle = computed<Record<string, string>>(() => ({
    opacity: '0',
    filter: props.filter ? 'blur(10px)' : 'none',
    transition: `opacity ${props.duration}s, filter ${props.duration}s`
}))

onMounted((): void => {
    if (scope.value) {
        const spans = scope.value.querySelectorAll('span')

        setTimeout((): void => {
            spans.forEach((span: Element, index: number): void => {
                setTimeout((): void => {
                    const el = span as HTMLElement
                    el.style.opacity = '1'
                    el.style.filter = props.filter ? 'blur(0px)' : 'none'
                }, index * 200)
            })
        }, props.delay)
    }
})
</script>

<template>
    <div class="leading-snug tracking-wide" :class="[props.class]">
        <div ref="scope">
            <span v-for="(word, idx) in wordsArray" :key="word + idx" class="inline-block" :style="spanStyle">
                {{ word }}&nbsp;
            </span>
        </div>
    </div>
</template>
