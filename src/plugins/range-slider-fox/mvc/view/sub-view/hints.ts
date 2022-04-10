import { boundMethod } from 'autobind-decorator';

interface CheckTip {
  tipMaxXY: number,
  visibilityTipSingle: boolean,
  visibilityTipMax: boolean,
  visibilityTipMin: boolean,
  tipMinYTop: number,
  tipMinXRight: number,
}

class Hints {
  private rsTop: Element;

  private rsName: string;

  private tipFrom: HTMLElement | null = null;

  private tipTo: HTMLElement | null = null;

  private tipMin: HTMLElement | null = null;

  private tipMax: HTMLElement | null = null;

  private tipSingle: HTMLElement | null = null;

  private tipPrefix: string = '';

  private tipPostfix: string = '';

  private tipFromTo: boolean = false;

  private tipMinMax: boolean = false;

  private vertical: boolean = false;

  constructor(elem: HTMLElement | Element, rsName: string) {
    this.rsName = rsName;
    this.rsTop = elem;
  }

  setTipFlag(tipFromTo: boolean, tipMinMax: boolean) {
    this.tipFromTo = tipFromTo;
    this.tipMinMax = tipMinMax;
    return { tipFromTo, tipMinMax };
  }

  setAdditionalText(tipPrefix: string, tipPostfix: string) {
    this.tipPrefix = tipPrefix;
    this.tipPostfix = tipPostfix;
    return { tipPrefix, tipPostfix };
  }

  setOrientation(str: string) {
    this.vertical = str === 'vertical';
    let flag: boolean = false;
    if (this.tipFrom) { flag = this.convertStyle(this.tipFrom.style); }

    if (this.tipTo) {
      flag = this.convertStyle(this.tipTo.style);
      if (this.tipSingle) {
        flag = this.convertStyle(this.tipSingle.style);
      }
    }
    return flag;
  }

  // ----------------------- create elements
  createTipMinMax() {
    if (this.tipMin && this.tipMax) return false;
    const minName = `${this.rsName}__tip-min`;
    this.tipMin = Hints.createElem('div', [minName, `js-${minName}`]);
    const maxName = `${this.rsName}__tip-max`;
    this.tipMax = Hints.createElem('div', [maxName, `js-${maxName}`]);
    this.rsTop.appendChild(this.tipMin);
    this.rsTop.appendChild(this.tipMax);
    return true;
  }

  createTipFrom() {
    if (this.tipFrom) return false;
    const fromName = `${this.rsName}__tip-from`;
    this.tipFrom = Hints.createElem('div', [fromName, `js-${fromName}`]);
    this.rsTop.appendChild(this.tipFrom);
    return true;
  }

  createTipTo() {
    if (this.tipTo) return false;
    const toName = `${this.rsName}__tip-to`;
    this.tipTo = Hints.createElem('div', [toName, `js-${toName}`]);
    this.rsTop.appendChild(this.tipTo);
    return true;
  }

  createTipSingle() {
    if (this.tipSingle) return false;
    const singleName = `${this.rsName}__tip-single`;
    this.tipSingle = Hints.createElem('div', [singleName, `js-${singleName}`]);
    this.tipSingle.style.visibility = 'hidden';
    this.rsTop.appendChild(this.tipSingle);
    return true;
  }

  // ------------------- remove elements
  deleteTipMinMax() {
    if (!this.tipMin || !this.tipMax) return false;

    this.tipMin.remove();
    this.tipMax.remove();
    this.tipMin = null;
    this.tipMax = null;
    return true;
  }

  deleteTipFrom() {
    if (!this.tipFrom) return false;
    this.tipFrom.remove();
    this.tipFrom = null;
    return true;
  }

  deleteTipTo() {
    if (!this.tipTo) return false;
    this.tipTo.remove();
    this.tipTo = null;
    return true;
  }

  deleteTipSingle() {
    if (!this.tipSingle) return false;
    this.tipSingle.remove();
    this.tipSingle = null;
    return true;
  }

  checkTipTo() {
    return !!(this.tipTo || !this.tipFromTo);
  }

  // --------------------------- save values

  setValTipMinMax(min: number, max: number) {
    if (!this.tipMin || !this.tipMax) return false;

    const tipMin = this.setData(this.tipMin, min);
    const tipMax = this.setData(this.tipMax, max);
    return { tipMin, tipMax };
  }

