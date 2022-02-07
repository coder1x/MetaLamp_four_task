import './keyboard-control.scss';


interface OP {
  keyStepOne?: number;
  keyStepHold?: number;
}


class KeyboardControl {

  private elem: Element;
  private keyStepOne: HTMLInputElement;
  private keyStepHold: HTMLInputElement;
  private keyStepOneD: number;
  private keyStepHoldD: number;
  private nameClass: string;


  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: OP) {
    const { keyStepOne, keyStepHold } = options;

    if (this.keyStepOneD != keyStepOne) {
      this.keyStepOne.value = String(keyStepOne);
      this.keyStepOneD = keyStepOne;
    }

    if (this.keyStepHoldD != keyStepHold) {
      this.keyStepHold.value = String(keyStepHold);
      this.keyStepHoldD = keyStepHold;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {

    let mapInput = new Map();
    mapInput.set('keyStepOne', this.keyStepOne.value);
    mapInput.set('keyStepHold', this.keyStepHold.value);

    const data = (e: Event) => {
      const elem = e.target;
      if (elem instanceof HTMLInputElement)
        obj.update({
          [elem.name]: +mapInput.get(elem.name)
        });
    };

    const inputProcessing = (e: Event) => {
      const elem = e.target;
      if (elem instanceof HTMLInputElement) {
        let val = elem.value.replace(/[^-.\d]/g, '');
        let regexp = /^-?\d*?[.]?\d*$/;
        const valid = regexp.test(val);

        if (valid) {
          mapInput.set(elem.name, val);
          elem.value = val;
        } else {
          elem.value = mapInput.get(elem.name);
        }
      }
    };

    const masE = [this.keyStepOne, this.keyStepHold];

    for (let item of masE) {
      item.addEventListener('change', data);
      item.addEventListener('input', inputProcessing);
    }
  }

  private setDom() {
    const getDom = (str: string): HTMLInputElement => {
      return this.elem.querySelector(
        this.nameClass +
        '__' +
        str +
        '-wrap input'
      );
    };

    this.keyStepOne = getDom('one');
    this.keyStepHold = getDom('hold');
  }

}




export { KeyboardControl };
