import './values.scss';
import {
  HInput,
  HInputEv,
  HElem
} from '../../plugins/range-slider-fox/glob-interface';

interface OP {
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
}


class Values {

  private elem: HElem;
  private min: HInput;
  private max: HInput;
  private from: HInput;
  private to: HInput;
  private step: HInput;

  private minD: number;
  private maxD: number;
  private fromD: number;
  private toD: number;
  private stepD: number;
  private nameClass: string;


  constructor(nameClass: string, elem: HElem) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: OP) {
    const { min, max, from, to, step } = options;

    if (this.minD != min) {
      this.min.value = String(min);
      this.minD = min;
    }

    if (this.maxD != max) {
      this.max.value = String(max);
      this.maxD = max;
    }

    if (this.fromD != from) {
      this.from.value = String(from);
      this.fromD = from;
    }

    if (this.toD != to) {
      this.to.value = String(to);
      this.toD = to;
    }

    if (this.stepD != step) {
      this.step.value = String(step);
      this.stepD = step;
    }
  }


  setAction(obj: any) {
    let mapInput = new Map();
    mapInput.set('min', this.min.value);
    mapInput.set('max', this.max.value);
    mapInput.set('from', this.from.value);
    mapInput.set('to', this.to.value);
    mapInput.set('step', this.step.value);

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

    const masE = [this.min, this.max, this.from, this.to, this.step];
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

    this.min = getDom('min');
    this.max = getDom('max');
    this.from = getDom('from');
    this.to = getDom('to');
    this.step = getDom('step');
  }

}





export { Values };
