import { _$ as $ } from '../range-slider-fox';

// Добавление JQuery плагина - Range Slider Fox
describe('------- Range Slider Fox - JQuery Objects -------', () => {
  let wrap: HTMLElement;
  let dom: HTMLInputElement;

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(() => {
    wrap = document.createElement('div');
    dom = document.createElement('input');
    wrap.appendChild(dom);
  });

  // RangeSliderFox Function
  test(' Adding plugim to JQuery library ', () => {
    let propertyFL = false;

    for (let prop in $(dom)) {
      if (prop == 'RangeSliderFox') {
        propertyFL = true;
        break;
      }
    }

    expect(propertyFL).toBeTruthy();
  });

  // initialization
  test(' Initialize plugin on a DOM-element ' +
    'and check the obtained object ', () => {
      const obj = $(dom).RangeSliderFox({}).data('RangeSliderFox');
      expect(obj).toBeDefined();

      const obj2 = $(dom).RangeSliderFox({}).data('RangeSliderFox');
      expect(obj2).toEqual(obj);
    });

  test(' destroy - plugin removal ', async () => {
    const obj = await $(dom).RangeSliderFox({}).data('RangeSliderFox');
    expect(obj).toBeDefined();

    let rs = await $.data(dom, 'RangeSliderFox');
    expect(rs).toBeDefined();

    await delay(100);
    await obj.destroy();
    await delay(100);
    rs = await $.data(dom, 'RangeSliderFox');
    expect(rs).toBeNull();

  });
});


