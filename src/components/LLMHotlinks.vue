<script setup lang="ts">
import { computed, ref } from 'vue'
import { Sparkles, Brain, Gem, Search, ExternalLink, Copy, Check } from 'lucide-vue-next'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import type { LLMProvider } from '@/stores/profile'

interface Props {
    providers: LLMProvider[]
    prompt: string
}

const props = defineProps<Props>()
const copiedId = ref<string | null>(null)

const getIcon = (iconName: string) => {
    const icons: Record<string, typeof Sparkles> = {
        sparkles: Sparkles,
        brain: Brain,
        gem: Gem,
        search: Search
    }
    return icons[iconName] || Sparkles
}

const encodedPrompt = computed(() => encodeURIComponent(props.prompt))

const openLLM = (provider: LLMProvider) => {
    window.open(`${provider.url}?q=${encodedPrompt.value}`, '_blank')
}

const copyPrompt = async (providerId: string) => {
    await navigator.clipboard.writeText(props.prompt)
    copiedId.value = providerId
    setTimeout(() => { copiedId.value = null }, 2000)
}
</script>

<template>
    <Card class="overflow-hidden">
        <CardHeader class="pb-4">
            <CardTitle class="flex items-center gap-2 text-lg">
                <Sparkles class="w-5 h-5 text-primary" />
                Ask AI About This Candidate
            </CardTitle>
            <CardDescription>
                Click an AI assistant to get an instant analysis of this candidate's profile
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div v-for="provider in providers" :key="provider.id" class="relative group">
                    <Button variant="outline" class="w-full h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg" @click="openLLM(provider)">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" :style="{ backgroundColor: provider.color + '20' }">
                            <component :is="getIcon(provider.icon)" class="w-5 h-5" :style="{ color: provider.color }" />
                        </div>
                        <span class="text-sm font-medium">{{ provider.name }}</span>
                        <ExternalLink class="w-3 h-3 text-muted-foreground absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                    <button class="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 py-1" @click.stop="copyPrompt(provider.id)">
                        <component :is="copiedId === provider.id ? Check : Copy" class="w-3 h-3" />
                        {{ copiedId === provider.id ? 'Copied!' : 'Copy prompt' }}
                    </button>
                </div>
            </div>
            <p class="mt-6 text-xs text-center text-muted-foreground">
                The prompt includes full context about education, experience, skills, and recommendations.
            </p>
        </CardContent>
    </Card>
</template>
