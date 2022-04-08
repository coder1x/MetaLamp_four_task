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
    const mapInput = new Map();
    mapInput.set('keyStepOne', this.keyStepOne.value);
    mapInput.set('keyStepHold', this.keyStepHold.value);

    const data = (event: Event) => {
      const elem = event.target as HTMLInputElement;

      obj.update({
        [elem.name]: +mapInput.get(elem.name),
      });
    };

    const inputProcessing = (event: Event) => {
      const elem = event.target as HTMLInputElement;
      const value = elem.value.replace(/[^-.\d]/g, '');
      const regexp = /^-?\d*?[.]?\d*$/;
      const valid = regexp.test(value);

      if (valid) {
        mapInput.set(elem.name, value);
        elem.value = value;
      } else {
        elem.value = mapInput.get(elem.name);
      }
    };

    const inputElements = [this.keyStepOne, this.keyStepHold];

    inputElements.forEach((item) => {
      item.addEventListener('change', data);
      item.addEventListener('input', inputProcessing);
    });
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
