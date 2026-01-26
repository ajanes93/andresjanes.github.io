<template>
  <div class="space-y-6">
    <h2 class="flex items-center gap-3 text-2xl font-bold">
      <div class="bg-primary/10 rounded-lg p-2">
        <Briefcase class="text-primary size-5" />
      </div>
      {{ title }}
    </h2>

    <TracingBeam>
      <div class="space-y-6">
        <div
          v-for="item in sortedItems"
          :key="`${item.company}-${item.startDate}`"
          class="relative"
        >
          <!-- Timeline dot indicator - filled for current role, centered on the beam line (beam at 19px + 2px center = 21px, circle 12px wide, so 21-6=15px) -->
          <div
            class="border-primary bg-background absolute top-6 left-3.75 z-10 hidden size-3  rounded-full border-2 md:block"
            :class="{ 'bg-primary': !item.endDate }"
          />
          <Card
            class="overflow-hidden transition-shadow duration-300 hover:shadow-md md:ml-12"
          >
            <div class="p-5">
              <div class="flex flex-col gap-4 md:flex-row md:items-start">
                <div
                  class="bg-muted flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                >
                  <img
                    v-if="item.logoPath"
                    :alt="item.company"
                    class="h-full w-full object-cover"
                    data-testid="company-logo"
                    :src="item.logoPath"
                  />
                  <Briefcase
                    v-else
                    class="text-muted-foreground size-6"
                  />
                </div>

                <div class="min-w-0 flex-1">
                  <div
                    class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 class="text-lg font-semibold">
                        {{ item.title }}
                      </h3>
                      <p class="text-muted-foreground font-medium">
                        {{ item.company }}
                      </p>
                    </div>
                    <Badge
                      v-if="!item.endDate"
                      class="w-fit"
                      variant="default"
                    >
                      Current
                    </Badge>
                  </div>

                  <div
                    class="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-sm"
                  >
                    <span class="flex items-center gap-1">
                      <Calendar class="size-4" />
                      {{ formatDate(item.startDate) }} -
                      {{ item.endDate ? formatDate(item.endDate) : "Present" }}
                      <span class="text-xs"
                        >({{
                          calculateDuration(item.startDate, item.endDate)
                        }})</span
                      >
                    </span>
                    <span class="flex items-center gap-1">
                      <MapPin class="size-4" />
                      {{ item.location }}
                    </span>
                  </div>

                  <p class="text-muted-foreground mt-3 text-sm/relaxed">
                    {{ item.description }}
                  </p>

                  <div
                    v-if="item.skills?.length"
                    class="mt-3 flex flex-wrap gap-2"
                  >
                    <Badge
                      v-for="skill in item.skills"
                      :key="skill"
                      variant="secondary"
                    >
                      {{ skill }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TracingBeam>
  </div>
</template>

<script setup lang="ts">
import { Briefcase, Calendar, MapPin } from "lucide-vue-next";
import { computed } from "vue";

import { Badge, Card, TracingBeam } from "@/components/ui";
import type { ExperienceItem } from "@/stores/profile";

interface Props {
  items: ExperienceItem[];
  title: string;
}

const props = defineProps<Props>();

/**
 * Parses an ISO date string (YYYY-MM-DD) consistently across browsers.
 * Creates date at noon local time to avoid timezone issues.
 */
function parseISODate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day, 12, 0, 0);
}

function formatDate(dateString: string): string {
  const date = parseISODate(dateString);

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function pluralize(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`;
}

function calculateDuration(start: string, end?: string): string {
  const startDate = parseISODate(start);
  const endDate = end ? parseISODate(end) : new Date();

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth();

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) return `${months} ${pluralize(months, "mo")}`;
  if (months === 0) return `${years} ${pluralize(years, "yr")}`;

  return `${years} ${pluralize(years, "yr")} ${months} ${pluralize(months, "mo")}`;
}

const sortedItems = computed<ExperienceItem[]>(() => {
  return [...props.items].sort(
    (a, b) =>
      parseISODate(b.startDate).getTime() - parseISODate(a.startDate).getTime()
  );
});
</script>
