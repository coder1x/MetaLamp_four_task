import { RangeSliderOptions } from '../../../glob-interface';
import { _$ as $ } from '../../../range-slider-fox';


describe('Test Controller API', () => {

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


  test('onStart, onUpdate, ubdate, onReset, reset ', () => {

    const objС = $(domC).RangeSliderFox({
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

        const node = wrapC.getElementsByClassName('range-slider-fox__grid-pol');

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
    }).data('RangeSliderFox');

  });

  test(' Input data ', () => {

    $(domC).RangeSliderFox({
      onStart: () => {
        expect(domC.value).toBe('1');
      },
    }).data('RangeSliderFox');

  });


  test(' Data-Attributes dynamically', () => {

    $(domC).RangeSliderFox({
      onStart: (data: RangeSliderOptions) => {
        expect(data.from).toBe(1);
        domC.setAttribute('data-from', '9');
      },
      onUpdate: (data: RangeSliderOptions) => {
        expect(data.from).toBe(9);
      },
    }).data('RangeSliderFox');

  });

  test(' Data-Attributes static', async () => {

    await domC.setAttribute('data-from', '5');
    await $(domC).RangeSliderFox({
      onUpdate: (data: RangeSliderOptions) => {
        expect(data.from).toBe(5);
      },
    }).data('RangeSliderFox');

  });


});