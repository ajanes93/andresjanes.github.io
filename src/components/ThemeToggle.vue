<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui'

const isDark = ref(false)

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
    if (!localStorage.getItem('theme')) {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        updateTheme()
    }
})

const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const updateTheme = () => {
    if (isDark.value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}
</script>

<template>
    <Button variant="ghost" size="icon" @click="toggleTheme" aria-label="Toggle theme">
        <Sun v-if="isDark" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
    </Button>
</template>
