<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { Moon, Sun } from 'lucide-vue-next'

import { Button } from '@/components/ui'

const isDark = ref<boolean>(false)

function updateTheme(): void {
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

function toggleTheme(): void {
    isDark.value = !isDark.value
    updateTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted((): void => {
    isDark.value = document.documentElement.classList.contains('dark')
    if (!localStorage.getItem('theme')) {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        updateTheme()
    }
})
</script>

<template>
    <Button
        variant="ghost"
        size="icon"
        class="cursor-pointer"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
    >
        <Sun v-if="isDark" class="w-5 h-5" aria-hidden="true" />
        <Moon v-else class="w-5 h-5" aria-hidden="true" />
    </Button>
</template>
