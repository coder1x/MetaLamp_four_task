import { Observer, TOB } from '../observer';

class TestOB extends Observer {
  constructor() {
    super();
  }

  notifyTest(options: TOB) {
    this.notifyOB(options);
  }
}

describe('------- Observer - subscribe, unsubscribe, notify -------', () => {

  let ob: TestOB;
  let callback: Function;
  let callback2: Function;

  beforeEach(() => {
    ob = new TestOB();
    callback = jest.fn();
    callback2 = jest.fn(x => x);
  });

  test('subscribeOB', () => {
    expect(ob.subscribeOB(callback)).toBe(1);
    expect(ob.subscribeOB(callback)).toBeFalsy();
    expect(ob.subscribeOB(callback2)).toBe(2);
  });

  test('unsubscribeOB', () => {
    ob.subscribeOB(callback);
    ob.subscribeOB(callback2);

    expect(ob.unsubscribeOB(callback)).toBe(1);
    expect(ob.unsubscribeOB(callback2)).toBe(0);
  });


  test('notifyOB', () => {

    const fun1 = jest.fn((options: TOB) => { return options; });
    const fun2 = jest.fn((options: TOB) => { return options; });

    ob.subscribeOB(fun1);
    ob.subscribeOB(fun2);

    const data = {
      key: 'KEY',
      from: 200,
      to: 500,
    };

    ob.notifyTest({ ...data });

    expect(fun1.mock.calls).toHaveLength(1);
    expect(fun2.mock.calls).toHaveLength(1);
    expect(fun1.mock.calls[0][0]).toStrictEqual(data);
    expect(fun2.mock.calls[0][0]).toStrictEqual(data);
  });


});