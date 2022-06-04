import { boundMethod } from 'autobind-decorator';

import { Observer, ObserverOptions } from '../../Observer';
import RangeSliderOptions from '../../globInterface';
import Handle from './subView/Handle';
import Hints from './subView/Hints';
import Bar from './subView/Bar';
import Grid from './subView/Grid';
import UpdateTip from './view.d';

class View extends Observer {
  private rangeSliderName: string = '';

  private wrapperSlider: Element | null = null;

  private rangeSlider: Element | null = null;

  private rangeSliderTop: Element | null = null;

  private rangeSliderCenter: HTMLElement | null = null;

  private rangeSliderBottom: Element | null = null;

  private rangeSliderLine: HTMLElement | null = null;

  private prevTheme: string = '';

  private vertical: boolean = false;

  private handle: Handle | null = null;

  private hints: Hints | null = null;

  private bar: Bar | null = null;

  private grid: Grid | null = null;

  private dataAttributes: ObserverOptions | null = null;

  onHandle: (() => void) | null = null;

  element: Element | null = null;

  constructor(element: Element) {
    super();
    this.element = element;
    this.rangeSliderName = 'range-slider-fox';
    this.wrapperSlider = this.element.parentElement;

    this.init();
  }

  async destroy() {
    if (!this.element || !this.wrapperSlider) return false;

    const typeElem = await this.element.constructor.name;
    if (typeElem === 'HTMLInputElement') {
      const input = this.element as HTMLInputElement;
      input.value = ' ';
    }
    const element = await this.wrapperSlider.querySelector(`.js-${this.rangeSliderName}`);
    if (element) { await element.remove(); }

    this.handle = null;
    this.hints = null;
    this.bar = null;
    this.grid = null;

    return true;
  }

  setValueInput(from: number, to: number, type: string) {
    if (!this.element) return false;

    let string = '';
    if (this.element.constructor.name === 'HTMLInputElement') {
      const input = this.element as HTMLInputElement;

      input.value = string;
      string += from;
      if (type === 'double') {
        string += `,${to}`;
      }
      input.value = string;
    } else {
      return false;
    }

    return string;
  }

  outputDataAttribute() {
    const isKeys = this.dataAttributes && Object.keys(this.dataAttributes).length !== 0;

    if (isKeys) {
      this.notifyObserver({
        key: 'DataAttributes',
        ...this.dataAttributes,
      });
      return this.dataAttributes;
    }
    return false;
  }

  disabledRangeSlider(isVisible: boolean) {
    const element = this.wrapperSlider as HTMLElement;
    const style = element.style as CSSStyleDeclaration;
    if (isVisible) {
      style.opacity = '0.5';
    } else {
      style.opacity = '1';
    }
  }

  getWrapWidthHeight() {
    if (!this.rangeSliderCenter) return 0;

    const size = (this.vertical
      ? this.rangeSliderCenter.offsetHeight
      : this.rangeSliderCenter.offsetWidth);
    return size;
  }

  static createElement(teg: string, className: string[]) {
    const element = document.createElement(teg);

    className.forEach((item) => {
      element.classList.add(item);
    });

    return element;
  }

  createDomElementBase() {
    this.rangeSlider = View.createElement(
      'div',
      [this.rangeSliderName, `js-${this.rangeSliderName}`],
    );
    this.rangeSliderTop = View.createElement('div', [
      `${this.rangeSliderName}__top`,
      `js-${this.rangeSliderName}__top`,
    ]);
    this.rangeSliderCenter = View.createElement('div', [
      `${this.rangeSliderName}__center`,
      `js-${this.rangeSliderName}__center`,
    ]);
    this.rangeSliderBottom = View.createElement('div', [
      `${this.rangeSliderName}__bottom`,
      `js-${this.rangeSliderName}__bottom`,
    ]);
    this.rangeSliderLine = View.createElement('span', [
      `${this.rangeSliderName}__line`,
      `js-${this.rangeSliderName}__line`,
    ]);

    this.rangeSliderCenter.appendChild(this.rangeSliderLine);
    this.rangeSlider.appendChild(this.rangeSliderTop);
    this.rangeSlider.appendChild(this.rangeSliderCenter);
    this.rangeSlider.appendChild(this.rangeSliderBottom);

    if (!this.wrapperSlider) return null;

    return this.wrapperSlider.appendChild(this.rangeSlider);
  }

