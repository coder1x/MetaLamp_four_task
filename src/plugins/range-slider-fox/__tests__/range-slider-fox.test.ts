import { _$ as $ } from '../range-slider-fox';


describe('Range Slider Fox - JQuery Objects', () => {

  let wrap: HTMLElement;
  let dom: HTMLInputElement;

  beforeEach(() => {
    wrap = document.createElement('div');
    dom = document.createElement('input');
    wrap.appendChild(dom);
  });

  test('RangeSliderFox Function', () => {
    let propertyFL = false;

    for (let prop in $(dom)) {
      if (prop == 'RangeSliderFox') {
        propertyFL = true;
        break;
      }
    }

    expect(propertyFL).toBeTruthy();
  });

});


