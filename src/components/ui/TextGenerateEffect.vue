<template>
  <div
    class="leading-snug tracking-wide"
    :class="[props.class]"
  >
    <div ref="scope">
      <span
        v-for="(word, idx) in wordsArray"
        :key="word + idx"
        class="inline-block"
        :style="spanStyle"
      >
        {{ word }}&nbsp;
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, onMounted, ref } from "vue";

interface Props {
  class?: HTMLAttributes["class"];
  delay?: number;
  duration?: number;
  noBlur?: boolean;
  words: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: undefined,
  delay: 0,
  duration: 0.7,
});

const scope = ref<HTMLElement | null>(null);
const wordsArray = computed<string[]>(() => props.words.split(" "));

const spanStyle = computed<Record<string, string>>(() => ({
  filter: props.noBlur ? "none" : "blur(10px)",
  opacity: "0",
  transition: `opacity ${props.duration}s, filter ${props.duration}s`,
}));

onMounted((): void => {
  if (scope.value) {
    const spans = scope.value.querySelectorAll("span");

    setTimeout((): void => {
      spans.forEach((span: Element, index: number): void => {
        setTimeout((): void => {
          const el = span as HTMLElement;
          el.style.opacity = "1";
          el.style.filter = props.noBlur ? "none" : "blur(0px)";
        }, index * 200);
      });
    }, props.delay);
  }
});
</script>
