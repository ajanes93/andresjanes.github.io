<script setup lang="ts">
interface Props {
    class?: string
}

defineProps<Props>()
</script>

<template>
    <!-- Google Gemini sparkle icon - simplified monochrome version -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="$props.class">
        <path d="M12 0C12.1875 4.5 13.5 7.875 16.3125 10.6875C19.125 13.5 22.5 14.8125 27 15C22.5 15.1875 19.125 16.5 16.3125 19.3125C13.5 22.125 12.1875 25.5 12 30C11.8125 25.5 10.5 22.125 7.6875 19.3125C4.875 16.5 1.5 15.1875 -3 15C1.5 14.8125 4.875 13.5 7.6875 10.6875C10.5 7.875 11.8125 4.5 12 0Z" transform="scale(0.8) translate(3, 3)"/>
    </svg>
</template>
