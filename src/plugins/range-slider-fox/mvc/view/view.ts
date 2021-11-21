
import { UbdateTip } from './view.d';
import { Handle } from './sub-view/handle';
import { Hints } from './sub-view/hints';
import { Bar } from './sub-view/bar';
import { Grid } from './sub-view/grid';
import { Observer, TOB } from '../../observer';

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
  private objData: TOB;
  onHandle: Function;
  elem: Element;
  numElem: Number;


  constructor(elem: Element, numElem: Number) {
    super();
    this.elem = elem;
    this.numElem = numElem;
    this.rsName = 'range-slider-fox';
    this.wrapSlider = this.elem.parentElement;

    this.init();
  }

  setValueInput(from: number, to: number, type: string) {

    const typeElem = this.elem.constructor.name;

    if (typeElem == 'HTMLInputElement') {
      let str = '';
      const input = this.elem as HTMLInputElement;
      input.value = str;
      str += from;
      if (type == 'double') {
        str += ',' + to;
      }
      input.value = str;
    }
  }

  outDataAttr() {
    if (Object.keys(this.objData).length != 0)
      this.notifyOB({
        key: 'DataAttributes',
        ...this.objData,
      });
  }

  disabledRangeSlider(flag: boolean) {
    const elem = this.wrapSlider as HTMLElement;
    const st = elem.style;

    flag ? st.opacity = '0.5' : st.opacity = '1';
  }


  getWrapWH() {
    const size = (this.vertical ?
      this.rsCenter.offsetHeight :
      this.rsCenter.offsetWidth);

    return size;
  }

  createDomBase() {

    const createElem = (teg: string, className: string[]) => {
      const elem = document.createElement(teg);
      for (let item of className) {
        elem.classList.add(item);
      }
      return elem;
    };

    this.rangeSlider = createElem('div', [
      this.rsName,
      'js-rs-' + this.numElem,
    ]);

    this.rsTop = createElem('div', [this.rsName + '__top']);
    this.rsCenter = createElem('div', [this.rsName + '__center']);
    this.rsBottom = createElem('div', [this.rsName + '__bottom']);
    this.rsLine = createElem('span', [this.rsName + '__line']);

    this.rsCenter.appendChild(this.rsLine);
    this.rangeSlider.appendChild(this.rsTop);
    this.rangeSlider.appendChild(this.rsCenter);
    this.rangeSlider.appendChild(this.rsBottom);

    this.wrapSlider.appendChild(this.rangeSlider);
  }


  async setOrientation(str: string) {

    const modif = this.rsName + '_vertical';
    const objP = this.rangeSlider.classList;
    this.vertical = str == 'vertical' ? true : false;
    this.vertical ? objP.add(modif) : objP.remove(modif);

    await this.handle.setOrientation(str);
    await this.hints.setOrientation(str);
    await this.bar.setOrientation(str);
    await this.grid.setOrientation(str);

    await this.sizeWrap();
  }

  setActions() {
    this.rsLine.addEventListener('click', (event: MouseEvent) => {
      this.notifyOB({
        key: 'ClickLine',
        clientXY: this.vertical ? event.offsetY : event.offsetX,
      });
    });
  }


  setTheme(theme: string) {
    if (this.prevTheme)
      this.rangeSlider.classList.remove(this.prevTheme);
    const classN = 'rs-' + theme;
    this.rangeSlider.classList.add(classN);
    this.prevTheme = classN;
  }

  //--------------------------------- handle
  createDotElem(type: string) {
    this.handle.createDomBase(type);
  }

  setDotFrom(fromP: number) {
    this.handle.setFrom(fromP);
  }

  setDotTo(toP: number) {
    this.handle.setTo(toP);
  }

  setDotActions(type: string) {
    this.handle.setActions(type);
  }

  //--------------------------------- hints

  setHintsData(options: TOB) {
    this.hints.setAdditionalText(options.tipPrefix, options.tipPostfix);
    this.hints.setTipFlag(options.tipFromTo, options.tipMinMax);
    if (options.tipMinMax) {
      this.hints.createTipMinMax();
      this.hints.setValTipMinMax(options.min, options.max);
    }
    else {
      this.hints.deleteTipMinMax();
    }

    if (options.tipFromTo) {
      this.hints.createTipFrom();
      if (options.type == 'double') {
        this.hints.createTipTo();
        this.hints.createTipSingle();
      }
    } else {
      this.hints.deleteTipFrom();
      if (options.type == 'double') {
        this.hints.deleteTipTo();
        this.hints.deleteTipSingle();
      }
    }
  }

  toggleTipTo(to: number) {
    if (!this.hints.checkTipTo()) {
      this.hints.createTipTo();
      this.hints.setValTipTo(to);
    }
  }

  ubdateTipMinMax(min: number, max: number) {
    this.hints.setValTipMinMax(min, max);
  }

  getWidthTip(startFL: boolean, resetFL: boolean) {
    if (startFL && !resetFL)
      this.sizeWrap();
    return this.hints.getWidthTip();
  }

  deleteTipTo() {
    this.hints.deleteTipTo();
  }

  checkVisibleTip() {
    this.hints.checkVisibleTip();
  }


  ubdateTipValue(from: number, to: number, type: string) {
    this.hints.setValTipFrom(from);
    if (type == 'double') {
      this.hints.setValTipTo(to);
      this.hints.setValTipSingle();
    }
  }

  ubdateTipPosition(op: UbdateTip) {
    this.hints.setPositionFrom(op.fromXY);
    if (op.toXY && op.singleXY) {
      this.hints.setPositionTo(op.toXY);
      this.hints.setPositionSingle(op.singleXY);
    }
  }


  //--------------------------------- bar

  setVisibleBar(bar: boolean) {
    this.bar.setVisibleBar(bar);
    this.bar.createDomBar();
    const size = this.vertical ?
      this.rsLine.offsetWidth : this.rsLine.offsetHeight;
    this.bar.setSizeWH(size);
  }

  setBar(barX: number, widthBar: number) {
    this.bar.setBar(barX, widthBar);
  }


  //--------------------------------- Grid

  deleteGrid() {
    this.grid.deleteGrid();
  }

  createDomGrid() {
    this.grid.createDomGrid();
  }

  createMark(valMark: {
    val: number,
    position: number,
  }[]) {
    this.grid.createMark(valMark);
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
      ['key_step_one', 'keyStepOne'],
      ['key_step_hold', 'keyStepHold'],
      ['bar', 'bar'],
      ['grid', 'grid'],
      ['grid_snap', 'gridSnap'],
      ['grid_num', 'gridNum'],
      ['grid_step', 'gridStep'],
      ['grid_round', 'gridRound'],
      ['tip_min_max', 'tipMinMax'],
    ]);

    const mapOptions = new Map();

    const getDataAttr = (item: string) => {
      const attr = 'data-' + item;
      if (this.elem.hasAttribute(attr)) {
        const val = this.elem.getAttribute(attr);
        const key = options.get(item);

        const regNumber = /^-?\d*?[.]?\d*$/;
        if (regNumber.test(val)) {
          return [key, Number(val)];
        }

        const regBoolean = /^(true|false)$/;
        if (regBoolean.test(val)) {
          return [key, (val === 'true')];
        }
        return [key, val];
      }
    };

    let masDataAttr = [];

    for (let item of options.keys()) {
      const data = getDataAttr(item);
      if (data) {
        const key = data[0];
        const val = data[1];
        mapOptions.set(key, val);
      }
      masDataAttr.push('data-' + item);
    }

    this.objData = Object.fromEntries(mapOptions);

    let observer = new MutationObserver(mut => {
      const attr = mut[0].attributeName;
      const opt = attr.replace('data-', '');
      const data = getDataAttr(opt);

      if (data) {
        const key = String(data[0]);
        const val = data[1];
        this.notifyOB({
          key: 'DataAttributes',
          [key]: val,
        });
      }
    });

    observer.observe(this.elem, {
      attributeFilter: masDataAttr,
    });
  }

  private init() {

    this.onHandle = async () => {

      await this.createDomBase(); // создаём базовые дом элементы. 
      await this.setActions();  // вешаем события.

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


  private handleForwarding = (options: TOB) => {
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
      wrapWH: wrapWH,
    });
  }



}



export { View };