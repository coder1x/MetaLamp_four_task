import RangeSliderOptions from '../../../glob-interface';
import { Controller, Model, View } from '../Controller';

function delay(time: number) {
  return new Promise((resolve, reject) => {
    if (time) {
      setTimeout(resolve, time);
    } else {
      reject(Error('time = 0'));
    }
  });
}

describe('------- Test Controller API -------', () => {
  let wrapper: HTMLElement;
  let input: HTMLInputElement;
  const defaultData = {
    type: 'single',
    orientation: 'horizontal',
    theme: 'base',
    min: 0,
    max: 10,
    to: 2,
    from: 1,
    step: 0,
    keyStepOne: 0,
    keyStepHold: 0,
    bar: false,
    tipPrefix: '',
    tipPostfix: '',
    tipMinMax: true,
    tipFromTo: true,
    grid: false,
    gridSnap: false,
    gridNum: 4,
    gridStep: 0,
    gridRound: 0,
    disabled: false,
  };

  beforeEach(() => {
    wrapper = document.createElement('div');
    input = document.createElement('input');
    wrapper.appendChild(input);
  });

  const testName1 = ' Check plugin events (onStart, onUpdate, onReset) '
    + 'and API (update, reset)';
  // onStart, onUpdate, update, onReset, reset
  test(testName1, () => {
    const objController = new Controller(new Model({
      onStart: (data: RangeSliderOptions) => {
        expect(data).toStrictEqual(defaultData);

        const flagUpdate = objController.update({
          type: 'double',
          orientation: 'vertical',
          theme: 'fox',
          min: -120,
          max: 800,
          to: 421.18,
          from: 150.59,
          step: 4,
          keyStepOne: 2,
          keyStepHold: 20,
          bar: true,
          tipPrefix: 'rr',
          tipPostfix: 'tt',
          tipMinMax: true,
          tipFromTo: true,
          grid: true,
          gridSnap: false,
          gridNum: 34,
          gridStep: 0,
          gridRound: 2,
          disabled: false,
        });
        expect(flagUpdate).toBeTruthy();
      },
      onUpdate: (data: RangeSliderOptions) => {
        expect(wrapper.getElementsByClassName(
          'js-range-slider-fox__grid-pol',
        )).toHaveLength(35);
        expect(data.type).toBe('double');
        expect(data.min).toBeCloseTo(-120);
        expect(data.max).toBeCloseTo(800);
        expect(data.from).toBeCloseTo(150.59);
        expect(data.to).toBeCloseTo(421.18);
        expect(data.orientation).toBe('vertical');
        expect(data.step).toBeCloseTo(4);
        expect(data.keyStepOne).toBeCloseTo(2);
        expect(data.keyStepHold).toBeCloseTo(20);
        expect(data.bar).toBeTruthy();
        expect(data.tipPrefix).toBe('rr');
        expect(data.tipPostfix).toBe('tt');
        expect(data.tipMinMax).toBeTruthy();
        expect(data.tipFromTo).toBeTruthy();
        expect(data.grid).toBeTruthy();
        expect(data.gridSnap).toBeFalsy();
        expect(data.gridNum).toBeCloseTo(34);
        expect(data.gridStep).toBeCloseTo(0);
        expect(data.gridRound).toBeCloseTo(2);
        expect(data.disabled).toBeFalsy();

        expect(objController.reset()).toBeTruthy();
      },
      onReset: (data: RangeSliderOptions) => {
        expect(data).toStrictEqual(defaultData);
      },
    }), new View(input));
  });

  test(' Check unsubscribtion from events  ', async () => {
    let objController: Controller;
    const updateMax = jest.fn((data: RangeSliderOptions) => {
      expect(data.max).toBe(150);

      objController.update({
        onUpdate: null,
      });

      objController.update({
        max: 50,
      });
    });

    const updateX = jest.fn((data: RangeSliderOptions) => {
      expect(data.max).toBe(100);

      objController.update({
        max: 150,
        onUpdate: updateMax,
      });
    });

    objController = new Controller(new Model({
      onStart: () => {
        objController.update({
          max: 100,
        });
      },
      onUpdate: updateX,
    }), new View(input));

    await delay(100);
    expect(updateX.mock.calls).toHaveLength(1);
    expect(updateMax.mock.calls).toHaveLength(1);
  });

  // Input data
  test(' Check if data in Input element is changing ', () => {
    new Controller(new Model({
      onStart: () => {
        expect(input.value).toBe('1');
      },
    }), new View(input));
  });

  // Data-Attributes dynamically
  test(' Check if plugin responding on data-attributes changes ', () => {
    new Controller(new Model({
      onStart: (data: RangeSliderOptions) => {
        expect(data.from).toBe(1);
        input.setAttribute('data-from', '9');
      },
      onUpdate: (data: RangeSliderOptions) => {
        expect(data.from).toBe(9);
      },
    }), new View(input));
  });

  const testName2 = ' Check if plugin is configured in '
    + 'line with data-attributes on its start ';
  // Data-Attributes static
  test(testName2, async () => {
    await input.setAttribute('data-from', '5');
    new Controller(new Model({
      onUpdate: (data: RangeSliderOptions) => {
        expect(data.from).toBe(5);
      },
    }), new View(input));
  });

  test(' destroy - plugin removal ', async () => {
    const fun = jest.fn(() => {
    });

    const objController = await new Controller(new Model({
      onUpdate: fun,
    }), new View(input));

    await objController.update({
      from: 4,
    });
    await delay(100);
    await objController.destroy();

    await delay(100);
    await objController.update({
      from: 8,
    });

    await delay(100);
    expect(fun.mock.calls).toHaveLength(1);
    expect(input.value).toBe(' ');
  });
});
