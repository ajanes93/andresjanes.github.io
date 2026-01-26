<template>
  <component
    :is="asChild ? 'span' : 'button'"
    :class="classes"
    :type="asChild ? undefined : 'button'"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { cn } from "@/lib/utils";

import { buttonVariants, type ButtonVariants } from "./button";

interface Props {
  asChild?: boolean;
  class?: string;
  size?: ButtonVariants["size"];
  variant?: ButtonVariants["variant"];
}

const props = withDefaults(defineProps<Props>(), {
  class: undefined,
  size: "default",
  variant: "default",
});

const classes = computed<string>(() =>
  cn(buttonVariants({ size: props.size, variant: props.variant }), props.class)
);
</script>
