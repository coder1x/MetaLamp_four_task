import './slider-data.scss';

interface OP {
  from?: number;
  to?: number;
}

class SliderData {

  private elem: HTMLElement;
  private from: HTMLInputElement;
  private to: HTMLInputElement;

  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, elem: HTMLElement) {

    this.elem = elem;
    this.setDom();
  }

  private setDom() {
    const getDom = (str: string) => {
      return this.elem.querySelector(
        this.nameClass +
        '__' +
        str +
        '-wrap input'
      ) as HTMLInputElement;
    };

    this.from = getDom('valfrom');
    this.to = getDom('valto');
  }

  setData(options: OP) {
    this.from.value = String(options.from);
    this.to.value = String(options.to);
  }
}



export { SliderData };
