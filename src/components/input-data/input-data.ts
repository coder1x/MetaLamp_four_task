import './input-data.scss';


class InputData {

  private elem: HTMLElement;
  private value: HTMLInputElement;
  private input: HTMLInputElement;

  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, public selectorIn: string) {

    // this.elem = elem;
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

    this.elem = document.querySelector(this.nameClass);
    this.input = document.querySelector(this.selectorIn);
    this.value = getDom('value');
  }

  setData() {
    this.value.value = this.input.value;
  }
}



export { InputData };
