import autoBind from 'auto-bind';
import UpdateTip from './view.d';
import Handle from './sub-view/handle';
import Hints from './sub-view/hints';
import Bar from './sub-view/bar';
import Grid from './sub-view/grid';
import { Observer, ObserverOptions } from '../../observer';
import RangeSliderOptions from '../../glob-interface';

class View extends Observer {
  private rsName: string;

  private wrapSlider: Element;

  private rangeSlider: Element;

  private rsTop: Element;

  private rsCenter: HTMLElement;

  private rsBottom: Element;

  private rsLine: HTMLElement;

  private prevTheme: string;

  private vertical: boolean;

  private handle: Handle;

  private hints: Hints;

  private bar: Bar;

  private grid: Grid;

  private objData: ObserverOptions;

  onHandle: Function;

  elem: Element;

  constructor(elem: Element) {
    super();
    autoBind(this);
    this.elem = elem;
    this.rsName = 'range-slider-fox';
    this.wrapSlider = this.elem.parentElement;

    this.init();
  }

  async destroy() {
    const typeElem = await this.elem.constructor.name;
    if (typeElem === 'HTMLInputElement') {
      const input = this.elem as HTMLInputElement;
      input.value = ' ';
    }
    const elem = await this.wrapSlider.querySelector(`.js-${this.rsName}`);
    if (elem) { await elem.remove(); }

    this.handle = null;
    this.hints = null;
    this.bar = null;
    this.grid = null;
  }

  setValueInput(from: number, to: number, type: string) {
    const typeElem = this.elem.constructor.name;
    let str = '';
    if (typeElem === 'HTMLInputElement') {
      const input = this.elem as HTMLInputElement;

      input.value = str;
      str += from;
      if (type === 'double') {
        str += `,${to}`;
      }
      input.value = str;
    } else {
      return false;
    }

    return str;
  }

  outDataAttr() {
    if (this.objData) {
      if (Object.keys(this.objData).length !== 0) {
        this.notifyOB({
          key: 'DataAttributes',
          ...this.objData,
        });
        return this.objData;
      }
    }
    return false;
  }

  disabledRangeSlider(flag: boolean) {
    const elem = this.wrapSlider as HTMLElement;
    const style = elem.style as CSSStyleDeclaration;
    const opacity = flag ? style.opacity = '0.5' : style.opacity = '1';
    return opacity;
  }

  getWrapWH() {
    const size = (this.vertical
      ? this.rsCenter.offsetHeight
      : this.rsCenter.offsetWidth);
    return size;
  }

  createDomBase() {
    const createElem = (teg: string, className: string[]) => {
      const elem = document.createElement(teg);

      className.forEach((item) => {
        elem.classList.add(item);
      });

      return elem;
    };

    this.rangeSlider = createElem('div', [this.rsName, `js-${this.rsName}`]);
    this.rsTop = createElem('div', [
      `${this.rsName}__top`,
      `js-${this.rsName}__top`,
    ]);
    this.rsCenter = createElem('div', [
      `${this.rsName}__center`,
      `js-${this.rsName}__center`,
    ]);
    this.rsBottom = createElem('div', [
      `${this.rsName}__bottom`,
      `js-${this.rsName}__bottom`,
    ]);
    this.rsLine = createElem('span', [
      `${this.rsName}__line`,
      `js-${this.rsName}__line`,
    ]);

    this.rsCenter.appendChild(this.rsLine);
    this.rangeSlider.appendChild(this.rsTop);
    this.rangeSlider.appendChild(this.rsCenter);
    this.rangeSlider.appendChild(this.rsBottom);

    return this.wrapSlider.appendChild(this.rangeSlider);
  }

  async setOrientation(str: string) {
    const modify = `${this.rsName}_vertical`;
    const { classList } = this.rangeSlider;
    this.vertical = str === 'vertical';

    if (this.vertical) {
      classList.add(modify);
    } else {
      classList.remove(modify);
    }

    await this.handle.setOrientation(str);
    await this.hints.setOrientation(str);
    await this.bar.setOrientation(str);
    await this.grid.setOrientation(str);

    await this.sizeWrap();
  }

