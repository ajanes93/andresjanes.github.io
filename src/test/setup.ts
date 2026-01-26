import { config, type DOMWrapper, VueWrapper } from "@vue/test-utils";

// Stub common components that are hard to test
config.global.stubs = {
  // Add any global stubs here
};

// Extend VueWrapper with helper methods
VueWrapper.prototype.findByTestId = function <T extends Node = Node>(
  selector: string
): DOMWrapper<T> {
  return this.find<T>(`[data-testid="${selector}"]`);
};

VueWrapper.prototype.findAllByTestId = function <T extends Element = Element>(
  selector: string
): DOMWrapper<T>[] {
  return this.findAll<T>(`[data-testid="${selector}"]`);
};

VueWrapper.prototype.findByAria = function <
  T extends HTMLElement = HTMLElement,
>(selector: string): DOMWrapper<T> {
  return this.find(`[aria-label*="${selector}"]`);
};

VueWrapper.prototype.findAllByAria = function <
  T extends HTMLElement = HTMLElement,
>(selector: string): DOMWrapper<T>[] {
  return this.findAll(`[aria-label*="${selector}"]`);
};

VueWrapper.prototype.findComponentByTestId = function <T>(
  selector: string
): VueWrapper<T> {
  return this.findComponent(`[data-testid="${selector}"]`) as VueWrapper<T>;
};

VueWrapper.prototype.findAllComponentsByTestId = function <T>(
  selector: string
): VueWrapper<T>[] {
  return this.findAllComponents(
    `[data-testid="${selector}"]`
  ) as VueWrapper<T>[];
};

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {}

  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = mockUnobserve;
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  configurable: true,
  value: MockIntersectionObserver,
  writable: true,
});

// Mock matchMedia - needs to be a function that returns the mock result
const createMatchMediaMock = () => {
  return (query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  });
};

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: createMatchMediaMock(),
  writable: true,
});
