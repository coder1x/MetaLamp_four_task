import './keyboard-control.scss';
import {
  HInput,
  HInputEv,
  HElem
} from '../../plugins/range-slider-fox/glob-interface';

interface OP {
  keyStepOne?: number;
  keyStepHold?: number;
}


class KeyboardControl {

  private elem: HElem;
  private keyStepOne: HInput;
  private keyStepHold: HInput;
  private keyStepOneD: number;
  private keyStepHoldD: number;
  private nameClass: string;


  constructor(nameClass: string, elem: HElem) {
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


  setAction(obj: any) {

    let mapInput = new Map();
    mapInput.set('keyStepOne', this.keyStepOne.value);
    mapInput.set('keyStepHold', this.keyStepHold.value);

    const data = (e: Event) => {
      const elem: HInputEv = e.target;
      obj.update({
        [elem.name]: +mapInput.get(elem.name)
      });
    };

    const inputProcessing = (e: Event) => {
      const elem: HInputEv = e.target;
      let val = elem.value.replace(/[^-.\d]/g, '');
      let regexp = /^-?\d*?[.]?\d*$/;
      const valid = regexp.test(val);

      if (valid) {
        mapInput.set(elem.name, val);
        elem.value = val;
      } else {
        elem.value = mapInput.get(elem.name);
      }
    };

    const masE = [this.keyStepOne, this.keyStepHold];

    for (let item of masE) {
      item.addEventListener('change', data);
      item.addEventListener('input', inputProcessing);
    }
  }

  private setDom() {
    const getDom = (str: string) => {
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
