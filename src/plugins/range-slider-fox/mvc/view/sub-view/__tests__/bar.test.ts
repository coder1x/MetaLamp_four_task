import Bar from '../Bar';
import { Controller, Model, View } from '../../../controller/Controller';
import { mockPointerEvent } from '../../../../__tests__/jestUtils';

// диапазон между ползунками
describe('------- Test Bar API -------', () => {
  let rsName: string;
  let wrap: HTMLElement;
  let bar: Bar;
  let jsRsName: string;

  const createBar = async () => {
    await bar.setVisibleBar(true);
    expect(await bar.createDomBar()).toBeTruthy();
  };

  beforeEach(() => {
    rsName = 'range-slider-fox';
    jsRsName = `js-${rsName}`;
    wrap = document.createElement('div');
    wrap.classList.add(`${rsName}__center`);
    wrap.classList.add(`${jsRsName}__center`);
    bar = new Bar(wrap, rsName);
  });

  // setVisibleBar
  test(' Turn progress-bar visibility on / off ', async () => {
    expect(bar.setVisibleBar(true)).toBeTruthy();
    expect(bar.setVisibleBar(false)).toBeFalsy();
  });

  // createDomBar
  test(' Create progress-bar DOM-element ', async () => {
    createBar();
  });

  // setBar
  test(' Set progress-bar position and width ', async () => {
    await createBar();
    expect(await bar.setBar(12, 23)).toBeTruthy();
    const element = await wrap.firstElementChild as HTMLElement;

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
    const element = await wrap.firstElementChild as HTMLElement;

    const { bottom } = element.style;
    const { height } = element.style;

    expect(bottom).toBe('34%');
    expect(height).toBe('10%');
  });

  // setSizeWH
  test(' Set progress-bar size relating the orientation ', async () => {
    await createBar();
    bar.setSizeWH(25);
    const element = await wrap.firstElementChild as HTMLElement;
    const { height } = element.style;
    expect(height).toBe('25px');
  });

  // clickBar
  test(' Check if click event on the progress-bar is triggered ', async () => {
    const wrapper = document.createElement('div');
    const input = document.createElement('input');
    wrapper.appendChild(input);
    let objController: Controller;

    const model = new Model({
      type: 'double',
      min: 0,
      max: 100,
      from: 20,
      to: 80,
      bar: true,
      onStart: async () => {
        objController.update({ tipMinMax: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'clickBar');
        const dot = await wrapper.getElementsByClassName(`${jsRsName}__bar`);
        const pointer = await mockPointerEvent(dot[0]);
        await pointer('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const view = await new View(input);
    objController = await new Controller(model, view);
  });
});
