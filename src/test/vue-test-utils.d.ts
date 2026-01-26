import type { DOMWrapper } from "@vue/test-utils";

declare module "@vue/test-utils" {
  interface VueWrapper {
    findAllByAria<T extends HTMLElement = HTMLElement>(
      selector: string
    ): DOMWrapper<T>[];
    findByAria<T extends HTMLElement = HTMLElement>(
      selector: string
    ): DOMWrapper<T>;
    findByTestId<T extends Node = Node>(selector: string): DOMWrapper<T>;
    findAllByTestId<T extends Node = Node>(selector: string): DOMWrapper<T>[];
  }
}
