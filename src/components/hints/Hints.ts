import { boundMethod } from 'autobind-decorator';
import './hints.scss';

interface Options {
  tipMinMax?: boolean | null;
  tipFromTo?: boolean | null;
  tipPrefix?: string | null;
  tipPostfix?: string | null;
}

class Hints {
  private element: Element;

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

  constructor(nameClass: string, element: Element) {
    this.nameClass = nameClass;
    this.element = element;
    this.setDomElement();
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
  bindEvent(rangeSlider: any) {
    this.objRangeSlider = rangeSlider;

    [this.tipPrefix, this.tipPostfix].forEach((item) => {
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
    const element = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      [element.name]: element.value,
    });
  }

  @boundMethod
  private handleTipMinMax(event: Event) {
    const element = event.target as HTMLInputElement;

    this.objRangeSlider.update({
      tipMinMax: element.checked,
    });
  }

  @boundMethod
  private handleTipFromTo(event: Event) {
    const element = event.target as HTMLInputElement;

    this.objRangeSlider.update({
      tipFromTo: element.checked,
    });
  }

  private getDomElement(string: string) {
    return this.element.querySelector(
      `${this.nameClass}__${string}-wrap input`,
    ) as HTMLInputElement;
  }

  private setDomElement() {
    this.tipMinMax = this.getDomElement('minmax');
    this.tipFromTo = this.getDomElement('fromto');
    this.tipPrefix = this.getDomElement('prefix');
    this.tipPostfix = this.getDomElement('postfix');
  }
}

export default Hints;
