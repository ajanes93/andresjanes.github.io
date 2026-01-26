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
import { useDark } from "@vueuse/core";
import { Moon, Sun } from "lucide-vue-next";

import { Button } from "@/components/ui";

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "",
  storageKey: "theme",
  storage: localStorage,
});

function toggleTheme(): void {
  isDark.value = !isDark.value;
}
</script>
