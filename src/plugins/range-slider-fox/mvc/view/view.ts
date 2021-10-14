
// eslint-disable-next-line no-unused-vars
import {
  UbdateTip
} from './view.d';
import { Handle } from './sub-view/handle';
import { Hints } from './sub-view/hints';
import { Bar } from './sub-view/bar';
import { Grid } from './sub-view/grid';



import { Observer, TOB } from '../../observer';

class View extends Observer {

  rsName: string;
  wrapSlider: Element;
  rangeSlider: Element;
  rsTop: Element;
  rsCenter: HTMLElement;
  rsBottom: Element;
  rsLine: HTMLElement;
  prevTheme: string;
  vertical: boolean;
  handle: Handle;
  hints: Hints;
  bar: Bar;
  grid: Grid;

  // eslint-disable-next-line no-unused-vars
  constructor(public elem: Element, public numElem: Number) {
    super();
    this.rsName = 'range-slider-fox';
    this.wrapSlider = this.elem.parentElement;

    this.init();
  }


  private init() {

    // создаём базовые дом элементы. 
    this.createDomBase();

    // вешаем события.
    this.setActions();


    this.handle = new Handle(this.rsName, this.rsCenter);
    this.hints = new Hints(this.rsTop);
    this.bar = new Bar(this.rsCenter);
    this.grid = new Grid(this.rsBottom);

    this.createListeners();
  }


  private createListeners() {
    this.handle.subscribeOB(this.handleDotMove);
    this.bar.subscribeOB(this.handleClickBar);
  }

  private handleDotMove = (options: TOB) => {
    const key = options.key;
    if (key != 'DotMove') return;

    this.notifyOB({
      key: 'DotMove', ...options
    });
  };

  private handleClickBar = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickBar') return;

    this.notifyOB({
      key: 'ClickBar', ...options
    });
  };

  // private handleWrapWH = (options: TOB) => {
  //   const key = options.key;
  //   if (key != 'WrapWH') return;

  //   this.notifyOB({
  //     key: 'WrapWH', ...options
  //   });
  // };

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


    // let wrapWH = 0;
    // if (this.vertical) {
    //   wrapWH = this.rsCenter.offsetHeight;
    // } else {
    //   wrapWH = this.rsCenter.offsetWidth;
    // }

    // console.log(this.rsCenter.offsetHeight);


    // this.notifyOB({
    //   key: 'SizeWrap',
    //   wrapWH: wrapWH,
    // });

  }

  setOrientation(str: string) {

    const modif = this.rsName + '_vertical';
    const objP = this.rangeSlider.classList;
    this.vertical = str == 'vertical' ? true : false;
    this.vertical ? objP.add(modif) : objP.remove(modif);

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

    this.handle.setOrientation(str);
    this.hints.setOrientation(str);
    this.bar.setOrientation(str);

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

  ubdateTipFromTo(op: UbdateTip) {
    const obj = this.hints.getWidthTip();
    if (!obj.fromWH && !obj.toWH) return;

    this.hints.setPositionFrom(op.fromXY(obj.fromWH), op.from);

    if (op.type == 'double') {
      this.hints.setPositionTo(op.toXY(obj.toWH), op.to);
      this.hints.setPositionSingle(op.singleXY(obj.singleWH));
    } else {
      this.hints.deleteTipTo();
    }
  }



  //--------------------------------- bar

  setVisibleBar(bar: boolean) {
    this.bar.setVisibleBar(bar);


    this.createDomBar();
    const size = this.vertical ?
      this.rsLine.offsetWidth : this.rsLine.offsetHeight;
    this.bar.setSizeWH(size);


  }

  createDomBar() {
    this.bar.createDomBar();
  }


  setBar(barX: number, widthBar: number) {
    this.bar.setBar(barX, widthBar);
  }




  //--------------------------------- Grid


  // setDataGrid(options: DateGrid) {
  //   this.grid.setData(options);
  // }

  deleteGrid() {
    this.grid.deleteGrid();
  }

  createDomGrid() {
    this.grid.createDomGrid();
  }

  createMark(val: number, position: number) {
    this.grid.createMark(val, position);
  }



}



export { View };