  setValTipFrom(from: number) {
    if (!this.tipFrom) return false;
    return this.setData(this.tipFrom, from);
  }

  setValTipTo(to: number) {
    if (!this.tipTo) return false;
    return this.setData(this.tipTo, to);
  }

  setValTipSingle() {
    if (!this.tipSingle) return false;
    const valFrom = this.tipFrom && this.tipFrom.innerHTML;
    const valTo = this.tipTo && this.tipTo.innerHTML;
    const br = '<br>';
    const value = valFrom + (this.vertical ? `${br}↕${br}` : ' ⟷ ') + valTo;
    this.tipSingle.innerHTML = value;
    return value;
  }

  // --------------------------- change position

  setPositionFrom(coordXY: number) {
    if (!this.tipFrom) return false;
    const { style } = this.tipFrom;
    this.setStylePosition(coordXY, style);
    return true;
  }

  setPositionTo(coordXY: number) {
    if (!this.tipTo) return false;
    const { style } = this.tipTo;
    this.setStylePosition(coordXY, style);
    return true;
  }

  setPositionSingle(coordXY: number) {
    if (!this.tipSingle) return false;
    const { style } = this.tipSingle;
    this.setStylePosition(coordXY, style);
    return true;
  }

  getWidthTip() {
    let fromWH = 0;
    let toWH = 0;
    let singleWH = 0;
    if (this.tipFrom) { fromWH = this.getSizeElem(this.tipFrom); }
    if (this.tipTo) { toWH = this.getSizeElem(this.tipTo); }
    if (this.tipSingle) { singleWH = this.getSizeElem(this.tipSingle); }
    return { fromWH, toWH, singleWH };
  }

  checkVisibleTip() {
    if (!this.tipMinMax && !this.tipFromTo) return false;

    // ------------------------------------------- get data
    const [tipFromXY, tipFromWH] = this.getBoundingDot(this.tipFrom);
    const [tipToXY, tipToWH] = this.getBoundingDot(this.tipTo);
    const { tipMinXY, tipMinWH, tipMaxXY } = this.getBoundingMinMax();
    //-------------------------------------------

    let visibilityTipSingle = false;
    let visibilityTipMax = false;
    let visibilityTipMin = false;
    let tipMinYTop = 0;
    let tipMinXRight = 0;

    // ------------------------------------------- define logic

    const flagTipFrom = tipFromXY || !this.tipFrom;

    if (this.vertical) {
      const tipFromYTop = tipFromXY - tipFromWH;
      const tipFromMax = tipMaxXY >= tipFromYTop;
      const tipToYTop = tipToXY - tipToWH;

      tipMinYTop = tipMinXY - tipMinWH;

      visibilityTipSingle = tipFromYTop <= tipToXY;

      visibilityTipMax = this.tipTo
        ? tipMaxXY >= tipToYTop || tipFromMax
        : tipFromMax;

      visibilityTipMin = tipMinYTop >= flagTipFrom;
    } else {
      tipMinXRight = tipMinXY + tipMinWH;

      const tipFromXRight = tipFromXY + tipFromWH;
      const tipToXRight = tipToXY + tipToWH;
      const tipMaxTo = tipMaxXY <= tipToXRight;
      const tipMaxFrom = tipMaxXY <= tipFromXRight;

      visibilityTipSingle = tipFromXRight >= tipToXY;
      visibilityTipMax = tipMaxTo || tipMaxFrom;
      visibilityTipMin = tipMinXRight <= flagTipFrom;
    }

    // ------------------------------------------- change view
    this.toggleDisplay({
      tipMaxXY,
      visibilityTipSingle,
      visibilityTipMax,
      visibilityTipMin,
      tipMinYTop,
      tipMinXRight,
    });
    return true;
  }

  private setData(elem: HTMLElement, value: number) {
    if (elem) {
      const dom = elem;
      const prefix = this.getPrefix(value);
      dom.innerText = prefix;
      return prefix;
    }
    return false;
  }

  private setStylePosition(coordXY: number, style: CSSStyleDeclaration) {
    const styleDom = style;
    if (this.vertical) {
      styleDom.bottom = `${coordXY}%`;
      styleDom.removeProperty('left');
    } else {
      styleDom.left = `${coordXY}%`;
      styleDom.removeProperty('bottom');
    }
  }

