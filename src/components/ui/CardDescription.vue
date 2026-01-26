<template>
  <p
    :class="cn('text-muted-foreground text-sm', props.class)"
    data-testid="card-description"
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>
