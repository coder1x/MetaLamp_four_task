import { Bar } from '../bar';
import { Controller, Model, View } from '../../../controller/controller';
import { mockPointerEvent } from '../../../../__tests__/jestUtils';

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

  const getElem = async () => {
    const barDom = await wrap.firstElementChild;
    const elem = await barDom as HTMLDivElement;
    return elem;
  };

  beforeEach(() => {
    rsName = 'range-slider-fox';
    jsRsName = 'js-' + rsName;
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__center');
    wrap.classList.add(jsRsName + '__center');
    bar = new Bar(wrap, rsName);
  });

  test(' setVisibleBar ', async () => {
    expect(bar.setVisibleBar(true)).toBeTruthy();
    expect(bar.setVisibleBar(false)).toBeFalsy();
  });


  test(' createDomBar ', async () => {
    createBar();
  });


  test(' setBar ', async () => {
    await createBar();
    const sbF = await bar.setBar(12, 23);
    expect(sbF).toBeTruthy();
    const elem = await getElem();
    const left = elem.style.left;
    const width = elem.style.width;
    expect(left).toBe('12%');
    expect(width).toBe('23%');
  });


  test(' setOrientation ', async () => {
    await createBar();
    const sbF = await bar.setBar(34, 10);
    expect(sbF).toBeTruthy();
    const orF = await bar.setOrientation('vertical');
    expect(orF).toBeTruthy();
    const elem = await getElem();
    const bottom = elem.style.bottom;
    const height = elem.style.height;
    expect(bottom).toBe('34%');
    expect(height).toBe('10%');
  });

  test(' setSizeWH ', async () => {
    await createBar();
    bar.setSizeWH(25);
    const elem = await getElem();
    const height = elem.style.height;
    expect(height).toBe('25px');
  });



  test(' clickBar ', async () => {

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
        let elem = dot[0] as HTMLElement;
        const funP = await mockPointerEvent(elem);
        await funP('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const view = await new View(domC);
    obj = await new Controller(model, view);

  });


});