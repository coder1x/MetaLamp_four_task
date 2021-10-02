
// eslint-disable-next-line no-unused-vars
import {
  CreateHandleOptions,
  CreateHintsOptions,
  DateGrid,
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
    this.createListeners();
  }


  private init() {

    // создаём базовые дом элементы. 
    this.createDomBase();

    // вешаем события.
    this.setActions();


    this.handle = new Handle(this.rsName, this.rsCenter);
    this.hints = new Hints(this.rsTop);

  }


  private createListeners() {
    this.handle.subscribeOB(this.handleDotMove);
  }

  private handleDotMove = (options: TOB) => {
    const key = options.key;
    if (key != 'DotMove') return;

    this.notifyOB({
      key: 'DotMove', ...options
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
  }

  setOrientation(str: string) {

    const modif = this.rsName + '_vertical';
    const objP = this.rangeSlider.classList;
    this.vertical = str == 'vertical' ? true : false;
    this.vertical ? objP.add(modif) : objP.remove(modif);
    this.handle.setOrientation(str);

    // передаём эти данные во вью 
    // она в свою очередь раздаст всем собвью .. 
    // и все они будут перестроены. на другую работу.

    // удалить свойство лефт и поменять его на bottom.


  }


  setActions() {
    // eslint-disable-next-line no-unused-vars
    this.rsLine.addEventListener('click', (event: MouseEvent) => {
      // const elem = (event.target as HTMLElement);

      // вызываем оповещение подписчиков
      // handler(event.offsetX, elem.offsetWidth);
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
    this.hints.setPrefix(options.tipPrefix);
    this.hints.setPostfix(options.tipPostfix);
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

  ubdateTipFromTo(op: UbdateTip) {
    const obj = this.hints.getWidthTip();
    if (!obj.fromW && !obj.toW) return;

    this.hints.setPositionFrom(op.fromXY(obj.fromW), op.from);

    if (op.type == 'double') {
      this.hints.setPositionTo(op.toXY(obj.toW), op.to);
      this.hints.setPositionSingle(op.singleXY(obj.singleW));
    } else {
      this.hints.deleteTipTo();
    }
  }











  // initGrid(handler: Function) {
  //   this.grid = new Grid(this.rsBottom);
  //   handler();
  // }

  // setDataGrid(options: DateGrid) {
  //   this.grid.setData(options);
  // }

  // createDomGrid(handler: Function) {
  //   this.grid.createDomGrid(handler);
  // }

  // createDomBar(handler: Function) {
  //   this.bar.createDomBar(this.rsLine);
  //   handler();
  // }

  // setPositionBar(barX: number, widthBar: number) {
  //   this.bar.setBar(barX, widthBar);
  // }

  // initBar(handler: Function) {
  //   this.bar = new Bar(this.rsCenter);
  //   handler();
  // }



}



export { View };