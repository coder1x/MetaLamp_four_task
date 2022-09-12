import { boundMethod } from 'autobind-decorator';

import {
  getProperty,
  setProperty,
} from '@shared/helpers/readWriteProperties';

import { RANGE_SLIDER_NAME } from '@shared/constants';

import Observer from '../../../Observer';

type ObserverOptions = {
  readonly key: 'ClickBar';
  readonly clientXY?: number;
};

class Bar extends Observer<ObserverOptions> {
  private rangeSliderCenter: Element;

  private elementBar: HTMLElement | null = null;

  private bar: boolean = false;

  private vertical: boolean = false;

  constructor(element: HTMLElement | Element) {
    super();
    this.rangeSliderCenter = element;
  }

  setVisibleBar(bar: boolean) {
    this.bar = bar;
    return this.bar;
  }

  setOrientation(type: string) {
    this.vertical = type === 'vertical';

    const convertStyle = (style: CSSStyleDeclaration) => {
      let axisXLength = '';
      let axisYLength = '';
      const styleDomElement = style;

      const toggleBar = (
        from: keyof CSSStyleDeclaration,
        to: keyof CSSStyleDeclaration,
      ) => {
        const value = getProperty(styleDomElement, from);
        if (value === '') {
          return false;
        }
        axisXLength = styleDomElement.width;
        axisYLength = styleDomElement.height;
        styleDomElement.removeProperty(String(from));
        setProperty(styleDomElement, to, value);
        return true;
      };

      if (this.vertical) {
        if (!toggleBar('left', 'bottom')) {
          return false;
        }
      } else if (!toggleBar('bottom', 'left')) {
        return false;
      }

      styleDomElement.width = axisYLength;
      styleDomElement.height = axisXLength;

      return true;
    };

    if (this.elementBar) {
      return convertStyle(this.elementBar.style);
    }

    return false;
  }

  createDomElementBar() {
    if (!this.bar && this.elementBar) {
      this.elementBar.remove();
      this.elementBar = null;
      return false;
    }
    if (this.bar && this.elementBar) {
      return false;
    }
    if (!this.bar && !this.elementBar) {
      return false;
    }

    const barName = `${RANGE_SLIDER_NAME}__bar`;
    this.elementBar = Bar.createElement('span', [barName, `js-${barName}`]);
    this.rangeSliderCenter.appendChild(this.elementBar);

    this.bindEvent();
    return true;
  }

  setSizeWidthHeight(size: number) {
    if (!this.elementBar) {
      return false;
    }

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
    if (!this.elementBar) {
      return false;
    }

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
    if (!this.elementBar) {
      return false;
    }

    this.elementBar.addEventListener('click', this.handleBarClick);

    return true;
  }

  @boundMethod
  private handleBarClick(event: MouseEvent) {
    this.notifyObserver({
      key: 'ClickBar',
      clientXY: this.vertical ? event.offsetY : event.offsetX,
    });
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
