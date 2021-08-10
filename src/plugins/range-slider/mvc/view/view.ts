
import { CreateHandleOptions } from './view.d';
import { Handle } from './sub-view/handle';



class View {

  rsName: string;
  wrapSlider: Element;
  rangeSlider: Element;
  rsTop: Element;
  rsCenter: Element;
  rsBottom: Element;
  rsLine: Element;

  // eslint-disable-next-line no-unused-vars
  constructor(public elem: Element, public numElem: Number) {
    this.rsName = 'range-slider';
    this.wrapSlider = this.elem.parentElement;
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



  createHandle(
    handler: Function,
    options: CreateHandleOptions
  ) {

    const obj = new Handle(options);

    obj.createHandle(this.rsCenter);


    handler();
  }


  initDomElem(handler: Function) {
    // нужно получить дом элементы базовой разметки. 

    const getElem = (elem: Element, str: string) => {
      return elem.getElementsByClassName(str)[0];
    };


    this.rangeSlider = getElem(this.wrapSlider, 'js-rs-' + this.numElem);
    this.rsTop = getElem(this.rangeSlider, this.rsName + '__top');
    this.rsCenter = getElem(this.rangeSlider, this.rsName + '__center');
    this.rsBottom = getElem(this.rangeSlider, this.rsName + '__bottom');
    this.rsLine = getElem(this.rangeSlider, this.rsName + '__line');




    handler();
  }

  setActions() {

  }

}



export { View };