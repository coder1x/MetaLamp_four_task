import { Controller, Model, View } from './mvc/controller/controller';

// eslint-disable-next-line func-names
$.fn.RangeSliderFox = function (options) {
  return this.each((i: number, el: Element) => {
    if (!$.data(el, 'RangeSliderFox')) {
      $.data(
        el,
        'RangeSliderFox',
        new Controller(new Model(options), new View(el)),
      );
    }
  });
};

// eslint-disable-next-line no-underscore-dangle
const _$ = $;
// eslint-disable-next-line import/prefer-default-export
export { _$ };
