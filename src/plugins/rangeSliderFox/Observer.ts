import RangeSliderOptions from './globInterface';

interface insideOptions extends RangeSliderOptions {
  readonly fromX?: number,
  readonly toX?: number,
  readonly valuePercent?: number,
  readonly fromPercent?: number,
  readonly toPercent?: number,
  readonly limitFrom?: number,
  readonly limitTo?: number,
  readonly fromTo?: number,
  readonly valueGrid?: number,
  readonly valueMark?: {
    value: number,
    position: number,
  }[],
  readonly snapNumber?: number[],
  readonly isResized?: boolean,
  readonly dimensions?: number,
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

// eslint-disable-next-line no-unused-vars
type ObserverFunctions<T> = (options: T) => boolean | Promise<boolean>;

abstract class Observer<T = ObserverOptions> {
  private observers: ObserverFunctions<T>[] = [];

  subscribeObserver(observer: ObserverFunctions<T>) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      return this.observers.length;
    }
    return false;
  }

  unsubscribeOB(observer: ObserverFunctions<T>) {
    this.observers = this.observers.filter((item) => item !== observer);
    return this.observers.length;
  }

  protected notifyObserver(options: T) {
    this.observers.forEach((item) => {
      item(options);
    });
  }
}

export { Observer, ObserverOptions };