  setActions() {
    this.rsLine.addEventListener('click', this.handleRsLineClick);
  }

  setTheme(theme: string) {
    if (this.prevTheme) { this.rangeSlider.classList.remove(this.prevTheme); }
    const name = `rs-${theme}`;
    this.rangeSlider.classList.add(name);
    this.prevTheme = name;
  }

  // --------------------------------- handle
  createDotElem(type: string) {
    return this.handle.createDomBase(type);
  }

  setDotFrom(fromP: number) {
    return this.handle.setFrom(fromP);
  }

  setDotTo(toP: number) {
    return this.handle.setTo(toP);
  }

  setDotActions(type: string) {
    return this.handle.setActions(type);
  }

  // --------------------------------- hints

  setHintsData(options: ObserverOptions) {
    const masFlag: boolean[] = [];
    this.hints.setAdditionalText(options.tipPrefix, options.tipPostfix);
    this.hints.setTipFlag(options.tipFromTo, options.tipMinMax);

    if (options.tipMinMax) {
      masFlag.push(this.hints.createTipMinMax());
      this.hints.setValTipMinMax(options.min, options.max);
    } else {
      masFlag.push(this.hints.deleteTipMinMax());
    }

    if (options.tipFromTo) {
      masFlag.push(this.hints.createTipFrom());
      if (options.type === 'double') {
        masFlag.push(this.hints.createTipTo());
        masFlag.push(this.hints.createTipSingle());
      }
    } else {
      masFlag.push(this.hints.deleteTipFrom());
      if (options.type === 'double') {
        masFlag.push(this.hints.deleteTipTo());
        masFlag.push(this.hints.deleteTipSingle());
      }
    }
    return masFlag;
  }

  toggleTipTo(to: number) {
    let flag = false;
    if (!this.hints.checkTipTo()) {
      flag = this.hints.createTipTo();
      flag = Boolean(this.hints.setValTipTo(to));
    }
    return flag;
  }

  updateTipMinMax(min: number, max: number) {
    return this.hints.setValTipMinMax(min, max);
  }

  getWidthTip(startFlag: boolean, resetFlag: boolean) {
    if (startFlag && !resetFlag) { this.sizeWrap(); }
    return this.hints.getWidthTip();
  }

  deleteTipTo() {
    return this.hints.deleteTipTo();
  }

  checkVisibleTip() {
    return this.hints.checkVisibleTip();
  }

  updateTipValue(from: number, to: number, type: string) {
    const masFlag: boolean[] = [];
    masFlag.push(Boolean(this.hints.setValTipFrom(from)));
    if (type === 'double') {
      masFlag.push(Boolean(this.hints.setValTipTo(to)));
      masFlag.push(Boolean(this.hints.setValTipSingle()));
    }
    return masFlag;
  }

  updateTipPosition(coordinates: UpdateTip) {
    const masFlag: boolean[] = [];
    masFlag.push(Boolean(this.hints.setPositionFrom(coordinates.fromXY)));
    if (coordinates.toXY && coordinates.singleXY) {
      masFlag.push(Boolean(this.hints.setPositionTo(coordinates.toXY)));
      masFlag.push(Boolean(this.hints.setPositionSingle(coordinates.singleXY)));
    }
    return masFlag;
  }

  // --------------------------------- bar

  setVisibleBar(bar: boolean) {
    const masFlag: boolean[] = [];
    masFlag.push(this.bar.setVisibleBar(bar));
    masFlag.push(this.bar.createDomBar());
    const size = this.vertical
      ? this.rsLine.offsetWidth : this.rsLine.offsetHeight;
    masFlag.push(this.bar.setSizeWH(size));
    return masFlag;
  }

  setBar(barX: number, widthBar: number) {
    return this.bar.setBar(barX, widthBar);
  }

  // --------------------------------- Grid

  deleteGrid() {
    return this.grid.deleteGrid();
  }

  createDomGrid() {
    return this.grid.createDomGrid();
  }

