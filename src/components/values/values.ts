import './values.scss';

interface OP {
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
}


class Values {

  private elem: HTMLElement;
  private min: HTMLInputElement;
  private max: HTMLInputElement;
  private from: HTMLInputElement;
  private to: HTMLInputElement;
  private step: HTMLInputElement;

  private minD: number;
  private maxD: number;
  private fromD: number;
  private toD: number;
  private stepD: number;


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

    this.min = getDom('min');
    this.max = getDom('max');
    this.from = getDom('from');
    this.to = getDom('to');
    this.step = getDom('step');
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


    const masE = [this.min, this.max, this.from, this.to, this.step];

    for (let item of masE) {
      item.addEventListener('change', data);
      item.addEventListener('input', inputProcessing);
    }

  }

}





export { Values };
