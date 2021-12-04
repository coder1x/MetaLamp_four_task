import './input-data.scss';
import {
  HInput,
  HElem
} from '../../plugins/range-slider-fox/glob-interface';


class InputData {

  private value: HInput;
  private input: HInput;
  private className: string;
  private elem: HElem;

  constructor(className: string, elem: HElem) {
    this.className = className;
    this.elem = elem;
    this.setDom();
  }

  private setDom() {
    this.input = this.elem.querySelector(
      this.className + '__slider-wrap input'
    );

    this.value = this.elem.querySelector(
      '.input-data input'
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
