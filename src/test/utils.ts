import type { ComponentMountingOptions, VueWrapper } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import type { Component } from "vue";

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

/**
 * Mount a component with default options and return wrapper
 */
export function mountComponent<T extends Component>(
  component: T,
  options: RenderOptions<T> = {}
) {
  return mount(component, options as ComponentMountingOptions<T>);
}

/**
 * Wait for the next tick and DOM updates
 */
export async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
