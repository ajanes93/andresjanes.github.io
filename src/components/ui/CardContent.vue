<template>
  <div
    :class="cn('p-4 pt-0', props.class)"
    data-testid="card-content"
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
