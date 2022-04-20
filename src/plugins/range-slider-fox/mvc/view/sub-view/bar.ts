import { boundMethod } from 'autobind-decorator';
import { Observer } from '../../../Observer';

class Bar extends Observer {
  private rsCenter: Element;

  private rsName: string;

  private elemBar: HTMLElement | null = null;

  private bar: boolean = false;

  private vertical: boolean = false;

  constructor(elem: HTMLElement | Element, rsName: string) {
    super();
    this.rsName = rsName;
    this.rsCenter = elem;
  }

  setVisibleBar(bar: boolean) {
    this.bar = bar;
    return this.bar;
  }

  setOrientation(str: string) {
    this.vertical = str === 'vertical';

    const convertStyle = (style: CSSStyleDeclaration) => {
      let sizeW = '';
      let sizeH = '';
      const styleDom = style;

      const toggleBar = (
        from: keyof CSSStyleDeclaration,
        to: keyof CSSStyleDeclaration,
      ) => {
        const value = Bar.getProperty(styleDom, from);
        if (value === '') return false;
        sizeW = styleDom.width;
        sizeH = styleDom.height;
        styleDom.removeProperty(String(from));
        Bar.setProperty(styleDom, to, value);
        return true;
      };

      if (this.vertical) {
        if (!toggleBar('left', 'bottom')) return false;
      } else if (!toggleBar('bottom', 'left')) return false;
      styleDom.width = sizeH;
      styleDom.height = sizeW;

      return true;
    };

    if (this.elemBar) { return convertStyle(this.elemBar.style); }

    return false;
  }

  createDomBar() {
    if (!this.bar && this.elemBar) {
      this.elemBar.remove();
      this.elemBar = null;
      return false;
    }
    if (this.bar && this.elemBar) return false;
    if (!this.bar && !this.elemBar) return false;

    const barName = `${this.rsName}__bar`;
    this.elemBar = Bar.createElem('span', [barName, `js-${barName}`]);
    this.rsCenter.appendChild(this.elemBar);

    this.setActions();
    return true;
  }

  setSizeWH(size: number) {
    if (!this.elemBar) return false;

    const sizePX = `${size}px`;
    const { style } = this.elemBar;

    if (this.vertical) {
      style.width = sizePX;
    } else {
      style.height = sizePX;
    }

    return true;
  }

  setBar(barX: number, widthBar: number) {
    if (!this.elemBar) return false;

    const { style } = this.elemBar;

    if (this.vertical) {
      style.bottom = `${barX}%`;
      style.height = `${widthBar}%`;
    } else {
      style.left = `${barX}%`;
      style.width = `${widthBar}%`;
    }
    return true;
  }

  private setActions() {
    if (!this.elemBar) return false;

    this.elemBar.addEventListener('click', this.handleBarClick);

    return true;
  }

  @boundMethod
  private handleBarClick(event: MouseEvent) {
    this.notifyOB({
      key: 'ClickBar',
      clientXY: this.vertical ? event.offsetY : event.offsetX,
    });
  }

  private static getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
  }

  private static setProperty<T, K extends keyof T>(
    obj: T,
    key: K,
    value: T[K],
  ) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = value;
  }

  private static createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    className.forEach((item) => {
      elem.classList.add(item);
    });

    return elem;
  }
}

export default Bar;
