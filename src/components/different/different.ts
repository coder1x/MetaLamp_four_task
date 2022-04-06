import './different.scss';
import Select from '@com/select/select';

interface Options {
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

  setData(options: Options) {
    const {
      disabled, bar, type, orientation, theme,
    } = options;

    if (this.disabledD !== disabled) {
      this.disabled.checked = disabled;
      this.disabledD = disabled;
    }

    if (this.barD !== bar) {
      this.bar.checked = bar;
      this.barD = bar;
    }

    if (this.typeD !== type) {
      this.type.checked = type === 'double';
      this.typeD = type;
    }

    if (this.orientationD !== orientation) {
      const orientF = orientation !== 'horizontal';
      this.orientation.checked = orientF;
      this.orientationD = orientation;

      if (orientF) {
        this.panel.classList.add(this.modify);
      } else {
        this.panel.classList.remove(this.modify);
      }
    }

    if (this.themeD !== theme) {
      this.select.update(String(theme));
      this.themeD = theme;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    const { modify } = this;
    const objP = this.panel.classList;

    this.reset.addEventListener('click', () => {
      obj.reset();
    });

    this.select.onChange = (val: string) => {
      obj.update({
        theme: val,
      });
    };

    this.disabled.addEventListener('click', (e: Event) => {
      const elem = e.target as HTMLInputElement;
      obj.update({
        disabled: elem.checked,
      });
    });

    this.bar.addEventListener('click', (e: Event) => {
      const elem = e.target as HTMLInputElement;
      obj.update({
        bar: elem.checked,
      });
    });

    this.unsubscribtion.addEventListener('click', () => {
      if (typeof this.onUnsubscribtion === 'function') {
        this.onUnsubscribtion();
      }
    });

    this.type.addEventListener('click', (e: Event) => {
      const elem = e.target as HTMLInputElement;
      const value = elem.checked ? 'double' : 'single';
      obj.update({
        type: value,
      });
    });

    this.orientation.addEventListener('click', (e: Event) => {
      const elem = e.target as HTMLInputElement;
      const value = elem.checked ? 'vertical' : 'horizontal';

      if (elem.checked) {
        objP.add(modify);
      } else {
        objP.remove(modify);
      }

      obj.update({
        orientation: value,
      });
    });
  }

  private setDom() {
    this.modify = `${this.panel.classList[0]}_vertical`;

    const getDom = (str: string): HTMLInputElement => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    );

    this.type = getDom('double');
    this.disabled = getDom('disabled');
    this.bar = getDom('bar');
    this.unsubscribtion = getDom('unsubscribtion');
    this.orientation = getDom('vertical');
    this.reset = this.elem.querySelector(`${this.nameClass}__reset`);
    const selectE = this.elem.querySelector('.js-select');
    this.select = new Select('.js-select', selectE);
  }
}

export default Different;
