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

  private tipMinMaxCache: boolean;

  private tipFromToCache: boolean;

  private tipPrefixCache: string;

  private tipPostfixCache: string;

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

    if (this.tipMinMaxCache !== tipMinMax) {
      this.tipMinMax.checked = tipMinMax;
      this.tipMinMaxCache = tipMinMax;
    }
    if (this.tipFromToCache !== tipFromTo) {
      this.tipFromTo.checked = tipFromTo;
      this.tipFromToCache = tipFromTo;
    }
    if (this.tipPrefixCache !== tipPrefix) {
      this.tipPrefix.value = String(tipPrefix);
      this.tipPrefixCache = tipPrefix;
    }
    if (this.tipPostfixCache !== tipPostfix) {
      this.tipPostfix.value = String(tipPostfix);
      this.tipPostfixCache = tipPostfix;
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

    const inputElements = [this.tipPrefix, this.tipPostfix];

    inputElements.forEach((item) => {
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
