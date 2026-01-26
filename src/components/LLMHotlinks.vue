<template>
  <Card class="overflow-hidden">
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-lg">
        <Sparkles
          aria-hidden="true"
          class="text-primary size-5"
        />
        Ask AI About This Candidate
      </CardTitle>
      <CardDescription>
        Click an AI assistant to get an instant analysis of this candidate's
        profile.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div
        ref="containerRef"
        class="relative flex h-50 w-full items-center justify-center"
      >
        <!-- Left side LLMs (ChatGPT and Claude) -->
        <div
          class="absolute left-0 flex flex-col justify-center gap-8 md:left-8"
        >
          <a
            ref="chatgptRef"
            aria-label="Open ChatGPT to analyze this candidate's profile"
            class="group bg-background relative z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            data-testid="llm-button"
            :href="chatgptUrl"
            rel="noopener noreferrer"
            :style="{ borderColor: '#10A37F' }"
            target="_blank"
          >
            <ChatGPTIcon
              class="size-6"
              style="color: #10a37f"
            />
            <span
              class="text-muted-foreground absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100"
            >
              ChatGPT
            </span>
          </a>
          <a
            ref="claudeRef"
            aria-label="Open Claude to analyze this candidate's profile"
            class="group bg-background relative z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            data-testid="llm-button"
            :href="claudeUrl"
            rel="noopener noreferrer"
            :style="{ borderColor: '#D97757' }"
            target="_blank"
          >
            <ClaudeIcon
              class="size-6"
              style="color: #d97757"
            />
            <span
              class="text-muted-foreground absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100"
            >
              Claude
            </span>
          </a>
        </div>

        <!-- Center AJ Logo -->
        <div
          ref="centerRef"
          class="ring-background z-10 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500 shadow-xl ring-4"
        >
          <span class="text-xl font-bold text-white">AJ</span>
        </div>

        <!-- Right side LLMs (Gemini and Perplexity) -->
        <div
          class="absolute right-0 flex flex-col justify-center gap-8 md:right-8"
        >
          <a
            ref="geminiRef"
            aria-label="Open Gemini to analyze this candidate's profile"
            class="group bg-background relative z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            data-testid="llm-button"
            :href="geminiUrl"
            rel="noopener noreferrer"
            :style="{ borderColor: '#4285F4' }"
            target="_blank"
          >
            <GeminiIcon
              class="size-6"
              style="color: #4285f4"
            />
            <span
              class="text-muted-foreground absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100"
            >
              Gemini
            </span>
          </a>
          <a
            ref="perplexityRef"
            aria-label="Open Perplexity to analyze this candidate's profile"
            class="group bg-background relative z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            data-testid="llm-button"
            :href="perplexityUrl"
            rel="noopener noreferrer"
            :style="{ borderColor: '#20B2AA' }"
            target="_blank"
          >
            <PerplexityIcon
              class="size-6"
              style="color: #20b2aa"
            />
            <span
              class="text-muted-foreground absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100"
            >
              Perplexity
            </span>
          </a>
        </div>

        <!-- Animated Beams -->
        <AnimatedBeam
          v-if="isReady && containerRef && centerRef && chatgptRef"
          :container-ref="containerRef"
          :curvature="75"
          :duration="4"
          :end-ref="chatgptRef"
          gradient-start-color="#10A37F"
          gradient-stop-color="#1A7F64"
          path-color="gray"
          :path-opacity="0.15"
          :start-ref="centerRef"
        />
        <AnimatedBeam
          v-if="isReady && containerRef && centerRef && claudeRef"
          :container-ref="containerRef"
          :curvature="-75"
          :duration="4.5"
          :end-ref="claudeRef"
          gradient-start-color="#D97757"
          gradient-stop-color="#C4694B"
          path-color="gray"
          :path-opacity="0.15"
          :start-ref="centerRef"
        />
        <AnimatedBeam
          v-if="isReady && containerRef && centerRef && geminiRef"
          :container-ref="containerRef"
          :curvature="-75"
          :duration="5"
          :end-ref="geminiRef"
          gradient-start-color="#4285F4"
          gradient-stop-color="#1967D2"
          path-color="gray"
          :path-opacity="0.15"
          reverse
          :start-ref="centerRef"
        />
        <AnimatedBeam
          v-if="isReady && containerRef && centerRef && perplexityRef"
          :container-ref="containerRef"
          :curvature="75"
          :duration="4.2"
          :end-ref="perplexityRef"
          gradient-start-color="#20B2AA"
          gradient-stop-color="#008B8B"
          path-color="gray"
          :path-opacity="0.15"
          reverse
          :start-ref="centerRef"
        />
      </div>

      <div class="mt-4 flex justify-center">
        <button
          aria-label="Copy prompt to clipboard"
          class="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm transition-colors"
          data-testid="copy-button"
          type="button"
          @click="copyPrompt"
        >
          <component
            :is="copied ? Check : Copy"
            class="size-4"
          />
          {{ copied ? "Prompt copied!" : "Copy prompt to clipboard" }}
        </button>
      </div>

      <p class="text-muted-foreground mt-4 text-center text-xs">
        The prompt includes full context about education, experience, skills,
        and recommendations.
      </p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { Check, Copy, Sparkles } from "lucide-vue-next";
import { computed, nextTick, onMounted, ref } from "vue";

import {
  ChatGPTIcon,
  ClaudeIcon,
  GeminiIcon,
  PerplexityIcon,
} from "@/components/icons";
import {
  AnimatedBeam,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { LLMProvider } from "@/stores/profile";

interface Props {
  prompt: string;
  providers: LLMProvider[];
}

const props = defineProps<Props>();
const containerRef = ref<HTMLElement | null>(null);
const centerRef = ref<HTMLElement | null>(null);
const chatgptRef = ref<HTMLElement | null>(null);
const claudeRef = ref<HTMLElement | null>(null);
const geminiRef = ref<HTMLElement | null>(null);
const perplexityRef = ref<HTMLElement | null>(null);
const isReady = ref<boolean>(false);

const { copy, copied } = useClipboard({ copiedDuring: 2000 });

const encodedPrompt = computed<string>(() => encodeURIComponent(props.prompt));

const chatgptUrl = computed<string>(
  () => `https://chat.openai.com/?q=${encodedPrompt.value}`
);

const claudeUrl = computed<string>(
  () => `https://claude.ai/new?q=${encodedPrompt.value}`
);

const geminiUrl = computed<string>(
  () => `https://www.google.com/search?q=${encodedPrompt.value}&udm=50`
);

const perplexityUrl = computed<string>(
  () => `https://www.perplexity.ai/?q=${encodedPrompt.value}`
);

function copyPrompt(): void {
  copy(props.prompt);
}

onMounted(async (): Promise<void> => {
  await nextTick();

  // Small delay to ensure all refs are populated
  setTimeout((): void => {
    isReady.value = true;
  }, 200);
});
</script>
