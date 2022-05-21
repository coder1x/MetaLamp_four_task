import {
  mockPointerEvent,
  mockKeyboardEvent,
} from '../../../../tests/jestUtils';
import { Controller, Model, View } from '../../../controller/Controller';
import Handle from '../Handle';

describe('------- Test Handle API -------', () => {
  let rangeSliderName: string;
  let wrapperElement: HTMLElement;
  let handle: Handle;
  let jsRangeSliderName: string;

  beforeEach(async () => {
    rangeSliderName = 'range-slider-fox';
    jsRangeSliderName = `js-${rangeSliderName}`;
    wrapperElement = document.createElement('div');
    wrapperElement.classList.add(`${rangeSliderName}__center`);
    wrapperElement.classList.add(`${jsRangeSliderName}__center`);
    handle = await new Handle(wrapperElement, rangeSliderName);
  });

  function searchStr(text: string, string: string) {
    expect(new RegExp(string, 'g').test(text)).toBeTruthy();
  }

  const delElement = (element: HTMLElement) => {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  };

  const createFromTo = async () => {
    expect(await handle.createDomElementBase('double')).toBeDefined();
    const from = await handle.setFrom(34);
    const to = await handle.setTo(56);
    return { from, to };
  };

  // createDomElementBase
  test(' Create basic DOM-elements ', async () => {
    let parentElement = handle.createDomElementBase('double');
    expect(parentElement).toBeDefined();

    let child: HTMLCollection | null = null;
    if (typeof parentElement !== 'boolean') { child = parentElement.children; }

    if (!child) return;

    searchStr(child[0].className, `${jsRangeSliderName}__from`);
    searchStr(child[1].className, `${jsRangeSliderName}__to`);

    parentElement = await handle.createDomElementBase('double');
    expect(parentElement).toBeFalsy();
    await delElement(wrapperElement);
    handle = await new Handle(wrapperElement, rangeSliderName);
    parentElement = await handle.createDomElementBase('single');
    expect(parentElement).toBeDefined();

    if (typeof parentElement !== 'boolean') { child = parentElement.children; }

    searchStr(child[0].className, `${jsRangeSliderName}__from`);
    expect(child[1]).toBeUndefined();
    parentElement = handle.createDomElementBase('single');
    expect(parentElement).toBeFalsy();
  });

  // setFrom & setTo
  test(' Check if dots got their positioning proprties ', async () => {
    const { from, to } = await createFromTo();
    let leftFrom: string = '';

    if (typeof from !== 'boolean') { leftFrom = from.left; }

    let leftTo: string = '';

    if (typeof to !== 'boolean') { leftTo = to.left; }

    expect(leftFrom).toBe('34%');
    expect(leftTo).toBe('56%');
  });

  // setOrientation
  test(' Check if orientation is changed ', async () => {
    await createFromTo();
    let isVertical = handle.setOrientation('vertical');
    expect(isVertical).toBeTruthy();
    isVertical = handle.setOrientation('horizontal');
    expect(isVertical).toBeTruthy();
  });

  const testName = ' Check if an event of dots'
    + ' movement along the track is triggered ';
  // bindEvent
  test(testName, async () => {
    const wrapper: HTMLElement = document.createElement('div');
    const input: HTMLInputElement = document.createElement('input');
    wrapper.appendChild(input);

    await createFromTo();
    handle.setOrientation('horizontal');
    expect(handle.bindEvent('double')).toBeTruthy();

    const model = new Model({
      type: 'double',
      onStart: async () => {
        const spy = await jest.spyOn(model, 'calcFromTo');

        const eventDot = async (name: string, down: number, move: number) => {
          const dot = await wrapper.getElementsByClassName(
            `${jsRangeSliderName}__${name}`,
          );

          const pointer = await mockPointerEvent(dot[0]);
          const keyboard = await mockKeyboardEvent(dot[0]);
          await pointer('pointerdown', down, 0);
          await pointer('pointermove', move, 0);
          await pointer('pointerup', 0, 0);
          await keyboard('ArrowRight');
          await keyboard('ArrowLeft');

          expect(spy).toBeCalledWith(
            {
              clientXY: move,
              position: 0,
              shiftXY: down,
              type: name === 'from' ? 'From' : 'To',
              wrapperWidthHeight: 0,
            },
          );
          expect(spy).toBeCalledTimes(1);
          await spy.mockClear();
        };

        await eventDot('from', 85, 82);
        await eventDot('to', 87, 83);
      },
    });
    const view = await new View(input);
    await new Controller(model, view);
  });
});
