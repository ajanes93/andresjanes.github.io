<template>
  <svg
    v-if="pathD"
    class="pointer-events-none absolute top-0 left-0 transform-gpu"
    :class="props.class"
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
      data-testid="beam-background-path"
      fill="none"
      :stroke="pathColor"
      stroke-linecap="round"
      :stroke-opacity="pathOpacity"
      :stroke-width="pathWidth"
    />
    <!-- Animated gradient path -->
    <path
      :d="pathD"
      data-testid="beam-animated-path"
      fill="none"
      :stroke="`url(#${id})`"
      stroke-linecap="round"
      :stroke-width="pathWidth"
    />
    <defs>
      <linearGradient
        :id="id"
        data-testid="beam-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0%"
        x2="0%"
        y1="0%"
        y2="0%"
      >
        <stop
          :stop-color="gradientStartColor"
          stop-opacity="0"
        />
        <stop :stop-color="gradientStartColor" />
        <stop
          offset="32.5%"
          :stop-color="gradientStopColor"
        />
        <stop
          offset="100%"
          :stop-color="gradientStopColor"
          stop-opacity="0"
        />
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
import { useResizeObserver } from "@vueuse/core";
import { computed, ref, toRef, useId, watch } from "vue";

interface AnimatedBeamProps {
  class?: string;
  containerRef: HTMLElement | null;
  curvature?: number;
  delay?: number;
  duration?: number;
  endRef: HTMLElement | null;
  endXOffset?: number;
  endYOffset?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  pathColor?: string;
  pathOpacity?: number;
  pathWidth?: number;
  reverse?: boolean;
  startRef: HTMLElement | null;
  startXOffset?: number;
  startYOffset?: number;
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

interface SvgDimensions {
  height: number;
  width: number;
}

interface Point {
  x: number;
  y: number;
}

const id = useId();
const pathD = ref<string>("");
const svgDimensions = ref<SvgDimensions>({ height: 0, width: 0 });
const isRightToLeft = ref<boolean>(false);

const shouldAnimateRightToLeft = computed<boolean>(() =>
  props.reverse ? !isRightToLeft.value : isRightToLeft.value
);

const x1 = computed<string>(() =>
  shouldAnimateRightToLeft.value ? "90%; -10%;" : "10%; 110%;"
);

const x2 = computed<string>(() =>
  shouldAnimateRightToLeft.value ? "100%; 0%;" : "0%; 100%;"
);

function getCenterPoint(
  rect: DOMRect,
  containerRect: DOMRect,
  xOffset: number,
  yOffset: number
): Point {
  return {
    x: rect.left - containerRect.left + rect.width / 2 + xOffset,
    y: rect.top - containerRect.top + rect.height / 2 + yOffset,
  };
}

function updatePath(): void {
  if (!props.containerRef || !props.startRef || !props.endRef) return;

  const containerRect = props.containerRef.getBoundingClientRect();
  const fromRect = props.startRef.getBoundingClientRect();
  const toRect = props.endRef.getBoundingClientRect();

  svgDimensions.value = {
    width: containerRect.width,
    height: containerRect.height,
  };

  const start = getCenterPoint(
    fromRect,
    containerRect,
    props.startXOffset,
    props.startYOffset
  );

  const end = getCenterPoint(
    toRect,
    containerRect,
    props.endXOffset,
    props.endYOffset
  );

  isRightToLeft.value = end.x < start.x;

  const controlX = (start.x + end.x) / 2;
  const controlY = start.y - props.curvature;
  pathD.value = `M ${start.x},${start.y} Q ${controlX},${controlY} ${end.x},${end.y}`;
}

watch(
  () => [props.containerRef, props.startRef, props.endRef],
  () => {
    if (!props.containerRef || !props.startRef || !props.endRef) return;
    updatePath();
  },
  { immediate: true }
);

// Set up resize observer on container
useResizeObserver(
  toRef(() => props.containerRef),
  () => {
    updatePath();
  }
);
</script>
