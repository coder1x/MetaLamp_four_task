

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


  setPrefix(tipPrefix: string) {
    this.tipPrefix = tipPrefix;
  }

  setPostfix(tipPostfix: string) {
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

  checkTipTo() {
    return this.tipTo ? true : false;
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
    this.tipSingle.innerText = valFrom + ' ⟷ ' + valTo;
  }

  // --------------------------- изменяем позицию и обнавляем значения
  setPositionFrom(coorXY: number, from: number) {
    if (!this.tipFrom) return;
    this.setValTipFrom(from);
    this.tipFrom.style.left = coorXY + '%';
    this.checkVisibleTip();
  }

  setPositionTo(coorXY: number, to: number) {
    if (!this.tipTo) return;
    this.setValTipTo(to);
    this.tipTo.style.left = coorXY + '%';
    this.checkVisibleTip();
  }

  setPositionSingle(coorXY: number) {
    if (!this.tipSingle) return;
    this.setValTipSingle();
    this.tipSingle.style.left = coorXY + '%';
  }


  //--------------------------------------- оптимизировать. 
  getWidthTip() {
    let fromW = 0;
    let toW = 0;
    let singleW = 0;

    // - это можно перебрать через map метод. 
    if (this.tipFrom)
      fromW = this.tipFrom.offsetWidth;
    if (this.tipTo)
      toW = this.tipTo.offsetWidth;
    if (this.tipSingle)
      singleW = this.tipSingle.offsetWidth;
    return { fromW, toW, singleW, };
  }


  getHeightTip() {
    let fromW = 0;
    let toW = 0;
    let singleW = 0;
    if (this.tipFrom)
      fromW = this.tipFrom.offsetHeight;
    if (this.tipTo)
      toW = this.tipTo.offsetHeight;
    if (this.tipSingle)
      singleW = this.tipSingle.offsetHeight;
    return { fromW, toW, singleW, };
  }
  //--------------------------------------------- end 



  checkVisibleTip() {
    let tipFromX = 0;
    let tipFromW = 0;
    let tipToX = 0;
    let tipToW = 0;
    let tipMinX = 0;
    let tipMinW = 0;
    let tipMaxX = 0;

    const type = this.checkTipTo();

    if (this.tipFrom) {
      tipFromX = this.tipFrom.getBoundingClientRect().left;
      tipFromW = this.tipFrom.offsetWidth;
    }

    if (type) {
      tipToX = this.tipTo.getBoundingClientRect().left;
      tipToW = this.tipTo.offsetWidth;
    }

    if (this.tipMin) {
      tipMinX = this.tipMin.getBoundingClientRect().left;
      tipMinW = this.tipMin.offsetWidth;
      tipMaxX = this.tipMax.getBoundingClientRect().left;
    }

    const tipMinXRight = tipMinX + tipMinW;
    const tipFromXRight = tipFromX + tipFromW;
    const tipToXRight = tipToX + tipToW;
    const visibilityTipSingle = tipFromXRight >= tipToX;
    let visibilityTipMax = tipMaxX <= tipToXRight || tipMaxX <= tipFromXRight;
    const visibilityTipMin = tipMinXRight <= tipFromX || !this.tipFrom;

    const display = (elem: HTMLElement, fl: boolean) => {
      const toggle = fl ? 'visible' : 'hidden';
      elem.style.visibility = toggle;
    };

    if (this.tipFrom)
      if (type) {
        const vis = visibilityTipSingle ? false : true;
        display(this.tipFrom, vis);
        display(this.tipTo, vis);
        display(this.tipSingle, visibilityTipSingle);
      } else {
        display(this.tipFrom, true);
        display(this.tipSingle, false);
      }

    if (this.tipMin) {
      const visMax = visibilityTipMax && this.tipFrom ? false : true;
      display(this.tipMax, visMax);

      display(this.tipMin, visibilityTipMin);
    }
  }


}


export { Hints };