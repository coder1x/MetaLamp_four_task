import { boundMethod } from 'autobind-decorator';

import { Observer } from '../../../Observer';

class Bar extends Observer {
  private rangeSliderCenter: Element;

  private rangeSliderName: string;

  private elementBar: HTMLElement | null = null;

  private bar: boolean = false;

  private vertical: boolean = false;

  constructor(element: HTMLElement | Element, rangeSliderName: string) {
    super();
    this.rangeSliderName = rangeSliderName;
    this.rangeSliderCenter = element;
  }

  setVisibleBar(bar: boolean) {
    this.bar = bar;
    return this.bar;
  }

  setOrientation(type: string) {
    this.vertical = type === 'vertical';

    const convertStyle = (style: CSSStyleDeclaration) => {
      let sizeWidth = '';
      let sizeHeight = '';
      const styleDomElement = style;

      const toggleBar = (
        from: keyof CSSStyleDeclaration,
        to: keyof CSSStyleDeclaration,
      ) => {
        const value = Bar.getProperty(styleDomElement, from);
        if (value === '') return false;
        sizeWidth = styleDomElement.width;
        sizeHeight = styleDomElement.height;
        styleDomElement.removeProperty(String(from));
        Bar.setProperty(styleDomElement, to, value);
        return true;
      };

      if (this.vertical) {
        if (!toggleBar('left', 'bottom')) return false;
      } else if (!toggleBar('bottom', 'left')) return false;
      styleDomElement.width = sizeHeight;
      styleDomElement.height = sizeWidth;

      return true;
    };

    if (this.elementBar) { return convertStyle(this.elementBar.style); }

    return false;
  }

  createDomElementBar() {
    if (!this.bar && this.elementBar) {
      this.elementBar.remove();
      this.elementBar = null;
      return false;
    }
    if (this.bar && this.elementBar) return false;
    if (!this.bar && !this.elementBar) return false;

    const barName = `${this.rangeSliderName}__bar`;
    this.elementBar = Bar.createElement('span', [barName, `js-${barName}`]);
    this.rangeSliderCenter.appendChild(this.elementBar);

    this.bindEvent();
    return true;
  }

  setSizeWidthHeight(size: number) {
    if (!this.elementBar) return false;

    const pixels = `${size}px`;
    const { style } = this.elementBar;

    if (this.vertical) {
      style.width = pixels;
    } else {
      style.height = pixels;
    }

    return true;
  }

  setBar(barXY: number, widthBar: number) {
    if (!this.elementBar) return false;

    const { style } = this.elementBar;

    if (this.vertical) {
      style.bottom = `${barXY}%`;
      style.height = `${widthBar}%`;
    } else {
      style.left = `${barXY}%`;
      style.width = `${widthBar}%`;
    }
    return true;
  }

  private bindEvent() {
    if (!this.elementBar) return false;

    this.elementBar.addEventListener('click', this.handleBarClick);

    return true;
  }

  @boundMethod
  private handleBarClick(event: MouseEvent) {
    this.notifyOB({
      key: 'ClickBar',
      clientXY: this.vertical ? event.offsetY : event.offsetX,
    });
  }

  private static getProperty<T, K extends keyof T>(object: T, key: K) {
    return object[key];
  }

  private static setProperty<T, K extends keyof T>(
    object: T,
    key: K,
    value: T[K],
  ) {
    // eslint-disable-next-line no-param-reassign
    object[key] = value;
  }

  private static createElement(teg: string, className: string[]) {
    const element = document.createElement(teg);
    className.forEach((item) => {
      element.classList.add(item);
    });

    return element;
  }
}

export default Bar;
