import { NAME_PLUGIN } from '@shared/constants';

import $ from '../rangeSliderFox';

// Добавление JQuery плагина - Range Slider Fox
describe('------- Range Slider Fox - JQuery Objects -------', () => {
  let wrapper: HTMLElement;
  let inputElement: HTMLInputElement;

  function delay(time: number) {
    return new Promise((resolve, reject) => {
      if (time) {
        setTimeout(resolve, time);
      } else {
        reject(Error('time = 0'));
      }
    });
  }

  function mockCustomEvent(
    element: Document,
    { eventType }: { eventType: string },
  ): void {
    element.dispatchEvent(new CustomEvent(
      eventType,
      { bubbles: true },
    ));
  }

  beforeEach(() => {
    wrapper = document.createElement('div');
    inputElement = document.createElement('input');
    wrapper.appendChild(inputElement);
  });

  // RangeSliderFox Function
  test(' Adding plugim to JQuery library ', () => {
    let isProperty = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const property in $(inputElement)) {
      if (property === NAME_PLUGIN) {
        isProperty = true;
        break;
      }
    }

    expect(isProperty).toBeTruthy();
  });

  const TEST_NAME = ' Initialize plugin on a DOM-element '
    + 'and check the obtained object ';
  // initialization
  test(TEST_NAME, () => {
    const rangeSliderOne = $(inputElement).RangeSliderFox({}).data(NAME_PLUGIN);
    expect(rangeSliderOne).toBeDefined();

    const rangeSliderTwo = $(inputElement).RangeSliderFox({}).data(NAME_PLUGIN);
    expect(rangeSliderTwo).toEqual(rangeSliderOne);
  });

  test('Plugin initialization with data attribute', async () => {
    const element = await document.createElement('div');
    await element.setAttribute('data-plugin', 'rangeSliderFox');
    document.body.appendChild(element);
    await mockCustomEvent(document, { eventType: 'DOMContentLoaded' });
    await delay(100);

    const sibling = element.nextElementSibling;
    let rangeSliderFox = '';
    if (sibling) { rangeSliderFox = sibling.className; }

    expect(rangeSliderFox).toBe('range-slider-fox js-range-slider-fox rs-base');
  });

  test(' destroy - plugin removal ', async () => {
    const rangeSlider = await $(inputElement).RangeSliderFox({})
      .data(NAME_PLUGIN);

    expect(rangeSlider).toBeDefined();

    let rangeSliderData = await $.data(inputElement, NAME_PLUGIN);
    expect(rangeSliderData).toBeDefined();

    await delay(100);
    await rangeSlider.destroy();
    await delay(100);
    rangeSliderData = await $.data(inputElement, NAME_PLUGIN);
    expect(rangeSliderData).toBeNull();
  });
});
