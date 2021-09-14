
import { RangeSliderOptions } from './mvc/model/model.d';
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



const sliderBase = $('.slider__base').RangeSlider({
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
  onStart: function (data: RangeSliderOptions) {
    console.log('-------------------------');
    console.log('onStart');
    console.log(data);
    console.log('-------------------------');
  },
  onChange: function (data: RangeSliderOptions) {
    console.log('-------------------------');
    console.log('onChange');
    console.log(data);
    console.log('-------------------------');
  },
  onUpdate: function (data: RangeSliderOptions) {
    console.log('-------------------------');
    console.log('onUpdate');
    console.log(data);
    console.log('-------------------------');
  }
}).data('RangeSlider'); // вернёт объект для одного элемента


// sliderBase.reset();

sliderBase.update({
  from: 250,
  to: 630,
});

console.log(sliderBase);


// вернёт все объекты.
// $('.slider-base').each(function (i: number, el: any) {
//   console.log($.data(el, 'RangeSlider'));
// });


