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

  private disabledCache: boolean;

  private barCache: boolean;

  private typeCache: string;

  private orientationCache: string;

  private themeCache: string;

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

    if (this.disabledCache !== disabled) {
      this.disabled.checked = disabled;
      this.disabledCache = disabled;
    }

    if (this.barCache !== bar) {
      this.bar.checked = bar;
      this.barCache = bar;
    }

    if (this.typeCache !== type) {
      this.type.checked = type === 'double';
      this.typeCache = type;
    }

    if (this.orientationCache !== orientation) {
      const orientFlag = orientation !== 'horizontal';
      this.orientation.checked = orientFlag;
      this.orientationCache = orientation;

      if (orientFlag) {
        this.panel.classList.add(this.modify);
      } else {
        this.panel.classList.remove(this.modify);
      }
    }

    if (this.themeCache !== theme) {
      this.select.update(String(theme));
      this.themeCache = theme;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    const { modify } = this;
    const objPanel = this.panel.classList;

    this.reset.addEventListener('click', () => {
      obj.reset();
    });

    this.select.onChange = (value: string) => {
      obj.update({
        theme: value,
      });
    };

    this.disabled.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;
      obj.update({
        disabled: elem.checked,
      });
    });

    this.bar.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;
      obj.update({
        bar: elem.checked,
      });
    });

    this.unsubscribtion.addEventListener('click', () => {
      if (typeof this.onUnsubscribtion === 'function') {
        this.onUnsubscribtion();
      }
    });

    this.type.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;
      const value = elem.checked ? 'double' : 'single';
      obj.update({
        type: value,
      });
    });

    this.orientation.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;
      const value = elem.checked ? 'vertical' : 'horizontal';

      if (elem.checked) {
        objPanel.add(modify);
      } else {
        objPanel.remove(modify);
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
