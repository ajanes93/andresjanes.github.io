<template>
  <Button
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    class="cursor-pointer"
    data-testid="theme-toggle"
    size="icon"
    variant="ghost"
    @click="toggleTheme"
  >
    <Sun
      v-if="isDark"
      aria-hidden="true"
      class="size-5"
    />
    <Moon
      v-else
      aria-hidden="true"
      class="size-5"
    />
  </Button>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { Moon, Sun } from "lucide-vue-next";

import { Button } from "@/components/ui";

const isDark = useDark({
  storageKey: "theme",
  valueDark: "dark",
  valueLight: "",
});

const toggleTheme = useToggle(isDark);
</script>
