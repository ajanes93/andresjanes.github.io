<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 via-blue-600 to-cyan-500 p-1"
  >
    <div class="bg-background relative rounded-xl p-6 md:p-8">
      <div
        class="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-transparent"
      />

      <div
        class="relative flex flex-col items-center gap-6 md:flex-row md:items-start"
      >
        <div class="relative">
          <div
            class="absolute inset-0 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 opacity-50 blur-lg"
          />
          <Avatar class="ring-background relative size-28 ring-4 md:size-32">
            <AvatarImage
              :alt="name"
              :src="avatarPath"
            />
            <AvatarFallback
              class="bg-linear-to-br from-blue-500 to-cyan-500 text-2xl font-bold text-white"
            >
              {{ initials }}
            </AvatarFallback>
          </Avatar>
        </div>

        <div class="flex-1 space-y-4 text-center md:text-left">
          <div>
            <div class="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 class="gradient-text text-3xl font-bold md:text-4xl">
                {{ name }}
              </h1>
              <Badge
                class="mx-auto w-fit md:mx-0"
                variant="secondary"
              >
                {{ pronouns }}
              </Badge>
            </div>
            <p class="text-muted-foreground mt-1 text-xl">
              {{ title }}
            </p>
          </div>

          <div
            class="text-muted-foreground flex flex-wrap justify-center gap-4 text-sm md:justify-start"
          >
            <span class="flex items-center gap-1.5">
              <Building2 class="size-4" />
              {{ company }}
            </span>
            <span class="flex items-center gap-1.5">
              <MapPin class="size-4" />
              {{ location }}
            </span>
            <span class="flex items-center gap-1.5">
              <Clock class="size-4" />
              {{ yearsExperience }} years experience
            </span>
            <span class="flex items-center gap-1.5">
              <Languages class="size-4" />
              {{ languageNames }}
            </span>
          </div>

          <div class="flex justify-center gap-2 md:justify-start">
            <Button
              v-for="social in socials"
              :key="social.name"
              as-child
              size="icon"
              variant="outline"
            >
              <a
                :aria-label="social.name"
                :data-testid="`social-link-${social.icon}`"
                :href="social.href"
                :rel="
                  isMailtoLink(social.href) ? undefined : 'noopener noreferrer'
                "
                :target="isMailtoLink(social.href) ? undefined : '_blank'"
              >
                <component
                  :is="getSocialIcon(social.icon)"
                  class="size-4"
                />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Building2,
  Clock,
  ExternalLink,
  Github,
  Languages,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-vue-next";
import { computed, type Component } from "vue";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
} from "@/components/ui";
import type { SocialLink } from "@/stores/profile";

interface Props {
  avatarPath: string;
  company: string;
  languages: { level: string; name: string }[];
  location: string;
  name: string;
  pronouns: string;
  socials: SocialLink[];
  title: string;
  yearsExperience: string;
}

const props = defineProps<Props>();

const initials = computed<string>(() =>
  props.name
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
);

const languageNames = computed<string>(() =>
  props.languages.map((lang) => lang.name).join(", ")
);

function isMailtoLink(href: string): boolean {
  return href.startsWith("mailto");
}

function getSocialIcon(iconName: string): Component {
  const icons: Record<string, Component> = {
    github: Github,
    gitlab: ExternalLink,
    linkedin: Linkedin,
    mail: Mail,
  };

  return icons[iconName] || ExternalLink;
}
</script>
