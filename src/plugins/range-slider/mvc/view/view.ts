
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
  handle: Handle;
  hints: Hints;
  bar: Bar;
  grid: Grid;

  // eslint-disable-next-line no-unused-vars
  constructor(public elem: Element, public numElem: Number) {
    super();
    this.rsName = 'range-slider';
    this.wrapSlider = this.elem.parentElement;
  }


  init() {

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

  // createDomBase(handler: Function, theme: string) {

  //   const createElem = (teg: string, className: string[]) => {
  //     const elem = document.createElement(teg);
  //     for (let item of className) {
  //       elem.classList.add(item);
  //     }
  //     return elem;
  //   };

  //   const wrapElem = createElem('div', [
  //     this.rsName,
  //     'js-rs-' + this.numElem,
  //     'rs-' + theme // тут нужно запрашивать из модели
  //   ]);


  //   const topElem = createElem('div', [this.rsName + '__top']);
  //   const centerElem = createElem('div', [this.rsName + '__center']);
  //   const bottomElem = createElem('div', [this.rsName + '__bottom']);
  //   const rsLine = createElem('span', [this.rsName + '__line']);

  //   centerElem.appendChild(rsLine);

  //   wrapElem.appendChild(topElem);
  //   wrapElem.appendChild(centerElem);
  //   wrapElem.appendChild(bottomElem);



  //   this.wrapSlider.appendChild(wrapElem);


  //   handler();
  // }



  // createHandle(handler: Function) {
  //   this.handle.createHandle(this.rsCenter, handler);
  // }


  // initDomElem(handler: Function) {
  //   // нужно получить дом элементы базовой разметки. 

  //   const getElem = (elem: Element, str: string) => {
  //     return elem.getElementsByClassName(str)[0];
  //   };

  //   this.rangeSlider = getElem(this.wrapSlider, 'js-rs-' + this.numElem);
  //   this.rsTop = getElem(this.rangeSlider, this.rsName + '__top');
  //   this.rsCenter = (getElem(this.rangeSlider,
  //     this.rsName + '__center') as HTMLElement);

  //   this.rsBottom = getElem(this.rangeSlider, this.rsName + '__bottom');
  //   this.rsLine = (getElem(this.rangeSlider,
  //     this.rsName + '__line') as HTMLElement);

  //   handler();
  // }

  // setActions(handler: Function) {

  //   this.rsLine.addEventListener('click', (event: MouseEvent) => {
  //     const elem = (event.target as HTMLElement);
  //     handler(event.offsetX, elem.offsetWidth);
  //   });

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