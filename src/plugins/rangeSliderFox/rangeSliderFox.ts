import { Controller, Model, View } from './mvc/controller/Controller';

$.fn.RangeSliderFox = function plugin(options = {}) {
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

document.addEventListener('DOMContentLoaded', (event: Event) => {
  const documentLoaded = event.target as Document;
  let elements = documentLoaded.querySelectorAll("[data-plugin = 'rangeSliderFox']");

  if (!elements.length) {
    elements = documentLoaded.querySelectorAll('.rangeSliderFox');
  }

  elements.forEach((element) => {
    $(element).RangeSliderFox();
  });
});

export default $;
