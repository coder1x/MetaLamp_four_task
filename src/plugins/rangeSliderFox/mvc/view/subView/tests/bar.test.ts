import { mockPointerEvent } from '../../../../tests/jestUtils';
import { Controller, Model, View } from '../../../controller/Controller';
import Bar from '../Bar';

// диапазон между ползунками
describe('------- Test Bar API -------', () => {
  let rangeSliderName: string;
  let wrapper: HTMLElement;
  let bar: Bar;
  let jsRangeSliderName: string;

  const createBar = async () => {
    await bar.setVisibleBar(true);
    expect(await bar.createDomElementBar()).toBeTruthy();
  };

  beforeEach(() => {
    rangeSliderName = 'range-slider-fox';
    jsRangeSliderName = `js-${rangeSliderName}`;
    wrapper = document.createElement('div');
    wrapper.classList.add(`${rangeSliderName}__center`);
    wrapper.classList.add(`${jsRangeSliderName}__center`);
    bar = new Bar(wrapper, rangeSliderName);
  });

  // setVisibleBar
  test(' Turn progress-bar visibility on / off ', async () => {
    expect(bar.setVisibleBar(true)).toBeTruthy();
    expect(bar.setVisibleBar(false)).toBeFalsy();
  });

  // createDomElementBar
  test(' Create progress-bar DOM-element ', async () => {
    createBar();
  });

  // setBar
  test(' Set progress-bar position and width ', async () => {
    await createBar();
    expect(await bar.setBar(12, 23)).toBeTruthy();
    const element = await wrapper.firstElementChild as HTMLElement;

    const { left } = element.style;
    const { width } = element.style;

    expect(left).toBe('12%');
    expect(width).toBe('23%');
  });

  // setOrientation
  test(' Set progress-bar orientation ', async () => {
    await createBar();
    expect(await bar.setBar(34, 10)).toBeTruthy();
    expect(await bar.setOrientation('vertical')).toBeTruthy();
    const element = await wrapper.firstElementChild as HTMLElement;

    const { bottom } = element.style;
    const { height } = element.style;

    expect(bottom).toBe('34%');
    expect(height).toBe('10%');
  });

  // setSizeWidthHeight
  test(' Set progress-bar size relating the orientation ', async () => {
    await createBar();
    bar.setSizeWidthHeight(25);
    const element = await wrapper.firstElementChild as HTMLElement;
    const { height } = element.style;
    expect(height).toBe('25px');
  });

  // clickBar
  test(' Check if click event on the progress-bar is triggered ', async () => {
    const parentElement = document.createElement('div');
    const input = document.createElement('input');
    parentElement.appendChild(input);
    let controller: Controller;

    const model = new Model({
      type: 'double',
      min: 0,
      max: 100,
      from: 20,
      to: 80,
      bar: true,
      onStart: async () => {
        controller.update({ tipMinMax: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'clickBar');
        const dot = await parentElement.getElementsByClassName(`${jsRangeSliderName}__bar`);
        const pointer = await mockPointerEvent(dot[0]);
        await pointer('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const view = await new View(input);
    controller = await new Controller(model, view);
  });
});
