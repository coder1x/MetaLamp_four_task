import './code.scss';

import { RangeSliderOptions } from
  '../../plugins/range-slider-fox/glob-interface';


class CopyCode {

  private className: string;
  private elem: HTMLElement;
  private button: HTMLButtonElement;
  private ul: Element;
  private items: HTMLElement[];


  constructor(className: string, component: HTMLElement) {
    this.className = className;

    this.elem = component;
    this.init();
  }

  private init() {
    this.ul = this.elem.querySelector(this.className + '__options');
    this.button = this.elem.querySelector(this.className + '__copy');

    this.setActions();
  }

  setData(options: RangeSliderOptions) {
    const key = Object.keys(options);
    const val = Object.values(options);
    const name = this.className.replace('.', '');
    const child = this.ul.childNodes;
    const fl = child.length ? true : false;

    for (let i = 0; i < key.length; ++i) {
      let valT: string;
      if (typeof val[i] == 'string') { valT = '\'' + val[i] + '\''; }
      else {
        valT = val[i];
      }
      const text = key[i] + ': ' + valT + ',';
      let item: HTMLElement;
      if (!fl) {
        item = this.createElem('li', [name + '__item']);
        this.ul.appendChild(item);
      }
      else
        item = child[i] as HTMLElement;
      item.innerText = text;
    }
  }


  private createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }

  private setActions() {

    const child = this.ul.childNodes;

    this.button.addEventListener('click', () => {
      let text = '$(\'.demo\').RangeSliderFox({\n';
      for (let item of child) {
        const elem = item as HTMLElement;
        text += elem.innerText + '\n';
      }
      text += '});';
      navigator.clipboard.writeText(text)
        .then(() => {
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });
    });
  }

}




export { CopyCode };