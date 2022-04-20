import RangeSliderOptions from './glob-interface';

interface insideOptions extends RangeSliderOptions {
  readonly fromX?: number,
  readonly toX?: number,
  readonly valP?: number,
  readonly fromP?: number,
  readonly toP?: number,
  readonly limitFrom?: number,
  readonly limitTo?: number,
  readonly fromTo?: number,
  readonly valueG?: number,
  readonly valMark?: {
    val: number,
    position: number,
  }[],
  readonly snapNum?: number[],
  readonly wrapWH?: number,
  readonly position?: number,
  readonly clientXY?: number,
  readonly shiftXY?: number,
  readonly keyRepeat?: boolean,
  readonly keySign?: string,
  readonly dot?: string,
}

interface ObserverOptions extends insideOptions {
  key?: string,
}

abstract class Observer {
  private observers: Function[] = [];

  subscribeOB(observer: Function) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      return this.observers.length;
    }
    return false;
  }

  unsubscribeOB(observer: Function) {
    this.observers = this.observers.filter((item) => item !== observer);
    return this.observers.length;
  }

  protected notifyOB(options: ObserverOptions) {
    this.observers.forEach((item) => {
      item(options);
    });
  }
}

export { Observer, ObserverOptions };
