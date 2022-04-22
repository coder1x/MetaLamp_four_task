import { boundMethod } from 'autobind-decorator';
import './code.scss';
import RangeSliderOptions from '@com/interface/glob-interface.d';

class CopyCode {
  private className: string;

  private element: Element;

  private button: HTMLButtonElement | null = null;

  private list: Element | null = null;

  constructor(className: string, component: Element) {
    this.className = className;
    this.element = component;
    this.init();
  }

  setData(options: RangeSliderOptions) {
    if (!this.list) return false;

    const key = Object.keys(options);
    const values = Object.values(options);
    const { childNodes } = this.list;
    const isChildNodes = !!childNodes.length;

    for (let i = 0; i < key.length; i += 1) {
      let value: string;
      if (typeof values[i] === 'string') {
        value = `'${values[i]}'`;
      } else {
        value = values[i];
      }
      const text = `${key[i]}: ${value},`;

      if (!isChildNodes) {
        const item = CopyCode.createElem(
          'li',
          [`${this.className.replace('.', '')}__item`],
        );
        this.list.appendChild(item);
        item.innerText = text;
      } else {
        const item = childNodes[i] as HTMLElement;
        item.innerText = text;
      }
    }

    return true;
  }

  private init() {
    this.list = this.element.querySelector(`${this.className}__options`);
    this.button = this.element.querySelector(`${this.className}__copy`);
    this.setActions();
  }

  private static createElem(teg: string, className: string[]) {
    const element = document.createElement(teg);

    className.forEach((item) => {
      element.classList.add(item);
    });

    return element;
  }

  @boundMethod
  private handleButtonClick() {
    if (!this.list) return false;

    let text = '$(\'.demo\').RangeSliderFox({\n';

    this.list.childNodes.forEach((item) => {
      const element = item as HTMLElement;
      text += `${element.innerText}\n`;
    });

    text += '});';

    navigator.clipboard.writeText(text)
      .then(() => {
      })
      .catch((err) => {
        console.log('Something went wrong', err);
      });

    return true;
  }

  private setActions() {
    if (this.button) {
      this.button.addEventListener('click', this.handleButtonClick);
    }
  }
}

export default CopyCode;
