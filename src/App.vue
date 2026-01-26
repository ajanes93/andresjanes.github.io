<template>
  <div class="min-h-screen bg-background">
    <a
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      href="#main-content"
    >
      Skip to main content
    </a>
    <header class="sticky top-0 z-50 glass border-b">
      <div
        class="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
          >
            <span class="text-white font-bold text-sm">AJ</span>
          </div>
          <span class="font-semibold hidden sm:inline">andresjanes.com</span>
        </div>

        <div class="flex items-center gap-2">
          <Button
            aria-label="Download CV as PDF"
            class="hidden sm:inline-flex items-center gap-2"
            size="sm"
            variant="outline"
            @click="downloadCv"
          >
            <Download aria-hidden="true" class="w-4 h-4" />
            <span>Download CV</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main
      id="main-content"
      class="container max-w-5xl mx-auto px-4 py-8 space-y-12"
    >
      <BlurFade>
        <section>
          <ProfileHero
            :avatar-path="store.avatarPath"
            :company="store.company"
            :languages="store.languages"
            :location="store.location"
            :name="store.name"
            :pronouns="store.pronouns"
            :socials="store.socials"
            :title="store.title"
            :years-experience="store.yearsExperience"
          />
        </section>
      </BlurFade>

      <BlurFade>
        <section>
          <AiSummary />
        </section>
      </BlurFade>

      <BlurFade>
        <section>
          <LLMHotlinks
            :prompt="store.getCandidateSummaryPrompt"
            :providers="store.llmProviders"
          />
        </section>
      </BlurFade>

      <BlurFade>
        <section>
          <SkillsSection :skills="store.skills" />
        </section>
      </BlurFade>

      <BlurFade>
        <section>
          <ExperienceTimeline :items="store.experience" title="Experience" />
        </section>
      </BlurFade>

      <BlurFade>
        <section>
          <div class="space-y-6">
            <h2 class="text-2xl font-bold flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <GraduationCap class="w-5 h-5 text-primary" />
              </div>
              Education
            </h2>

            <div class="grid gap-4">
              <Card
                v-for="edu in store.education"
                :key="edu.company"
                class="overflow-hidden"
              >
                <CardContent class="p-5">
                  <div class="flex items-start gap-4">
                    <div
                      class="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0"
                    >
                      <img
                        v-if="edu.logoPath"
                        :alt="edu.company"
                        class="w-full h-full object-cover"
                        :src="edu.logoPath"
                      />
                      <GraduationCap
                        v-else
                        class="w-6 h-6 text-muted-foreground"
                      />
                    </div>
                    <div>
                      <h3 class="font-semibold">
                        {{ edu.title }}
                      </h3>
                      <p class="text-muted-foreground">
                        {{ edu.company }}
                      </p>
                      <p class="text-sm text-muted-foreground mt-1">
                        {{ edu.description }}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </BlurFade>

      <BlurFade>
        <section class="space-y-6">
          <h2 class="text-2xl font-bold flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10">
              <Heart class="w-5 h-5 text-primary" />
            </div>
            Recommendations
          </h2>

          <div class="grid md:grid-cols-2 gap-4">
            <a
              v-for="rec in store.recommendations"
              :key="rec.name"
              class="block cursor-pointer"
              :href="rec.linkedInUrl"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Card
                class="overflow-hidden h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <CardContent class="p-5">
                  <blockquote class="space-y-3">
                    <p
                      class="text-sm text-muted-foreground italic leading-relaxed"
                    >
                      "{{ rec.text }}"
                    </p>
                    <footer class="text-sm">
                      <strong class="text-foreground">{{ rec.name }}</strong>
                      <span class="text-muted-foreground">
                        - {{ rec.title }}</span
                      >
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            </a>
          </div>
        </section>
      </BlurFade>
    </main>

    <footer class="border-t mt-16">
      <div class="container max-w-5xl mx-auto px-4 py-8">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} Andres Janes. Built with Vue
            3, TypeScript & Tailwind CSS 4.
          </p>
          <a
            class="hover:text-foreground transition-colors"
            href="https://github.com/ajanes93/andresjanes.github.io"
            rel="noopener noreferrer"
            target="_blank"
          >
            View Source
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Download, GraduationCap, Heart } from "lucide-vue-next";

import AiSummary from "@/components/AiSummary.vue";
import ExperienceTimeline from "@/components/ExperienceTimeline.vue";
import LLMHotlinks from "@/components/LLMHotlinks.vue";
import ProfileHero from "@/components/ProfileHero.vue";
import SkillsSection from "@/components/SkillsSection.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";
import { BlurFade, Button, Card, CardContent } from "@/components/ui";
import { useCvGenerator } from "@/composables/useCvGenerator";
import { useProfileStore } from "@/stores/profile";

const store = useProfileStore();
const { generateCv } = useCvGenerator();

function downloadCv(): void {
  generateCv({ profile: store.$state });
}
</script>
