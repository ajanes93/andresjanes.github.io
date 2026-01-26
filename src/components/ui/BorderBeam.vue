<template>
  <div
    class="border-beam animate-border-beam pointer-events-none absolute inset-0 rounded-[inherit] ![mask-composite:intersect] ![mask-clip:padding-box,border-box] [border:calc(var(--border-width)*1px)_solid_transparent] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]"
    :class="props.class"
    data-testid="border-beam"
  />
</template>

<script setup lang="ts">
interface BorderBeamProps {
  anchor?: number;
  borderWidth?: number;
  class?: string;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  duration?: number;
  size?: number;
}

const props = withDefaults(defineProps<BorderBeamProps>(), {
  anchor: 90,
  borderWidth: 1.5,
  class: undefined,
  colorFrom: "#0066ff",
  colorTo: "#00ccff",
  delay: 0,
  duration: 15,
  size: 200,
});
</script>

<style scoped>
.border-beam {
  --size: v-bind(size);
  --duration: v-bind("`${duration}s`");
  --anchor: v-bind(anchor);
  --border-width: v-bind(borderWidth);
  --color-from: v-bind(colorFrom);
  --color-to: v-bind(colorTo);
  --delay: v-bind("`${delay}s`");
}

.animate-border-beam::after {
  animation: border-beam-anim var(--duration) infinite linear;
}

@keyframes border-beam-anim {
  to {
    offset-distance: 100%;
  }
}
</style>
