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
import { Moon, Sun } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";

import { Button } from "@/components/ui";

const isDark = ref<boolean>(false);
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function toggleTheme(): void {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
}

function handleSystemThemeChange(event: MediaQueryListEvent): void {
  if (!localStorage.getItem("theme")) {
    isDark.value = event.matches;
    document.documentElement.classList.toggle("dark", event.matches);
  }
}

onMounted((): void => {
  const savedTheme = localStorage.getItem("theme");
  const useDark = savedTheme ? savedTheme === "dark" : mediaQuery.matches;

  isDark.value = useDark;
  document.documentElement.classList.toggle("dark", useDark);

  mediaQuery.addEventListener("change", handleSystemThemeChange);
});

onUnmounted((): void => {
  mediaQuery.removeEventListener("change", handleSystemThemeChange);
});
</script>
