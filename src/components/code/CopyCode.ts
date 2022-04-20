import { boundMethod } from 'autobind-decorator';
import './code.scss';
import RangeSliderOptions from '@com/interface/glob-interface';

class CopyCode {
  private className: string;

  private elem: Element;

  private button: HTMLButtonElement | null = null;

  private ul: Element | null = null;

  constructor(className: string, component: Element) {
    this.className = className;
    this.elem = component;
    this.init();
  }

  setData(options: RangeSliderOptions) {
    if (!this.ul) return false;

    const key = Object.keys(options);
    const value = Object.values(options);
    const name = this.className.replace('.', '');
    const child = this.ul.childNodes;
    const flag = !!child.length;

    for (let i = 0; i < key.length; i += 1) {
      let valStr: string;
      if (typeof value[i] === 'string') {
        valStr = `'${value[i]}'`;
      } else {
        valStr = value[i];
      }
      const text = `${key[i]}: ${valStr},`;

      if (!flag) {
        const item = CopyCode.createElem('li', [`${name}__item`]);
        this.ul.appendChild(item);
        item.innerText = text;
      } else {
        const item = child[i] as HTMLElement;
        item.innerText = text;
      }
    }

    return true;
  }

  private init() {
    this.ul = this.elem.querySelector(`${this.className}__options`);
    this.button = this.elem.querySelector(`${this.className}__copy`);
    this.setActions();
  }

  private static createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);

    className.forEach((item) => {
      elem.classList.add(item);
    });

    return elem;
  }

  @boundMethod
  private handleButtonClick() {
    if (!this.ul) return false;

    const child = this.ul.childNodes;

    let text = '$(\'.demo\').RangeSliderFox({\n';

    child.forEach((item) => {
      const elem = item as HTMLElement;
      text += `${elem.innerText}\n`;
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
