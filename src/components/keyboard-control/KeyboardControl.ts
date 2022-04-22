import { boundMethod } from 'autobind-decorator';
import './keyboard-control.scss';

interface Options {
  keyStepOne?: number | null;
  keyStepHold?: number | null;
}

class KeyboardControl {
  private element: Element;

  private keyStepOne: HTMLInputElement | null = null;

  private keyStepHold: HTMLInputElement | null = null;

  private keyStepOneCache: number = 0;

  private keyStepHoldCache: number = 0;

  private nameClass: string = '';

  private objRangeSlider: any;

  private mapInput: Map<string, string> | null = null;

  constructor(nameClass: string, element: Element) {
    this.nameClass = nameClass;
    this.element = element;
    this.setDomElement();
  }

  setData(options: Options) {
    const { keyStepOne, keyStepHold } = options;

    if (this.keyStepOneCache !== keyStepOne && this.keyStepOne) {
      this.keyStepOne.value = String(keyStepOne);
      this.keyStepOneCache = keyStepOne ?? 0;
    }

    if (this.keyStepHoldCache !== keyStepHold && this.keyStepHold) {
      this.keyStepHold.value = String(keyStepHold);
      this.keyStepHoldCache = keyStepHold ?? 0;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  bindEvent(rangeSlider: any) {
    this.objRangeSlider = rangeSlider;

    this.mapInput = new Map();

    this.mapInput.set(
      'keyStepOne',
      (this.keyStepOne && this.keyStepOne.value) ?? '',
    );
    this.mapInput.set(
      'keyStepHold',
      (this.keyStepHold && this.keyStepHold.value) ?? '',
    );

    [this.keyStepOne, this.keyStepHold].forEach((item) => {
      if (!item) return;
      item.addEventListener('change', this.handleDataChange);
      item.addEventListener('input', this.handleInputProcessing);
    });
  }

  @boundMethod
  private handleDataChange(event: Event) {
    if (!this.mapInput) return false;
    const element = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      [element.name]: Number(this.mapInput.get(element.name)),
    });
    return true;
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value.replace(/[^-.\d]/g, '');
    const regexp = /^-?\d*?[.]?\d*$/;

    if (!this.mapInput) return false;

    if (regexp.test(value)) {
      this.mapInput.set(element.name, value);
      element.value = value;
    } else {
      element.value = this.mapInput.get(element.name) ?? '';
    }

    return true;
  }

  private getDomElement(string: string) {
    return this.element.querySelector(
      `${this.nameClass}__${string}-wrap input`,
    ) as HTMLInputElement;
  }

  private setDomElement() {
    this.keyStepOne = this.getDomElement('one');
    this.keyStepHold = this.getDomElement('hold');
  }
}

export default KeyboardControl;
