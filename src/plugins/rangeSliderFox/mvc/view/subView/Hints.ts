import { boundMethod } from 'autobind-decorator';

import {
  getProperty,
  setProperty,
} from '@shared/helpers/readWriteProperties';
import { RANGE_SLIDER_NAME } from '@shared/constants';

interface CheckTip {
  tipMaxXY: number,
  visibilityTipSingle: boolean,
  visibilityTipMax: boolean,
  visibilityTipMin: boolean,
  tipMinYTop: number,
  tipMinXRight: number,
}

class Hints {
  private rangeSliderTop: Element;

  private tipFrom: HTMLElement | null = null;

  private tipTo: HTMLElement | null = null;

  private tipMin: HTMLElement | null = null;

  private tipMax: HTMLElement | null = null;

  private tipSingle: HTMLElement | null = null;

  private tipPrefix: string = '';

  private tipPostfix: string = '';

  private isTipFromTo: boolean = false;

  private isTipMinMax: boolean = false;

  private isVertical: boolean = false;

  constructor(element: HTMLElement | Element) {
    this.rangeSliderTop = element;
  }

  setTipVisible(tipFromTo: boolean, tipMinMax: boolean) {
    this.isTipFromTo = tipFromTo;
    this.isTipMinMax = tipMinMax;
    return { tipFromTo, tipMinMax };
  }

  setAdditionalText(tipPrefix: string, tipPostfix: string) {
    this.tipPrefix = tipPrefix;
    this.tipPostfix = tipPostfix;
    return { tipPrefix, tipPostfix };
  }

  setOrientation(orientation: string) {
    this.isVertical = orientation === 'vertical';
    let isConverted: boolean = false;
    if (this.tipFrom) { isConverted = this.convertStyle(this.tipFrom.style); }

    if (!this.tipTo) { return false; }

    isConverted = this.convertStyle(this.tipTo.style);
    if (this.tipSingle) {
      isConverted = this.convertStyle(this.tipSingle.style);
    }

    return isConverted;
  }

  // ----------------------- create elements
  createTipMinMax() {
    if (this.tipMin && this.tipMax) { return false; }

    const minName = `${RANGE_SLIDER_NAME}__tip-min`;
    this.tipMin = Hints.createElement('div', [minName, `js-${minName}`]);
    const maxName = `${RANGE_SLIDER_NAME}__tip-max`;
    this.tipMax = Hints.createElement('div', [maxName, `js-${maxName}`]);
    this.rangeSliderTop.appendChild(this.tipMin);
    this.rangeSliderTop.appendChild(this.tipMax);

    return true;
  }

  createTipFrom() {
    if (this.tipFrom) { return false; }

    const fromName = `${RANGE_SLIDER_NAME}__tip-from`;
    this.tipFrom = Hints.createElement('div', [fromName, `js-${fromName}`]);
    this.rangeSliderTop.appendChild(this.tipFrom);

    return true;
  }

  createTipTo() {
    if (this.tipTo) { return false; }

    const toName = `${RANGE_SLIDER_NAME}__tip-to`;
    this.tipTo = Hints.createElement('div', [toName, `js-${toName}`]);
    this.rangeSliderTop.appendChild(this.tipTo);

    return true;
  }

  createTipSingle() {
    if (this.tipSingle) { return false; }

    const singleName = `${RANGE_SLIDER_NAME}__tip-single`;
    this.tipSingle = Hints.createElement('div', [singleName, `js-${singleName}`]);
    this.tipSingle.style.visibility = 'hidden';
    this.rangeSliderTop.appendChild(this.tipSingle);

    return true;
  }

  // ------------------- remove elements
  deleteTipMinMax() {
    if (!this.tipMin || !this.tipMax) { return false; }

    this.tipMin.remove();
    this.tipMax.remove();
    this.tipMin = null;
    this.tipMax = null;

    return true;
  }

  deleteTipFrom() {
    if (!this.tipFrom) { return false; }

    this.tipFrom.remove();
    this.tipFrom = null;

    return true;
  }

  deleteTipTo() {
    if (!this.tipTo) { return false; }

    this.tipTo.remove();
    this.tipTo = null;

    return true;
  }

  deleteTipSingle() {
    if (!this.tipSingle) { return false; }

    this.tipSingle.remove();
    this.tipSingle = null;

    return true;
  }

  checkTipTo() {
    return !!(this.tipTo || !this.isTipFromTo);
  }

  // --------------------------- save values

  setValueTipMinMax(min: number, max: number) {
    if (!this.tipMin || !this.tipMax) { return false; }

    return {
      tipMin: this.setData(this.tipMin, min),
      tipMax: this.setData(this.tipMax, max),
    };
  }

  setValueTipFrom(from: number) {
    if (!this.tipFrom) { return false; }
    return this.setData(this.tipFrom, from);
  }

  setValueTipTo(to: number) {
    if (!this.tipTo) { return false; }
    return this.setData(this.tipTo, to);
  }

