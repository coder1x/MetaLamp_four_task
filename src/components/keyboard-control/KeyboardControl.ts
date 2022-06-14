import { boundMethod } from 'autobind-decorator';

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

  private fieldValues: Map<string, string> | null = null;

  constructor(nameClass: string, element: Element) {
    this.nameClass = nameClass;
    this.element = element;
    this.setDomElement();
  }

  setData(options: Options) {
    const { keyStepOne, keyStepHold } = options;

    let isNewData = this.keyStepOneCache !== keyStepOne;

    if (isNewData && this.keyStepOne) {
      this.keyStepOne.value = String(keyStepOne);
      this.keyStepOneCache = keyStepOne ?? 0;
    }

    isNewData = this.keyStepHoldCache !== keyStepHold;

    if (isNewData && this.keyStepHold) {
      this.keyStepHold.value = String(keyStepHold);
      this.keyStepHoldCache = keyStepHold ?? 0;
    }
  }

  bindEvent<T>(rangeSlider: T) {
    this.objRangeSlider = rangeSlider;

    this.fieldValues = new Map();

    this.fieldValues.set(
      'keyStepOne',
      (this.keyStepOne && this.keyStepOne.value) ?? '',
    );
    this.fieldValues.set(
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
    if (!this.fieldValues) return false;
    const element = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      [element.name]: Number(this.fieldValues.get(element.name)),
    });
    return true;
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value.replace(/[^-.\d]/g, '');
    const REGEXP = /^-?\d*?[.]?\d*$/;

    if (!this.fieldValues) return false;

    if (REGEXP.test(value)) {
      this.fieldValues.set(element.name, value);
      element.value = value;
    } else {
      element.value = this.fieldValues.get(element.name) ?? '';
    }

    return true;
  }

  private getDomElement(nameElement: string) {
    return this.element.querySelector(
      `${this.nameClass}__${nameElement}-wrapper input`,
    ) as HTMLInputElement;
  }

  private setDomElement() {
    this.keyStepOne = this.getDomElement('one');
    this.keyStepHold = this.getDomElement('hold');
  }
}

export default KeyboardControl;
