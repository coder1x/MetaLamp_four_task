import './code.scss';


import { RangeSliderOptions } from
  '../../plugins/range-slider-fox/mvc/model/model.d';


class CopyCode {

  private className: string;
  private elem: HTMLElement;
  private button: HTMLButtonElement;
  private items: HTMLElement[];


  constructor(className: string, component: HTMLElement) {
    this.className = className;
    this.elem = component;
    this.setDomElem();
    this.setActions();
  }


  setData(options: RangeSliderOptions) {
    const key = Object.keys(options);
    const val = Object.values(options);

    for (let i = 0; i < key.length; i++) {
      let valT: string;
      if (typeof val[i] == 'string') { valT = '\'' + val[i] + '\''; }
      else {
        valT = val[i];
      }
      const text = key[i] + ': ' + valT + ',';
      this.items[i].innerText = text;
    }
  }


  private setDomElem() {
    this.button = this.elem.querySelector(this.className + '__copy');

    this.items =
      [...this.elem.querySelectorAll<HTMLElement>(this.className + '__item')];
  }

  private setActions() {
    this.button.addEventListener('click', () => {
      let text = '$(\'.demo\').RangeSliderFox({\n';
      for (let item of this.items) {
        text += item.innerText + '\n';
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