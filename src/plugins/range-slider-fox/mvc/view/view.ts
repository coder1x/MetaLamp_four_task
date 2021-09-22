
import { CreateHandleOptions, CreateHintsOptions, DateGrid } from './view.d';
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

  // когда получим данные то повесить модификатор темы theme: string
  // 'rs-' + theme // тут нужно запрашивать из модели

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



  setActions() {
    this.rsLine.addEventListener('click', (event: MouseEvent) => {
      const elem = (event.target as HTMLElement);

      // вызываем оповещение подписчиков
      // handler(event.offsetX, elem.offsetWidth);
    });
  }


  setTheme(theme: string) {

    // удаляем старую тему если есть 
    if (this.prevTheme)
      this.rangeSlider.classList.remove(this.prevTheme);
    const classN = 'rs-' + theme;
    this.rangeSlider.classList.add(classN);
    this.prevTheme = classN;
  }


  createDotElem(type: string) {
    this.handle.createDomBase(type);
  }

  setDotFrom(fromP: number) {
    this.handle.setFrom(fromP);
  }

  setDotTo(toP: number, type: string) {
    this.handle.setTo(toP, type);
  }


  setDotActions(type: string) {
    this.handle.setActions(type);
  }

  // initHandle(options: CreateHandleOptions) {
  //   this.handle = new Handle(options);
  // }

  // initHints(handler: Function) {
  //   this.hints = new Hints(this.rsTop);
  //   handler();
  // }

  // initBar(handler: Function) {
  //   this.bar = new Bar(this.rsCenter);
  //   handler();
  // }

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

  // createDomHints(handler: Function, options: CreateHintsOptions) {

  //   this.hints.createTipMinMax(
  //     options.min,
  //     options.max,
  //     options.tipPrefix
  //   );
  //   this.hints.createTipFromTo({
  //     valFrom: options.valFrom,
  //     valTo: options.valTo,
  //     type: options.type,
  //     tipPrefix: options.tipPrefix
  //   });

  //   handler();
  // }

  // getWidthTipFromTo() {
  //   const widthFrom = this.hints.getWidthFrom();
  //   const widthTo = this.hints.getWidthTo();
  //   return {
  //     tipFrom: widthFrom,
  //     tipTo: widthTo
  //   };
  // }

  // setTipFrom(valFrom: number, tipFromX: number) {
  //   this.hints.setTipFrom(valFrom, tipFromX);
  // }

  // setTipTo(valTo: number, tipToX: number) {
  //   this.hints.setTipTo(valTo, tipToX);
  // }

  // setTipSingleX(singleX: number) {
  //   this.hints.positionTipSingle(singleX);
  // }

  // getWidthTipSingle() {
  //   return this.hints.getWidthSingle();
  // }




  // createHandle(handler: Function) {
  //   this.handle.createHandle(this.rsCenter, handler);
  // }



  // setActionsHandle(handler: Function) {
  //   this.handle.setActions(handler);
  // }


  // setPositionFrom(fromP: number) {
  //   this.handle.setFrom(fromP);
  // }

  // setPositionTo(toP: number) {
  //   this.handle.setTo(toP);
  // }



}



export { View };