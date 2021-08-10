
class View {

  rsName: string;

  // eslint-disable-next-line no-unused-vars
  constructor(public elem: Element, public numElem: Number) {
    this.rsName = 'range-slider';
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


    const wrapSlider = this.elem.parentElement;
    wrapSlider.appendChild(wrapElem);


    handler();
  }

  getDomElem() {

  }

  setActions() {

  }

}



export { View };