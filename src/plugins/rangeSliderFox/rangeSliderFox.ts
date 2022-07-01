import { NAME_PLUGIN } from '@shared/constants';

import { Controller, Model, View } from './mvc/controller/Controller';

$.fn.RangeSliderFox = function plugin(options = {}) {
  return this.each((i: number, element: Element) => {
    if (!$.data(element, NAME_PLUGIN)) {
      $.data(
        element,
        NAME_PLUGIN,
        new Controller(new Model(options), new View(element)),
      );
    }
  });
};

const handleDocumentDOMContentLoaded = (event: Event) => {
  const documentLoaded = event.target as Document;
  let elements = documentLoaded.querySelectorAll("[data-plugin = 'rangeSliderFox']");

  if (!elements.length) {
    elements = documentLoaded.querySelectorAll('.rangeSliderFox');
  }

  elements.forEach((element) => {
    $(element).RangeSliderFox();
  });
};

document.addEventListener('DOMContentLoaded', handleDocumentDOMContentLoaded);

export default $;
