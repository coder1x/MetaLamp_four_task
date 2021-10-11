import { Observer, TOB } from '../../../observer';

class Bar extends Observer {


  rsCenter: HTMLElement;
  rsName: string;
  elemBar: HTMLElement;

  constructor(elem: HTMLElement | Element) {
    super();
    this.rsName = 'range-slider';
    this.rsCenter = (elem as HTMLElement);
  }

  createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

  createDomBar() {
    this.elemBar = this.createElem('span', [this.rsName + '__bar']);
    this.rsCenter.appendChild(this.elemBar);
  }

  setSizeWH(size: number) {
    this.elemBar.style.height = size + 'px';
  }

  setBar(barX: number, widthBar: number) {
    this.elemBar.style.left = barX + '%';
    this.elemBar.style.width = widthBar + '%';
  }
}

export { Bar };