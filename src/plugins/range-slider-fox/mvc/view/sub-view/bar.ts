import { Observer } from '../../../observer';

class Bar extends Observer {


  private rsCenter: HTMLElement;
  private rsName: string;
  private elemBar: HTMLElement;
  private bar: boolean;
  private vertical: boolean;


  constructor(elem: HTMLElement | Element, rsName: string) {
    super();
    this.rsName = rsName;
    this.rsCenter = (elem as HTMLElement);
  }

  setVisibleBar(bar: boolean) {
    this.bar = bar;
  }

  setOrientation(str: string) {
    this.vertical = str == 'vertical' ? true : false;

    const convertStyle = (elem: CSSStyleDeclaration) => {
      let val = '';
      let sizeW = '';
      let sizeH = '';
      if (this.vertical) {
        if (elem.left == '') return;
        val = elem.left;
        sizeW = elem.width;
        sizeH = elem.height;
        elem.removeProperty('left');
        elem.bottom = val;
      } else {
        if (elem.bottom == '') return;
        val = elem.bottom;
        sizeW = elem.width;
        sizeH = elem.height;
        elem.removeProperty('bottom');
        elem.left = val;
      }
      elem.width = sizeH;
      elem.height = sizeW;
    };

    if (this.elemBar)
      convertStyle(this.elemBar.style);
  }


  setActions() {
    this.elemBar.addEventListener('click', (event: MouseEvent) => {
      const dotXY = this.vertical ? event.offsetY : event.offsetX;

      this.notifyOB({
        key: 'ClickBar',
        clientXY: dotXY,
      });
    });
  }

  private createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

  createDomBar() {
    if (!this.bar && this.elemBar) {
      this.elemBar.remove();
      this.elemBar = null;
      return;
    }
    if (this.bar && this.elemBar) return;
    if (!this.bar && !this.elemBar) return;

    this.elemBar = this.createElem('span', [this.rsName + '__bar']);
    this.rsCenter.appendChild(this.elemBar);

    this.setActions();
  }

  setSizeWH(size: number) {
    if (!this.elemBar) return;

    const sizePX = size + 'px';
    const st = this.elemBar.style;
    this.vertical ? st.width = sizePX : st.height = sizePX;
  }

  setBar(barX: number, widthBar: number) {
    if (!this.elemBar) return;

    const st = this.elemBar.style;

    if (this.vertical) {
      st.bottom = barX + '%';
      st.height = widthBar + '%';
    } else {
      st.left = barX + '%';
      st.width = widthBar + '%';
    }

  }
}

export { Bar };