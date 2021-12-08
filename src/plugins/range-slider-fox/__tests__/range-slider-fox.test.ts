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
    });



  test(' destroy - plugin removal ', async () => {

    const obj = $(dom).RangeSliderFox({}).data('RangeSliderFox');
    expect(obj).toBeDefined();

    let rs = $.data(dom, 'RangeSliderFox');
    expect(rs).toBeDefined();
    obj.destroy();
    await delay(100);

    rs = $.data(dom, 'RangeSliderFox');
    expect(rs).toBeNull();

  });

});


