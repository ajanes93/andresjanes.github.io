<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 via-blue-600 to-cyan-500 p-1"
  >
    <div class="relative bg-background rounded-xl p-6 md:p-8">
      <div
        class="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent"
      />

      <div
        class="relative flex flex-col md:flex-row gap-6 items-center md:items-start"
      >
        <div class="relative">
          <div
            class="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50"
          />
          <Avatar
            class="w-28 h-28 md:w-32 md:h-32 ring-4 ring-background relative"
          >
            <AvatarImage :alt="name" :src="avatarPath" />
            <AvatarFallback
              class="text-2xl font-bold bg-linear-to-br from-blue-500 to-cyan-500 text-white"
            >
              {{
                name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              }}
            </AvatarFallback>
          </Avatar>
        </div>

        <div class="flex-1 text-center md:text-left space-y-4">
          <div>
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <h1 class="text-3xl md:text-4xl font-bold gradient-text">
                {{ name }}
              </h1>
              <Badge class="w-fit mx-auto md:mx-0" variant="secondary">
                {{ pronouns }}
              </Badge>
            </div>
            <p class="text-xl text-muted-foreground mt-1">
              {{ title }}
            </p>
          </div>

          <div
            class="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground"
          >
            <span class="flex items-center gap-1.5">
              <Building2 class="w-4 h-4" />
              {{ company }}
            </span>
            <span class="flex items-center gap-1.5">
              <MapPin class="w-4 h-4" />
              {{ location }}
            </span>
            <span class="flex items-center gap-1.5">
              <Clock class="w-4 h-4" />
              {{ yearsExperience }} years experience
            </span>
            <span class="flex items-center gap-1.5">
              <Languages class="w-4 h-4" />
              {{ languages.map((l) => l.name).join(", ") }}
            </span>
          </div>

          <div class="flex justify-center md:justify-start gap-2">
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
                  social.href.startsWith('mailto')
                    ? undefined
                    : 'noopener noreferrer'
                "
                :target="
                  social.href.startsWith('mailto') ? undefined : '_blank'
                "
              >
                <component :is="getSocialIcon(social.icon)" class="w-4 h-4" />
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
import type { Component } from "vue";

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

defineProps<Props>();

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
