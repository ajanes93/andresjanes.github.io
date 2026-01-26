<template>
  <div class="bg-background min-h-screen">
    <a
      class="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2 focus:outline-none"
      href="#main-content"
    >
      Skip to main content
    </a>
    <header class="glass sticky top-0 z-50 border-b">
      <div
        class="container mx-auto flex max-w-5xl items-center justify-between px-4 py-3"
      >
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500"
          >
            <span class="text-sm font-bold text-white">AJ</span>
          </div>
          <span class="hidden font-semibold sm:inline">andresjanes.com</span>
        </div>

        <div class="flex items-center gap-2">
          <Button
            aria-label="Download CV as PDF"
            class="hidden items-center gap-2 sm:inline-flex"
            size="sm"
            variant="outline"
            @click="downloadCv"
          >
            <Download
              aria-hidden="true"
              class="h-4 w-4"
            />
            <span>Download CV</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main
      id="main-content"
      class="container mx-auto max-w-5xl space-y-12 px-4 py-8"
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
          <ExperienceTimeline
            :items="store.experience"
            title="Experience"
          />
        </section>
      </BlurFade>

      <BlurFade>
        <section>
          <div class="space-y-6">
            <h2 class="flex items-center gap-3 text-2xl font-bold">
              <div class="bg-primary/10 rounded-lg p-2">
                <GraduationCap class="text-primary h-5 w-5" />
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
                      class="bg-muted flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                    >
                      <img
                        v-if="edu.logoPath"
                        :alt="edu.company"
                        class="h-full w-full object-cover"
                        :src="edu.logoPath"
                      />
                      <GraduationCap
                        v-else
                        class="text-muted-foreground h-6 w-6"
                      />
                    </div>
                    <div>
                      <h3 class="font-semibold">
                        {{ edu.title }}
                      </h3>
                      <p class="text-muted-foreground">
                        {{ edu.company }}
                      </p>
                      <p class="text-muted-foreground mt-1 text-sm">
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
          <h2 class="flex items-center gap-3 text-2xl font-bold">
            <div class="bg-primary/10 rounded-lg p-2">
              <Heart class="text-primary h-5 w-5" />
            </div>
            Recommendations
          </h2>

          <div class="grid gap-4 md:grid-cols-2">
            <a
              v-for="rec in store.recommendations"
              :key="rec.name"
              class="block cursor-pointer"
              :href="rec.linkedInUrl"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Card
                class="h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent class="p-5">
                  <blockquote class="space-y-3">
                    <p
                      class="text-muted-foreground text-sm leading-relaxed italic"
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

    <footer class="mt-16 border-t">
      <div class="container mx-auto max-w-5xl px-4 py-8">
        <div
          class="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row"
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
