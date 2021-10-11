

interface RangeSliderOptions {
  type?: string;
  orientation?: string;
  theme?: string;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  bar?: boolean;
  grid?: boolean;
  gridSnap?: boolean;
  tipPrefix?: string;
  tipPostfix?: string;
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  gridNum?: number;
  gridStep?: number;
  disabled?: boolean;
}

interface insideOptions extends RangeSliderOptions {
  fromX?: number,
  toX?: number
  valP?: number;
  fromP?: number;
  toP?: number;
  limitFrom?: number;
  limitTo?: number;
  fromTo?: number;

  wrapWH?: number,
  position?: number,
  clientXY?: number,
  shiftXY?: number
}


interface TOB extends insideOptions {
  key?: string,

}

// интерфейс должен содержать не только описание конфига но и внутренних данных
// которая передаёт въюшка или передаёт модель в виде процентов, координат и тп.
// можно это реализовать через наследование интерфейсов и разбить на логические части.


abstract class Observer {
  private observers: Function[] = [];

  public subscribeOB(observer: Function) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public unsubscribeOB(observer: Function) {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  protected notifyOB(options: TOB) {
    for (let item of this.observers) {
      item(options);
    }
  }
}


export { Observer, TOB };




