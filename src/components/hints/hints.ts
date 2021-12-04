import './hints.scss';

import {
  HInputEv,
  HInput,
  HElem
} from '../../plugins/range-slider-fox/glob-interface';

interface OP {
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  tipPrefix?: string;
  tipPostfix?: string;
}

class Hints {
  private elem: HElem;
  private tipMinMax: HInput;
  private tipFromTo: HInput;
  private tipPrefix: HInput;
  private tipPostfix: HInput;
  private tipMinMaxD: boolean;
  private tipFromToD: boolean;
  private tipPrefixD: string;
  private tipPostfixD: string;
  private nameClass: string;

  constructor(nameClass: string, elem: HElem) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: OP) {
    const { tipMinMax, tipFromTo, tipPrefix, tipPostfix } = options;

    if (this.tipMinMaxD != tipMinMax) {
      this.tipMinMax.checked = tipMinMax;
      this.tipMinMaxD = tipMinMax;
    }
    if (this.tipFromToD != tipFromTo) {
      this.tipFromTo.checked = tipFromTo;
      this.tipFromToD = tipFromTo;
    }
    if (this.tipPrefixD != tipPrefix) {
      this.tipPrefix.value = String(tipPrefix);
      this.tipPrefixD = tipPrefix;
    }
    if (this.tipPostfixD != tipPostfix) {
      this.tipPostfix.value = String(tipPostfix);
      this.tipPostfixD = tipPostfix;
    }
  }

  setAction(obj: any) {
    const data = (e: Event) => {
      const elem: HInputEv = e.target;
      obj.update({
        [elem.name]: elem.value
      });
    };

    const masE = [this.tipPrefix, this.tipPostfix];
    for (let item of masE) {
      item.addEventListener('change', data);
    }

    this.tipMinMax.addEventListener('click', function (e: Event) {
      const elem: HInputEv = e.target;
      obj.update({
        tipMinMax: elem.checked
      });
    });

    this.tipFromTo.addEventListener('click', function (e: Event) {
      const elem: HInputEv = e.target;
      obj.update({
        tipFromTo: elem.checked
      });
    });
  }

  private setDom() {
    const getDom = (str: string) => {
      return this.elem.querySelector(
        this.nameClass +
        '__' +
        str +
        '-wrap input'
      );
    };

    this.tipMinMax = getDom('minmax');
    this.tipFromTo = getDom('fromto');
    this.tipPrefix = getDom('prefix');
    this.tipPostfix = getDom('postfix');
  }

}



export { Hints };