import { boundMethod } from 'autobind-decorator';
import './keyboard-control.scss';

interface Options {
  keyStepOne?: number;
  keyStepHold?: number;
}

class KeyboardControl {
  private elem: Element;

  private keyStepOne: HTMLInputElement | null = null;

  private keyStepHold: HTMLInputElement | null = null;

  private keyStepOneCache: number = 0;

  private keyStepHoldCache: number = 0;

  private nameClass: string = '';

  private objRangeSlider: any;

  private mapInput: Map<string, string> | null = null;

  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
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
  setAction(obj: any) {
    this.objRangeSlider = obj;

    this.mapInput = new Map();

    const keyStepOne = (this.keyStepOne && this.keyStepOne.value) ?? '';
    const keyStepHold = (this.keyStepHold && this.keyStepHold.value) ?? '';

    this.mapInput.set('keyStepOne', keyStepOne);
    this.mapInput.set('keyStepHold', keyStepHold);

    const inputElements = [this.keyStepOne, this.keyStepHold];

    inputElements.forEach((item) => {
      if (!item) return;
      item.addEventListener('change', this.handleDataChange);
      item.addEventListener('input', this.handleInputProcessing);
    });
  }

  @boundMethod
  private handleDataChange(event: Event) {
    if (!this.mapInput) return false;
    const elem = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      [elem.name]: Number(this.mapInput.get(elem.name)),
    });
    return true;
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value.replace(/[^-.\d]/g, '');
    const regexp = /^-?\d*?[.]?\d*$/;
    const valid = regexp.test(value);

    if (!this.mapInput) return false;

    if (valid) {
      this.mapInput.set(elem.name, value);
      elem.value = value;
    } else {
      elem.value = this.mapInput.get(elem.name) ?? '';
    }

    return true;
  }

  private setDom() {
    const getDom = (str: string) => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    ) as HTMLInputElement;

    this.keyStepOne = getDom('one');
    this.keyStepHold = getDom('hold');
  }
}

export default KeyboardControl;
