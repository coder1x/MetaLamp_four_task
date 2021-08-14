
import { Controller, Model, View } from './mvc/controller/controller';


// eslint-disable-next-line no-undef
$.fn.RangeSlider = function (options): JQuery {


  return this.each(function (i: number, el: Element) {


    if (!$.data(el, 'RangeSlider')) {
      $.data(
        el,
        'RangeSlider',
        new Controller(new Model(options), new View(el, i))
      );
    }


  });

};



$('.slider-base').RangeSlider({
  type: 'double',
  // type: 'single',
  min: 0,
  max: 150,
  from: 30,
  to: 80,
  step: 10
}).data('RangeSlider'); // вернёт объект для одного элемента


// вернёт все объекты.
// $('.slider-base').each(function (i: number, el: any) {
//   console.log($.data(el, 'RangeSlider'));
// });


