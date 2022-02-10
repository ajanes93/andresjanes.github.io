<script setup lang="ts">
import { TextValueItem } from '../../types'
import BaseDetailsSection from './BaseDetailsSection.vue'

defineProps<{
    items: TextValueItem[]
    title: string
}>()
</script>

<template>
    <base-details-section>
        <template #title>{{ title }}</template>
        <template #default>
            <div class="space-y-3">
                <div v-for="{ text, value } in items" :key="text" class="flex justify-between">
                    <div class="text-gray-500">
                        {{ text }}
                    </div>
                    <div class="font-medium text-right text-gray-600">
                        {{ value }}
                    </div>
                </div>
            </div>
        </template>
    </base-details-section>
</template>
