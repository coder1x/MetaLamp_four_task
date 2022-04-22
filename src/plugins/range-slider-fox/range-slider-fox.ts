import { Controller, Model, View } from './mvc/controller/Controller';

// eslint-disable-next-line func-names
$.fn.RangeSliderFox = function (options) {
  return this.each((i: number, element: Element) => {
    if (!$.data(element, 'RangeSliderFox')) {
      $.data(
        element,
        'RangeSliderFox',
        new Controller(new Model(options), new View(element)),
      );
    }
  });
};

// eslint-disable-next-line no-underscore-dangle
const _$ = $;
// eslint-disable-next-line import/prefer-default-export
export { _$ };
