import { boundMethod } from 'autobind-decorator';
import './different.scss';
import Select from '@com/select/Select';

interface Options {
  type?: string | null;
  disabled?: boolean | null;
  bar?: boolean | null;
  orientation?: string | null;
  theme?: string | null;
}

class Different {
  private elem: Element;

  private type: HTMLInputElement | null = null;

  private disabled: HTMLInputElement | null = null;

  private orientation: HTMLInputElement | null = null;

  private bar: HTMLInputElement | null = null;

  private unsubscribtion: HTMLInputElement | null = null;

  private select: Select | null = null;

  private reset: HTMLButtonElement | null = null;

  private panel: Element | null = null;

  private modify: string = '';

  private disabledCache: boolean = false;

  private barCache: boolean = false;

  private typeCache: string = '';

  private orientationCache: string = '';

  private themeCache: string = '';

  private nameClass: string;

  private objRangeSlider: any;

  onUnsubscribtion: Function | null = null;

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

    if (this.disabledCache !== disabled && this.disabled) {
      this.disabled.checked = disabled ?? false;
      this.disabledCache = disabled ?? false;
    }

    if (this.barCache !== bar && this.bar) {
      this.bar.checked = bar ?? false;
      this.barCache = bar ?? false;
    }

    if (this.typeCache !== type && this.type) {
      this.type.checked = type === 'double';
      this.typeCache = type ?? '';
    }

    if (this.orientationCache !== orientation && this.orientation) {
      const orientFlag = orientation !== 'horizontal';
      this.orientation.checked = orientFlag;
      this.orientationCache = orientation ?? '';

      const { classList } = this.panel as Element;

      if (orientFlag) {
        classList.add(this.modify);
      } else {
        classList.remove(this.modify);
      }
    }

    if (this.themeCache !== theme && this.select) {
      this.select.update(String(theme));
      this.themeCache = theme ?? '';
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    this.objRangeSlider = obj;

    if (!this.reset || !this.select) return false;

    this.reset.addEventListener('click', this.handleResetClick);

    this.select.onChange = (value: string) => {
      obj.update({
        theme: value,
      });
    };

    if (!this.disabled || !this.bar) return false;

    this.disabled.addEventListener('click', this.handleDisabledClick);
    this.bar.addEventListener('click', this.handleBarClick);

    if (!this.unsubscribtion || !this.type) return false;

    this.unsubscribtion.addEventListener(
      'click',
      this.handleUnsubscribtionClick,
    );
    this.type.addEventListener('click', this.handleTypeClick);

    if (this.orientation) {
      this.orientation.addEventListener('click', this.handleOrientationClick);
    }

    return true;
  }

  @boundMethod
  private handleResetClick() {
    this.objRangeSlider.reset();
  }

  @boundMethod
  private handleDisabledClick(event: Event) {
    const elem = event.target as HTMLInputElement;
    this.objRangeSlider.update({
      disabled: elem.checked,
    });
  }

  @boundMethod
  private handleBarClick(event: Event) {
    const elem = event.target as HTMLInputElement;
    this.objRangeSlider.update({
      bar: elem.checked,
    });
  }

  @boundMethod
  private handleUnsubscribtionClick() {
    if (typeof this.onUnsubscribtion === 'function') {
      this.onUnsubscribtion();
    }
  }

  @boundMethod
  private handleTypeClick(event: Event) {
    const elem = event.target as HTMLInputElement;
    this.objRangeSlider.update({
      type: elem.checked ? 'double' : 'single',
    });
  }

  @boundMethod
  private handleOrientationClick(event: Event) {
    const elem = event.target as HTMLInputElement;
    const { classList } = this.panel as Element;

    if (elem.checked) {
      classList.add(this.modify);
    } else {
      classList.remove(this.modify);
    }

    this.objRangeSlider.update({
      orientation: elem.checked ? 'vertical' : 'horizontal',
    });
  }

  private setDom() {
    if (this.panel) {
      this.modify = `${this.panel.classList[0]}_vertical`;
    }

    const getDom = (str: string) => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    ) as HTMLInputElement;

    this.type = getDom('double');
    this.disabled = getDom('disabled');
    this.bar = getDom('bar');
    this.unsubscribtion = getDom('unsubscribtion');
    this.orientation = getDom('vertical');
    this.reset = this.elem.querySelector(`${this.nameClass}__reset`);

    this.select = new Select(
      '.js-select',
      this.elem.querySelector('.js-select') as Element,
    );
  }
}

export default Different;
