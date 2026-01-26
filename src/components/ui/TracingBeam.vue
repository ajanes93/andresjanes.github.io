<template>
  <div
    ref="tracingBeamRef"
    class="relative h-full w-full"
    :class="props.class"
    data-testid="tracing-beam"
  >
    <!-- Tracing beam line - positioned to align with timeline dots -->
    <div
      class="absolute top-0 left-4.75 hidden md:block"
      style="z-index: 5"
    >
      <svg
        aria-hidden="true"
        class="block"
        :height="svgHeight"
        :viewBox="`0 0 4 ${svgHeight}`"
        width="4"
      >
        <!-- Background line -->
        <path
          :d="`M 2 0 V ${svgHeight}`"
          fill="none"
          stroke="hsl(var(--border))"
          stroke-width="2"
        />
        <!-- Animated gradient line -->
        <path
          class="motion-reduce:hidden"
          :d="`M 2 0 V ${svgHeight}`"
          fill="none"
          :stroke="`url(#${gradientId})`"
          stroke-width="2"
        />
        <defs>
          <linearGradient
            :id="gradientId"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="0"
            :y1="spring.y1"
            :y2="spring.y2"
          >
            <stop
              stop-color="hsl(var(--primary))"
              stop-opacity="0"
            />
            <stop
              offset="0.1"
              stop-color="hsl(var(--primary))"
            />
            <stop
              offset="0.5"
              stop-color="hsl(217 91% 60%)"
            />
            <stop
              offset="0.9"
              stop-color="hsl(187 85% 53%)"
            />
            <stop
              offset="1"
              stop-color="hsl(187 85% 53%)"
              stop-opacity="0"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div ref="tracingBeamContentRef">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useSpring } from "vue-use-spring";

interface Props {
  class?: string;
}

const props = defineProps<Props>();

const tracingBeamRef = ref<HTMLDivElement>();
const tracingBeamContentRef = ref<HTMLDivElement>();

const gradientId = `tracing-gradient-${Math.random().toString(36).substring(2, 10)}`;
const svgHeight = ref<number>(0);
const scrollProgress = ref<number>(0);

const gradientLength = 200;

const computedY1 = computed<number>(() =>
  Math.max(0, scrollProgress.value * svgHeight.value - gradientLength)
);

const computedY2 = computed<number>(() =>
  Math.min(
    svgHeight.value,
    scrollProgress.value * svgHeight.value + gradientLength
  )
);

const spring = useSpring(
  { y1: computedY1.value, y2: computedY2.value },
  { friction: 20, precision: 0.01, tension: 120 }
);

watch(computedY1, (newY1) => {
  spring.y1 = newY1;
});

watch(computedY2, (newY2) => {
  spring.y2 = newY2;
});

function updateScrollProgress(): void {
  if (tracingBeamRef.value) {
    const rect = tracingBeamRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    // Calculate how much of the element has been scrolled through
    // Start earlier (when element is 50% down the viewport) for better visual timing
    const startOffset = windowHeight * 0.5;
    const endOffset = elementHeight;

    const scrolled = startOffset - rect.top;
    const total = startOffset + endOffset;

    scrollProgress.value = Math.max(0, Math.min(1, scrolled / total));
  }
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  resizeObserver = new ResizeObserver(() => {
    updateSVGHeight();
  });

  if (tracingBeamContentRef.value) {
    resizeObserver.observe(tracingBeamContentRef.value);
  }

  updateSVGHeight();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollProgress);
  window.removeEventListener("resize", updateScrollProgress);
  resizeObserver?.disconnect();
});

function updateSVGHeight(): void {
  if (!tracingBeamContentRef.value) return;
  svgHeight.value = tracingBeamContentRef.value.offsetHeight;
}
</script>
