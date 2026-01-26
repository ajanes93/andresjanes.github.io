<template>
  <div
    :class="classes"
    data-testid="badge"
    :data-variant="props.variant"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { computed } from "vue";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
  }
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

interface Props {
  class?: string;
  variant?: BadgeVariants["variant"];
}

const props = withDefaults(defineProps<Props>(), {
  class: undefined,
  variant: "default",
});

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant }), props.class)
);
</script>
