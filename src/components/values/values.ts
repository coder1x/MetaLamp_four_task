import './values.scss';

interface OP {
  min?: number;
  max?: number;
  from?: number;
  to?: number;
}


class Values {

  private elem: HTMLElement;
  private min: HTMLInputElement;
  private max: HTMLInputElement;
  private from: HTMLInputElement;
  private to: HTMLInputElement;



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

  }


  setData(options: OP) {
    this.min.value = String(options.min);
    this.max.value = String(options.max);
    this.from.value = String(options.from);
    this.to.value = String(options.to);
  }


  setAction(obj: any) {

    let mapInput = new Map();
    mapInput.set('min', this.min.value);
    mapInput.set('max', this.max.value);
    mapInput.set('from', this.from.value);
    mapInput.set('to', this.to.value);

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


    const masE = [this.min, this.max, this.from, this.to];

    for (let item of masE) {
      item.addEventListener('change', data);
      item.addEventListener('input', inputProcessing);
    }

  }

}





export { Values };
