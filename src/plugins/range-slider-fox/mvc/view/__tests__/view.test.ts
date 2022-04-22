import { Controller, Model, View } from '../../controller/Controller';
import { mockPointerEvent } from '../../../__tests__/jestUtils';

describe('------- Test View API -------', () => {
  let wrap: HTMLElement;
  let inputElement: HTMLInputElement;
  let view: View;
  let rsName: string;
  let jsRsName: string;

  beforeEach(() => {
    rsName = 'range-slider-fox';
    jsRsName = `js-${rsName}`;
    wrap = document.createElement('div');
    inputElement = document.createElement('input');
    wrap.appendChild(inputElement);
    view = new View(inputElement);
  });

  function searchStr(text: string, str: string) {
    return new RegExp(str, 'g').test(text);
  }

  // setValueInput
  test(' Check Input DOM-element value changing ', () => {
    new Controller(new Model({
      min: 0,
      max: 100,
      from: 30,
      to: 70,
    }), view);
    const data = view.setValueInput(30, 70, 'double');
    expect(data).toBeTruthy();
    expect(data).toBe(inputElement.value);
  });

  // outDataAttr
  test(' Check if all necessary data-attributes are got ', async () => {
    await inputElement.setAttribute('data-from', '45');
    await inputElement.setAttribute('data-to', '86');

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
        let opacity = await view.disabledRangeSlider(true);
        const rs = inputElement.parentElement as HTMLElement;
        let num = Number(rs.style.opacity);
        expect(+opacity).toBeCloseTo(num);
        opacity = await view.disabledRangeSlider(false);
        num = Number(rs.style.opacity);
        expect(+opacity).toBeCloseTo(num);
      },
    });
    new Controller(model, view);
  });

  // createDomBase
  test(' Create basic DOM-elements ', async () => {
    const model = await new Model({
      disabled: false,
      onStart: async () => {
        const dom = view.createDomBase() as Element;
        const nodes = dom.childNodes;
        const name: string[] = [];
        let line: Element | null = null;

        nodes.forEach((item) => {
          const element = item as HTMLElement;

          const { className } = element;
          if (searchStr(className, `${jsRsName}__center`)) {
            [line] = element.children;
          }
          name.push(className);
        });

        expect(searchStr(name[0], `${jsRsName}__top`)).toBeTruthy();
        expect(searchStr(name[1], `${jsRsName}__center`)).toBeTruthy();
        expect(searchStr(name[2], `${jsRsName}__bottom`)).toBeTruthy();

        if (line) {
          const element = line as Element;
          expect(searchStr(element.className, `${jsRsName}__line`)).toBeTruthy();
        }
      },
    });
    new Controller(model, view);
  });

  // setOrientation
  test(' Change plugin orientation - horizontal / vertical ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setOrientation('vertical');
        const element = wrap.getElementsByClassName(`${rsName}_vertical`);
        expect(element[0]).toBeDefined();
      },
    });
    new Controller(model, view);
  });

  // setActions
  test(' Check if click event on the grid range is triggered ', async () => {
    const wrapper: HTMLElement = document.createElement('div');
    const input: HTMLInputElement = document.createElement('input');
    wrapper.appendChild(input);

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
        const dot = await wrapper.getElementsByClassName(`${jsRsName}__line`);
        const pointer = await mockPointerEvent(dot[0]);
        await pointer('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const objView = await new View(input);
    obj = await new Controller(model, objView);
  });

  // setTheme
  test(' Check interface theme changing ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setTheme('dark');
        let element = wrap.getElementsByClassName('rs-dark');
        expect(element[0]).toBeDefined();
        view.setTheme('fox');
        element = wrap.getElementsByClassName('rs-dark');
        expect(element[0]).toBeUndefined();
        element = wrap.getElementsByClassName('rs-fox');
        expect(element[0]).toBeDefined();
      },
    });
    new Controller(model, view);
  });

  test(' handle - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {
        const element = view.createDotElem('double') as HTMLElement;
        expect(element.constructor.name).toBe('HTMLDivElement');

        expect(typeof view.setDotFrom(15)).toBe('object');

        expect(typeof view.setDotTo(20)).toBe('object');

        expect(view.setDotActions('double')).toBeTruthy();
      },
    });
    new Controller(model, view);
  });

  test(' hints - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {
        let masFlag = view.setHintsData({
          tipPrefix: '',
          tipPostfix: '',
          tipFromTo: false,
          tipMinMax: false,
          min: 0,
          max: 100,
          type: 'single',
        });

        expect(masFlag.indexOf(false)).toBe(-1);
        expect(view.toggleTipTo(20)).toBeFalsy();

        expect(view.updateTipMinMax(10, 50)).toBeFalsy();

        expect(view.getWidthTip(true, false)).toEqual({
          fromWH: 0,
          toWH: 0,
          singleWH: 0,
        });
        expect(view.deleteTipTo()).toBeFalsy();
        expect(view.checkVisibleTip()).toBeFalsy();

        masFlag = view.updateTipValue(10, 30, 'double');
        expect(masFlag).not.toContain(true);

        masFlag = view.updateTipPosition({
          fromXY: 1,
          toXY: 1,
          singleXY: 1,
        });
        expect(masFlag).not.toContain(true);
      },
    });
    new Controller(model, view);
  });

  test(' Bar - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {
        expect(view.setVisibleBar(true)).not.toContain(false);
        expect(view.setBar(25, 100)).toBeTruthy();
      },
    });
    new Controller(model, view);
  });

  test(' Grid - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {
        let element = await view.createDomGrid() as HTMLElement;
        expect(element.constructor.name).toBe('HTMLDivElement');
        element = await view.createMark([
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
        ]) as HTMLElement;

        expect(element.constructor.name).toBe('HTMLDivElement');
        expect(await view.deleteGrid()).toBeTruthy();
      },
    });
    new Controller(model, view);
  });
});
