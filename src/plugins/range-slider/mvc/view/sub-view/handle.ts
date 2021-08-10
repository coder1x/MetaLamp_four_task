
import { CreateHandleOptions } from '../view.d';

class Handle {

  elemFrom: Element;
  elemTo: Element;
  rsName: string;

  // eslint-disable-next-line no-unused-vars
  constructor(public options: CreateHandleOptions) {
    this.rsName = 'range-slider';

  }

  // создаём точки с табИндексом ноль. и с нужными классами. 

  createHandle(wrapElem: Element) {

    const createElem = (teg: string, className: string[]) => {
      const elem = document.createElement(teg);
      for (let item of className) {
        elem.classList.add(item);
      }
      return elem;
    };

    if (this.options.type == 'double') {
      // две точки
      this.elemFrom = createElem('span', [this.rsName + '__from']);
      this.elemTo = createElem('span', [this.rsName + '__to']);

      wrapElem.appendChild(this.elemFrom);
      wrapElem.appendChild(this.elemTo);
    }
    else {
      // одна точка - только From
      this.elemFrom = createElem('span', [this.rsName + '__from']);
      wrapElem.appendChild(this.elemFrom);
    }


  }




}





export { Handle };