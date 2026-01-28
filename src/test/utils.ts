import type { ComponentMountingOptions, VueWrapper } from "@vue/test-utils";

/**
 * RenderOptions type for Vue Test Utils mounting options
 * Maintains all original ComponentMountingOptions properties
 * Makes all props optional while preserving their types
 * Keeps global mounting options, slots, attrs and other properties intact
 */
export type RenderOptions<T> = {
  [K in keyof ComponentMountingOptions<T>]: K extends "props"
    ? Partial<ComponentMountingOptions<T>["props"]>
    : ComponentMountingOptions<T>[K];
};

/**
 * Helper to find elements by data-testid attribute
 */
export function findByTestId(wrapper: VueWrapper, testId: string) {
  return wrapper.find(`[data-testid="${testId}"]`);
}
