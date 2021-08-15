
import { CreateTipFromTo } from '../view.d';

class Hints {

  rsTop: HTMLElement;
  rsName: string;
  tipFrom: HTMLElement;
  tipTo: HTMLElement;
  tipMin: HTMLElement;
  tipMax: HTMLElement;
  tipSingle: HTMLElement;
  flMinMax: boolean;
  flFromTo: boolean;
  fromPosition: number;
  toPosition: number;
  type: string;
  tipPrefix: string;

  // eslint-disable-next-line no-unused-vars
  constructor(elem: HTMLElement | Element) {
    this.rsName = 'range-slider';
    this.rsTop = (elem as HTMLElement);
    this.flMinMax = false;
    this.flFromTo = false;
  }

  createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

  createTipMinMax(min: number, max: number, tipPrefix: string) {
    this.tipPrefix = tipPrefix;
    this.tipMin = this.createElem('div', [this.rsName + '__tip-min']);
    this.tipMax = this.createElem('div', [this.rsName + '__tip-max']);
    this.setTipMin(min);
    this.setTipMax(max);
    this.rsTop.appendChild(this.tipMin);
    this.rsTop.appendChild(this.tipMax);
    this.flMinMax = true;
  }

  createTipFromTo(options: CreateTipFromTo) {
    const op = options;
    this.tipPrefix = op.tipPrefix;
    this.type = op.type;
    this.tipFrom = this.createElem('div', [this.rsName + '__tip-from']);
    this.tipFrom.innerText = this.getPrefix(op.valFrom);
    this.rsTop.appendChild(this.tipFrom);

    if (op.type == 'double') {
      this.tipTo = this.createElem('div', [this.rsName + '__tip-to']);
      this.tipTo.innerText = this.getPrefix(op.valTo);

      this.tipSingle = this.createElem('div', [this.rsName + '__tip-single']);
      this.tipSingle.innerText =
        this.getPrefix(op.valFrom) +
        ' ⟷ ' +
        this.getPrefix(op.valTo);
      this.tipSingle.style.visibility = 'hidden';
      this.rsTop.appendChild(this.tipTo);
      this.rsTop.appendChild(this.tipSingle);
    }

    this.flFromTo = true;
  }


  setTipSingle() {
    if (!this.flMinMax || !this.flFromTo || this.type == 'single') return;
    const valFrom = this.tipFrom.innerHTML;
    const valTo = this.tipTo.innerHTML;
    this.tipSingle.innerText = valFrom + ' ⟷ ' + valTo;
  }

  getWidthSingle() {
    if (this.type == 'double') {
      return this.tipSingle.offsetWidth;
    } else {
      return 0;
    }
  }

  getWidthFrom() {
    return this.tipFrom.offsetWidth;
  }

  getWidthTo() {
    if (this.type == 'double') {
      return this.tipTo.offsetWidth;
    } else {
      return 0;
    }
  }

  positionTipSingle(singleX: number) {
    if (this.type == 'double')
      this.tipSingle.style.left = singleX + '%';
  }

  checkVisibleTip() {
    if (!this.flMinMax || !this.flFromTo) return;

    const tipFromX = this.tipFrom.getBoundingClientRect().left;
    const tipFromW = this.tipFrom.offsetWidth;

    let tipToX = 0;
    let tipToW = 0;
    if (this.type == 'double') {
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

    if (this.type == 'double')
      if (visibilityTipSingle) {
        this.tipFrom.style.visibility = 'hidden';
        this.tipTo.style.visibility = 'hidden';
        this.tipSingle.style.visibility = 'visible';
      } else {
        this.tipFrom.style.visibility = 'visible';
        this.tipTo.style.visibility = 'visible';
        this.tipSingle.style.visibility = 'hidden';
      }

    if (visibilityTipMax)
      this.tipMax.style.visibility = 'hidden';
    else
      this.tipMax.style.visibility = 'visible';

    if (visibilityTipMin)
      this.tipMin.style.visibility = 'visible';
    else
      this.tipMin.style.visibility = 'hidden';

  }

  getPrefix(val: number) {
    let text = String(val);
    if (this.tipPrefix)
      text += ' ' + this.tipPrefix;
    return text;
  }

  setTipMin(min: number) {
    this.tipMin.innerText = this.getPrefix(min);
    this.checkVisibleTip();
  }

  setTipMax(max: number) {
    this.tipMax.innerText = this.getPrefix(max);
    this.checkVisibleTip();
  }


  setTipFrom(valFrom: number, fromX: number) {
    this.fromPosition = fromX;
    this.tipFrom.innerText = this.getPrefix(valFrom);
    this.tipFrom.style.left = fromX + '%';
    this.checkVisibleTip();
    this.setTipSingle();
  }

  setTipTo(valTo: number, toX: number) {
    if (this.type == 'single') return;
    this.toPosition = toX;
    this.tipTo.innerText = this.getPrefix(valTo);
    this.tipTo.style.left = toX + '%';
    this.checkVisibleTip();
    this.setTipSingle();
  }


}


export { Hints };