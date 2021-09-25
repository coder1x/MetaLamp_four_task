
import { CreateTipFromTo, CreateTipMinMax } from '../view.d';


class Hints {

  rsTop: HTMLElement;
  rsName: string;
  tipFrom: HTMLElement;
  tipTo: HTMLElement;
  tipMin: HTMLElement;
  tipMax: HTMLElement;
  tipSingle: HTMLElement;
  tipPrefix: string;


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

  getPrefix(val: number | string) {
    let text = String(val);
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
  }

  deleteTipTo() {
    if (!this.tipTo) return;
    this.tipTo.remove();
    this.tipTo = null;
  }

  deleteTipSingle() {
    if (!this.tipSingle) return;
    this.tipSingle.remove();
    this.tipSingle = null;
  }



  // --------------------------- заносим значения
  setData(elem: HTMLElement, val: number) {
    if (elem) {
      elem.innerText = this.getPrefix(val);
      this.checkVisibleTip();
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
    this.tipSingle.innerText = this.getPrefix(valFrom) +
      ' ⟷ ' +
      this.getPrefix(valTo);
  }

  // --------------------------- изменяем позицию и обнавляем значения
  setPositionFrom(coorXY: number, from: number) {
    if (!this.tipFrom) return;
    this.setValTipFrom(from);
    this.tipFrom.style.left = coorXY + '%';
  }

  setPositionTo(coorXY: number, to: number) {
    if (!this.tipTo) return;
    this.setValTipTo(to);
    this.tipTo.style.left = coorXY + '%';
  }

  setPositionSingle(coorXY: number) {
    if (!this.tipSingle) return;
    this.setValTipSingle();
    this.tipSingle.style.left = coorXY + '%';
  }



  getWidthTip() {
    let fromW = 0;
    let toW = 0;
    let singleW = 0;
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


  checkVisibleTip() {

    const minMaxF = !this.tipMin || !this.tipMax;
    const fromSingleF = !this.tipFrom || !this.tipSingle;

    if (minMaxF || fromSingleF) return;
    if (!this.tipSingle.style.left) return;

    const type = this.tipTo ? true : false;

    const tipFromX = this.tipFrom.getBoundingClientRect().left;
    const tipFromW = this.tipFrom.offsetWidth;

    let tipToX = 0;
    let tipToW = 0;
    if (type) {
      tipToX = this.tipTo.getBoundingClientRect().left;
      tipToW = this.tipTo.offsetWidth;
    }
    const tipMinX = this.tipMin.getBoundingClientRect().left;
    const tipMinW = this.tipMin.offsetWidth;
    const tipMaxX = this.tipMax.getBoundingClientRect().left;

    const tipFromXRight = tipFromX + tipFromW;
    const tipToXRight = tipToX + tipToW;
    const tipMinXRight = tipMinX + tipMinW;

    const visibilityTipSingle = tipFromXRight >= tipToX;
    const visibilityTipMax = tipMaxX <= tipToXRight || tipMaxX <= tipFromXRight;
    const visibilityTipMin = tipMinXRight <= tipFromX;

    const display = (elem: HTMLElement, str: string) => {
      elem.style.visibility = str;
    };


    if (type)
      if (visibilityTipSingle) {
        display(this.tipFrom, 'hidden');
        display(this.tipTo, 'hidden');
        display(this.tipSingle, 'visible');
      } else {
        display(this.tipFrom, 'visible');
        display(this.tipTo, 'visible');
        display(this.tipSingle, 'hidden');
      }

    if (visibilityTipMax)
      display(this.tipMax, 'hidden');
    else
      display(this.tipMax, 'visible');


    if (visibilityTipMin)
      display(this.tipMin, 'visible');
    else
      display(this.tipMin, 'hidden');


  }


}


export { Hints };