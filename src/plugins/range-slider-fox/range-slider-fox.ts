
//import { RangeSliderOptions } from './mvc/model/model.d';
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






// sliderBase.reset();

// sliderBase.update({
//   type: 'single',
// });

// console.log(sliderBase);

// вернёт все объекты.
// $('.slider-base').each(function (i: number, el: any) {
//   console.log($.data(el, 'RangeSlider'));
// });


