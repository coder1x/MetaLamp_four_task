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
  private tipFrom: HTMLElement;
  private tipTo: HTMLElement;
  private tipMin: HTMLElement;
  private tipMax: HTMLElement;
  private tipSingle: HTMLElement;
  private tipPrefix: string;
  private tipPostfix: string;
  private tipFromTo: boolean;
  private tipMinMax: boolean;
  private vertical: boolean;

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
    this.vertical = str == 'vertical' ? true : false;
    let fl: boolean;
    if (this.tipFrom)
      fl = this.convertStyle(this.tipFrom.style);

    if (this.tipTo) {
      fl = this.convertStyle(this.tipTo.style);
      if (this.tipSingle) {
        fl = this.convertStyle(this.tipSingle.style);
      }
    }
    return fl;
  }

  //----------------------- create elements
  createTipMinMax() {
    if (this.tipMin && this.tipMax) return false;
    const minName = this.rsName + '__tip-min';
    this.tipMin = this.createElem('div', [minName, 'js-' + minName]);
    const maxName = this.rsName + '__tip-max';
    this.tipMax = this.createElem('div', [maxName, 'js-' + maxName]);
    this.rsTop.appendChild(this.tipMin);
    this.rsTop.appendChild(this.tipMax);
    return true;
  }

  createTipFrom() {
    if (this.tipFrom) return false;
    const fromName = this.rsName + '__tip-from';
    this.tipFrom = this.createElem('div', [fromName, 'js-' + fromName]);
    this.rsTop.appendChild(this.tipFrom);
    return true;
  }

  createTipTo() {
    if (this.tipTo) return false;
    const toName = this.rsName + '__tip-to';
    this.tipTo = this.createElem('div', [toName, 'js-' + toName]);
    this.rsTop.appendChild(this.tipTo);
    return true;
  }

  createTipSingle() {
    if (this.tipSingle) return false;
    const singleName = this.rsName + '__tip-single';
    this.tipSingle = this.createElem('div', [singleName, 'js-' + singleName]);
    this.tipSingle.style.visibility = 'hidden';
    this.rsTop.appendChild(this.tipSingle);
    return true;
  }

  //------------------- remove elements
  deleteTipMinMax() {
    if (!this.tipMin && !this.tipMax) return false;
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
    return this.tipTo || !this.tipFromTo ? true : false;
  }

  // --------------------------- save values

  setValTipMinMax(min: number, max: number) {
    const tipMin = this.setData(this.tipMin, min);
    const tipMax = this.setData(this.tipMax, max);
    return { tipMin, tipMax };
  }

  setValTipFrom(from: number) {
    return this.setData(this.tipFrom, from);
  }
  setValTipTo(to: number) {
    return this.setData(this.tipTo, to);
  }

  setValTipSingle() {
    if (!this.tipSingle) return false;
    const valFrom = this.tipFrom.innerHTML;
    const valTo = this.tipTo.innerHTML;
    const br = '<br>';
    return this.tipSingle.innerHTML = valFrom +
      (this.vertical ? br + '↕' + br : ' ⟷ ') + valTo;
  }

  // --------------------------- change position

  setPositionFrom(coordXY: number) {
    if (!this.tipFrom) return false;
    const st = this.tipFrom.style;
    this.setStylePosition(coordXY, st);
    return true;
  }

  setPositionTo(coordXY: number) {
    if (!this.tipTo) return false;
    const st = this.tipTo.style;
    this.setStylePosition(coordXY, st);
    return true;
  }

  setPositionSingle(coordXY: number) {
    if (!this.tipSingle) return false;
    const st = this.tipSingle.style;
    this.setStylePosition(coordXY, st);
    return true;
  }

  getWidthTip() {
    let fromWH = 0;
    let toWH = 0;
    let singleWH = 0;
    if (this.tipFrom)
      fromWH = this.getSizeElem(this.tipFrom);
    if (this.tipTo)
      toWH = this.getSizeElem(this.tipTo);
    if (this.tipSingle)
      singleWH = this.getSizeElem(this.tipSingle);
    return { fromWH, toWH, singleWH, };
  }

  checkVisibleTip() {
    if (!this.tipMinMax && !this.tipFromTo) return false;

    //------------------------------------------- get data
    const { tipFromXY, tipFromWH } = this.getBoundingDot(this.tipFrom);
    const { tipToXY, tipToWH } = this.getBoundingDot(this.tipTo);
    const { tipMinXY, tipMinWH, tipMaxXY } = this.getBoundingMinMax();
    //-------------------------------------------

    let visibilityTipSingle = false;
    let visibilityTipMax = false;
    let visibilityTipMin = false;
    let tipMinYTop = 0;
    let tipMinXRight = 0;

    //------------------------------------------- define logic
    if (this.vertical) {
      tipMinYTop = tipMinXY - tipMinWH;
      const tipFromYTop = tipFromXY - tipFromWH;
      const tipToYTop = tipToXY - tipToWH;
      visibilityTipSingle = tipFromYTop <= tipToXY;
      if (this.tipTo) {
        visibilityTipMax = tipMaxXY >= tipToYTop || tipMaxXY >= tipFromYTop;
      } else {
        visibilityTipMax = tipMaxXY >= tipFromYTop;
      }
      visibilityTipMin = tipMinYTop >= tipFromXY || !this.tipFrom;
    } else {
      tipMinXRight = tipMinXY + tipMinWH;
      const tipFromXRight = tipFromXY + tipFromWH;
      const tipToXRight = tipToXY + tipToWH;
      visibilityTipSingle = tipFromXRight >= tipToXY;
      visibilityTipMax = tipMaxXY <= tipToXRight || tipMaxXY <= tipFromXRight;
      visibilityTipMin = tipMinXRight <= tipFromXY || !this.tipFrom;
    }

    //------------------------------------------- change view
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

  private setData(elem: HTMLElement, val: number) {
    if (elem) {
      return elem.innerText = this.getPrefix(val);
    }
    return false;
  }

  private setStylePosition(coordXY: number, st: CSSStyleDeclaration) {
    if (this.vertical) {
      st.bottom = coordXY + '%';
      st.removeProperty('left');
    } else {
      st.left = coordXY + '%';
      st.removeProperty('bottom');
    }
  }

  private createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

  private getPrefix(val: number | string) {
    let text = String(val);
    if (this.tipPostfix)
      text = this.tipPostfix + ' ' + text;
    if (this.tipPrefix)
      text += ' ' + this.tipPrefix;
    return text;
  }

  private convertStyle = (elem: CSSStyleDeclaration) => {
    let val = '';
    if (this.vertical) {
      if (elem.left == '') return false;
      val = elem.left;
      elem.removeProperty('left');
      elem.bottom = val;
    } else {
      if (elem.bottom == '') return false;
      val = elem.bottom;
      elem.removeProperty('bottom');
      elem.left = val;
    }
    return true;
  };

  private getSizeElem(elem: HTMLElement) {
    return this.vertical ? elem.offsetHeight : elem.offsetWidth;
  }

  private getBoundingDot(elem: HTMLElement) {
    let tipDotXY = 0;
    let tipDotWH = 0;
    if (elem) {
      const cr = elem.getBoundingClientRect();
      tipDotXY = this.vertical ? cr.bottom : cr.left;
      tipDotWH = this.vertical ?
        elem.offsetHeight : elem.offsetWidth;
    }
    if (elem == this.tipFrom) {
      return {
        tipFromXY: tipDotXY,
        tipFromWH: tipDotWH
      };
    }
    return {
      tipToXY: tipDotXY,
      tipToWH: tipDotWH
    };
  }

  private getBoundingMinMax() {
    let tipMinXY = 0;
    let tipMinWH = 0;
    let tipMaxXY = 0;
    if (this.tipMin) {
      const tip = this.tipMin;
      const crMin = tip.getBoundingClientRect();
      const fl = this.vertical;
      tipMinXY = fl ? crMin.bottom : crMin.left;
      tipMinWH = fl ? tip.offsetHeight : tip.offsetWidth;
      if (this.tipMax) {
        const crMax = this.tipMax.getBoundingClientRect();
        tipMaxXY = fl ? crMax.bottom : crMax.left;
      }
    }
    return { tipMinXY, tipMinWH, tipMaxXY };
  }

  private getBoundingSingle() {
    let tipSingleXY = 0;
    let tipSingleWH = 0;
    let tipSingleB = 0;
    const fl = this.vertical;
    const tip = this.tipSingle;
    if (tip) {
      const cr = tip.getBoundingClientRect();
      tipSingleXY = fl ? cr.bottom : cr.left;
      tipSingleWH = fl ? tip.offsetHeight : tip.offsetWidth;
    }
    if (fl) {
      tipSingleB = tipSingleXY - tipSingleWH;
    } else {
      tipSingleB = tipSingleXY + tipSingleWH;
    }
    return { tipSingleXY, tipSingleB };
  }

  private toggleDisplay(options: CheckTip) {
    let {
      tipMaxXY,
      visibilityTipSingle,
      visibilityTipMax,
      visibilityTipMin,
      tipMinYTop,
      tipMinXRight,
    } = options;

    const display = (elem: HTMLElement, fl: boolean) => {
      if (elem)
        elem.style.visibility = fl ? 'visible' : 'hidden';
    };

    if (this.tipFrom && this.tipFromTo)
      if (this.tipTo) {
        const vis = visibilityTipSingle ? false : true;
        display(this.tipFrom, vis);
        display(this.tipTo, vis);
        display(this.tipSingle, visibilityTipSingle);

        if (visibilityTipSingle) {
          const { tipSingleXY, tipSingleB } = this.getBoundingSingle();
          if (this.vertical) {
            if (tipMaxXY >= tipSingleB)
              visibilityTipMax = true;
            if (tipMinYTop <= tipSingleXY)
              visibilityTipMin = false;
          } else {
            if (tipMaxXY <= tipSingleB)
              visibilityTipMax = true;
            if (tipMinXRight >= tipSingleXY)
              visibilityTipMin = false;
          }
        }
      } else {
        display(this.tipFrom, true);
        display(this.tipSingle, false);
      }

    if (this.tipMin && this.tipMinMax) {
      const visMax = visibilityTipMax && this.tipFrom ? false : true;
      display(this.tipMax, visMax);
      display(this.tipMin, visibilityTipMin);
    }
  }
}

export { Hints };