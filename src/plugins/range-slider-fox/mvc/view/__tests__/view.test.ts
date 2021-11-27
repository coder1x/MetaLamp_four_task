import { Controller, Model, View } from '../../controller/controller';
import { mockPointerEvent } from '../../../__tests__/jestUtils';

describe('------- Test View API -------', () => {

  let wrap: HTMLElement;
  let domV: HTMLInputElement;
  let view: View;
  let rsName: string;

  beforeEach(() => {
    rsName = 'range-slider-fox';
    wrap = document.createElement('div');
    domV = document.createElement('input');
    wrap.appendChild(domV);
    view = new View(domV, 1);
  });

  test(' setValueInput ', () => {
    const model = new Model({
      min: 0,
      max: 100,
      from: 30,
      to: 70,
    });

    new Controller(model, view);
    const data = view.setValueInput(30, 70, 'double');
    expect(data).toBeTruthy();
    expect(data).toBe(domV.value);
  });

  test(' outDataAttr ', async () => {
    await domV.setAttribute('data-from', '45');
    await domV.setAttribute('data-to', '86');

    const model = await new Model({
      min: 0,
      max: 100,
      from: 30,
      to: 70,
      onStart: async () => {
        let obj = { from: 45, to: 86 };
        expect(view.outDataAttr()).toEqual(obj);
      },
    });

    new Controller(model, view);
  });


  test(' disabledRangeSlider ', async () => {
    const model = await new Model({
      disabled: false,
      onStart: async () => {
        let op = await view.disabledRangeSlider(true);
        const rs = domV.parentElement;
        let num = +rs.style.opacity;
        expect(+op).toBeCloseTo(num);
        op = await view.disabledRangeSlider(false);
        num = +rs.style.opacity;
        expect(+op).toBeCloseTo(num);
      }
    });

    new Controller(model, view);
  });


  test(' createDomBase ', async () => {
    const model = await new Model({
      disabled: false,
      onStart: async () => {
        let nodes = view.createDomBase().childNodes;
        let name: string[] = [];
        let line: HTMLElement;
        for (let item of nodes) {
          const elem = item as HTMLElement;
          const nC = elem.className;
          if (nC == rsName + '__center')
            line = elem.children[0] as HTMLElement;
          name.push(nC);
        }

        const masName = [
          rsName + '__top',
          rsName + '__center',
          rsName + '__bottom'
        ];

        expect(name).toEqual(masName);
        expect(line.className).toBe(rsName + '__line');
      }
    });

    new Controller(model, view);
  });



  test(' setOrientation ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setOrientation('vertical');
        const elem = wrap.getElementsByClassName(rsName + '_vertical');
        expect(elem[0]).toBeDefined();
      }
    });

    new Controller(model, view);
  });


  test(' setActions ', async () => {

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
      bar: false,
      onStart: async () => {
        obj.update({ tipMinMax: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'clickLine');
        const dot =
          await wrapC.getElementsByClassName(rsName + '__line');
        let elem = dot[0] as HTMLElement;
        const funP = await mockPointerEvent(elem);
        await funP('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const view = await new View(domC, 1);
    obj = await new Controller(model, view);

  });


  test(' setTheme ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setTheme('dark');
        let elem = wrap.getElementsByClassName('rs-dark');
        expect(elem[0]).toBeDefined();
        view.setTheme('fox');
        elem = wrap.getElementsByClassName('rs-dark');
        expect(elem[0]).toBeUndefined();
        elem = wrap.getElementsByClassName('rs-fox');
        expect(elem[0]).toBeDefined();
      }
    });

    new Controller(model, view);
  });





});

