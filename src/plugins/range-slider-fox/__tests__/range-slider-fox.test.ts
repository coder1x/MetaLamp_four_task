import { _$ as $ } from '../range-slider-fox';

// Добавление JQuery плагина - Range Slider Fox
describe('------- Range Slider Fox - JQuery Objects -------', () => {
  let wrap: HTMLElement;
  let dom: HTMLInputElement;

  function delay(time: number) {
    return new Promise((resolve, reject) => {
      if (time) {
        setTimeout(resolve, time);
      } else {
        reject(Error('time = 0'));
      }
    });
  }

  beforeEach(() => {
    wrap = document.createElement('div');
    dom = document.createElement('input');
    wrap.appendChild(dom);
  });

  // RangeSliderFox Function
  test(' Adding plugim to JQuery library ', () => {
    let propertyFlag = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const prop in $(dom)) {
      if (prop === 'RangeSliderFox') {
        propertyFlag = true;
        break;
      }
    }

    expect(propertyFlag).toBeTruthy();
  });

  const testName = ' Initialize plugin on a DOM-element '
    + 'and check the obtained object ';
  // initialization
  test(testName, () => {
    const objRangeSliderFox = $(dom).RangeSliderFox({}).data('RangeSliderFox');
    expect(objRangeSliderFox).toBeDefined();

    const objRangeSliderFox2 = $(dom).RangeSliderFox({}).data('RangeSliderFox');
    expect(objRangeSliderFox2).toEqual(objRangeSliderFox);
  });

  test(' destroy - plugin removal ', async () => {
    const objRangeSliderFox = await $(dom).RangeSliderFox({})
      .data('RangeSliderFox');

    expect(objRangeSliderFox).toBeDefined();

    let rsData = await $.data(dom, 'RangeSliderFox');
    expect(rsData).toBeDefined();

    await delay(100);
    await objRangeSliderFox.destroy();
    await delay(100);
    rsData = await $.data(dom, 'RangeSliderFox');
    expect(rsData).toBeNull();
  });
});
