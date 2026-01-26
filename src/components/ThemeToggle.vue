<template>
  <Button
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    class="cursor-pointer"
    data-testid="theme-toggle"
    size="icon"
    variant="ghost"
    @click="toggleTheme"
  >
    <Sun v-if="isDark" aria-hidden="true" class="w-5 h-5" />
    <Moon v-else aria-hidden="true" class="w-5 h-5" />
  </Button>
</template>

<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
import { onMounted, ref } from "vue";

import { Button } from "@/components/ui";

const isDark = ref<boolean>(false);

function updateTheme(): void {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme(): void {
  isDark.value = !isDark.value;
  updateTheme();
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
}

onMounted((): void => {
  isDark.value = document.documentElement.classList.contains("dark");

  if (!localStorage.getItem("theme")) {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    updateTheme();
  }
});
</script>
