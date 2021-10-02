import './hints.scss';

interface OP {
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  tipPrefix?: string;
  tipPostfix?: string;
}

class Hints {
  private elem: HTMLElement;
  private tipMinMax: HTMLInputElement;
  private tipFromTo: HTMLInputElement;
  private tipPrefix: HTMLInputElement;
  private tipPostfix: HTMLInputElement;

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

    this.tipMinMax = getDom('minmax');
    this.tipFromTo = getDom('fromto');
    this.tipPrefix = getDom('prefix');
    this.tipPostfix = getDom('postfix');
  }

  setData(options: OP) {
    this.tipMinMax.checked = options.tipMinMax;
    this.tipFromTo.checked = options.tipFromTo;
    this.tipPrefix.value = String(options.tipPrefix);
    this.tipPostfix.value = String(options.tipPostfix);
  }

  setAction(obj: any) {
    const data = (e: Event) => {
      const elem = e.target as HTMLInputElement;
      obj.update({
        [elem.name]: elem.value
      });
    };

    const masE = [this.tipPrefix, this.tipPostfix];
    for (let item of masE) {
      item.addEventListener('change', data);
    }

    this.tipMinMax.addEventListener('click', function () {
      obj.update({
        tipMinMax: this.checked
      });
    });

    this.tipFromTo.addEventListener('click', function () {
      obj.update({
        tipFromTo: this.checked
      });
    });
  }

}



export { Hints };