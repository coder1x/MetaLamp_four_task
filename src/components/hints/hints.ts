import './hints.scss';

interface Options {
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  tipPrefix?: string;
  tipPostfix?: string;
}

class Hints {
  private elem: Element;

  private tipMinMax: HTMLInputElement;

  private tipFromTo: HTMLInputElement;

  private tipPrefix: HTMLInputElement;

  private tipPostfix: HTMLInputElement;

  private tipMinMaxD: boolean;

  private tipFromToD: boolean;

  private tipPrefixD: string;

  private tipPostfixD: string;

  private nameClass: string;

  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: Options) {
    const {
      tipMinMax, tipFromTo, tipPrefix, tipPostfix,
    } = options;

    if (this.tipMinMaxD !== tipMinMax) {
      this.tipMinMax.checked = tipMinMax;
      this.tipMinMaxD = tipMinMax;
    }
    if (this.tipFromToD !== tipFromTo) {
      this.tipFromTo.checked = tipFromTo;
      this.tipFromToD = tipFromTo;
    }
    if (this.tipPrefixD !== tipPrefix) {
      this.tipPrefix.value = String(tipPrefix);
      this.tipPrefixD = tipPrefix;
    }
    if (this.tipPostfixD !== tipPostfix) {
      this.tipPostfix.value = String(tipPostfix);
      this.tipPostfixD = tipPostfix;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    const data = (event: Event) => {
      const elem = event.target as HTMLInputElement;

      obj.update({
        [elem.name]: elem.value,
      });
    };

    const masE = [this.tipPrefix, this.tipPostfix];

    masE.forEach((item) => {
      item.addEventListener('change', data);
    });

    this.tipMinMax.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;

      obj.update({
        tipMinMax: elem.checked,
      });
    });

    this.tipFromTo.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;

      obj.update({
        tipFromTo: elem.checked,
      });
    });
  }

  private setDom() {
    const getDom = (str: string): HTMLInputElement => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    );

    this.tipMinMax = getDom('minmax');
    this.tipFromTo = getDom('fromto');
    this.tipPrefix = getDom('prefix');
    this.tipPostfix = getDom('postfix');
  }
}

export default Hints;
