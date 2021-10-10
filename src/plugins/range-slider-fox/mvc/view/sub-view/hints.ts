
interface CH {
  tipMaxXY: number,
  visibilityTipSingle: boolean,
  visibilityTipMax: boolean,
  visibilityTipMin: boolean,
  tipMinYTop: number,
  tipMinXRight: number,
}


class Hints {

  rsTop: HTMLElement;
  rsName: string;
  tipFrom: HTMLElement;
  tipTo: HTMLElement;
  tipMin: HTMLElement;
  tipMax: HTMLElement;
  tipSingle: HTMLElement;
  tipPrefix: string;
  tipPostfix: string;
  tipFromTo: boolean;
  tipMinMax: boolean;
  vertical: boolean;


  constructor(elem: HTMLElement | Element) {
    this.rsName = 'range-slider-fox';
    this.rsTop = (elem as HTMLElement);
  }

  createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

  setTipFlag(tipFromTo: boolean, tipMinMax: boolean) {
    this.tipFromTo = tipFromTo;
    this.tipMinMax = tipMinMax;
  }

  setAdditionalText(tipPrefix: string, tipPostfix: string) {
    this.tipPrefix = tipPrefix;
    this.tipPostfix = tipPostfix;
  }


  getPrefix(val: number | string) {
    let text = String(val);
    if (this.tipPostfix)
      text = this.tipPostfix + ' ' + text;
    if (this.tipPrefix)
      text += ' ' + this.tipPrefix;
    return text;
  }

  setOrientation(str: string) {
    this.vertical = str == 'vertical' ? true : false;
    // нужно вызвать сигнал который перестроит подсказки по новым координатам.

    const convertStyle = (elem: CSSStyleDeclaration) => {
      let val = '';
      if (this.vertical) {
        if (elem.left == '') return;
        val = elem.left;
        elem.removeProperty('left');
        elem.bottom = val;
      } else {
        if (elem.bottom == '') return;
        val = elem.bottom;
        elem.removeProperty('bottom');
        elem.left = val;
      }
    };

    if (this.tipFrom)
      convertStyle(this.tipFrom.style);

    if (this.tipTo) {
      convertStyle(this.tipTo.style);
      if (this.tipSingle)
        convertStyle(this.tipSingle.style);
    }

  }

  //----------------------- создаём элементы

  createTipMinMax() {
    if (this.tipMin && this.tipMax) return;
    this.tipMin = this.createElem('div', [this.rsName + '__tip-min']);
    this.tipMax = this.createElem('div', [this.rsName + '__tip-max']);
    this.rsTop.appendChild(this.tipMin);
    this.rsTop.appendChild(this.tipMax);
  }

  createTipFrom() {
    if (this.tipFrom) return;
    this.tipFrom = this.createElem('div', [this.rsName + '__tip-from']);
    this.rsTop.appendChild(this.tipFrom);
  }

  createTipTo() {
    if (this.tipTo) return;
    this.tipTo = this.createElem('div', [this.rsName + '__tip-to']);
    this.rsTop.appendChild(this.tipTo);
  }

  createTipSingle() {
    if (this.tipSingle) return;
    this.tipSingle = this.createElem('div', [this.rsName + '__tip-single']);
    this.tipSingle.style.visibility = 'hidden';
    this.rsTop.appendChild(this.tipSingle);
  }


  //------------------- удаляем элементы
  deleteTipMinMax() {
    if (!this.tipMin && !this.tipMax) return;
    this.tipMin.remove();
    this.tipMax.remove();
    this.tipMin = null;
    this.tipMax = null;
  }

  deleteTipFrom() {
    if (!this.tipFrom) return;
    this.tipFrom.remove();
    this.tipFrom = null;
    this.checkVisibleTip();
  }

  deleteTipTo() {
    if (!this.tipTo) return;
    this.tipTo.remove();
    this.tipTo = null;
    this.checkVisibleTip();
  }

  deleteTipSingle() {
    if (!this.tipSingle) return;
    this.tipSingle.remove();
    this.tipSingle = null;
  }
  //-------------------

  checkTipTo() {
    return this.tipTo || !this.tipFromTo ? true : false;
  }


  // --------------------------- заносим значения
  setData(elem: HTMLElement, val: number) {
    if (elem) {
      elem.innerText = this.getPrefix(val);
    }
  }


  setValTipMinMax(min: number, max: number) {
    this.setData(this.tipMin, min);
    this.setData(this.tipMax, max);
  }

  setValTipFrom(from: number) {
    this.setData(this.tipFrom, from);
  }
  setValTipTo(to: number) {
    this.setData(this.tipTo, to);
  }

  setValTipSingle() {
    if (!this.tipSingle) return;
    const valFrom = this.tipFrom.innerHTML;
    const valTo = this.tipTo.innerHTML;
    this.tipSingle.innerText = valFrom +
      (this.vertical ? ' ↕ ' : ' ⟷ ') + valTo;
  }

