import { _$ as $ } from '../range-slider-fox';


// Добавление JQuery плагина - Range Slider Fox
describe('------- Range Slider Fox - JQuery Objects -------', () => {

  let wrap: HTMLElement;
  let dom: HTMLInputElement;

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
      const wrapC = document.createElement('div');
      const domC = document.createElement('input');
      wrapC.appendChild(domC);

      const obj = $(domC).RangeSliderFox({}).data('RangeSliderFox');
      expect(obj).toBeDefined();
    });

});


