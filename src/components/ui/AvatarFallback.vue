<template>
  <span
    :class="
      cn(
        'bg-muted flex h-full w-full items-center justify-center rounded-full',
        props.class
      )
    "
    data-testid="avatar-fallback"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>
