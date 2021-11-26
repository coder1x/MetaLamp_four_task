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
  let сallback: Function;
  let сallback2: Function;

  beforeEach(() => {
    ob = new TestOB();
    сallback = jest.fn();
    сallback2 = jest.fn(x => x);
  });

  test('subscribeOB', () => {
    expect(ob.subscribeOB(сallback)).toBe(1);
    expect(ob.subscribeOB(сallback)).toBeFalsy();
    expect(ob.subscribeOB(сallback2)).toBe(2);
  });

  test('unsubscribeOB', () => {
    ob.subscribeOB(сallback);
    ob.subscribeOB(сallback2);

    expect(ob.unsubscribeOB(сallback)).toBe(1);
    expect(ob.unsubscribeOB(сallback2)).toBe(0);
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