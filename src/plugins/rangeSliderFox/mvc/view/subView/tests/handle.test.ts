import { RANGE_SLIDER_NAME } from '@shared/constants';

import {
  mockPointerEvent,
  mockKeyboardEvent,
} from '../../../../tests/jestUtils';
import { Controller, Model, View } from '../../../controller/Controller';
import Handle from '../Handle';

describe('------- Test Handle API -------', () => {
  let wrapperElement: HTMLElement;
  let handle: Handle;

  beforeEach(() => {
    wrapperElement = document.createElement('div');
    wrapperElement.classList.add(`${RANGE_SLIDER_NAME}__center`);
    wrapperElement.classList.add(`js-${RANGE_SLIDER_NAME}__center`);
    handle = new Handle(wrapperElement);
  });

  function searchString(text: string, substring: string) {
    expect(new RegExp(substring, 'g').test(text)).toBeTruthy();
  }

  const delElement = (element: HTMLElement) => {
    while (element.firstChild) {
      element.firstChild.remove();
    }
  };

  const createFromTo = () => {
    expect(handle.createDomElementBase('double')).toBeDefined();
    const from = handle.setFrom(34);
    const to = handle.setTo(56);
    return { from, to };
  };

  // createDomElementBase
  test(' Create basic DOM-elements ', () => {
    let parentElement = handle.createDomElementBase('double');
    expect(parentElement).toBeDefined();

    let child: HTMLCollection | null = null;
    if (typeof parentElement !== 'boolean') {
      child = parentElement.children;
    }

    if (!child) {
      return;
    }

    searchString(child[0].className, `js-${RANGE_SLIDER_NAME}__from`);
    searchString(child[1].className, `js-${RANGE_SLIDER_NAME}__to`);

    parentElement = handle.createDomElementBase('double');
    expect(parentElement).toBeFalsy();
    delElement(wrapperElement);
    handle = new Handle(wrapperElement);
    parentElement = handle.createDomElementBase('single');
    expect(parentElement).toBeDefined();

    if (typeof parentElement !== 'boolean') {
      child = parentElement.children;
    }

    searchString(child[0].className, `js-${RANGE_SLIDER_NAME}__from`);
    expect(child[1]).toBeUndefined();
    parentElement = handle.createDomElementBase('single');
    expect(parentElement).toBeFalsy();
  });

  // setFrom & setTo
  test(' Check if dots got their positioning proprties ', () => {
    const { from, to } = createFromTo();
    let leftFrom: string = '';

    if (typeof from !== 'boolean') {
      leftFrom = from.left;
    }

    let leftTo: string = '';

    if (typeof to !== 'boolean') {
      leftTo = to.left;
    }

    expect(leftFrom).toBe('34%');
    expect(leftTo).toBe('56%');
  });

  // setOrientation
  test(' Check if orientation is changed ', () => {
    createFromTo();
    let isVertical = handle.setOrientation('vertical');
    expect(isVertical).toBeTruthy();
    isVertical = handle.setOrientation('horizontal');
    expect(isVertical).toBeTruthy();
  });

  // bindEvent
  test(' Check if an event of dots movement along the track is triggered ', () => {
    const wrapper: HTMLElement = document.createElement('div');
    const input: HTMLInputElement = document.createElement('input');
    wrapper.appendChild(input);

    createFromTo();
    handle.setOrientation('horizontal');
    expect(handle.bindEvent('double')).toBeTruthy();

    const model = new Model({
      type: 'double',
      onStart: () => {
        const spy = jest.spyOn(model, 'calcFromTo');

        const eventDot = (name: string, down: number, move: number) => {
          const dot = wrapper.getElementsByClassName(
            `js-${RANGE_SLIDER_NAME}__${name}`,
          );

          const pointer = mockPointerEvent(dot[0]);
          const keyboard = mockKeyboardEvent(dot[0]);
          pointer('pointerdown', down, 0);
          pointer('pointermove', move, 0);
          pointer('pointerup', 0, 0);
          keyboard('ArrowRight');
          keyboard('ArrowLeft');

          expect(spy).toBeCalledWith(
            {
              clientXY: move,
              position: 0,
              shiftXY: down,
              type: name === 'from' ? 'From' : 'To',
              dimensions: 0,
            },
          );
          expect(spy).toBeCalledTimes(1);
          spy.mockClear();
        };

        eventDot('from', 85, 82);
        eventDot('to', 87, 83);
      },
    });
    const view = new View(input);
    new Controller(model, view);
  });
});
