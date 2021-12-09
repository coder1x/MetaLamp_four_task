
import { UpdateTip } from './view.d';
import { Handle } from './sub-view/handle';
import { Hints } from './sub-view/hints';
import { Bar } from './sub-view/bar';
import { Grid } from './sub-view/grid';
import { Observer, TOB } from '../../observer';
import { HInput, HElem } from '../../glob-interface';



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


  constructor(elem: Element) {
    super();
    this.elem = elem;
    this.rsName = 'range-slider-fox';
    this.wrapSlider = this.elem.parentElement;

    this.init();
  }


  destroy() {
    const typeElem = this.elem.constructor.name;
    if (typeElem == 'HTMLInputElement') {
      const input: HInput = this.elem;
      input.value = ' ';
    }
    const elem = this.wrapSlider.querySelector('.js-' + this.rsName);
    if (elem)
      elem.remove();
  }

  setValueInput(from: number, to: number, type: string) {
    const typeElem = this.elem.constructor.name;
    let str = '';
    if (typeElem == 'HTMLInputElement') {

      const input: HInput = this.elem;

      input.value = str;
      str += from;
      if (type == 'double') {
        str += ',' + to;
      }
      input.value = str;
    }
    else {
      return false;
    }

    return str;
  }

  outDataAttr() {
    if (this.objData)
      if (Object.keys(this.objData).length != 0) {
        this.notifyOB({
          key: 'DataAttributes',
          ...this.objData,
        });
        return this.objData;
      }
    return false;
  }

  disabledRangeSlider(flag: boolean) {
    const elem: HElem = this.wrapSlider;
    const st = elem.style;
    return flag ? st.opacity = '0.5' : st.opacity = '1';
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

    this.rangeSlider = createElem('div', [this.rsName, 'js-' + this.rsName]);
    this.rsTop = createElem('div', [this.rsName + '__top',
    'js-' + this.rsName + '__top']);
    this.rsCenter = createElem('div', [this.rsName + '__center',
    'js-' + this.rsName + '__center']);
    this.rsBottom = createElem('div', [this.rsName + '__bottom',
    'js-' + this.rsName + '__bottom']);
    this.rsLine = createElem('span', [this.rsName + '__line',
    'js-' + this.rsName + '__line']);

    this.rsCenter.appendChild(this.rsLine);
    this.rangeSlider.appendChild(this.rsTop);
    this.rangeSlider.appendChild(this.rsCenter);
    this.rangeSlider.appendChild(this.rsBottom);

    return this.wrapSlider.appendChild(this.rangeSlider);
  }


  async setOrientation(str: string) {

    const modify = this.rsName + '_vertical';
    const objP = this.rangeSlider.classList;
    this.vertical = str == 'vertical' ? true : false;
    this.vertical ? objP.add(modify) : objP.remove(modify);

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

  //--------------------------------- hints

  setHintsData(options: TOB) {
    const masFL: boolean[] = [];
    this.hints.setAdditionalText(options.tipPrefix, options.tipPostfix);
    this.hints.setTipFlag(options.tipFromTo, options.tipMinMax);
    if (options.tipMinMax) {
      masFL.push(this.hints.createTipMinMax());
      this.hints.setValTipMinMax(options.min, options.max);
    }
    else {
      masFL.push(this.hints.deleteTipMinMax());
    }

    if (options.tipFromTo) {
      masFL.push(this.hints.createTipFrom());
      if (options.type == 'double') {
        masFL.push(this.hints.createTipTo());
        masFL.push(this.hints.createTipSingle());
      }
    } else {
      masFL.push(this.hints.deleteTipFrom());
      if (options.type == 'double') {
        masFL.push(this.hints.deleteTipTo());
        masFL.push(this.hints.deleteTipSingle());
      }
    }
    return masFL;
  }

  toggleTipTo(to: number) {
    let fl = false;
    if (!this.hints.checkTipTo()) {
      fl = this.hints.createTipTo();
      fl = Boolean(this.hints.setValTipTo(to));
    }
    return fl;
  }

  updateTipMinMax(min: number, max: number) {
    return this.hints.setValTipMinMax(min, max);
  }

  getWidthTip(startFL: boolean, resetFL: boolean) {
    if (startFL && !resetFL)
      this.sizeWrap();
    return this.hints.getWidthTip();
  }

  deleteTipTo() {
    return this.hints.deleteTipTo();
  }

  checkVisibleTip() {
    return this.hints.checkVisibleTip();
  }


  updateTipValue(from: number, to: number, type: string) {
    const masFL: boolean[] = [];
    masFL.push(Boolean(this.hints.setValTipFrom(from)));
    if (type == 'double') {
      masFL.push(Boolean(this.hints.setValTipTo(to)));
      masFL.push(Boolean(this.hints.setValTipSingle()));
    }
    return masFL;
  }

  updateTipPosition(op: UpdateTip) {
    const masFL: boolean[] = [];
    masFL.push(Boolean(this.hints.setPositionFrom(op.fromXY)));
    if (op.toXY && op.singleXY) {
      masFL.push(Boolean(this.hints.setPositionTo(op.toXY)));
      masFL.push(Boolean(this.hints.setPositionSingle(op.singleXY)));
    }
    return masFL;
  }


  //--------------------------------- bar

  setVisibleBar(bar: boolean) {
    const masFL: boolean[] = [];
    masFL.push(this.bar.setVisibleBar(bar));
    masFL.push(this.bar.createDomBar());
    const size = this.vertical ?
      this.rsLine.offsetWidth : this.rsLine.offsetHeight;
    masFL.push(this.bar.setSizeWH(size));
    return masFL;
  }

  setBar(barX: number, widthBar: number) {
    return this.bar.setBar(barX, widthBar);
  }


  //--------------------------------- Grid

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
      await this.createDomBase(); // create basic DOM elements
      await this.setActions();  // add event listeners

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