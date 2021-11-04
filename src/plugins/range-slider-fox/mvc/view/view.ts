
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

  // eslint-disable-next-line no-unused-vars
  constructor(public elem: Element, public numElem: Number) {
    super();
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

  private init() {

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
        masDataAttr.push('data-' + item);
      }
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



    // создаём базовые дом элементы. 
    this.createDomBase();

    // вешаем события.
    this.setActions();


    this.handle = new Handle(this.rsCenter, this.rsName);
    this.hints = new Hints(this.rsTop, this.rsName);
    this.bar = new Bar(this.rsCenter, this.rsName);
    this.grid = new Grid(this.rsBottom, this.rsName);

    this.createListeners();
  }

  outDataAttr() {
    if (Object.keys(this.objData).length != 0)
      this.notifyOB({
        key: 'DataAttributes',
        ...this.objData,
      });
  }

  private createListeners() {
    this.handle.subscribeOB(this.handleForwarding);
    this.bar.subscribeOB(this.handleForwarding);
    this.grid.subscribeOB(this.handleForwarding);
  }


  disabledRangeSlider(flag: boolean) {
    const elem = this.wrapSlider as HTMLElement;
    const st = elem.style;

    flag ? st.opacity = '0.5' : st.opacity = '1';
  }


  private handleForwarding = (options: TOB) => {
    this.notifyOB({ ...options });
  };


  getWrapWH() {
    return (this.vertical ?
      this.rsCenter.offsetHeight :
      this.rsCenter.offsetWidth);
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

  setOrientation(str: string) {

    const modif = this.rsName + '_vertical';
    const objP = this.rangeSlider.classList;
    this.vertical = str == 'vertical' ? true : false;
    this.vertical ? objP.add(modif) : objP.remove(modif);

    this.sizeWrap();

    this.handle.setOrientation(str);
    this.hints.setOrientation(str);
    this.bar.setOrientation(str);
    this.grid.setOrientation(str);
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
      this.hints.setValTipFrom(options.from);
      if (options.type == 'double') {
        this.hints.createTipTo();
        this.hints.createTipSingle();
        this.hints.setValTipTo(options.to);
        this.hints.setValTipSingle();
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

  getWidthTip() {
    this.sizeWrap();
    return this.hints.getWidthTip();
  }

  deleteTipTo() {
    this.hints.deleteTipTo();
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


}



export { View };