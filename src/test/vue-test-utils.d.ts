import type { DOMWrapper } from "@vue/test-utils";

declare module "@vue/test-utils" {
  interface VueWrapper {
    findAllByAria<T extends HTMLElement = HTMLElement>(
      selector: string
    ): DOMWrapper<T>[];
    findAllByTestId<T extends Element = Element>(
      selector: string
    ): DOMWrapper<T>[];
    findByAria<T extends HTMLElement = HTMLElement>(
      selector: string
    ): DOMWrapper<T>;
    findByTestId<T extends Element = Element>(
      selector: string
    ): DOMWrapper<T>;
  }
}
