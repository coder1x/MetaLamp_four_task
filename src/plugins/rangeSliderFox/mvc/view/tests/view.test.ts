import { Controller, Model, View } from '../../controller/Controller';
import { mockPointerEvent } from '../../../tests/jestUtils';

describe('------- Test View API -------', () => {
  let wrapper: HTMLElement;
  let inputElement: HTMLInputElement;
  let view: View;
  let rangeSliderName: string;
  let jsRangeSliderName: string;

  beforeEach(() => {
    rangeSliderName = 'range-slider-fox';
    jsRangeSliderName = `js-${rangeSliderName}`;
    wrapper = document.createElement('div');
    inputElement = document.createElement('input');
    wrapper.appendChild(inputElement);
    view = new View(inputElement);
  });

  function searchString(text: string, str: string) {
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

  // outputDataAttribute
  test(' Check if all necessary data-attributes are got ', async () => {
    await inputElement.setAttribute('data-from', '45');
    await inputElement.setAttribute('data-to', '86');

    const model = await new Model({
      min: 0,
      max: 100,
      from: 30,
      to: 70,
      onStart: async () => {
        const data = { from: 45, to: 86 };
        expect(view.outputDataAttribute()).toEqual(data);
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
        const rangeSliderElement = inputElement.parentElement as HTMLElement;
        let numberOpacity = Number(rangeSliderElement.style.opacity);
        expect(+opacity).toBeCloseTo(numberOpacity);
        opacity = await view.disabledRangeSlider(false);
        numberOpacity = Number(rangeSliderElement.style.opacity);
        expect(+opacity).toBeCloseTo(numberOpacity);
      },
    });
    new Controller(model, view);
  });

  // createDomElementBase
  test(' Create basic DOM-elements ', async () => {
    const model = await new Model({
      disabled: false,
      onStart: async () => {
        const domElement = view.createDomElementBase() as Element;
        const nodes = domElement.childNodes;
        const names: string[] = [];
        let line: Element | null = null;

        nodes.forEach((item) => {
          const element = item as HTMLElement;

          const { className } = element;
          if (searchString(className, `${jsRangeSliderName}__center`)) {
            [line] = element.children;
          }
          names.push(className);
        });

        expect(searchString(names[0], `${jsRangeSliderName}__top`)).toBeTruthy();
        expect(searchString(names[1], `${jsRangeSliderName}__center`)).toBeTruthy();
        expect(searchString(names[2], `${jsRangeSliderName}__bottom`)).toBeTruthy();

        if (line) {
          const element = line as Element;
          expect(searchString(element.className, `${jsRangeSliderName}__line`)).toBeTruthy();
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
        const element = wrapper.getElementsByClassName(`${rangeSliderName}_vertical`);
        expect(element[0]).toBeDefined();
      },
    });
    new Controller(model, view);
  });

  // bindEvent
  test(' Check if click event on the grid range is triggered ', async () => {
    const parentElement: HTMLElement = document.createElement('div');
    const input: HTMLInputElement = document.createElement('input');
    parentElement.appendChild(input);

    let controller: Controller;

    const model = new Model({
      type: 'double',
      min: 0,
      max: 100,
      from: 20,
      to: 80,
      bar: false,
      onStart: async () => {
        controller.update({ tipMinMax: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'calcLineCoordinates');
        const dot = await parentElement.getElementsByClassName(`${jsRangeSliderName}__line`);
        const pointer = await mockPointerEvent(dot[0]);
        await pointer('click', 34, 45);
        expect(spy).toBeCalledTimes(1);
        await spy.mockClear();
      },
    });
    const objView = await new View(input);
    controller = await new Controller(model, objView);
  });

  // setTheme
  test(' Check interface theme changing ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setTheme('dark');
        let element = wrapper.getElementsByClassName('rs-dark');
        expect(element[0]).toBeDefined();
        view.setTheme('fox');
        element = wrapper.getElementsByClassName('rs-dark');
        expect(element[0]).toBeUndefined();
        element = wrapper.getElementsByClassName('rs-fox');
        expect(element[0]).toBeDefined();
      },
    });
    new Controller(model, view);
  });

  test(' handle - interface  ', async () => {
    const model = await new Model({
      onStart: async () => {
        const element = view.createDotElement('double') as HTMLElement;
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
        let areHintsExist = view.setHintsData({
          tipPrefix: '',
          tipPostfix: '',
          tipFromTo: false,
          tipMinMax: false,
          min: 0,
          max: 100,
          type: 'single',
        });

        expect(areHintsExist.indexOf(false)).toBe(-1);
        expect(view.toggleTipTo(20)).toBeFalsy();

        expect(view.updateTipMinMax(10, 50)).toBeFalsy();

        expect(view.getWidthTip()).toEqual({
          fromWidthHeight: 0,
          toWidthHeight: 0,
          singleWidthHeight: 0,
        });
        expect(view.deleteTipTo()).toBeFalsy();
        expect(view.checkVisibleTip()).toBeFalsy();

        areHintsExist = view.updateTipValue(10, 30, 'double');
        expect(areHintsExist).not.toContain(true);

        areHintsExist = view.updateTipPosition({
          fromXY: 1,
          toXY: 1,
          singleXY: 1,
        });
        expect(areHintsExist).not.toContain(true);
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
        let element = await view.createDomElementGrid() as HTMLElement;
        expect(element.constructor.name).toBe('HTMLDivElement');
        element = await view.createMark([
          {
            value: 1,
            position: 1,
          },
          {
            value: 1,
            position: 1,
          },
          {
            value: 1,
            position: 1,
          },
          {
            value: 1,
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
