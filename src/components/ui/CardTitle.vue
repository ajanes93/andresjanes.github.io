<template>
  <h3
    :class="
      cn('text-2xl leading-none font-semibold tracking-tight', props.class)
    "
  >
    <slot />
  </h3>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>
