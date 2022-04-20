import { boundMethod } from 'autobind-decorator';
import './values.scss';

interface Options {
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
}

class Values {
  private elem: Element;

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

  private mapInput: Map<string, string> | null = null;

  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
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
  setAction(obj: any) {
    this.objRangeSlider = obj;
    this.mapInput = new Map();

    const min = (this.min && this.min.value) ?? '';
    const max = (this.max && this.max.value) ?? '';
    const from = (this.from && this.from.value) ?? '';
    const to = (this.to && this.to.value) ?? '';
    const step = (this.step && this.step.value) ?? '';

    this.mapInput.set('min', min);
    this.mapInput.set('max', max);
    this.mapInput.set('from', from);
    this.mapInput.set('to', to);
    this.mapInput.set('step', step);

    const inputElements = [this.min, this.max, this.from, this.to, this.step];

    inputElements.forEach((item) => {
      if (item) {
        item.addEventListener('change', this.handleInputChange);
        item.addEventListener('input', this.handleInputProcessing);
      }
    });
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value.replace(/[^-.\d]/g, '');
    const regexp = /^-?\d*?[.]?\d*$/;
    const valid = regexp.test(value);

    if (!this.mapInput) return false;

    if (valid) {
      this.mapInput.set(elem.name, value);
      elem.value = value;
    } else {
      elem.value = this.mapInput.get(elem.name) ?? '';
    }

    return true;
  }

  @boundMethod
  private handleInputChange(event: Event) {
    if (!this.mapInput) return false;
    const elem = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      [elem.name]: Number(this.mapInput.get(elem.name)),
    });
    return true;
  }

  private setDom() {
    const getDom = (str: string) => this.elem.querySelector(
      `${this.nameClass
      }__${str
      }-wrap input`,
    ) as HTMLInputElement;

    this.min = getDom('min');
    this.max = getDom('max');
    this.from = getDom('from');
    this.to = getDom('to');
    this.step = getDom('step');
  }
}

export default Values;