  setValueTipSingle() {
    if (!this.tipSingle) { return false; }

    const valueFrom = this.tipFrom && this.tipFrom.innerHTML;
    const valueTo = this.tipTo && this.tipTo.innerHTML;
    const value = valueFrom + (this.isVertical ? '<br>↕<br>' : ' ⟷ ') + valueTo;
    this.tipSingle.innerHTML = value;

    return value;
  }

  // --------------------------- change position

  setPositionFrom(coordinatesXY: number) {
    if (!this.tipFrom) { return false; }

    const { style } = this.tipFrom;
    this.setStylePosition(coordinatesXY, style);

    return true;
  }

  setPositionTo(coordinatesXY: number) {
    if (!this.tipTo) { return false; }

    const { style } = this.tipTo;
    this.setStylePosition(coordinatesXY, style);

    return true;
  }

  setPositionSingle(coordinatesXY: number) {
    if (!this.tipSingle) { return false; }

    const { style } = this.tipSingle;
    this.setStylePosition(coordinatesXY, style);

    return true;
  }

  getWidthTip() {
    let fromWidthHeight = 0;
    let toWidthHeight = 0;
    let singleWidthHeight = 0;

    if (this.tipFrom) { fromWidthHeight = this.getElementSize(this.tipFrom); }
    if (this.tipTo) { toWidthHeight = this.getElementSize(this.tipTo); }
    if (this.tipSingle) { singleWidthHeight = this.getElementSize(this.tipSingle); }

    return { fromWidthHeight, toWidthHeight, singleWidthHeight };
  }

  checkTipIsVisible() {
    if (!this.isTipMinMax && !this.isTipFromTo) { return false; }

    // ------------------------------------------- get data
    const [tipFromXY, tipFromWidthHeight] = this.getBoundingDot(this.tipFrom);
    const [tipToXY, tipToWidthHeight] = this.getBoundingDot(this.tipTo);
    const { tipMinXY, tipMinWidthHeight, tipMaxXY } = this.getBoundingMinMax();
    //-------------------------------------------

    let isTipSingleVisible = false;
    let isTipMaxVisible = false;
    let isTipMinVisible = false;
    let tipMinYTop = 0;
    let tipMinXRight = 0;

    const defineLogic = () => {
      if (this.isVertical) {
        tipMinYTop = tipMinXY - tipMinWidthHeight;
        const tipFromYTop = tipFromXY - tipFromWidthHeight;
        const tipToYTop = tipToXY - tipToWidthHeight;

        isTipSingleVisible = tipFromYTop <= tipToXY;

        isTipMaxVisible = this.tipTo ? tipMaxXY >= tipToYTop || tipMaxXY >= tipFromYTop
          : isTipMaxVisible = tipMaxXY >= tipFromYTop;

        isTipMinVisible = tipMinYTop >= tipFromXY || !this.tipFrom;

        return {
          isTipSingleVisible,
          isTipMaxVisible,
          isTipMinVisible,
          tipMinYTop,
          tipMinXRight,
        };
      }

      tipMinXRight = tipMinXY + tipMinWidthHeight;
      const tipFromXRight = tipFromXY + tipFromWidthHeight;
      const tipToXRight = tipToXY + tipToWidthHeight;

      isTipSingleVisible = tipFromXRight >= tipToXY;
      isTipMaxVisible = tipMaxXY <= tipToXRight || tipMaxXY <= tipFromXRight;
      isTipMinVisible = tipMinXRight <= tipFromXY || !this.tipFrom;

      return {
        isTipSingleVisible,
        isTipMaxVisible,
        isTipMinVisible,
        tipMinYTop,
        tipMinXRight,
      };
    };

    const data = defineLogic();

    // ------------------------------------------- change view
    this.toggleVisibility({
      tipMaxXY,
      visibilityTipSingle: data.isTipSingleVisible,
      visibilityTipMax: data.isTipMaxVisible,
      visibilityTipMin: data.isTipMinVisible,
      tipMinYTop: data.tipMinYTop,
      tipMinXRight: data.tipMinXRight,
    });
    return true;
  }

  private setData(element: HTMLElement, value: number) {
    if (element) {
      const domElement = element;
      const prefix = this.getPrefix(value);
      domElement.innerText = prefix;
      return prefix;
    }

    return false;
  }

  private setStylePosition(coordinatesXY: number, style: CSSStyleDeclaration) {
    const styleDom = style;

    if (this.isVertical) {
      styleDom.bottom = `${coordinatesXY}%`;
      styleDom.removeProperty('left');
    } else {
      styleDom.left = `${coordinatesXY}%`;
      styleDom.removeProperty('bottom');
    }
  }

  private static createElement(teg: string, className: string[]) {
    const element = document.createElement(teg);

    className.forEach((item) => {
      element.classList.add(item);
    });

    return element;
  }