  createMark(valMark: {
    val: number,
    position: number,
  }[]) {
    return this.grid.createMark(valMark);
  }

  private handleRsLineClick(event: MouseEvent) {
    this.notifyOB({
      key: 'ClickLine',
      clientXY: this.vertical ? event.offsetY : event.offsetX,
    });
  }

  private attributesChange() {
    const options = new Map([
      ['type', 'type'],
      ['disabled', 'disabled'],
      ['orientation', 'orientation'],
      ['theme', 'theme'],
      ['min', 'min'],
      ['max', 'max'],
      ['from', 'from'],
      ['to', 'to'],
      ['step', 'step'],
      ['key-step-one', 'keyStepOne'],
      ['key-step-hold', 'keyStepHold'],
      ['bar', 'bar'],
      ['grid', 'grid'],
      ['grid-snap', 'gridSnap'],
      ['grid-num', 'gridNum'],
      ['grid-step', 'gridStep'],
      ['grid-round', 'gridRound'],
      ['tip-min-max', 'tipMinMax'],
      ['tip-from-to', 'tipFromTo'],
      ['tip-prefix', 'tipPrefix'],
      ['tip-postfix', 'tipPostfix'],
    ]);

    const mapOptions = new Map();

    const getDataAttr = (item: string) => {
      const attribute = `data-${item}`;
      if (this.elem.hasAttribute(attribute)) {
        const value = this.elem.getAttribute(attribute);
        const key = options.get(item);

        const regNumber = /^-?\d*?[.]?\d*$/;
        if (regNumber.test(value)) {
          return [key, Number(value)];
        }

        const regBoolean = /^(true|false)$/;
        if (regBoolean.test(value)) {
          return [key, (value === 'true')];
        }
        return [key, value];
      }
      return false;
    };

    const masDataAttr: string[] = [];

    options.forEach((value, key) => {
      const data = getDataAttr(key);
      if (data) {
        const [dataAttr] = data;
        const [, valueAttr] = data;
        mapOptions.set(dataAttr, valueAttr);
      }
      masDataAttr.push(`data-${key}`);
    });

    this.objData = Object.fromEntries(mapOptions);
    const observer = new MutationObserver((mutation) => {
      const obj: RangeSliderOptions = {};

      mutation.forEach((item) => {
        const attr = item.attributeName;
        const trimAttr = attr.replace('data-', '');
        const data = getDataAttr(trimAttr);

        if (data) {
          const key = String(data[0]);
          const val = data[1];
          // использую type assertions так как не нашёл возможности передавать нужный тип
          // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
          View.setProperty(obj, key as keyof RangeSliderOptions, val);
        }
      });

      if (obj) {
        this.notifyOB({
          key: 'DataAttributes',
          ...obj,
        });
      }
    });

    observer.observe(this.elem, {
      attributeFilter: masDataAttr,
    });
  }

  private static setProperty<T, K extends keyof T>(
    obj: T,
    key: K,
    value: T[K],
  ) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = value;
  }

  private init() {
    this.onHandle = async () => {
      await this.createDomBase(); // create basic DOM elements
      await this.setActions(); // add event listeners

      this.handle = await new Handle(this.rsCenter, this.rsName);
      this.hints = await new Hints(this.rsTop, this.rsName);
      this.bar = await new Bar(this.rsCenter, this.rsName);
      this.grid = await new Grid(this.rsBottom, this.rsName);

      await this.createListeners();
      await this.attributesChange();
    };
  }

  private createListeners() {
    this.handle.subscribeOB(this.handleForwarding);
    this.bar.subscribeOB(this.handleForwarding);
    this.grid.subscribeOB(this.handleForwarding);
  }

  private handleForwarding = (options: ObserverOptions) => {
    this.notifyOB({ ...options });
    return true;
  };

  private sizeWrap() {
    let wrapWH = 0;
    if (this.vertical) {
      wrapWH = this.rsCenter.offsetHeight;
    } else {
      wrapWH = this.rsCenter.offsetWidth;
    }

    this.notifyOB({
      key: 'SizeWrap',
      wrapWH,
    });
  }
}

export default View;
