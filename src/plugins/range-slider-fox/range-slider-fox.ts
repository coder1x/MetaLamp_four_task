import { Controller, Model, View } from './mvc/controller/controller';

// eslint-disable-next-line no-undef
$.fn.RangeSliderFox = function (options): JQuery {
  return this.each(function (i: number, el: Element) {
    if (!$.data(el, 'RangeSliderFox')) {
      $.data(
        el,
        'RangeSliderFox',
        new Controller(new Model(options), new View(el, i))
      );
    }
  });
};


function sum(a: number, b: number) {
  return a + b;
}

module.exports = sum;