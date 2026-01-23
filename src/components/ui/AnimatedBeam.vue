<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface AnimatedBeamProps {
    class?: string
    containerRef: HTMLElement | null
    fromRef: HTMLElement | null
    toRef: HTMLElement | null
    curvature?: number
    reverse?: boolean
    pathColor?: string
    pathWidth?: number
    pathOpacity?: number
    gradientStartColor?: string
    gradientStopColor?: string
    delay?: number
    duration?: number
    startXOffset?: number
    startYOffset?: number
    endXOffset?: number
    endYOffset?: number
}

const props = withDefaults(defineProps<AnimatedBeamProps>(), {
    curvature: 0,
    reverse: false,
    duration: 4,
    delay: 0,
    pathColor: 'gray',
    pathWidth: 2,
    pathOpacity: 0.2,
    gradientStartColor: '#FFAA40',
    gradientStopColor: '#9C40FF',
    startXOffset: 0,
    startYOffset: 0,
    endXOffset: 0,
    endYOffset: 0
})

const id = `beam-${Math.random().toString(36).substring(2, 10)}`
const pathD = ref<string>('')
const svgDimensions = ref<{ width: number; height: number }>({ width: 0, height: 0 })

const isRightToLeft = ref<boolean>(false)

const x1 = computed<string>((): string => {
    const direction = props.reverse ? !isRightToLeft.value : isRightToLeft.value
    return direction ? '90%; -10%;' : '10%; 110%;'
})
const x2 = computed<string>((): string => {
    const direction = props.reverse ? !isRightToLeft.value : isRightToLeft.value
    return direction ? '100%; 0%;' : '0%; 100%;'
})

let resizeObserver: ResizeObserver | undefined

function updatePath(): void {
    if (!props.containerRef || !props.fromRef || !props.toRef) return

    const containerRect = props.containerRef.getBoundingClientRect()
    const rectA = props.fromRef.getBoundingClientRect()
    const rectB = props.toRef.getBoundingClientRect()

    const svgWidth = containerRect.width
    const svgHeight = containerRect.height
    svgDimensions.value = { width: svgWidth, height: svgHeight }

    const startX = rectA.left - containerRect.left + rectA.width / 2 + props.startXOffset
    const startY = rectA.top - containerRect.top + rectA.height / 2 + props.startYOffset
    const endX = rectB.left - containerRect.left + rectB.width / 2 + props.endXOffset
    const endY = rectB.top - containerRect.top + rectB.height / 2 + props.endYOffset

    isRightToLeft.value = endX < startX

    const controlY = startY - props.curvature
    pathD.value = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
}

// Watch for ref changes
watch(
    () => [props.containerRef, props.fromRef, props.toRef],
    ([container, from, to]) => {
        if (container && from && to) {
            // Clean up old observer
            resizeObserver?.disconnect()

            // Update path immediately
            updatePath()

            // Set up resize observer
            resizeObserver = new ResizeObserver(() => updatePath())
            resizeObserver.observe(container)
        }
    },
    { immediate: true }
)

onMounted(() => {
    // Trigger initial update after mount
    if (props.containerRef && props.fromRef && props.toRef) {
        updatePath()
    }
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})
</script>

<template>
    <svg
        v-if="pathD"
        fill="none"
        :width="svgDimensions.width"
        :height="svgDimensions.height"
        xmlns="http://www.w3.org/2000/svg"
        class="pointer-events-none absolute top-0 left-0 transform-gpu"
        :class="[props.class]"
        :viewBox="`0 0 ${svgDimensions.width} ${svgDimensions.height}`"
    >
        <!-- Background path -->
        <path
            :d="pathD"
            :stroke="pathColor"
            :stroke-width="pathWidth"
            :stroke-opacity="pathOpacity"
            stroke-linecap="round"
            fill="none"
        />
        <!-- Animated gradient path -->
        <path
            :d="pathD"
            :stroke-width="pathWidth"
            :stroke="`url(#${id})`"
            stroke-linecap="round"
            fill="none"
        />
        <defs>
            <linearGradient :id="id" gradientUnits="userSpaceOnUse" x1="0%" x2="0%" y1="0%" y2="0%">
                <stop :stop-color="gradientStartColor" stop-opacity="0" />
                <stop :stop-color="gradientStartColor" />
                <stop offset="32.5%" :stop-color="gradientStopColor" />
                <stop offset="100%" :stop-color="gradientStopColor" stop-opacity="0" />
                <animate
                    attributeName="x1"
                    :values="x1"
                    :dur="`${duration}s`"
                    keyTimes="0; 1"
                    keySplines="0.16 1 0.3 1"
                    calcMode="spline"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="x2"
                    :values="x2"
                    :dur="`${duration}s`"
                    keyTimes="0; 1"
                    keySplines="0.16 1 0.3 1"
                    calcMode="spline"
                    repeatCount="indefinite"
                />
            </linearGradient>
        </defs>
    </svg>
</template>
