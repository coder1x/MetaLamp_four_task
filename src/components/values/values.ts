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

  private min: HTMLInputElement;

  private max: HTMLInputElement;

  private from: HTMLInputElement;

  private to: HTMLInputElement;

  private step: HTMLInputElement;

  private minCache: number;

  private maxCache: number;

  private fromCache: number;

  private toCache: number;

  private stepCache: number;

  private nameClass: string;

  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: Options) {
    const {
      min, max, from, to, step,
    } = options;

    if (this.minCache !== min) {
      this.min.value = String(min);
      this.minCache = min;
    }

    if (this.maxCache !== max) {
      this.max.value = String(max);
      this.maxCache = max;
    }

    if (this.fromCache !== from) {
      this.from.value = String(from);
      this.fromCache = from;
    }

    if (this.toCache !== to) {
      this.to.value = String(to);
      this.toCache = to;
    }

    if (this.stepCache !== step) {
      this.step.value = String(step);
      this.stepCache = step;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    const mapInput = new Map();
    mapInput.set('min', this.min.value);
    mapInput.set('max', this.max.value);
    mapInput.set('from', this.from.value);
    mapInput.set('to', this.to.value);
    mapInput.set('step', this.step.value);

    const data = (event: Event) => {
      const elem = event.target as HTMLInputElement;
      obj.update({
        [elem.name]: +mapInput.get(elem.name),
      });
    };

    const inputProcessing = (event: Event) => {
      const elem = event.target as HTMLInputElement;
      const value = elem.value.replace(/[^-.\d]/g, '');
      const regexp = /^-?\d*?[.]?\d*$/;
      const valid = regexp.test(value);

      if (valid) {
        mapInput.set(elem.name, value);
        elem.value = value;
      } else {
        elem.value = mapInput.get(elem.name);
      }
    };

    const inputElements = [this.min, this.max, this.from, this.to, this.step];

    inputElements.forEach((item) => {
      item.addEventListener('change', data);
      item.addEventListener('input', inputProcessing);
    });
  }

  private setDom() {
    const getDom = (str: string): HTMLInputElement => this.elem.querySelector(
      `${this.nameClass
      }__${str
      }-wrap input`,
    );

    this.min = getDom('min');
    this.max = getDom('max');
    this.from = getDom('from');
    this.to = getDom('to');
    this.step = getDom('step');
  }
}

export default Values;
