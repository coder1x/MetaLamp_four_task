
import { CreateHandleOptions } from './view.d';
import { Handle } from './sub-view/handle';



class View {

  rsName: string;
  wrapSlider: Element;
  rangeSlider: Element;
  rsTop: Element;
  rsCenter: HTMLElement;
  rsBottom: Element;
  rsLine: HTMLElement;
  handle: Handle;

  // eslint-disable-next-line no-unused-vars
  constructor(public elem: Element, public numElem: Number) {
    this.rsName = 'range-slider';
    this.wrapSlider = this.elem.parentElement;
  }

  initHandle(options: CreateHandleOptions) {
    this.handle = new Handle(options);
  }


  createDomBase(handler: Function, theme: string) {

    const createElem = (teg: string, className: string[]) => {
      const elem = document.createElement(teg);
      for (let item of className) {
        elem.classList.add(item);
      }
      return elem;
    };

    const wrapElem = createElem('div', [
      this.rsName,
      'js-rs-' + this.numElem,
      'rs-' + theme // тут нужно запрашивать из модели
    ]);


    const topElem = createElem('div', [this.rsName + '__top']);
    const centerElem = createElem('div', [this.rsName + '__center']);
    const bottomElem = createElem('div', [this.rsName + '__bottom']);
    const rsLine = createElem('span', [this.rsName + '__line']);


    centerElem.appendChild(rsLine);

    wrapElem.appendChild(topElem);
    wrapElem.appendChild(centerElem);
    wrapElem.appendChild(bottomElem);



    this.wrapSlider.appendChild(wrapElem);


    handler();
  }



  createHandle(handler: Function) {
    this.handle.createHandle(this.rsCenter, handler);
  }


  initDomElem(handler: Function) {
    // нужно получить дом элементы базовой разметки. 

    const getElem = (elem: Element, str: string) => {
      return elem.getElementsByClassName(str)[0];
    };

    this.rangeSlider = getElem(this.wrapSlider, 'js-rs-' + this.numElem);
    this.rsTop = getElem(this.rangeSlider, this.rsName + '__top');
    this.rsCenter =
      (getElem(this.rangeSlider, this.rsName + '__center') as HTMLElement);

    this.rsBottom = getElem(this.rangeSlider, this.rsName + '__bottom');
    this.rsLine =
      (getElem(this.rangeSlider, this.rsName + '__line') as HTMLElement);

    handler();
  }

  setActions(handler: Function) {

    this.rsLine.addEventListener('click', (event: MouseEvent) => {
      const elem = (event.target as HTMLElement);
      handler(event.offsetX, elem.offsetWidth);
    });

  }

  setActionsHandle(handler: Function) {
    this.handle.setActions(handler);
  }


  setPositionFrom(fromP: number) {
    this.handle.setFrom(fromP);
  }

  setPositionTo(toP: number) {
    this.handle.setTo(toP);
  }



}



export { View };