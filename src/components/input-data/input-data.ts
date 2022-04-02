import './input-data.scss';

class InputData {
  private value: HTMLInputElement;
  private input: HTMLInputElement;
  private className: string;
  private elem: Element;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.setDom();
  }

  private setDom() {
    this.input = this.elem.querySelector(
      this.className + '__slider-wrap input'
    );

    this.value = this.elem.querySelector(
      '.js-input-data input'
    );

    if (this.input) {
      const _this = this;
      Object.defineProperty(this.input, "value", {
        set: function (text) {
          if (!text) return;
          _this.value.value = text;
          this.setAttribute("value", text);
        }
      });
    } else {
      this.value.disabled = true;
    }
  }
}

export { InputData };