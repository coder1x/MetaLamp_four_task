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

    // в инпутах должны вводиться только цифры
    // знак минус и точка. 

    const minVal = () => {
      obj.update({
        min: this.min.value
      });
    };

    const maxVal = () => {
      obj.update({
        max: this.max.value
      });
    };

    const fromVal = () => {
      obj.update({
        from: this.from.value
      });
    };

    const toVal = () => {
      obj.update({
        to: this.to.value
      });
    };

    const inputProcessing = (e: Event) => {
      const elem = e.target as HTMLInputElement;
      let val = elem.value.replace(/[^-.\d]/g, '');

      // val = val.replace(/^-?/,'');


      let regexp = /^-?\d+?[.]?\d+$/;
      const valid = regexp.test(val);
      console.log(valid);

      if (valid) { elem.value = val; }

    };


    this.min.addEventListener('change', minVal);
    this.max.addEventListener('change', maxVal);
    this.from.addEventListener('change', fromVal);
    this.to.addEventListener('change', toVal);

    const masE = [this.min, this.max, this.from, this.to];

    for (let item of masE) {
      item.addEventListener('input', inputProcessing);
    }



  }

}





export { Values };
