import { Observer, ObserverOptions } from '../observer';

class TestOB extends Observer {
  notifyTest(options: ObserverOptions) {
    this.notifyOB(options);
  }
}

describe('------- Observer - subscribe, unsubscribe, notify -------', () => {
  let observer: TestOB;
  let callback: Function;
  let callback2: Function;

  beforeEach(() => {
    observer = new TestOB();
    callback = jest.fn();
    callback2 = jest.fn((x) => x);
  });

  // subscribeOB
  test(' Subscribe a listener on events ', () => {
    expect(observer.subscribeOB(callback)).toBe(1);
    expect(observer.subscribeOB(callback)).toBeFalsy();
    expect(observer.subscribeOB(callback2)).toBe(2);
  });

  // unsubscribeOB
  test(' Unsubscribe a listener from events ', () => {
    observer.subscribeOB(callback);
    observer.subscribeOB(callback2);

    expect(observer.unsubscribeOB(callback)).toBe(1);
    expect(observer.unsubscribeOB(callback2)).toBe(0);
  });

  // notifyOB
  test(' Data distribution among the listeners ', () => {
    const fun1 = jest.fn((options: ObserverOptions) => options);
    const fun2 = jest.fn((options: ObserverOptions) => options);

    observer.subscribeOB(fun1);
    observer.subscribeOB(fun2);

    const data = {
      key: 'KEY',
      from: 200,
      to: 500,
    };

    observer.notifyTest({ ...data });

    expect(fun1.mock.calls).toHaveLength(1);
    expect(fun2.mock.calls).toHaveLength(1);
    expect(fun1.mock.calls[0][0]).toStrictEqual(data);
    expect(fun2.mock.calls[0][0]).toStrictEqual(data);
  });
});
