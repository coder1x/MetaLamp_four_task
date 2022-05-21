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
      if (property === 'RangeSliderFox') {
        isProperty = true;
        break;
      }
    }

    expect(isProperty).toBeTruthy();
  });

  const testName = ' Initialize plugin on a DOM-element '
    + 'and check the obtained object ';
  // initialization
  test(testName, () => {
    const rangeSliderOne = $(inputElement).RangeSliderFox({}).data('RangeSliderFox');
    expect(rangeSliderOne).toBeDefined();

    const rangeSliderTwo = $(inputElement).RangeSliderFox({}).data('RangeSliderFox');
    expect(rangeSliderTwo).toEqual(rangeSliderOne);
  });

  test('Plugin initialization with data attribute', async () => {
    inputElement = await document.createElement('input');
    await inputElement.setAttribute('data-plugin', 'rangeSliderFox');
    await mockCustomEvent(document, { eventType: 'DOMContentLoaded' });
    await jest.runOnlyPendingTimers();
  });

  test(' destroy - plugin removal ', async () => {
    const rangeSlider = await $(inputElement).RangeSliderFox({})
      .data('RangeSliderFox');

    expect(rangeSlider).toBeDefined();

    let rangeSliderData = await $.data(inputElement, 'RangeSliderFox');
    expect(rangeSliderData).toBeDefined();

    await delay(100);
    await rangeSlider.destroy();
    await delay(100);
    rangeSliderData = await $.data(inputElement, 'RangeSliderFox');
    expect(rangeSliderData).toBeNull();
  });
});
