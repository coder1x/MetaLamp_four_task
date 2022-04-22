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
  private element: Element;

  private type: HTMLInputElement | null = null;

  private disabled: HTMLInputElement | null = null;

  private orientation: HTMLInputElement | null = null;

  private bar: HTMLInputElement | null = null;

  private unsubscribtion: HTMLInputElement | null = null;

  private select: Select | null = null;

  private reset: HTMLButtonElement | null = null;

  private panel: Element | null = null;

  private modifier: string = '';

  private disabledCache: boolean = false;

  private barCache: boolean = false;

  private typeCache: string = '';

  private orientationCache: string = '';

  private themeCache: string = '';

  private nameClass: string;

  private objRangeSlider: any;

  onUnsubscribtion: Function | null = null;

  constructor(nameClass: string, element: Element, panel: Element) {
    this.nameClass = nameClass;
    this.panel = panel;
    this.element = element;
    this.setDomElement();
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
        classList.add(this.modifier);
      } else {
        classList.remove(this.modifier);
      }
    }

    if (this.themeCache !== theme && this.select) {
      this.select.update(String(theme));
      this.themeCache = theme ?? '';
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  bindEvent(rangeSlider: any) {
    this.objRangeSlider = rangeSlider;

    if (!this.reset || !this.select) return false;

    this.reset.addEventListener('click', this.handleResetClick);

    this.select.onChange = (value: string) => {
      rangeSlider.update({
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
    const element = event.target as HTMLInputElement;
    this.objRangeSlider.update({
      disabled: element.checked,
    });
  }

  @boundMethod
  private handleBarClick(event: Event) {
    const element = event.target as HTMLInputElement;
    this.objRangeSlider.update({
      bar: element.checked,
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
    const element = event.target as HTMLInputElement;
    this.objRangeSlider.update({
      type: element.checked ? 'double' : 'single',
    });
  }

  @boundMethod
  private handleOrientationClick(event: Event) {
    const element = event.target as HTMLInputElement;
    const { classList } = this.panel as Element;

    if (element.checked) {
      classList.add(this.modifier);
    } else {
      classList.remove(this.modifier);
    }

    this.objRangeSlider.update({
      orientation: element.checked ? 'vertical' : 'horizontal',
    });
  }

  private getDomElement(str: string) {
    return this.element.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    ) as HTMLInputElement;
  }

  private setDomElement() {
    if (this.panel) {
      this.modifier = `${this.panel.classList[0]}_vertical`;
    }

    this.type = this.getDomElement('double');
    this.disabled = this.getDomElement('disabled');
    this.bar = this.getDomElement('bar');
    this.unsubscribtion = this.getDomElement('unsubscribtion');
    this.orientation = this.getDomElement('vertical');
    this.reset = this.element.querySelector(`${this.nameClass}__reset`);

    this.select = new Select(
      '.js-select',
      this.element.querySelector('.js-select') as Element,
    );
  }
}

export default Different;
