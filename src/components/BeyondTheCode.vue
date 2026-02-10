<template>
  <section
    class="space-y-6"
    data-testid="beyond-the-code-section"
  >
    <h2 class="flex items-center gap-3 text-2xl font-bold">
      <div class="bg-primary/10 rounded-lg p-2">
        <Coffee class="text-primary size-5" />
      </div>
      Beyond the Code
    </h2>

    <Card class="overflow-hidden">
      <!-- Code editor header -->
      <div
        class="bg-muted/50 flex items-center gap-2 border-b px-4 py-2"
        data-testid="code-editor-header"
      >
        <div class="flex gap-1.5">
          <div class="size-3 rounded-full bg-red-500/80" />
          <div class="size-3 rounded-full bg-yellow-500/80" />
          <div class="size-3 rounded-full bg-green-500/80" />
        </div>
        <span class="text-muted-foreground ml-2 font-mono text-xs">
          andres.config.ts
        </span>
      </div>

      <!-- Code content -->
      <CardContent class="p-0">
        <pre
          class="overflow-x-auto p-4 font-mono text-sm/relaxed"
          data-testid="code-content"
        ><code><span :class="SYNTAX.comment">// The person behind the commits</span>
<span :class="SYNTAX.keyword">const</span> <span :class="SYNTAX.identifier">andres</span> = {
  <span :class="SYNTAX.property">origin</span>: <span :class="SYNTAX.string">"{{ props.personal.origin }} 🇨🇴"</span>,
  <span :class="SYNTAX.property">currentChapter</span>: <span :class="SYNTAX.string">"{{ props.personal.currentChapter }} 👶"</span>,
  <span :class="SYNTAX.property">interests</span>: [
    <span v-for="(interest, index) in props.personal.interests" :key="interest"><span :class="SYNTAX.string">"{{ interest }}"</span><span v-if="index < props.personal.interests.length - 1">, </span></span>
  ],
  <span :class="SYNTAX.property">currentlyExploring</span>: [
    <span v-for="(tool, index) in props.personal.aiTools" :key="tool"><span :class="SYNTAX.string">"{{ tool }}"</span><span v-if="index < props.personal.aiTools.length - 1">, </span></span>
  ],
  <span :class="SYNTAX.comment">// {{ props.personal.sideProjectStatus }}</span>
  <span :class="SYNTAX.property">sideProjects</span>: [
    <span v-for="(project, index) in props.personal.sideProjects" :key="project"><span :class="SYNTAX.string">"{{ project }}"</span><span v-if="index < props.personal.sideProjects.length - 1">, </span></span>
  ],
};

<span :class="SYNTAX.keyword">export default</span> <span :class="SYNTAX.identifier">andres</span>;</code></pre>
      </CardContent>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { Coffee } from "lucide-vue-next";

import { Card, CardContent } from "@/components/ui";
import type { PersonalInfo } from "@/stores/profile";

interface Props {
  personal: PersonalInfo;
}

const props = defineProps<Props>();

const SYNTAX = {
  keyword: "text-pink-500 dark:text-pink-400",
  identifier: "text-blue-600 dark:text-blue-400",
  property: "text-emerald-600 dark:text-emerald-400",
  string: "text-amber-600 dark:text-amber-400",
  comment: "text-muted-foreground",
} as const;
</script>
