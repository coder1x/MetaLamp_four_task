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
  private tipMinMaxD: boolean;
  private tipFromToD: boolean;
  private tipPrefixD: string;
  private tipPostfixD: string;
  private nameClass: string;

  constructor(nameClass: string, elem: HTMLElement) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: OP) {
    const { tipMinMax, tipFromTo, tipPrefix, tipPostfix } = options;

    if (this.tipMinMaxD != tipMinMax) {
      this.tipMinMax.checked = tipMinMax;
      this.tipMinMaxD = tipMinMax;
    }
    if (this.tipFromToD != tipFromTo) {
      this.tipFromTo.checked = tipFromTo;
      this.tipFromToD = tipFromTo;
    }
    if (this.tipPrefixD != tipPrefix) {
      this.tipPrefix.value = String(tipPrefix);
      this.tipPrefixD = tipPrefix;
    }
    if (this.tipPostfixD != tipPostfix) {
      this.tipPostfix.value = String(tipPostfix);
      this.tipPostfixD = tipPostfix;
    }
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

}



export { Hints };