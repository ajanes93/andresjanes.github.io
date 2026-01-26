<template>
  <svg
    v-if="pathD"
    class="pointer-events-none absolute top-0 left-0 transform-gpu"
    :class="[props.class]"
    data-testid="animated-beam"
    fill="none"
    :height="svgDimensions.height"
    :viewBox="`0 0 ${svgDimensions.width} ${svgDimensions.height}`"
    :width="svgDimensions.width"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Background path -->
    <path
      :d="pathD"
      fill="none"
      :stroke="pathColor"
      stroke-linecap="round"
      :stroke-opacity="pathOpacity"
      :stroke-width="pathWidth"
    />
    <!-- Animated gradient path -->
    <path
      :d="pathD"
      fill="none"
      :stroke="`url(#${id})`"
      stroke-linecap="round"
      :stroke-width="pathWidth"
    />
    <defs>
      <linearGradient
        :id="id"
        gradientUnits="userSpaceOnUse"
        x1="0%"
        x2="0%"
        y1="0%"
        y2="0%"
      >
        <stop :stop-color="gradientStartColor" stop-opacity="0" />
        <stop :stop-color="gradientStartColor" />
        <stop offset="32.5%" :stop-color="gradientStopColor" />
        <stop offset="100%" :stop-color="gradientStopColor" stop-opacity="0" />
        <animate
          attributeName="x1"
          calcMode="spline"
          :dur="`${duration}s`"
          keySplines="0.16 1 0.3 1"
          keyTimes="0; 1"
          repeatCount="indefinite"
          :values="x1"
        />
        <animate
          attributeName="x2"
          calcMode="spline"
          :dur="`${duration}s`"
          keySplines="0.16 1 0.3 1"
          keyTimes="0; 1"
          repeatCount="indefinite"
          :values="x2"
        />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

interface AnimatedBeamProps {
  class?: string;
  containerRef: HTMLElement | null;
  curvature?: number;
  delay?: number;
  duration?: number;
  endXOffset?: number;
  endYOffset?: number;
  fromRef: HTMLElement | null;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pathColor?: string;
  pathOpacity?: number;
  pathWidth?: number;
  reverse?: boolean;
  startXOffset?: number;
  startYOffset?: number;
  toRef: HTMLElement | null;
}

const props = withDefaults(defineProps<AnimatedBeamProps>(), {
  class: undefined,
  curvature: 0,
  delay: 0,
  duration: 4,
  endXOffset: 0,
  endYOffset: 0,
  gradientStartColor: "#FFAA40",
  gradientStopColor: "#9C40FF",
  pathColor: "gray",
  pathOpacity: 0.2,
  pathWidth: 2,
  startXOffset: 0,
  startYOffset: 0,
});

const id = `beam-${Math.random().toString(36).substring(2, 10)}`;
const pathD = ref<string>("");

const svgDimensions = ref<{ height: number; width: number }>({
  height: 0,
  width: 0,
});

const isRightToLeft = ref<boolean>(false);

const x1 = computed<string>(() => {
  const direction = props.reverse ? !isRightToLeft.value : isRightToLeft.value;

  return direction ? "90%; -10%;" : "10%; 110%;";
});

const x2 = computed<string>(() => {
  const direction = props.reverse ? !isRightToLeft.value : isRightToLeft.value;

  return direction ? "100%; 0%;" : "0%; 100%;";
});

let resizeObserver: ResizeObserver | undefined;

function updatePath(): void {
  if (!props.containerRef || !props.fromRef || !props.toRef) return;

  const containerRect = props.containerRef.getBoundingClientRect();
  const rectA = props.fromRef.getBoundingClientRect();
  const rectB = props.toRef.getBoundingClientRect();

  const svgWidth = containerRect.width;
  const svgHeight = containerRect.height;
  svgDimensions.value = { height: svgHeight, width: svgWidth };

  const startX =
    rectA.left - containerRect.left + rectA.width / 2 + props.startXOffset;

  const startY =
    rectA.top - containerRect.top + rectA.height / 2 + props.startYOffset;

  const endX =
    rectB.left - containerRect.left + rectB.width / 2 + props.endXOffset;

  const endY =
    rectB.top - containerRect.top + rectB.height / 2 + props.endYOffset;

  isRightToLeft.value = endX < startX;

  const controlY = startY - props.curvature;
  pathD.value = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
}

// Watch for ref changes
watch(
  () => [props.containerRef, props.fromRef, props.toRef],
  ([container, from, to]) => {
    if (container && from && to) {
      // Clean up old observer
      resizeObserver?.disconnect();

      // Update path immediately
      updatePath();

      // Set up resize observer
      resizeObserver = new ResizeObserver(() => updatePath());
      resizeObserver.observe(container);
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Trigger initial update after mount
  if (props.containerRef && props.fromRef && props.toRef) {
    updatePath();
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>
