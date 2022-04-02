import { RangeSliderOptions } from '../../../glob-interface';
import { Controller, Model, View } from '../controller';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('------- Test Controller API -------', () => {
  let wrapC: HTMLElement;
  let domC: HTMLInputElement;
  const defaultData = {
    type: 'single', orientation: 'horizontal',
    theme: 'base', min: 0,
    max: 10, to: 2,
    from: 1, step: 0,
    keyStepOne: 0, keyStepHold: 0,
    bar: false, tipPrefix: '',
    tipPostfix: '', tipMinMax: true,
    tipFromTo: true, grid: false,
    gridSnap: false, gridNum: 4,
    gridStep: 0, gridRound: 0,
    disabled: false
  };

  beforeEach(() => {
    wrapC = document.createElement('div');
    domC = document.createElement('input');
    wrapC.appendChild(domC);
  });

  // onStart, onUpdate, update, onReset, reset
  test(' Check plugin events (onStart, onUpdate, onReset) ' +
    'and API (update, reset)', () => {
      const objС = new Controller(new Model({
        onStart: (data: RangeSliderOptions) => {

          expect(data).toStrictEqual(defaultData);

          const flU = objС.update({
            type: 'double', orientation: 'vertical',
            theme: 'fox', min: -120,
            max: 800, to: 421.18,
            from: 150.59, step: 4,
            keyStepOne: 2, keyStepHold: 20,
            bar: true, tipPrefix: 'rr',
            tipPostfix: 'tt', tipMinMax: true,
            tipFromTo: true, grid: true,
            gridSnap: false,
            gridNum: 34, gridStep: 0,
            gridRound: 2, disabled: false,
          });
          expect(flU).toBeTruthy();
        },
        onUpdate: (data: RangeSliderOptions) => {

          const gridPol = 'js-range-slider-fox__grid-pol';
          const node = wrapC.getElementsByClassName(gridPol);

          expect(node).toHaveLength(35);
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

          const flR = objС.reset();
          expect(flR).toBeTruthy();
        },
        onReset: (data: RangeSliderOptions) => {
          expect(data).toStrictEqual(defaultData);
        }
      }), new View(domC));
    });

  test(' Check unsubscribtion from events  ', async () => {
    let obj: Controller;
    const updateX2 = jest.fn((data: RangeSliderOptions) => {
      expect(data.max).toBe(150);

      obj.update({
        onUpdate: null,
      });

      obj.update({
        max: 50,
      });
    });

    let updateX = jest.fn((data: RangeSliderOptions) => {
      expect(data.max).toBe(100);

      obj.update({
        max: 150,
        onUpdate: updateX2,
      });
    });

    obj = new Controller(new Model({
      onStart: () => {
        obj.update({
          max: 100,
        });

      },
      onUpdate: updateX,
    }), new View(domC));

    await delay(100);
    expect(updateX.mock.calls).toHaveLength(1);
    expect(updateX2.mock.calls).toHaveLength(1);

  });

  // Input data
  test(' Check if data in Input element is changing ', () => {
    new Controller(new Model({
      onStart: () => {
        expect(domC.value).toBe('1');
      },
    }), new View(domC));
  });

  // Data-Attributes dynamically
  test(' Check if plugin responding on data-attributes changes ', () => {
    new Controller(new Model({
      onStart: (data: RangeSliderOptions) => {
        expect(data.from).toBe(1);
        domC.setAttribute('data-from', '9');
      },
      onUpdate: (data: RangeSliderOptions) => {
        expect(data.from).toBe(9);
      },
    }), new View(domC));
  });

  // Data-Attributes static
  test(' Check if plugin is configured in ' +
    'line with data-attributes on its start ', async () => {
      await domC.setAttribute('data-from', '5');
      new Controller(new Model({
        onUpdate: (data: RangeSliderOptions) => {
          expect(data.from).toBe(5);
        },
      }), new View(domC));
    });

  test(' destroy - plugin removal ', async () => {
    let objX: Controller;
    const fun = jest.fn(() => {
    });

    objX = await new Controller(new Model({
      onUpdate: fun,
    }), new View(domC));

    await objX.update({
      from: 4
    });
    await delay(100);
    await objX.destroy();

    await delay(100);
    await objX.update({
      from: 8
    });

    await delay(100);
    expect(fun.mock.calls).toHaveLength(1);
    expect(domC.value).toBe(' ');
  });
});