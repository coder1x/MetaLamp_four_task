import { boundMethod } from 'autobind-decorator';

interface Options {
  min?: number | null;
  max?: number | null;
  from?: number | null;
  to?: number | null;
  step?: number | null;
}

class Values {
  private element: Element;

  private min: HTMLInputElement | null = null;

  private max: HTMLInputElement | null = null;

  private from: HTMLInputElement | null = null;

  private to: HTMLInputElement | null = null;

  private step: HTMLInputElement | null = null;

  private minCache: number = 0;

  private maxCache: number = 0;

  private fromCache: number = 0;

  private toCache: number = 0;

  private stepCache: number = 0;

  private nameClass: string;

  private objRangeSlider: any;

  private fieldValues: Map<string, string> | null = null;

  constructor(nameClass: string, element: Element) {
    this.nameClass = nameClass;
    this.element = element;
    this.setDomElement();
  }

  setData(options: Options) {
    const {
      min, max, from, to, step,
    } = options;

    if (this.minCache !== min && this.min) {
      this.min.value = String(min);
      this.minCache = min ?? 0;
    }

    if (this.maxCache !== max && this.max) {
      this.max.value = String(max);
      this.maxCache = max ?? 0;
    }

    if (this.fromCache !== from && this.from) {
      this.from.value = String(from);
      this.fromCache = from ?? 0;
    }

    if (this.toCache !== to && this.to) {
      this.to.value = String(to);
      this.toCache = to ?? 0;
    }

    if (this.stepCache !== step && this.step) {
      this.step.value = String(step);
      this.stepCache = step ?? 0;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  bindEvent(rangeSlider: any) {
    this.objRangeSlider = rangeSlider;
    this.fieldValues = new Map();

    this.fieldValues.set('min', (this.min && this.min.value) ?? '');
    this.fieldValues.set('max', (this.max && this.max.value) ?? '');
    this.fieldValues.set('from', (this.from && this.from.value) ?? '');
    this.fieldValues.set('to', (this.to && this.to.value) ?? '');
    this.fieldValues.set('step', (this.step && this.step.value) ?? '');

    [this.min, this.max, this.from, this.to, this.step].forEach((item) => {
      if (item) {
        item.addEventListener('change', this.handleInputChange);
        item.addEventListener('input', this.handleInputProcessing);
      }
    });
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value.replace(/[^-.\d]/g, '');
    const regexp = /^-?\d*?[.]?\d*$/;

    if (!this.fieldValues) return false;

    if (regexp.test(value)) {
      this.fieldValues.set(element.name, value);
      element.value = value;
    } else {
      element.value = this.fieldValues.get(element.name) ?? '';
    }

    return true;
  }

  @boundMethod
  private handleInputChange(event: Event) {
    if (!this.fieldValues) return false;
    const element = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      [element.name]: Number(this.fieldValues.get(element.name)),
    });
    return true;
  }

  private getDomElement(string: string) {
    return this.element.querySelector(
      `${this.nameClass
      }__${string
      }-wrap input`,
    ) as HTMLInputElement;
  }

  private setDomElement() {
    this.min = this.getDomElement('min');
    this.max = this.getDomElement('max');
    this.from = this.getDomElement('from');
    this.to = this.getDomElement('to');
    this.step = this.getDomElement('step');
  }
}

export default Values;
