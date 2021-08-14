
//import { TipFromTo } from '../view.d';

class Hints {

  rsTop: HTMLElement;
  rsName: string;
  tipFrom: HTMLElement;
  tipTo: HTMLElement;
  tipMin: HTMLElement;
  tipMax: HTMLElement;

  // eslint-disable-next-line no-unused-vars
  constructor(elem: HTMLElement | Element) {
    this.rsName = 'range-slider';
    this.rsTop = (elem as HTMLElement);
  }

  createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

  createTipMinMax(min: number, max: number) {

    this.tipMin = this.createElem('div', [this.rsName + '__tip-min']);
    this.tipMax = this.createElem('div', [this.rsName + '__tip-max']);
    this.setTipMin(min);
    this.setTipMax(max);
    this.rsTop.appendChild(this.tipMin);
    this.rsTop.appendChild(this.tipMax);

  }

  createTipFromTo(valFrom: number, valTo: number) {
    this.tipFrom = this.createElem('div', [this.rsName + '__tip-from']);
    this.tipTo = this.createElem('div', [this.rsName + '__tip-to']);
    this.tipFrom.innerText = String(valFrom);
    this.tipTo.innerText = String(valTo);
    this.rsTop.appendChild(this.tipFrom);
    this.rsTop.appendChild(this.tipTo);
  }

  setTipMin(min: number) {
    this.tipMin.innerText = String(min);
  }

  setTipMax(max: number) {
    this.tipMax.innerText = String(max);
  }


  setTipFrom(valFrom: number, fromX: Number) {
    this.tipFrom.innerText = String(valFrom);
    this.tipFrom.style.left = fromX + '%';
  }

  setTipTo(valTo: number, toX: number) {
    this.tipTo.innerText = String(valTo);
    this.tipTo.style.left = toX + '%';
  }


}


export { Hints };