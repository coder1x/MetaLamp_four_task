import { boundMethod } from 'autobind-decorator';

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

    let isNewData = this.tipMinMaxCache !== tipMinMax;

    if (isNewData && this.tipMinMax) {
      this.tipMinMax.checked = tipMinMax ?? false;
      this.tipMinMaxCache = tipMinMax ?? false;
    }

    isNewData = this.tipFromToCache !== tipFromTo;

    if (isNewData && this.tipFromTo) {
      this.tipFromTo.checked = tipFromTo ?? false;
      this.tipFromToCache = tipFromTo ?? false;
    }

    isNewData = this.tipPrefixCache !== tipPrefix;

    if (isNewData && this.tipPrefix) {
      this.tipPrefix.value = String(tipPrefix);
      this.tipPrefixCache = tipPrefix ?? '';
    }

    isNewData = this.tipPostfixCache !== tipPostfix;

    if (isNewData && this.tipPostfix) {
      this.tipPostfix.value = String(tipPostfix);
      this.tipPostfixCache = tipPostfix ?? '';
    }
  }

  bindEvent<T>(rangeSlider: T) {
    this.objRangeSlider = rangeSlider;

    [this.tipPrefix, this.tipPostfix].forEach((item) => {
      if (!item) return;
      item.addEventListener('change', this.handleInputChange);
    });

    if (!this.tipMinMax || !this.tipFromTo) return false;

    this.tipMinMax.addEventListener('click', this.handleTipMinMaxClick);
    this.tipFromTo.addEventListener('click', this.handleTipFromToClick);

    return true;
  }

  @boundMethod
  private handleInputChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      [element.name]: element.value,
    });
  }

  @boundMethod
  private handleTipMinMaxClick(event: Event) {
    const element = event.target as HTMLInputElement;

    this.objRangeSlider.update({
      tipMinMax: element.checked,
    });
  }

  @boundMethod
  private handleTipFromToClick(event: Event) {
    const element = event.target as HTMLInputElement;

    this.objRangeSlider.update({
      tipFromTo: element.checked,
    });
  }

  private getDomElement(nameElement: string) {
    return this.element.querySelector(
      `${this.nameClass}__${nameElement}-wrapper input`,
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
