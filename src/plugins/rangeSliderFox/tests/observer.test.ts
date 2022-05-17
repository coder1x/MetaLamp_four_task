import { Observer, ObserverOptions } from '../Observer';

class TestObserver extends Observer {
  notifyTest(options: ObserverOptions) {
    this.notifyOB(options);
  }
}

describe('------- Observer - subscribe, unsubscribe, notify -------', () => {
  let observer: TestObserver;
  let oneCallback: Function;
  let twoCallback: Function;

  beforeEach(() => {
    observer = new TestObserver();
    oneCallback = jest.fn();
    twoCallback = jest.fn((x) => x);
  });

  // subscribeObserver
  test(' Subscribe a listener on events ', () => {
    expect(observer.subscribeObserver(oneCallback)).toBe(1);
    expect(observer.subscribeObserver(oneCallback)).toBeFalsy();
    expect(observer.subscribeObserver(twoCallback)).toBe(2);
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
    const oneFunction = jest.fn((options: ObserverOptions) => options);
    const twoFunction = jest.fn((options: ObserverOptions) => options);

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
