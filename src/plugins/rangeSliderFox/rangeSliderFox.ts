import { NAME_PLUGIN } from '@shared/constants';

import { Controller, Model, View } from './mvc/controller/Controller';

$.fn.RangeSliderFox = function plugin(options = {}) {
  this.each((i: number, element: Element) => {
    if (!$.data(element, NAME_PLUGIN)) {
      $(element).data(
        NAME_PLUGIN,
        new Controller(new Model(options), new View(element)),
      );
    }
  });
  return this;
};

const handleDocumentDOMContentLoaded = (event: Event) => {
  const documentLoaded = event.target as Document;
  documentLoaded.querySelectorAll(
    "[data-plugin = 'rangeSliderFox'], .rangeSliderFox",
  ).forEach((element) => {
    $(element).RangeSliderFox();
  });
};

document.addEventListener('DOMContentLoaded', handleDocumentDOMContentLoaded);

export default $;
