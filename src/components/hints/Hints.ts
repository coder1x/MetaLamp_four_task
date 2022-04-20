import { boundMethod } from 'autobind-decorator';
import './hints.scss';

interface Options {
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  tipPrefix?: string;
  tipPostfix?: string;
}

class Hints {
  private elem: Element;

  private tipMinMax: HTMLInputElement | null = null;

  private tipFromTo: HTMLInputElement | null = null;

  private tipPrefix: HTMLInputElement | null = null;

  private tipPostfix: HTMLInputElement | null = null;

  private tipMinMaxCache: boolean = false;

  private tipFromToCache: boolean = false;

  private tipPrefixCache: string = '';

  private tipPostfixCache: string = '';

  private nameClass: string;

  private objRangeSlider: any;

  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: Options) {
    const {
      tipMinMax, tipFromTo, tipPrefix, tipPostfix,
    } = options;

    if (this.tipMinMaxCache !== tipMinMax && this.tipMinMax) {
      this.tipMinMax.checked = tipMinMax ?? false;
      this.tipMinMaxCache = tipMinMax ?? false;
    }
    if (this.tipFromToCache !== tipFromTo && this.tipFromTo) {
      this.tipFromTo.checked = tipFromTo ?? false;
      this.tipFromToCache = tipFromTo ?? false;
    }
    if (this.tipPrefixCache !== tipPrefix && this.tipPrefix) {
      this.tipPrefix.value = String(tipPrefix);
      this.tipPrefixCache = tipPrefix ?? '';
    }
    if (this.tipPostfixCache !== tipPostfix && this.tipPostfix) {
      this.tipPostfix.value = String(tipPostfix);
      this.tipPostfixCache = tipPostfix ?? '';
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    this.objRangeSlider = obj;
    const inputElements = [this.tipPrefix, this.tipPostfix];

    inputElements.forEach((item) => {
      if (!item) return;
      item.addEventListener('change', this.handleInputData);
    });

    if (!this.tipMinMax || !this.tipFromTo) return false;

    this.tipMinMax.addEventListener('click', this.handleTipMinMax);
    this.tipFromTo.addEventListener('click', this.handleTipFromTo);

    return true;
  }

  @boundMethod
  private handleInputData(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      [elem.name]: elem.value,
    });
  }

  @boundMethod
  private handleTipMinMax(event: Event) {
    const elem = event.target as HTMLInputElement;

    this.objRangeSlider.update({
      tipMinMax: elem.checked,
    });
  }

  @boundMethod
  private handleTipFromTo(event: Event) {
    const elem = event.target as HTMLInputElement;

    this.objRangeSlider.update({
      tipFromTo: elem.checked,
    });
  }

  private setDom() {
    const getDom = (str: string) => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    ) as HTMLInputElement;

    this.tipMinMax = getDom('minmax');
    this.tipFromTo = getDom('fromto');
    this.tipPrefix = getDom('prefix');
    this.tipPostfix = getDom('postfix');
  }
}

export default Hints;
