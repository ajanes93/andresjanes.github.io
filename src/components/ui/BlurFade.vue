<template>
  <div
    ref="target"
    class="blur-fade"
    :class="{ 'blur-fade--visible': isVisible }"
    data-testid="blur-fade"
    :style="{
      '--blur-fade-delay': `${props.delay}s`,
      '--blur-fade-duration': `${props.duration}s`,
      '--blur-fade-blur': props.blur,
      '--blur-fade-y': `${props.yOffset}px`,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { ref } from "vue";

interface Props {
  blur?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  blur: "6px",
  delay: 0,
  duration: 0.4,
  yOffset: 6,
});

const target = ref<HTMLElement | null>(null);
const isVisible = ref<boolean>(false);

const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true;
      stop();
    }
  },
  { rootMargin: "50px", threshold: 0.1 }
);
</script>

<style scoped>
.blur-fade {
  opacity: 0;
  filter: blur(var(--blur-fade-blur));
  transform: translateY(var(--blur-fade-y));
  will-change: opacity, filter, transform;
}

.blur-fade--visible {
  animation: blur-fade-in var(--blur-fade-duration) ease-out
    var(--blur-fade-delay) forwards;
}

@keyframes blur-fade-in {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}
</style>
