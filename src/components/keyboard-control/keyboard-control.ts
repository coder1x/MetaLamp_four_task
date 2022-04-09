import { boundMethod } from 'autobind-decorator';
import './keyboard-control.scss';

interface Options {
  keyStepOne?: number;
  keyStepHold?: number;
}

class KeyboardControl {
  private elem: Element;

  private keyStepOne: HTMLInputElement;

  private keyStepHold: HTMLInputElement;

  private keyStepOneCache: number;

  private keyStepHoldCache: number;

  private nameClass: string;

  private objRangeSlider: any;

  private mapInput: Map<string, string>

  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: Options) {
    const { keyStepOne, keyStepHold } = options;

    if (this.keyStepOneCache !== keyStepOne) {
      this.keyStepOne.value = String(keyStepOne);
      this.keyStepOneCache = keyStepOne;
    }

    if (this.keyStepHoldCache !== keyStepHold) {
      this.keyStepHold.value = String(keyStepHold);
      this.keyStepHoldCache = keyStepHold;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    this.objRangeSlider = obj;

    this.mapInput = new Map();
    this.mapInput.set('keyStepOne', this.keyStepOne.value);
    this.mapInput.set('keyStepHold', this.keyStepHold.value);

    const inputElements = [this.keyStepOne, this.keyStepHold];

    inputElements.forEach((item) => {
      item.addEventListener('change', this.handleDataChange);
      item.addEventListener('input', this.handleInputProcessing);
    });
  }

  @boundMethod
  private handleDataChange(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      [elem.name]: +this.mapInput.get(elem.name),
    });
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value.replace(/[^-.\d]/g, '');
    const regexp = /^-?\d*?[.]?\d*$/;
    const valid = regexp.test(value);

    if (valid) {
      this.mapInput.set(elem.name, value);
      elem.value = value;
    } else {
      elem.value = this.mapInput.get(elem.name);
    }
  }

  private setDom() {
    const getDom = (str: string): HTMLInputElement => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    );

    this.keyStepOne = getDom('one');
    this.keyStepHold = getDom('hold');
  }
}

export default KeyboardControl;
