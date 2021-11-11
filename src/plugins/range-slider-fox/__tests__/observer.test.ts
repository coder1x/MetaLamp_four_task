

// eslint-disable-next-line no-unused-vars
import { Observer, TOB } from '../observer';

class TestOB extends Observer {
  constructor() {
    super();
  }
}


test('subscribeOB', () => {
  const ob = new TestOB();
  ob.subscribeOB(() => { });

  // expect(sum2(1, 2)).toBe(3);
});