  private static createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);

    className.forEach((item) => {
      elem.classList.add(item);
    });

    return elem;
  }

  private getPrefix(value: number | string) {
    let text = String(value);
    if (this.tipPostfix) { text = `${this.tipPostfix} ${text}`; }
    if (this.tipPrefix) { text += ` ${this.tipPrefix}`; }
    return text;
  }

  @boundMethod
  private convertStyle(elem: CSSStyleDeclaration) {
    const dom = elem;
    let value = '';
    if (this.vertical) {
      if (dom.left === '') return false;
      value = dom.left;
      dom.removeProperty('left');
      dom.bottom = value;
    } else {
      if (dom.bottom === '') return false;
      value = dom.bottom;
      dom.removeProperty('bottom');
      dom.left = value;
    }
    return true;
  }

  private getSizeElem(elem: HTMLElement) {
    return this.vertical ? elem.offsetHeight : elem.offsetWidth;
  }

  private getBoundingDot(elem: HTMLElement | null) {
    let tipDotXY = 0;
    let tipDotWH = 0;
    if (elem) {
      const elemRect = elem.getBoundingClientRect();
      tipDotXY = this.vertical ? elemRect.bottom : elemRect.left;
      tipDotWH = this.vertical
        ? elem.offsetHeight : elem.offsetWidth;
    }

    return [
      tipDotXY,
      tipDotWH,
    ];
  }

  private getBoundingMinMax() {
    let tipMinXY = 0;
    let tipMinWH = 0;
    let tipMaxXY = 0;
    if (this.tipMin) {
      const tip = this.tipMin;
      const minRect = tip.getBoundingClientRect();
      const flag = this.vertical;
      tipMinXY = flag ? minRect.bottom : minRect.left;
      tipMinWH = flag ? tip.offsetHeight : tip.offsetWidth;
      if (this.tipMax) {
        const maxRect = this.tipMax.getBoundingClientRect();
        tipMaxXY = flag ? maxRect.bottom : maxRect.left;
      }
    }
    return { tipMinXY, tipMinWH, tipMaxXY };
  }

  private getBoundingSingle() {
    let tipSingleXY = 0;
    let tipSingleWH = 0;
    let tipSingleB = 0;
    const flag = this.vertical;
    const tip = this.tipSingle;
    if (tip) {
      const singleRect = tip.getBoundingClientRect();
      tipSingleXY = flag ? singleRect.bottom : singleRect.left;
      tipSingleWH = flag ? tip.offsetHeight : tip.offsetWidth;
    }
    if (flag) {
      tipSingleB = tipSingleXY - tipSingleWH;
    } else {
      tipSingleB = tipSingleXY + tipSingleWH;
    }
    return { tipSingleXY, tipSingleB };
  }

  private toggleDisplay(options: CheckTip) {
    const {
      tipMaxXY,
      visibilityTipSingle,
      visibilityTipMax,
      visibilityTipMin,
      tipMinYTop,
      tipMinXRight,
    } = options;

    const display = (elem: HTMLElement | null, flag: boolean) => {
      if (elem) {
        const dom = elem;
        dom.style.visibility = flag ? 'visible' : 'hidden';
      }
    };

    let maxVisible = visibilityTipMax;
    let minVisible = visibilityTipMin;

    if (this.tipFrom && this.tipFromTo) {
      if (this.tipTo) {
        const visible = !visibilityTipSingle;
        display(this.tipFrom, visible);
        display(this.tipTo, visible);
        display(this.tipSingle, visibilityTipSingle);

        if (visibilityTipSingle) {
          const { tipSingleXY, tipSingleB } = this.getBoundingSingle();
          if (this.vertical) {
            if (tipMaxXY >= tipSingleB) maxVisible = true;
            if (tipMinYTop <= tipSingleXY) minVisible = false;
          } else {
            if (tipMaxXY <= tipSingleB) maxVisible = true;
            if (tipMinXRight >= tipSingleXY) minVisible = false;
          }
        }
      } else {
        display(this.tipFrom, true);
        display(this.tipSingle, false);
      }
    }

    if (this.tipMin && this.tipMinMax) {
      const visMax = !(maxVisible && this.tipFrom);
      display(this.tipMax, visMax);
      display(this.tipMin, minVisible);
    }
  }
}

export default Hints;
