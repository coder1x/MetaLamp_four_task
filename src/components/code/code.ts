import './code.scss';
import { RangeSliderOptions } from
  '../../components/interface/glob-interface';


class CopyCode {

  private className: string;
  private elem: Element;
  private button: HTMLButtonElement;
  private ul: Element;


  constructor(className: string, component: Element) {
    this.className = className;
    this.elem = component;
    this.init();
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

      if (!fl) {
        const item = this.createElem('li', [name + '__item']);
        this.ul.appendChild(item);
        item.innerText = text;
      }
      else {
        const item = child[i];
        if (item instanceof HTMLElement)
          item.innerText = text;
      }

    }
  }

  private init() {
    this.ul = this.elem.querySelector(this.className + '__options');
    this.button = this.elem.querySelector(this.className + '__copy');
    this.setActions();
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
        const elem = item;
        if (elem instanceof HTMLElement)
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