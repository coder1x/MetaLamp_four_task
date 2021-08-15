class Bar {

  rsCenter: HTMLElement;
  rsName: string;
  elemBar: HTMLElement;

  constructor(elem: HTMLElement | Element) {
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

  createDomBar(line: HTMLElement) {
    this.elemBar = this.createElem('span', [this.rsName + '__bar']);
    this.elemBar.style.height = line.offsetHeight + 'px';
    this.rsCenter.appendChild(this.elemBar);
  }

  setBar(barX: number, widthBar: number) {
    this.elemBar.style.left = barX + '%';
    this.elemBar.style.width = widthBar + '%';
  }
}

export { Bar };