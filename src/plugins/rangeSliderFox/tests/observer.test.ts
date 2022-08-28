import { RangeSliderOptions } from '../globInterface';
import Observer from '../Observer';

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

class TestObserver extends Observer<ObserverOptions> {
  notifyTest(options: ObserverOptions) {
    this.notifyObserver(options);
  }
}

describe('------- Observer - subscribe, unsubscribe, notify -------', () => {
  let observer: TestObserver;

  let oneCallback: (options: ObserverOptions) => boolean | Promise<boolean>;

  let twoCallback: (options: ObserverOptions) => boolean | Promise<boolean>;

  beforeEach(() => {
    observer = new TestObserver();
    oneCallback = jest.fn();

    twoCallback = jest.fn((options: ObserverOptions) => true);
  });

  // subscribeObserver
  test(' Subscribe a listener on events ', () => {
    expect(observer.subscribeObserver(oneCallback)).toBe(1);
    expect(observer.subscribeObserver(oneCallback)).toBeFalsy();
    expect(observer.subscribeObserver(twoCallback)).toBeTruthy();
  });

  // unsubscribeOB
  test(' Unsubscribe a listener from events ', () => {
    observer.subscribeObserver(oneCallback);
    observer.subscribeObserver(twoCallback);

    expect(observer.unsubscribeOB(oneCallback)).toBe(1);
    expect(observer.unsubscribeOB(twoCallback)).toBe(0);
  });

  // notifyOB
  test(' Data distribution among the listeners ', () => {
    const oneFunction = jest.fn((options: ObserverOptions) => true);

    const twoFunction = jest.fn((options: ObserverOptions) => true);

    observer.subscribeObserver(oneFunction);
    observer.subscribeObserver(twoFunction);

    const data = {
      key: 'KEY',
      from: 200,
      to: 500,
    };

    observer.notifyTest({ ...data });

    expect(oneFunction.mock.calls).toHaveLength(1);
    expect(twoFunction.mock.calls).toHaveLength(1);
    expect(oneFunction.mock.calls[0][0]).toStrictEqual(data);
    expect(twoFunction.mock.calls[0][0]).toStrictEqual(data);
  });
});
