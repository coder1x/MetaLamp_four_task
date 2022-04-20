import { boundMethod } from 'autobind-decorator';
import UpdateTip from './view.d';
import Handle from './sub-view/Handle';
import Hints from './sub-view/Hints';
import Bar from './sub-view/Bar';
import Grid from './sub-view/Grid';
import { Observer, ObserverOptions } from '../../Observer';
import RangeSliderOptions from '../../glob-interface';

class View extends Observer {
  private rsName: string = '';

  private wrapSlider: Element | null = null;

  private rangeSlider: Element | null = null;

  private rsTop: Element | null = null;

  private rsCenter: HTMLElement | null = null;

  private rsBottom: Element | null = null;

  private rsLine: HTMLElement | null = null;

  private prevTheme: string = '';

  private vertical: boolean = false;

  private handle: Handle | null = null;

  private hints: Hints | null = null;

  private bar: Bar | null = null;

  private grid: Grid | null = null;

  private objData: ObserverOptions | null = null;

  onHandle: Function | null = null;

  elem: Element | null = null;

  constructor(elem: Element) {
    super();
    this.elem = elem;
    this.rsName = 'range-slider-fox';
    this.wrapSlider = this.elem.parentElement;

    this.init();
  }

  async destroy() {
    if (!this.elem || !this.wrapSlider) return false;

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

    return true;
  }