  async setOrientation(type: string) {
    const modifier = `${this.rangeSliderName}_vertical`;
    const { classList } = this.rangeSlider as Element;
    this.vertical = type === 'vertical';

    if (this.vertical) {
      classList.add(modifier);
    } else {
      classList.remove(modifier);
    }

    if (!this.handle || !this.hints) return false;

    await this.handle.setOrientation(type);
    await this.hints.setOrientation(type);

    if (!this.bar || !this.grid) return false;

    await this.bar.setOrientation(type);
    await this.grid.setOrientation(type);

    return true;
  }

  bindEvent() {
    if (this.rangeSliderLine) {
      this.rangeSliderLine.addEventListener('click', this.handleLineClick);
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
  createDotElement(type: string) {
    if (!this.handle) return null;
    return this.handle.createDomElementBase(type);
  }

  setDotFrom(fromPercent: number) {
    if (!this.handle) return null;
    return this.handle.setFrom(fromPercent);
  }

  setDotTo(toPercent: number) {
    if (!this.handle) return null;
    return this.handle.setTo(toPercent);
  }

  setDotActions(type: string) {
    if (!this.handle) return null;
    return this.handle.bindEvent(type);
  }

  // --------------------------------- hints

  setHintsData(options: ObserverOptions) {
    if (!this.hints) return [];

    const areHintsExist: boolean[] = [];
    this.hints.setAdditionalText(
      options.tipPrefix ?? '',
      options.tipPostfix ?? '',
    );

    this.hints.setTipVisible(
      options.tipFromTo ?? false,
      options.tipMinMax ?? false,
    );

    if (options.tipMinMax) {
      areHintsExist.push(this.hints.createTipMinMax());

      this.hints.setValueTipMinMax(
        options.min ?? 0,
        options.max ?? 0,
      );
    } else {
      areHintsExist.push(this.hints.deleteTipMinMax());
    }

    if (options.tipFromTo) {
      areHintsExist.push(this.hints.createTipFrom());
      if (options.type === 'double') {
        areHintsExist.push(this.hints.createTipTo());
        areHintsExist.push(this.hints.createTipSingle());
      }
    } else {
      areHintsExist.push(this.hints.deleteTipFrom());
      if (options.type === 'double') {
        areHintsExist.push(this.hints.deleteTipTo());
        areHintsExist.push(this.hints.deleteTipSingle());
      }
    }
    return areHintsExist;
  }

  toggleTipTo(to: number) {
    if (!this.hints) return false;

    let isToggled = false;
    if (!this.hints.checkTipTo()) {
      isToggled = this.hints.createTipTo();
      isToggled = Boolean(this.hints.setValueTipTo(to));
    }
    return isToggled;
  }

  updateTipMinMax(min: number, max: number) {
    if (!this.hints) return null;
    return this.hints.setValueTipMinMax(min, max);
  }

  getWidthTip() {
    if (!this.hints) return null;
    return this.hints.getWidthTip();
  }

  deleteTipTo() {
    if (!this.hints) return false;
    return this.hints.deleteTipTo();
  }

  checkVisibleTip() {
    if (!this.hints) return false;
    return this.hints.checkTipIsVisible();
  }

  updateTipValue(from: number, to: number, type: string) {
    if (!this.hints) return [];
    const isUpdated: boolean[] = [];
    isUpdated.push(Boolean(this.hints.setValueTipFrom(from)));
    if (type === 'double') {
      isUpdated.push(Boolean(this.hints.setValueTipTo(to)));
      isUpdated.push(Boolean(this.hints.setValueTipSingle()));
    }
    return isUpdated;
  }

  updateTipPosition(coordinates: UpdateTip) {
    if (!this.hints) return [];
    const isUpdated: boolean[] = [];

    isUpdated.push(Boolean(this.hints.setPositionFrom(coordinates.fromXY ?? 0)));
    if (coordinates.toXY && coordinates.singleXY) {
      isUpdated.push(Boolean(this.hints.setPositionTo(coordinates.toXY)));
      isUpdated.push(Boolean(this.hints.setPositionSingle(coordinates.singleXY)));
    }
    return isUpdated;
  }

  // --------------------------------- bar

  setVisibleBar(bar: boolean) {
    if (!this.bar || !this.rangeSliderLine) return [];
    const isVisible: boolean[] = [];

    isVisible.push(this.bar.setVisibleBar(bar));
    isVisible.push(this.bar.createDomElementBar());

    isVisible.push(this.bar.setSizeWidthHeight(
      this.vertical
        ? this.rangeSliderLine.offsetWidth : this.rangeSliderLine.offsetHeight,
    ));

    return isVisible;
  }

  setBar(barXY: number, widthBar: number) {
    if (!this.bar) return false;
    return this.bar.setBar(barXY, widthBar);
  }

  // --------------------------------- Grid

  deleteGrid() {
    if (!this.grid) return false;
    return this.grid.deleteGrid();
  }

  createDomElementGrid() {
    if (!this.grid) return null;
    return this.grid.createDomElementGrid();
  }

  createMark(valueMark: {
    value: number,
    position: number,
  }[]) {
    if (!this.grid) return null;
    return this.grid.createMark(valueMark);
  }

  @boundMethod
  private handleLineClick(event: MouseEvent) {
    this.notifyObserver({
      key: 'ClickLine',
      clientXY: this.vertical ? event.offsetY : event.offsetX,
    });
  }

  private changeAttributes() {
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
      ['grid-num', 'gridNumber'],
      ['grid-step', 'gridStep'],
      ['grid-round', 'gridRound'],
      ['tip-min-max', 'tipMinMax'],
      ['tip-from-to', 'tipFromTo'],
      ['tip-prefix', 'tipPrefix'],
      ['tip-postfix', 'tipPostfix'],
    ]);

    const attributes = new Map();

    const getDataAttribute = (item: string) => {
      if (!this.element) return false;

      const attribute = `data-${item}`;
      if (this.element.hasAttribute(attribute)) {
        const value = this.element.getAttribute(attribute) ?? '';
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

    const nameAttributes: string[] = [];

    options.forEach((value, key) => {
      const data = getDataAttribute(key);
      if (data) {
        const [nameAttribute] = data;
        const [, valueAttribute] = data;
        attributes.set(nameAttribute, valueAttribute);
      }
      nameAttributes.push(`data-${key}`);
    });

    this.dataAttributes = Object.fromEntries(attributes);
    const observer = new MutationObserver((mutation) => {
      const rangeSlider: RangeSliderOptions = {};

      mutation.forEach((item) => {
        const data = getDataAttribute(
          (item.attributeName ?? '').replace('data-', ''),
        );

        if (data) {
          const key = String(data[0]);
          const value = data[1];
          // использую type assertions так как не нашёл возможности передавать нужный тип
          // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
          View.setProperty(rangeSlider, key as keyof RangeSliderOptions, value);
        }
      });

      if (rangeSlider) {
        this.notifyObserver({
          key: 'DataAttributes',
          ...rangeSlider,
        });
      }
    });

    observer.observe(
      (this.element as Element),
      {
        attributeFilter: nameAttributes,
      },
    );
  }

  private static setProperty<T, K extends keyof T>(
    object: T,
    key: K,
    value: T[K],
  ) {
    object[key] = value;
  }

  private init() {
    this.onHandle = async () => {
      await this.createDomElementBase(); // create basic DOM elements
      await this.bindEvent(); // add event listeners

      this.handle = await new Handle(
        (this.rangeSliderCenter as HTMLElement),
        this.rangeSliderName,
      );
      this.hints = await new Hints(
        this.rangeSliderTop as Element,
        this.rangeSliderName,
      );
      this.bar = await new Bar(
        this.rangeSliderCenter as HTMLElement,
        this.rangeSliderName,
      );
      this.grid = await new Grid(this.rangeSliderBottom as Element, this.rangeSliderName);

      await this.createListeners();
      await this.changeAttributes();
    };
  }

  private createListeners() {
    if (!this.handle || !this.bar) return false;

    this.handle.subscribeObserver(this.handleForwarding);
    this.bar.subscribeObserver(this.handleForwarding);

    if (this.grid) { this.grid.subscribeObserver(this.handleForwarding); }

    return true;
  }

  @boundMethod
  private handleForwarding(options: ObserverOptions) {
    this.notifyObserver({ ...options });
    return true;
  }
}

export default View;
