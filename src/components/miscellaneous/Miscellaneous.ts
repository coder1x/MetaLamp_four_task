import { boundMethod } from 'autobind-decorator';

import Select from '@com/select/Select';

type Options = {
  type?: string | null;
  disabled?: boolean | null;
  bar?: boolean | null;
  orientation?: string | null;
  theme?: string | null;
};

class Different {
  private element: Element;

  private type: HTMLInputElement | null = null;

  private disabled: HTMLInputElement | null = null;

  private orientation: HTMLInputElement | null = null;

  private bar: HTMLInputElement | null = null;

  private unsubscribtion: HTMLInputElement | null = null;

  private select: Select | null = null;

  private reset: HTMLButtonElement | null = null;

  private panel: Element;

  private modifier: string = '';

  private disabledCache: boolean = false;

  private barCache: boolean = false;

  private typeCache: string = '';

  private orientationCache: string = '';

  private themeCache: string = '';

  private nameClass: string;

  private objRangeSlider: any;

  onUnsubscribtion: (() => void) | null = null;

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

    let isNewData = this.disabledCache !== disabled;

    if (isNewData && this.disabled) {
      this.disabled.checked = disabled ?? false;
      this.disabledCache = disabled ?? false;
    }

    isNewData = this.barCache !== bar;

    if (isNewData && this.bar) {
      this.bar.checked = bar ?? false;
      this.barCache = bar ?? false;
    }

    isNewData = this.typeCache !== type;

    if (isNewData && this.type) {
      this.type.checked = type === 'double';
      this.typeCache = type ?? '';
    }

    isNewData = this.orientationCache !== orientation;

    if (isNewData && this.orientation) {
      const orientFlag = orientation !== 'horizontal';
      this.orientation.checked = orientFlag;
      this.orientationCache = orientation ?? '';

      const { classList } = this.panel;

      if (orientFlag) {
        classList.add(this.modifier);
      } else {
        classList.remove(this.modifier);
      }
    }

    isNewData = this.themeCache !== theme;

    if (isNewData && this.select) {
      this.select.update(String(theme));
      this.themeCache = theme ?? '';
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  bindEvent(rangeSlider: any) {
    this.objRangeSlider = rangeSlider;

    if (!this.reset || !this.select) {
      return false;
    }

    this.reset.addEventListener('click', this.handleResetClick);

    this.select.onChange = (value: string | null) => {
      rangeSlider.update({
        theme: value,
      });
    };

    if (!this.disabled || !this.bar) {
      return false;
    }

    this.disabled.addEventListener('click', this.handleDisabledClick);
    this.bar.addEventListener('click', this.handleBarClick);

    if (!this.unsubscribtion || !this.type) {
      return false;
    }

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
    const { classList } = this.panel;

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
      `${this.nameClass}__${str}-wrapper input`,
    ) as HTMLInputElement;
  }

  private setDomElement() {
    this.modifier = `${this.panel.classList[0]}_vertical`;

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
