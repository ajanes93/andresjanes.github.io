import type { DOMWrapper } from "@vue/test-utils";
import type { DefinedComponent, RefSelector } from "@vue/test-utils/dist/types";

declare module "@vue/test-utils" {
  interface VueWrapper {
    findAllByAria<T extends HTMLElement = HTMLElement>(
      selector: string
    ): DOMWrapper<T>[];
    findAllByTestId<T extends Element = Element>(
      selector: string | RefSelector
    ): DOMWrapper<T>[];
    findAllComponentsByTestId<T extends DefinedComponent>(
      selector: string
    ): VueWrapper<InstanceType<T>>[];
    findByAria<T extends HTMLElement = HTMLElement>(
      selector: string
    ): DOMWrapper<T>;
    findByTestId<T extends Node = Node>(
      selector: string | RefSelector
    ): DOMWrapper<T>;
    findComponentByTestId<T extends DefinedComponent>(
      selector: string
    ): VueWrapper<InstanceType<T>>;
  }
}
