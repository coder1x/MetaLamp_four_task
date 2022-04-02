import { Controller, Model, View } from '../../controller/controller';
import { mockPointerEvent } from '../../../__tests__/jestUtils';

describe('------- Test View API -------', () => {
  let wrap: HTMLElement;
  let domV: HTMLInputElement;
  let view: View;
  let rsName: string;
  let jsRsName: string;

  beforeEach(() => {
    rsName = 'range-slider-fox';
    jsRsName = 'js-' + rsName;
    wrap = document.createElement('div');
    domV = document.createElement('input');
    wrap.appendChild(domV);
    view = new View(domV);
  });

  function searchStr(text: string, str: string) {
    const regexp = new RegExp(str, 'g');
    return regexp.test(text);
  }

  // setValueInput
  test(' Check Input DOM-element value changing ', () => {
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

  // outDataAttr 
  test(' Check if all necessary data-attributes are got ', async () => {
    await domV.setAttribute('data-from', '45');
    await domV.setAttribute('data-to', '86');

    const model = await new Model({
      min: 0,
      max: 100,
      from: 30,
      to: 70,
      onStart: async () => {
        const obj = { from: 45, to: 86 };
        expect(view.outDataAttr()).toEqual(obj);
      },
    });

    new Controller(model, view);
  });

  // disabledRangeSlider
  test(' Check interface changing on pluging disabling ', async () => {
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

  // createDomBase
  test(' Create basic DOM-elements ', async () => {
    const model = await new Model({
      disabled: false,
      onStart: async () => {
        const nodes = view.createDomBase().childNodes;
        const name: string[] = [];
        let line: Element;
        for (let item of nodes) {
          let elem: HTMLElement;
          if (item instanceof HTMLElement)
            elem = item;
          const nC = elem.className;
          if (searchStr(nC, jsRsName + '__center')) {
            line = elem.children[0];
          }
          name.push(nC);
        }

        expect(searchStr(name[0], jsRsName + '__top')).toBeTruthy();
        expect(searchStr(name[1], jsRsName + '__center')).toBeTruthy();
        expect(searchStr(name[2], jsRsName + '__bottom')).toBeTruthy();
        expect(searchStr(line.className, jsRsName + '__line')).toBeTruthy();
      }
    });
    new Controller(model, view);
  });

  // setOrientation
  test(' Change plugin orientation - horizontal / vertical ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setOrientation('vertical');
        const elem = wrap.getElementsByClassName(rsName + '_vertical');
        expect(elem[0]).toBeDefined();
      }
    });
    new Controller(model, view);
  });

  // setActions
  test(' Check if click event on the grid range is triggered ', async () => {
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
          await wrapC.getElementsByClassName(jsRsName + '__line');
        const funP = await mockPointerEvent(dot[0]);
        await funP('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const view = await new View(domC);
    obj = await new Controller(model, view);
  });

  // setTheme
  test(' Check interface theme changing ', async () => {
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

  test(' handle - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {

        const elem = view.createDotElem('double');
        expect(elem.constructor.name).toBe('HTMLDivElement');

        const from = view.setDotFrom(15);
        expect(typeof from).toBe('object');

        const to = view.setDotTo(20);
        expect(typeof to).toBe('object');

        const fl = view.setDotActions('double');
        expect(fl).toBeTruthy();
      }
    });
    new Controller(model, view);
  });

  test(' hints - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {

        let masFL = view.setHintsData({
          tipPrefix: '',
          tipPostfix: '',
          tipFromTo: false,
          tipMinMax: false,
          min: 0,
          max: 100,
          type: 'single',
        });

        expect(masFL.indexOf(false)).toBe(-1);
        expect(view.toggleTipTo(20)).toBeFalsy();

        const objMinMax = view.updateTipMinMax(10, 50);
        expect(objMinMax).toEqual({ tipMin: false, tipMax: false });

        const size = view.getWidthTip(true, false);
        expect(size).toEqual({ fromWH: 0, toWH: 0, singleWH: 0 });
        expect(view.deleteTipTo()).toBeFalsy();
        expect(view.checkVisibleTip()).toBeFalsy();

        masFL = view.updateTipValue(10, 30, 'double');
        expect(masFL).not.toContain(true);

        masFL = view.updateTipPosition({
          fromXY: 1,
          toXY: 1,
          singleXY: 1,
        });
        expect(masFL).not.toContain(true);
      }
    });
    new Controller(model, view);
  });

  test(' Bar - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {
        const masFL = view.setVisibleBar(true);
        expect(masFL).not.toContain(false);

        const fl = view.setBar(25, 100);
        expect(fl).toBeTruthy();
      }
    });
    new Controller(model, view);
  });

  test(' Grid - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {
        let elem = await view.createDomGrid();
        expect(elem.constructor.name).toBe('HTMLDivElement');
        elem = await view.createMark([
          {
            val: 1,
            position: 1,
          },
          {
            val: 1,
            position: 1,
          },
          {
            val: 1,
            position: 1,
          },
          {
            val: 1,
            position: 1,
          },
        ]);

        expect(elem.constructor.name).toBe('HTMLDivElement');
        const fl = await view.deleteGrid();
        expect(fl).toBeTruthy();
      }
    });
    new Controller(model, view);
  });
});