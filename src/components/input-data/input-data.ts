import './input-data.scss';



class InputData {

  private value: HTMLInputElement;
  private input: HTMLInputElement;

  // eslint-disable-next-line no-unused-vars
  constructor(public className: string, public elem: HTMLElement) {
    this.setDom();
  }

  private setDom() {

    this.input = this.elem.querySelector(
      this.className + '__slider-wrap input'
    ) as HTMLInputElement;

    this.value = this.elem.querySelector(
      '.input-data input'
    ) as HTMLInputElement;

    const _this = this;
    Object.defineProperty(this.input, "value", {
      set: function (text) {
        if (!text) return;
        _this.value.value = text;
        this.setAttribute("value", text);
      }
    });

  }
}


export { InputData };
