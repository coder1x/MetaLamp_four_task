import './keyboard-control.scss';

interface OP {
  keyStepOne?: number;
  keyStepHold?: number;
}


class KeyboardControl {

  private elem: HTMLElement;
  private keyStepOne: HTMLInputElement;
  private keyStepHold: HTMLInputElement;

  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, elem: HTMLElement) {

    this.elem = elem;
    this.setDom();
  }

  private setDom() {

    const getDom = (str: string) => {
      return this.elem.querySelector(
        this.nameClass +
        '__' +
        str +
        '-wrap input'
      ) as HTMLInputElement;
    };

    this.keyStepOne = getDom('one');
    this.keyStepHold = getDom('hold');

  }


  setData(options: OP) {
    this.keyStepOne.value = String(options.keyStepOne);
    this.keyStepHold.value = String(options.keyStepHold);
  }


  setAction(obj: any) {

    let mapInput = new Map();
    mapInput.set('keyStepOne', this.keyStepOne.value);
    mapInput.set('keyStepHold', this.keyStepHold.value);

    const data = (e: Event) => {
      const elem = e.target as HTMLInputElement;
      obj.update({
        [elem.name]: +mapInput.get(elem.name)
      });
    };

    const inputProcessing = (e: Event) => {
      const elem = e.target as HTMLInputElement;
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

}




export { KeyboardControl };