  private getPrefix(value: number | string) {
    let text = String(value);

    if (this.tipPostfix) { text = `${this.tipPostfix} ${text}`; }
    if (this.tipPrefix) { text += ` ${this.tipPrefix}`; }

    return text;
  }

  @boundMethod
  private convertStyle(element: CSSStyleDeclaration) {
    const domElement = element;

    function setOrientation(
      from: keyof CSSStyleDeclaration,
      to: keyof CSSStyleDeclaration,
    ) {
      const data = getProperty(domElement, from);

      if (String(data) === '') { return false; }

      domElement.removeProperty(String(from));
      setProperty(
        domElement,
        to,
        data,
      );

      return true;
    }

    if (this.isVertical) {
      return setOrientation('left', 'bottom');
    }
    return setOrientation('bottom', 'left');
  }

  private getElementSize(element: HTMLElement) {
    return this.isVertical ? element.offsetHeight : element.offsetWidth;
  }

  private getBoundingDot(element: HTMLElement | null) {
    let tipDotXY = 0;
    let tipDotWidthHeight = 0;

    if (element) {
      const elementRect = element.getBoundingClientRect();
      tipDotXY = this.isVertical ? elementRect.bottom : elementRect.left;
      tipDotWidthHeight = this.isVertical
        ? element.offsetHeight : element.offsetWidth;
    }

    return [
      tipDotXY,
      tipDotWidthHeight,
    ];
  }

  private getBoundingMinMax() {
    let tipMinXY = 0;
    let tipMinWidthHeight = 0;
    let tipMaxXY = 0;

    if (!this.tipMin) { return { tipMinXY, tipMinWidthHeight, tipMaxXY }; }

    const tip = this.tipMin;
    const minRect = tip.getBoundingClientRect();

    tipMinXY = this.isVertical ? minRect.bottom : minRect.left;
    tipMinWidthHeight = this.isVertical ? tip.offsetHeight : tip.offsetWidth;

    if (this.tipMax) {
      const maxRect = this.tipMax.getBoundingClientRect();
      tipMaxXY = this.isVertical ? maxRect.bottom : maxRect.left;
    }

    return { tipMinXY, tipMinWidthHeight, tipMaxXY };
  }

  private getBoundingSingle() {
    let tipSingleXY = 0;
    let tipSingleWidthHeight = 0;
    let tipSingleSize = 0;

    if (this.tipSingle) {
      const singleRect = this.tipSingle.getBoundingClientRect();
      tipSingleXY = this.isVertical ? singleRect.bottom : singleRect.left;
      tipSingleWidthHeight = this.isVertical
        ? this.tipSingle.offsetHeight
        : this.tipSingle.offsetWidth;
    }

    if (this.isVertical) {
      tipSingleSize = tipSingleXY - tipSingleWidthHeight;
    } else {
      tipSingleSize = tipSingleXY + tipSingleWidthHeight;
    }

    return { tipSingleXY, tipSingleB: tipSingleSize };
  }

  private static display(element: HTMLElement | null, isVisible: boolean) {
    if (element) {
      const domElement = element;
      domElement.style.visibility = isVisible ? 'visible' : 'hidden';
    }
  }

  private toggleVisibility(options: CheckTip) {
    const {
      tipMaxXY,
      visibilityTipSingle,
      visibilityTipMax,
      visibilityTipMin,
      tipMinYTop,
      tipMinXRight,
    } = options;

    let maxVisible = visibilityTipMax;
    let minVisible = visibilityTipMin;

    const visibilityMinMax = () => {
      if (!visibilityTipSingle) { return false; }

      const { tipSingleXY, tipSingleB: tipSingleSize } = this.getBoundingSingle();

      if (this.isVertical) {
        if (tipMaxXY >= tipSingleSize) maxVisible = true;
        if (tipMinYTop <= tipSingleXY) minVisible = false;
      } else {
        if (tipMaxXY <= tipSingleSize) maxVisible = true;
        if (tipMinXRight >= tipSingleXY) minVisible = false;
      }

      return { minVisible, maxVisible };
    };

    const visibilityDot = () => {
      if (!this.tipFrom && !this.isTipFromTo) { return false; }

      if (this.tipTo) {
        const visible = !visibilityTipSingle;
        Hints.display(this.tipFrom, visible);
        Hints.display(this.tipTo, visible);
        Hints.display(this.tipSingle, visibilityTipSingle);

        return visibilityMinMax();
      }

      Hints.display(this.tipFrom, true);
      Hints.display(this.tipSingle, false);

      return true;
    };

    const data = visibilityDot();

    if (typeof data === 'object') {
      maxVisible = data.maxVisible;
      minVisible = data.minVisible;
    }

    if (this.tipMin && this.isTipMinMax) {
      Hints.display(this.tipMax, !(maxVisible && this.tipFrom));
      Hints.display(this.tipMin, minVisible);
    }
  }
}

export default Hints;
