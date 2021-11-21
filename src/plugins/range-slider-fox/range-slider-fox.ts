import { Controller, Model, View } from './mvc/controller/controller';

$.fn.RangeSliderFox = function (options) {
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

const _$ = $;
export { _$ };