import { RANGE_SLIDER_NAME } from '@shared/constants';

import { mockPointerEvent } from '../../../../tests/jestUtils';
import { Controller, Model, View } from '../../../controller/Controller';
import Bar from '../Bar';

// диапазон между ползунками
describe('------- Test Bar API -------', () => {
  let wrapper: HTMLElement;
  let bar: Bar;

  const createBar = () => {
    bar.setVisibleBar(true);
    expect(bar.createDomElementBar()).toBeTruthy();
  };

  beforeEach(() => {
    wrapper = document.createElement('div');
    wrapper.classList.add(`${RANGE_SLIDER_NAME}__center`);
    wrapper.classList.add(`js-${RANGE_SLIDER_NAME}__center`);
    bar = new Bar(wrapper);
  });

  // setVisibleBar
  test(' Turn progress-bar visibility on / off ', () => {
    expect(bar.setVisibleBar(true)).toBeTruthy();
    expect(bar.setVisibleBar(false)).toBeFalsy();
  });

  // createDomElementBar
  test(' Create progress-bar DOM-element ', () => {
    createBar();
  });

  // setBar
  test(' Set progress-bar position and width ', () => {
    createBar();
    expect(bar.setBar(12, 23)).toBeTruthy();
    const element = wrapper.firstElementChild as HTMLElement;

    const { left } = element.style;
    const { width } = element.style;

    expect(left).toBe('12%');
    expect(width).toBe('23%');
  });

  // setOrientation
  test(' Set progress-bar orientation ', () => {
    createBar();
    expect(bar.setBar(34, 10)).toBeTruthy();
    expect(bar.setOrientation('vertical')).toBeTruthy();
    const element = wrapper.firstElementChild as HTMLElement;

    const { bottom } = element.style;
    const { height } = element.style;

    expect(bottom).toBe('34%');
    expect(height).toBe('10%');
  });

  // setSizeWidthHeight
  test(' Set progress-bar size relating the orientation ', () => {
    createBar();
    bar.setSizeWidthHeight(25);
    const element = wrapper.firstElementChild as HTMLElement;
    const { height } = element.style;
    expect(height).toBe('25px');
  });

  // clickBar
  test(' Check if click event on the progress-bar is triggered ', () => {
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
      onStart: () => {
        controller.update({ tipMinMax: false });
      },
      onUpdate: () => {
        const spy = jest.spyOn(model, 'calcBarCoordinates');
        const dot = parentElement.getElementsByClassName(`js-${RANGE_SLIDER_NAME}__bar`);
        const pointer = mockPointerEvent(dot[0]);
        pointer('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        spy.mockClear();
      },
    });
    const view = new View(input);
    controller = new Controller(model, view);
  });
});
