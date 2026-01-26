<template>
  <div class="space-y-4">
    <h2 class="flex items-center gap-3 text-2xl font-bold">
      <div class="bg-primary/10 rounded-lg p-2">
        <Code2 class="text-primary h-5 w-5" />
      </div>
      Technical Skills
    </h2>

    <div class="flex flex-wrap gap-2">
      <Badge
        v-for="skill in sortedSkills"
        :key="skill"
        class="cursor-default px-3 py-1.5 text-sm transition-transform hover:scale-105"
        :variant="getSkillCategory(skill)"
      >
        {{ skill }}
      </Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Code2 } from "lucide-vue-next";
import { computed } from "vue";

import { Badge } from "@/components/ui";
import {
  SKILL_CATEGORIES,
  SKILL_VARIANT_ORDER,
  type SkillVariant,
} from "@/lib/constants";

interface Props {
  skills: string[];
}

const props = defineProps<Props>();

function getSkillCategory(skill: string): SkillVariant {
  if (SKILL_CATEGORIES.PRIMARY.some((s): boolean => skill.includes(s)))
    return "default";
  if (SKILL_CATEGORIES.SECONDARY.some((s): boolean => skill.includes(s)))
    return "secondary";

  return "outline";
}

// Sort skills so highlighted ones appear first
const sortedSkills = computed<string[]>(() => {
  return [...props.skills].sort((a: string, b: string): number => {
    const aCategory = getSkillCategory(a);
    const bCategory = getSkillCategory(b);

    return SKILL_VARIANT_ORDER[aCategory] - SKILL_VARIANT_ORDER[bCategory];
  });
});
</script>
