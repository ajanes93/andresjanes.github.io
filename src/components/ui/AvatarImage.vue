<template>
  <img
    :alt="props.alt"
    :class="cn('aspect-square size-full', props.class)"
    data-testid="avatar-image"
    :src="props.src"
  />
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  alt?: string;
  class?: string;
  src: string;
}

const props = defineProps<Props>();
</script>