  // --------------------------- изменяем позицию и обнавляем значения

  setStylePosition(coorXY: number, st: CSSStyleDeclaration) {
    this.vertical ? st.bottom = coorXY + '%' : st.left = coorXY + '%';
  }

  setPositionFrom(coorXY: number, from: number) {
    if (!this.tipFrom) return;
    this.setValTipFrom(from);
    const st = this.tipFrom.style;
    this.setStylePosition(coorXY, st);
    this.checkVisibleTip();
  }

  setPositionTo(coorXY: number, to: number) {
    if (!this.tipTo) return;
    this.setValTipTo(to);
    const st = this.tipTo.style;
    this.setStylePosition(coorXY, st);
    this.checkVisibleTip();
  }

  setPositionSingle(coorXY: number) {
    if (!this.tipSingle) return;
    this.setValTipSingle();
    const st = this.tipSingle.style;
    this.setStylePosition(coorXY, st);
  }


  getSizeElem(elem: HTMLElement) {
    return this.vertical ? elem.offsetHeight : elem.offsetWidth;
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



  getBoundingFrom() {
    let tipFromXY = 0;
    let tipFromWH = 0;
    if (this.tipFrom) {
      const cr = this.tipFrom.getBoundingClientRect();
      tipFromXY = this.vertical ? cr.bottom : cr.left;
      tipFromWH = this.vertical ?
        this.tipFrom.offsetHeight : this.tipFrom.offsetWidth;
    }
    return { tipFromXY, tipFromWH };
  }

  getBoundingTo() {
    let tipToXY = 0;
    let tipToWH = 0;
    if (this.tipTo) {
      const cr = this.tipTo.getBoundingClientRect();
      tipToXY = this.vertical ? cr.bottom : cr.left;
      tipToWH = this.vertical ?
        this.tipTo.offsetHeight : this.tipTo.offsetWidth;
    }
    return { tipToXY, tipToWH };
  }

  getBoundingMinMax() {
    let tipMinXY = 0;
    let tipMinWH = 0;
    let tipMaxXY = 0;
    if (this.tipMin) {
      const crMin = this.tipMin.getBoundingClientRect();
      tipMinXY = this.vertical ? crMin.bottom : crMin.left;
      tipMinWH = this.vertical ?
        this.tipMin.offsetHeight : this.tipMin.offsetWidth;

      const crMax = this.tipMax.getBoundingClientRect();
      tipMaxXY = this.vertical ? crMax.bottom : crMax.left;
    }
    return { tipMinXY, tipMinWH, tipMaxXY };
  }

  getBoundingSingle() {
    let tipSingleXY = 0;
    let tipSingleWH = 0;
    let tipSingleB = 0;

    const cr = this.tipSingle.getBoundingClientRect();
    tipSingleXY = this.vertical ? cr.bottom : cr.left;
    tipSingleWH = this.vertical ?
      this.tipSingle.offsetHeight : this.tipSingle.offsetWidth;

    if (this.vertical) {
      tipSingleB = tipSingleXY - tipSingleWH;
    } else {
      tipSingleB = tipSingleXY + tipSingleWH;
    }

    return { tipSingleXY, tipSingleB };
  }

  toggleDisplay(op: CH) {

    let {
      tipMaxXY,
      visibilityTipSingle,
      visibilityTipMax,
      visibilityTipMin,
      tipMinYTop,
      tipMinXRight,
    } = op;

    const display = (elem: HTMLElement, fl: boolean) => {
      const toggle = fl ? 'visible' : 'hidden';
      if (elem)
        elem.style.visibility = toggle;
    };

    if (this.tipFrom && this.tipFromTo)
      if (this.tipTo) {
        const vis = visibilityTipSingle ? false : true;
        display(this.tipFrom, vis);
        display(this.tipTo, vis);
        display(this.tipSingle, visibilityTipSingle);

        if (visibilityTipSingle) {
          let { tipSingleXY, tipSingleB } = this.getBoundingSingle();
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



  checkVisibleTip() {
    if (!this.tipMinMax && !this.tipFromTo) return;

    //------------------------------------------- Получаем данные
    let { tipFromXY, tipFromWH } = this.getBoundingFrom();
    let { tipToXY, tipToWH } = this.getBoundingTo();
    let { tipMinXY, tipMinWH, tipMaxXY } = this.getBoundingMinMax();
    //-------------------------------------------

    let visibilityTipSingle = false;
    let visibilityTipMax = false;
    let visibilityTipMin = false;
    let tipMinYTop = 0;
    let tipMinXRight = 0;

    //------------------------------------------- Определяем логику
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
    //------------------------------------------- Изменяем отображение
    this.toggleDisplay({
      tipMaxXY,
      visibilityTipSingle,
      visibilityTipMax,
      visibilityTipMin,
      tipMinYTop,
      tipMinXRight,
    });
    //------------------------------------------- 
  }


}


export { Hints };