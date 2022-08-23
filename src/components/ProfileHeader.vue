<script setup lang="ts">
defineProps({
    /**
     * The path to the profile picture
     */
    imgSrc: {
        type: String,
        default: '/img/profile.webp'
    },
    /**
     * The name of the person
     */
    name: {
        type: String,
        default: 'Andres Janes'
    },
    /**
     * The current position of the person
     */
    position: {
        type: String,
        default: 'Frontend Developer'
    },
    /**
     * The website of the person
     */
    website: {
        type: String,
        default: 'https://andresjanes.gitlab.io'
    }
})
</script>

<template>
    <div>
        <img :src="imgSrc" alt="Profile Picture" class="bg-white rounded-full w-48 mx-auto mb-1.5" />
        <h1 class="text-2xl text-center font-semibold mb-1.5">
            {{ name }}
        </h1>
        <h2 class="text-sm text-center font-medium text-gray-600 print:mb-1.5">
            {{ position }}
        </h2>
        <h3 class="text-xs text-center font-medium text-gray-600 hidden print:block">
            <a :href="website" target="_blank">
                {{ website }}
            </a>
        </h3>
    </div>
</template>
