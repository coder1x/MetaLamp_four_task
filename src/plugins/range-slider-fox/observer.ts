import { RangeSliderOptions } from './glob-interface';

interface insideOptions extends RangeSliderOptions {
  fromX?: number,
  toX?: number,
  valP?: number,
  fromP?: number,
  toP?: number,
  limitFrom?: number,
  limitTo?: number,
  fromTo?: number,
  valueG?: number,
  valMark?: {
    val: number,
    position: number,
  }[],
  snapNum?: number[],
  wrapWH?: number,
  position?: number,
  clientXY?: number,
  shiftXY?: number,
  keyRepeat?: boolean,
  keySign?: string,
  dot?: string,
}


interface TOB extends insideOptions {
  key?: string,
}

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
      // if (item(options)) 
      // break;
    }
  }
}

export { Observer, TOB };




