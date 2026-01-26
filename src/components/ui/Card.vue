<template>
  <div
    :class="
      cn(
        'bg-card text-card-foreground rounded-xl border shadow-sm',
        props.class
      )
    "
    data-testid="card"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>
