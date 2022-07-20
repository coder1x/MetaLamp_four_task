class InputData {
  private value: HTMLInputElement | null = null;

  private input: HTMLInputElement | null = null;

  private className: string;

  private element: Element;

  constructor(className: string, element: Element) {
    this.className = className;
    this.element = element;
    this.setDomElement();
  }

  private setDomElement() {
    this.input = this.element.querySelector(
      `${this.className}__slider-wrapper input`,
    );

    this.value = this.element.querySelector(
      '.js-input-data input',
    ) as HTMLInputElement;

    if (this.input) {
      const objThis = this;
      Object.defineProperty(this.input, 'value', {
        set(text) {
          if (!text && !objThis) { return; }

          const input = objThis.value as HTMLInputElement;

          input.value = text;
          this.setAttribute('value', text);
        },
      });
    } else {
      this.value.disabled = true;
    }
  }
}

export default InputData;
