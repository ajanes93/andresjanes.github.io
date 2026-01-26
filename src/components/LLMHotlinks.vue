<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

import { Check, Copy, Sparkles } from 'lucide-vue-next'

import { ChatGPTIcon, ClaudeIcon, GeminiIcon, PerplexityIcon } from '@/components/icons'
import { AnimatedBeam, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import type { LLMProvider } from '@/stores/profile'

interface Props {
    providers: LLMProvider[]
    prompt: string
}

const props = defineProps<Props>()
const copiedId = ref<string | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const centerRef = ref<HTMLElement | null>(null)
const chatgptRef = ref<HTMLElement | null>(null)
const claudeRef = ref<HTMLElement | null>(null)
const geminiRef = ref<HTMLElement | null>(null)
const perplexityRef = ref<HTMLElement | null>(null)
const isReady = ref<boolean>(false)


const encodedPrompt = computed<string>((): string => encodeURIComponent(props.prompt))

function getProviderUrl(provider: LLMProvider): string {
    const prompt = encodedPrompt.value

    switch (provider.id) {
        case 'chatgpt':
            return `https://chat.openai.com/?q=${prompt}`
        case 'claude':
            return `https://claude.ai/new?q=${prompt}`
        case 'gemini':
            // Use Google Search AI Mode (udm=50) which uses Gemini
            return `https://www.google.com/search?q=${prompt}&udm=50`
        case 'perplexity':
            return `https://www.perplexity.ai/?q=${prompt}`
        default:
            return `${provider.url}?q=${prompt}`
    }
}

function openLLM(provider: LLMProvider): void {
    const url = getProviderUrl(provider)
    window.open(url, '_blank')
}

async function copyPrompt(): Promise<void> {
    await navigator.clipboard.writeText(props.prompt)
    copiedId.value = 'copied'
    setTimeout((): void => {
        copiedId.value = null
    }, 2000)
}

onMounted(async (): Promise<void> => {
    await nextTick()
    // Small delay to ensure all refs are populated
    setTimeout((): void => {
        isReady.value = true
    }, 200)
})
</script>

<template>
    <Card class="overflow-hidden">
        <CardHeader class="pb-4">
            <CardTitle class="flex items-center gap-2 text-lg">
                <Sparkles class="w-5 h-5 text-primary" aria-hidden="true" />
                Ask AI About This Candidate
            </CardTitle>
            <CardDescription>
                Click an AI assistant to get an instant analysis of this candidate's profile.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div ref="containerRef" class="relative flex h-[200px] w-full items-center justify-center">
                <!-- Left side LLMs (ChatGPT and Claude) -->
                <div class="flex flex-col justify-center gap-8 absolute left-0 md:left-8">
                    <button
                        ref="chatgptRef"
                        type="button"
                        class="group relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-background shadow-lg transition-all hover:scale-110 hover:shadow-xl cursor-pointer"
                        :style="{ borderColor: '#10A37F' }"
                        aria-label="Open ChatGPT to analyze this candidate's profile"
                        @click="openLLM(providers[0])"
                    >
                        <ChatGPTIcon class="w-6 h-6" style="color: #10A37F" />
                        <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ChatGPT
                        </span>
                    </button>
                    <button
                        ref="claudeRef"
                        type="button"
                        class="group relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-background shadow-lg transition-all hover:scale-110 hover:shadow-xl cursor-pointer"
                        :style="{ borderColor: '#D97757' }"
                        aria-label="Open Claude to analyze this candidate's profile"
                        @click="openLLM(providers[1])"
                    >
                        <ClaudeIcon class="w-6 h-6" style="color: #D97757" />
                        <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Claude
                        </span>
                    </button>
                </div>

                <!-- Center AJ Logo -->
                <div
                    ref="centerRef"
                    class="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500 shadow-xl ring-4 ring-background"
                >
                    <span class="text-white font-bold text-xl">AJ</span>
                </div>

                <!-- Right side LLMs (Gemini and Perplexity) -->
                <div class="flex flex-col justify-center gap-8 absolute right-0 md:right-8">
                    <button
                        ref="geminiRef"
                        type="button"
                        class="group relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-background shadow-lg transition-all hover:scale-110 hover:shadow-xl cursor-pointer"
                        :style="{ borderColor: '#4285F4' }"
                        aria-label="Open Gemini to analyze this candidate's profile"
                        @click="openLLM(providers[2])"
                    >
                        <GeminiIcon class="w-6 h-6" style="color: #4285F4" />
                        <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Gemini
                        </span>
                    </button>
                    <button
                        ref="perplexityRef"
                        type="button"
                        class="group relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-background shadow-lg transition-all hover:scale-110 hover:shadow-xl cursor-pointer"
                        :style="{ borderColor: '#20B2AA' }"
                        aria-label="Open Perplexity to analyze this candidate's profile"
                        @click="openLLM(providers[3])"
                    >
                        <PerplexityIcon class="w-6 h-6" style="color: #20B2AA" />
                        <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Perplexity
                        </span>
                    </button>
                </div>

                <!-- Animated Beams -->
                <AnimatedBeam
                    v-if="isReady && containerRef && centerRef && chatgptRef"
                    :container-ref="containerRef"
                    :from-ref="centerRef"
                    :to-ref="chatgptRef"
                    gradient-start-color="#10A37F"
                    gradient-stop-color="#1A7F64"
                    :duration="4"
                    :curvature="75"
                    path-color="gray"
                    :path-opacity="0.15"
                />
                <AnimatedBeam
                    v-if="isReady && containerRef && centerRef && claudeRef"
                    :container-ref="containerRef"
                    :from-ref="centerRef"
                    :to-ref="claudeRef"
                    gradient-start-color="#D97757"
                    gradient-stop-color="#C4694B"
                    :duration="4.5"
                    :curvature="-75"
                    path-color="gray"
                    :path-opacity="0.15"
                />
                <AnimatedBeam
                    v-if="isReady && containerRef && centerRef && geminiRef"
                    :container-ref="containerRef"
                    :from-ref="centerRef"
                    :to-ref="geminiRef"
                    gradient-start-color="#4285F4"
                    gradient-stop-color="#1967D2"
                    :duration="5"
                    :curvature="-75"
                    path-color="gray"
                    :path-opacity="0.15"
                    reverse
                />
                <AnimatedBeam
                    v-if="isReady && containerRef && centerRef && perplexityRef"
                    :container-ref="containerRef"
                    :from-ref="centerRef"
                    :to-ref="perplexityRef"
                    gradient-start-color="#20B2AA"
                    gradient-stop-color="#008B8B"
                    :duration="4.2"
                    :curvature="75"
                    path-color="gray"
                    :path-opacity="0.15"
                    reverse
                />
            </div>

            <div class="flex justify-center mt-4">
                <button
                    type="button"
                    class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Copy prompt to clipboard"
                    @click="copyPrompt"
                >
                    <component :is="copiedId === 'copied' ? Check : Copy" class="w-4 h-4" />
                    {{ copiedId === 'copied' ? 'Prompt copied!' : 'Copy prompt to clipboard' }}
                </button>
            </div>

            <p class="mt-4 text-xs text-center text-muted-foreground">
                The prompt includes full context about education, experience, skills, and recommendations.
            </p>
        </CardContent>
    </Card>
</template>
