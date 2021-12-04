import { Observer } from '../../../observer';


class Bar extends Observer {

  private rsCenter: Element;
  private rsName: string;
  private elemBar: HTMLElement;
  private bar: boolean;
  private vertical: boolean;


  constructor(elem: HTMLElement | Element, rsName: string) {
    super();
    this.rsName = rsName;
    this.rsCenter = elem;
  }


  setVisibleBar(bar: boolean) {
    return this.bar = bar;
  }


  setOrientation(str: string) {
    this.vertical = str == 'vertical' ? true : false;

    const convertStyle = (elem: CSSStyleDeclaration) => {
      let sizeW = '';
      let sizeH = '';

      const toggleBar = (
        from: keyof CSSStyleDeclaration,
        to: keyof CSSStyleDeclaration
      ) => {
        const val = this.getProperty(elem, from);
        if (val == '') return false;
        sizeW = elem.width;
        sizeH = elem.height;
        elem.removeProperty(String(from));
        const key = to;
        this.setProperty(elem, key, val);
        return true;
      };

      if (this.vertical) {
        if (!toggleBar('left', 'bottom')) return false;
      } else {
        if (!toggleBar('bottom', 'left')) return false;
      }
      elem.width = sizeH;
      elem.height = sizeW;

      return true;
    };

    if (this.elemBar)
      return convertStyle(this.elemBar.style);

    return false;
  }


  private setActions() {
    this.elemBar.addEventListener('click', (event: MouseEvent) => {
      const dotXY = this.vertical ? event.offsetY : event.offsetX;

      this.notifyOB({
        key: 'ClickBar',
        clientXY: dotXY,
      });
    });
  }


  createDomBar() {
    if (!this.bar && this.elemBar) {
      this.elemBar.remove();
      this.elemBar = null;
      return false;
    }
    if (this.bar && this.elemBar) return false;
    if (!this.bar && !this.elemBar) return false;

    const barName = this.rsName + '__bar';
    this.elemBar = this.createElem('span', [barName, 'js-' + barName]);
    this.rsCenter.appendChild(this.elemBar);

    this.setActions();
    return true;
  }


  setSizeWH(size: number) {
    if (!this.elemBar) return false;

    const sizePX = size + 'px';
    const st = this.elemBar.style;
    this.vertical ? st.width = sizePX : st.height = sizePX;
    return true;
  }


  setBar(barX: number, widthBar: number) {
    if (!this.elemBar) return false;

    const st = this.elemBar.style;

    if (this.vertical) {
      st.bottom = barX + '%';
      st.height = widthBar + '%';
    } else {
      st.left = barX + '%';
      st.width = widthBar + '%';
    }
    return true;
  }


  private getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
  }


  private setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
  }


  private createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

}

export { Bar };