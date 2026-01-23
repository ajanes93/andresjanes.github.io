<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'
import ProfileHero from '@/components/ProfileHero.vue'
import AiChatSummary from '@/components/AiChatSummary.vue'
import LLMHotlinks from '@/components/LLMHotlinks.vue'
import ExperienceTimeline from '@/components/ExperienceTimeline.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { GraduationCap, Download, Heart } from 'lucide-vue-next'
import { Button, Card, CardContent } from '@/components/ui'

const store = useProfileStore()
</script>

<template>
    <div class="min-h-screen bg-background">
        <!-- Header -->
        <header class="sticky top-0 z-50 glass border-b">
            <div class="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                    >
                        <span class="text-white font-bold text-sm">AJ</span>
                    </div>
                    <span class="font-semibold hidden sm:inline">andresjanes.com</span>
                </div>

                <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" as-child class="hidden sm:flex">
                        <a href="/doc/cv_andres_janes.pdf" download="cv_andres_janes.pdf">
                            <Download class="w-4 h-4 mr-2" />
                            Download CV
                        </a>
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container max-w-5xl mx-auto px-4 py-8 space-y-12">
            <!-- Profile Hero -->
            <section>
                <ProfileHero
                    :name="store.name"
                    :title="store.title"
                    :company="store.company"
                    :location="store.location"
                    :years-experience="store.yearsExperience"
                    :pronouns="store.pronouns"
                    :languages="store.languages"
                    :socials="store.socials"
                />
            </section>

            <!-- AI Summary Section -->
            <section class="space-y-6">
                <div class="text-center space-y-2">
                    <h2 class="text-2xl font-bold">
                        <span class="gradient-text">AI-Powered</span> Profile Summary
                    </h2>
                    <p class="text-muted-foreground max-w-2xl mx-auto">
                        Get an instant overview of this candidate's background, or use one of the AI assistants below for deeper analysis.
                    </p>
                </div>

                <AiChatSummary :summary="store.summary" />
            </section>

            <!-- LLM Hotlinks -->
            <section>
                <LLMHotlinks :providers="store.llmProviders" :prompt="store.getCandidateSummaryPrompt" />
            </section>

            <!-- Skills Section -->
            <section>
                <SkillsSection :skills="store.skills" />
            </section>

            <!-- Experience Section -->
            <section>
                <ExperienceTimeline :items="store.experience" title="Experience" />
            </section>

            <!-- Education Section -->
            <section>
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-primary/10">
                            <GraduationCap class="w-5 h-5 text-primary" />
                        </div>
                        Education
                    </h2>

                    <div class="grid gap-4">
                        <Card v-for="edu in store.education" :key="edu.company" class="overflow-hidden">
                            <CardContent class="p-5">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0"
                                    >
                                        <img
                                            v-if="edu.logoPath"
                                            :src="edu.logoPath"
                                            :alt="edu.company"
                                            class="w-full h-full object-cover"
                                        />
                                        <GraduationCap v-else class="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 class="font-semibold">{{ edu.title }}</h3>
                                        <p class="text-muted-foreground">{{ edu.company }}</p>
                                        <p class="text-sm text-muted-foreground mt-1">{{ edu.description }}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <!-- Recommendations Section -->
            <section class="space-y-6">
                <h2 class="text-2xl font-bold flex items-center gap-3">
                    <div class="p-2 rounded-lg bg-primary/10">
                        <Heart class="w-5 h-5 text-primary" />
                    </div>
                    Recommendations
                </h2>

                <div class="grid md:grid-cols-2 gap-4">
                    <Card v-for="rec in store.recommendations" :key="rec.name" class="overflow-hidden">
                        <CardContent class="p-5">
                            <blockquote class="space-y-3">
                                <p class="text-sm text-muted-foreground italic leading-relaxed">
                                    "{{ rec.text }}"
                                </p>
                                <footer class="text-sm">
                                    <strong class="text-foreground">{{ rec.name }}</strong>
                                    <span class="text-muted-foreground"> - {{ rec.title }}</span>
                                </footer>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="border-t mt-16">
            <div class="container max-w-5xl mx-auto px-4 py-8">
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>&copy; {{ new Date().getFullYear() }} Andres Janes. Built with Vue 3, TypeScript & Tailwind CSS.</p>
                    <div class="flex items-center gap-4">
                        <a
                            href="https://github.com/ajanes93/andresjanes.github.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="hover:text-foreground transition-colors"
                        >
                            View Source
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>
