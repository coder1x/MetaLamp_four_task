/* eslint no-unused-vars: off */

interface EventListenerOptions {
  capture?: boolean;
}
interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}
interface EventListener {
  (evt: Event): void;
}
interface EventListenerObject {
  handleEvent(object: Event): void;
}
type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

interface addEvent {
  addEventListener<K>(type: K,
    listener: (this: HTMLElement,
      ev: [K]) => any,
    options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions): void;
}


interface ChildNode extends Node {
}

interface ParentNode extends Node {
}

//-------------------------------------------------



interface RangeSliderOptions {
  readonly type?: string;
  readonly orientation?: string;
  readonly theme?: string;
  readonly min?: number;
  readonly max?: number;
  readonly from?: number;
  readonly to?: number;
  readonly step?: number,
  readonly keyStepOne?: number,
  readonly keyStepHold?: number,
  readonly bar?: boolean;
  readonly grid?: boolean;
  readonly gridSnap?: boolean;
  readonly tipPrefix?: string;
  readonly tipPostfix?: string;
  readonly tipMinMax?: boolean;
  readonly tipFromTo?: boolean;
  readonly gridNum?: number;
  readonly gridStep?: number;
  readonly gridRound?: number;
  readonly disabled?: boolean;
  readonly onStart?: Function;
  readonly onChange?: Function;
  readonly onUpdate?: Function;
  readonly onReset?: Function;
}




interface HInput extends Element, addEvent {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
}

interface HInputEv extends EventTarget {
  value?: string;
  checked?: boolean;
  name?: string;
}



interface HElem extends Element, addEvent {
  style?: CSSStyleDeclaration;
  className: string;
  offsetWidth?: number;
  offsetHeight?: number;
  innerText?: string;
  setPointerCapture: (pointerId: number) => void;
  releasePointerCapture: (pointerId: number) => void;
  dispatchEvent: (event: Event) => boolean;
}


interface HCElem extends ChildNode {
  className?: string;
  children?: HTMLCollection;
  style?: CSSStyleDeclaration;
  innerText?: string;
}

interface HTElem extends EventTarget {
  className?: string;
  children?: HTMLCollection;
  innerText?: string;
  getAttribute?(qualifiedName: string): string | null;
  closest?<Element>(selectors: string): Element;
}


interface HPElem extends ParentNode {
  style?: CSSStyleDeclaration;
}


export {
  RangeSliderOptions,
  HInput,
  HElem,
  HCElem,
  HTElem,
  HPElem,
  HInputEv
};