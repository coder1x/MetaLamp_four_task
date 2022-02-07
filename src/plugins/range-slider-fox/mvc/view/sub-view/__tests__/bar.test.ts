import { Bar } from '../bar';
import { Controller, Model, View } from '../../../controller/controller';
import { mockPointerEvent } from '../../../../__tests__/jestUtils';


// диапазон между ползунками
describe('------- Test Bar API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;
  let bar: Bar;
  let jsRsName: string;

  const createBar = async () => {
    await bar.setVisibleBar(true);
    const domF = await bar.createDomBar();
    expect(domF).toBeTruthy();
  };

  beforeEach(() => {
    rsName = 'range-slider-fox';
    jsRsName = 'js-' + rsName;
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__center');
    wrap.classList.add(jsRsName + '__center');
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
    const sbF = await bar.setBar(12, 23);
    expect(sbF).toBeTruthy();
    const elem = await wrap.firstElementChild;

    let left: string;
    let width: string;
    if (elem instanceof HTMLElement) {
      left = elem.style.left;
      width = elem.style.width;
    }
    expect(left).toBe('12%');
    expect(width).toBe('23%');
  });

  // setOrientation
  test(' Set progress-bar orientation ', async () => {
    await createBar();
    const sbF = await bar.setBar(34, 10);
    expect(sbF).toBeTruthy();
    const orF = await bar.setOrientation('vertical');
    expect(orF).toBeTruthy();
    const elem = await wrap.firstElementChild;

    let bottom: string;
    let height: string;

    if (elem instanceof HTMLElement) {
      bottom = elem.style.bottom;
      height = elem.style.height;
    }
    expect(bottom).toBe('34%');
    expect(height).toBe('10%');
  });

  // setSizeWH 
  test(' Set progress-bar size relating the orientation ', async () => {
    await createBar();
    bar.setSizeWH(25);
    const elem = await wrap.firstElementChild;
    let height: string;
    if (elem instanceof HTMLElement)
      height = elem.style.height;
    expect(height).toBe('25px');
  });


  // clickBar
  test(' Check if click event on the progress-bar is triggered ', async () => {

    let wrapC: HTMLElement;
    let domC: HTMLInputElement;
    wrapC = document.createElement('div');
    domC = document.createElement('input');
    wrapC.appendChild(domC);

    let obj: Controller;

    const model = new Model({
      type: 'double',
      min: 0,
      max: 100,
      from: 20,
      to: 80,
      bar: true,
      onStart: async () => {
        obj.update({ tipMinMax: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'clickBar');
        const dot =
          await wrapC.getElementsByClassName(jsRsName + '__bar');
        const funP = await mockPointerEvent(dot[0]);
        await funP('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const view = await new View(domC);
    obj = await new Controller(model, view);

  });


});