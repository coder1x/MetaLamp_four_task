import { boundMethod } from 'autobind-decorator';
import './values.scss';

interface Options {
  min?: number | null;
  max?: number | null;
  from?: number | null;
  to?: number | null;
  step?: number | null;
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

    this.mapInput.set('min', (this.min && this.min.value) ?? '');
    this.mapInput.set('max', (this.max && this.max.value) ?? '');
    this.mapInput.set('from', (this.from && this.from.value) ?? '');
    this.mapInput.set('to', (this.to && this.to.value) ?? '');
    this.mapInput.set('step', (this.step && this.step.value) ?? '');

    [this.min, this.max, this.from, this.to, this.step].forEach((item) => {
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

    if (!this.mapInput) return false;

    if (regexp.test(value)) {
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
