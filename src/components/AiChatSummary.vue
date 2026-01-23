<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sparkles, User } from 'lucide-vue-next'
import { Card } from '@/components/ui'

interface Props {
    summary: string
}

const props = defineProps<Props>()

const displayedText = ref('')
const isTyping = ref(true)
const typingSpeed = 15

onMounted(() => {
    let index = 0
    const typeWriter = () => {
        if (index < props.summary.length) {
            displayedText.value += props.summary.charAt(index)
            index++
            setTimeout(typeWriter, typingSpeed)
        } else {
            isTyping.value = false
        }
    }
    setTimeout(typeWriter, 500)
})
</script>

<template>
    <Card class="overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <div class="p-6 space-y-4">
            <!-- AI Assistant Header -->
            <div class="flex items-center gap-3 pb-4 border-b border-border/50">
                <div
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
                >
                    <Sparkles class="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 class="font-semibold text-foreground">AI Assistant</h3>
                    <p class="text-xs text-muted-foreground">Summarizing candidate profile...</p>
                </div>
            </div>

            <!-- Chat Messages -->
            <div class="space-y-4">
                <!-- User Message -->
                <div class="flex gap-3 justify-end">
                    <div
                        class="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm"
                    >
                        Tell me about this candidate's background and experience.
                    </div>
                    <div
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0"
                    >
                        <User class="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                <!-- AI Response -->
                <div class="flex gap-3">
                    <div
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0"
                    >
                        <Sparkles class="w-4 h-4 text-white" />
                    </div>
                    <div
                        class="max-w-[85%] bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                    >
                        <p class="whitespace-pre-line">
                            {{ displayedText
                            }}<span v-if="isTyping" class="inline-block w-0.5 h-4 bg-primary animate-blink ml-0.5"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>