  setValueInput(from: number, to: number, type: string) {
    if (!this.elem) return false;

    let str = '';
    if (this.elem.constructor.name === 'HTMLInputElement') {
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
    if (!this.rsCenter) return 0;

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

    if (!this.wrapSlider) return null;

    return this.wrapSlider.appendChild(this.rangeSlider);
  }

  async setOrientation(str: string) {
    const modify = `${this.rsName}_vertical`;
    const { classList } = this.rangeSlider as Element;
    this.vertical = str === 'vertical';

    if (this.vertical) {
      classList.add(modify);
    } else {
      classList.remove(modify);
    }

    if (!this.handle || !this.hints) return false;

    await this.handle.setOrientation(str);
    await this.hints.setOrientation(str);

    if (!this.bar || !this.grid) return false;

    await this.bar.setOrientation(str);
    await this.grid.setOrientation(str);

    await this.sizeWrap();

    return true;
  }

  setActions() {
    if (this.rsLine) {
      this.rsLine.addEventListener('click', this.handleRsLineClick);
    }
  }

  setTheme(theme: string) {
    if (!this.rangeSlider) return false;

    if (this.prevTheme) {
      this.rangeSlider.classList.remove(this.prevTheme);
    }
    const name = `rs-${theme}`;
    this.rangeSlider.classList.add(name);
    this.prevTheme = name;

    return true;
  }

  // --------------------------------- handle
  createDotElem(type: string) {
    if (!this.handle) return null;
    return this.handle.createDomBase(type);
  }

  setDotFrom(fromP: number) {
    if (!this.handle) return null;
    return this.handle.setFrom(fromP);
  }

  setDotTo(toP: number) {
    if (!this.handle) return null;
    return this.handle.setTo(toP);
  }

  setDotActions(type: string) {
    if (!this.handle) return null;
    return this.handle.setActions(type);
  }

  // --------------------------------- hints

  setHintsData(options: ObserverOptions) {
    if (!this.hints) return [];

    const masFlag: boolean[] = [];
    this.hints.setAdditionalText(
      options.tipPrefix ?? '',
      options.tipPostfix ?? '',
    );

    this.hints.setTipFlag(
      options.tipFromTo ?? false,
      options.tipMinMax ?? false,
    );

    if (options.tipMinMax) {
      masFlag.push(this.hints.createTipMinMax());

      this.hints.setValTipMinMax(
        options.min ?? 0,
        options.max ?? 0,
      );
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
    if (!this.hints) return false;

    let flag = false;
    if (!this.hints.checkTipTo()) {
      flag = this.hints.createTipTo();
      flag = Boolean(this.hints.setValTipTo(to));
    }
    return flag;
  }

  updateTipMinMax(min: number, max: number) {
    if (!this.hints) return null;
    return this.hints.setValTipMinMax(min, max);
  }

  getWidthTip(startFlag: boolean, resetFlag: boolean) {
    if (!this.hints) return null;
    if (startFlag && !resetFlag) { this.sizeWrap(); }
    return this.hints.getWidthTip();
  }

  deleteTipTo() {
    if (!this.hints) return false;
    return this.hints.deleteTipTo();
  }

  checkVisibleTip() {
    if (!this.hints) return false;
    return this.hints.checkVisibleTip();
  }

  updateTipValue(from: number, to: number, type: string) {
    if (!this.hints) return [];
    const masFlag: boolean[] = [];
    masFlag.push(Boolean(this.hints.setValTipFrom(from)));
    if (type === 'double') {
      masFlag.push(Boolean(this.hints.setValTipTo(to)));
      masFlag.push(Boolean(this.hints.setValTipSingle()));
    }
    return masFlag;
  }

  updateTipPosition(coordinates: UpdateTip) {
    if (!this.hints) return [];
    const masFlag: boolean[] = [];

    masFlag.push(Boolean(this.hints.setPositionFrom(coordinates.fromXY ?? 0)));
    if (coordinates.toXY && coordinates.singleXY) {
      masFlag.push(Boolean(this.hints.setPositionTo(coordinates.toXY)));
      masFlag.push(Boolean(this.hints.setPositionSingle(coordinates.singleXY)));
    }
    return masFlag;
  }

  // --------------------------------- bar

  setVisibleBar(bar: boolean) {
    if (!this.bar || !this.rsLine) return [];
    const masFlag: boolean[] = [];

    masFlag.push(this.bar.setVisibleBar(bar));
    masFlag.push(this.bar.createDomBar());

    masFlag.push(this.bar.setSizeWH(
      this.vertical
        ? this.rsLine.offsetWidth : this.rsLine.offsetHeight,
    ));

    return masFlag;
  }

  setBar(barX: number, widthBar: number) {
    if (!this.bar) return false;
    return this.bar.setBar(barX, widthBar);
  }

  // --------------------------------- Grid

  deleteGrid() {
    if (!this.grid) return false;
    return this.grid.deleteGrid();
  }

  createDomGrid() {
    if (!this.grid) return null;
    return this.grid.createDomGrid();
  }

  createMark(valMark: {
    val: number,
    position: number,
  }[]) {
    if (!this.grid) return null;
    return this.grid.createMark(valMark);
  }

  @boundMethod
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
      if (!this.elem) return false;

      const attribute = `data-${item}`;
      if (this.elem.hasAttribute(attribute)) {
        const value = this.elem.getAttribute(attribute) ?? '';
        const key = options.get(item);

        if (/^-?\d*?[.]?\d*$/.test(value)) {
          return [key, Number(value)];
        }

        if (/^(true|false)$/.test(value)) {
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
        const data = getDataAttr(
          (item.attributeName ?? '').replace('data-', ''),
        );

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

    observer.observe(
      (this.elem as Element),
      {
        attributeFilter: masDataAttr,
      },
    );
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

      this.handle = await new Handle(
        (this.rsCenter as HTMLElement),
        this.rsName,
      );
      this.hints = await new Hints(
        this.rsTop as Element,
        this.rsName,
      );
      this.bar = await new Bar(
        this.rsCenter as HTMLElement,
        this.rsName,
      );
      this.grid = await new Grid(this.rsBottom as Element, this.rsName);

      await this.createListeners();
      await this.attributesChange();
    };
  }

  private createListeners() {
    if (!this.handle || !this.bar) return false;

    this.handle.subscribeOB(this.handleForwarding);
    this.bar.subscribeOB(this.handleForwarding);

    if (this.grid) { this.grid.subscribeOB(this.handleForwarding); }

    return true;
  }

  @boundMethod
  private handleForwarding(options: ObserverOptions) {
    this.notifyOB({ ...options });
    return true;
  }

  private sizeWrap() {
    if (!this.rsCenter) return false;

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

    return true;
  }
}

export default View;
