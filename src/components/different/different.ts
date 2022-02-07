import './different.scss';
import { Select } from '../select/select';



interface OP {
  type?: string;
  disabled?: boolean;
  bar?: boolean;
  orientation?: string;
  theme?: string;
}



class Different {

  private elem: Element;
  private type: HTMLInputElement;
  private disabled: HTMLInputElement;
  private orientation: HTMLInputElement;
  private bar: HTMLInputElement;
  private unsubscribtion: HTMLInputElement;
  private select: Select;
  private reset: HTMLButtonElement;
  private panel: Element;
  private modify: string;
  private disabledD: boolean;
  private barD: boolean;
  private typeD: string;
  private orientationD: string;
  private themeD: string;
  private nameClass: string;
  onUnsubscribtion: Function;


  constructor(nameClass: string, elem: Element, panel: Element) {
    this.nameClass = nameClass;
    this.panel = panel;
    this.elem = elem;
    this.setDom();
  }


  setData(options: OP) {
    const { disabled, bar, type, orientation, theme } = options;

    if (this.disabledD != disabled) {
      this.disabled.checked = disabled;
      this.disabledD = disabled;
    }

    if (this.barD != bar) {
      this.bar.checked = bar;
      this.barD = bar;
    }

    if (this.typeD != type) {
      this.type.checked = type == 'double' ? true : false;
      this.typeD = type;
    }

    if (this.orientationD != orientation) {
      const orientF = orientation == 'horizontal' ? false : true;
      this.orientation.checked = orientF;
      this.orientationD = orientation;

      if (orientF) {
        this.panel.classList.add(this.modify);
      } else {
        this.panel.classList.remove(this.modify);
      }
    }

    if (this.themeD != theme) {
      this.select.update(String(theme));
      this.themeD = theme;
    }
  }


  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    const modify = this.modify;
    const objP = this.panel.classList;

    this.reset.addEventListener('click', () => {
      obj.reset();
    });

    this.select.onChange = (val: string) => {
      obj.update({
        theme: val
      });
    };

    this.disabled.addEventListener('click', function (e: Event) {
      const elem = e.target;
      if (elem instanceof HTMLInputElement)
        obj.update({
          disabled: elem.checked
        });
    });

    this.bar.addEventListener('click', function (e: Event) {
      const elem = e.target;
      if (elem instanceof HTMLInputElement)
        obj.update({
          bar: elem.checked
        });
    });

    this.unsubscribtion.addEventListener('click', () => {
      if (typeof this.onUnsubscribtion == 'function')
        this.onUnsubscribtion();
    });

    this.type.addEventListener('click', function (e: Event) {
      const elem = e.target;
      let val: string;
      if (elem instanceof HTMLInputElement)
        val = elem.checked ? 'double' : 'single';
      obj.update({
        type: val
      });
    });

    this.orientation.addEventListener('click', function (e: Event) {
      const elem = e.target;
      let val: string;
      if (elem instanceof HTMLInputElement) {
        val = elem.checked ? 'vertical' : 'horizontal';
        elem.checked ? objP.add(modify) : objP.remove(modify);
      }

      obj.update({
        orientation: val
      });
    });
  }

  private setDom() {

    this.modify = this.panel.classList[0] + '_vertical';

    const getDom = (str: string): HTMLInputElement => {
      return this.elem.querySelector(
        this.nameClass +
        '__' +
        str +
        '-wrap input'
      );
    };

    this.type = getDom('double');
    this.disabled = getDom('disabled');
    this.bar = getDom('bar');
    this.unsubscribtion = getDom('unsubscribtion');
    this.orientation = getDom('vertical');
    this.reset =
      this.elem.querySelector(this.nameClass + '__reset');
    const selectE = this.elem.querySelector('.js-select');
    this.select = new Select('.js-select', selectE);
  }

}



export { Different };