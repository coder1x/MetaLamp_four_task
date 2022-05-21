import { Observer, ObserverOptions } from '../Observer';

class TestObserver extends Observer {
  notifyTest(options: ObserverOptions) {
    this.notifyObserver(options);
  }
}

describe('------- Observer - subscribe, unsubscribe, notify -------', () => {
  let observer: TestObserver;
  // eslint-disable-next-line no-unused-vars
  let oneCallback: (options: ObserverOptions) => boolean | Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  let twoCallback: (options: ObserverOptions) => boolean | Promise<boolean>;

  beforeEach(() => {
    observer = new TestObserver();
    oneCallback = jest.fn();
    // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line no-unused-vars
    const oneFunction = jest.fn((options: ObserverOptions) => true);
    // eslint-disable-next-line no-unused-vars
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
