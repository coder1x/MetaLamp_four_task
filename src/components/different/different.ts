import './different.scss';
import { Select } from '../select/select';



import { HInput, HInputEv, HElem } from
  '../../components/interface/glob-interface';


interface OP {
  type?: string;
  disabled?: boolean;
  bar?: boolean;
  orientation?: string;
  theme?: string;
}



class Different {

  private elem: HElem;
  private type: HInput;
  private disabled: HInput;
  private orientation: HInput;
  private bar: HInput;
  private unsubscribtion: HInput;
  private select: Select;
  private reset: HTMLButtonElement;
  private panel: HElem;
  private modify: string;
  private disabledD: boolean;
  private barD: boolean;
  private typeD: string;
  private orientationD: string;
  private themeD: string;
  private nameClass: string;
  onUnsubscribtion: Function;


  constructor(nameClass: string, elem: HElem, panel: HElem) {
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
      const elem: HInputEv = e.target;
      obj.update({
        disabled: elem.checked
      });
    });

    this.bar.addEventListener('click', function (e: Event) {
      const elem: HInputEv = e.target;
      obj.update({
        bar: elem.checked
      });
    });

    this.unsubscribtion.addEventListener('click', () => {
      if (typeof this.onUnsubscribtion == 'function')
        this.onUnsubscribtion();
    });

    this.type.addEventListener('click', function (e: Event) {
      const elem: HInputEv = e.target;
      const val = elem.checked ? 'double' : 'single';
      obj.update({
        type: val
      });
    });

    this.orientation.addEventListener('click', function (e: Event) {
      const elem: HInputEv = e.target;
      const val = elem.checked ? 'vertical' : 'horizontal';
      elem.checked ? objP.add(modify) : objP.remove(modify);

      obj.update({
        orientation: val
      });
    });
  }

  private setDom() {

    this.modify = this.panel.className + '_vertical';

    const getDom = (str: string) => {
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
    const selectE = this.elem.querySelector('.select');
    this.select = new Select('.select', selectE);
  }

}



export { Different };