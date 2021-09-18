
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



// eslint-disable-next-line no-unused-vars
const sliderBase = $('.slider__base').RangeSlider({
  type: 'double',
  //type: 'single',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  //disabled: false,
  // tipPrefix: '°C',
  // tipMinMax: false,
  // tipFromTo: false,
  grid: true,
  //gridSnap: true,
  //gridNum: 10,
  gridStep: 30,
  // eslint-disable-next-line no-unused-vars
  onStart: function (data: RangeSliderOptions) {
    console.log('-------------------------');
    console.log('onStart');
    console.log(data);
    console.log('-------------------------');
  },
  // eslint-disable-next-line no-unused-vars
  onChange: function (data: RangeSliderOptions) {
    // console.log('-------------------------');
    // console.log('onChange');
    // console.log(data);
    // console.log('-------------------------');
  },
  // eslint-disable-next-line no-unused-vars
  onUpdate: function (data: RangeSliderOptions) {
    // console.log('-------------------------');
    // console.log('onUpdate');
    // console.log(data);
    // console.log('-------------------------');
  }
}).data('RangeSlider'); // вернёт объект для одного элемента


// sliderBase.reset();

// sliderBase.update({
//   from: 250,
//   to: 630,
// });

// console.log(sliderBase);


// вернёт все объекты.
// $('.slider-base').each(function (i: number, el: any) {
//   console.log($.data(el, 'RangeSlider'));
// });


