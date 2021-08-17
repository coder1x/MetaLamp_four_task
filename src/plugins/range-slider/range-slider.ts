
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



$('.slider__base').RangeSlider({
  type: 'double',
  //type: 'single',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  //tipPrefix: '°C',
  grid: true,
  //gridSnap: true,
  //gridNum: 10,
  gridStep: 30,
}).data('RangeSlider'); // вернёт объект для одного элемента


// вернёт все объекты.
// $('.slider-base').each(function (i: number, el: any) {
//   console.log($.data(el, 'RangeSlider'));
// });


