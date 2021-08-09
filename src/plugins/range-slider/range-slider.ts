
import { Controller, Model, View } from './mvc/controller/controller';



// eslint-disable-next-line no-undef
$.fn.RangeSlider = function (options): JQuery {


  // eslint-disable-next-line no-unused-vars
  return this.each(function (i: number, el: any) {


    console.log(el);
    console.log(i);

    // тут создаём объекты слайдера 
    // i - будет номером компонента - пропускаем нулевое значение
    // этот номер можно добавлять к классу компонента что бы создавать 
    // множество экземпляров. 



    if (!$.data(el, 'RangeSlider')) {
      $.data(el, 'RangeSlider', new Controller(new Model(options), new View()));
    }


  });

};



$('.slider-base').RangeSlider({
  type: 'double',
  min: 0,
  max: 15000,
  from: 5000,
  to: 10000,
  step: 1
}).data('RangeSlider'); // вернёт объект для одного элемента


// вернёт все объекты.
// $('.slider-base').each(function (i: number, el: any) {
//   console.log($.data(el, 'RangeSlider'));
// });


