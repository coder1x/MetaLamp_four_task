import Handle from '../handle';
import { Controller, Model, View } from '../../../controller/controller';
import {
  mockPointerEvent,
  mockKeyboardEvent,
} from '../../../../__tests__/jestUtils';

describe('------- Test Handle API -------', () => {
  let rsName: string;
  let wrap: HTMLElement;
  let handle: Handle;
  let jsRsName: string;

  beforeEach(async () => {
    rsName = 'range-slider-fox';
    jsRsName = `js-${rsName}`;
    wrap = document.createElement('div');
    wrap.classList.add(`${rsName}__center`);
    wrap.classList.add(`${jsRsName}__center`);
    handle = await new Handle(wrap, rsName);
  });

  function searchStr(text: string, str: string) {
    const regexp = new RegExp(str, 'g');
    expect(regexp.test(text)).toBeTruthy();
  }

  const delElem = (elem: HTMLElement) => {
    while (elem.firstChild) {
      elem.firstChild.remove();
    }
  };

  const createFromTo = async () => {
    const wrapper = await handle.createDomBase('double');
    expect(wrapper).toBeDefined();
    const from = await handle.setFrom(34);
    const to = await handle.setTo(56);
    return { from, to };
  };

  // createDomBase
  test(' Create basic DOM-elements ', async () => {
    let wrapper = handle.createDomBase('double');
    expect(wrapper).toBeDefined();

    let child: HTMLCollection | null = null;
    if (typeof wrapper !== 'boolean') { child = wrapper.children; }

    if (!child) return;

    searchStr(child[0].className, `${jsRsName}__from`);
    searchStr(child[1].className, `${jsRsName}__to`);

    wrapper = await handle.createDomBase('double');
    expect(wrapper).toBeFalsy();
    await delElem(wrap);
    handle = await new Handle(wrap, rsName);
    wrapper = await handle.createDomBase('single');
    expect(wrapper).toBeDefined();

    if (typeof wrapper !== 'boolean') { child = wrapper.children; }

    searchStr(child[0].className, `${jsRsName}__from`);
    expect(child[1]).toBeUndefined();
    wrapper = handle.createDomBase('single');
    expect(wrapper).toBeFalsy();
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
    let flag = handle.setOrientation('vertical');
    expect(flag).toBeTruthy();
    flag = handle.setOrientation('horizontal');
    expect(flag).toBeTruthy();
  });

  const testName = ' Check if an event of dots'
    + ' movement along the track is triggered ';
  // setActions
  test(testName, async () => {
    const wrapper: HTMLElement = document.createElement('div');
    const input: HTMLInputElement = document.createElement('input');
    wrapper.appendChild(input);

    await createFromTo();
    handle.setOrientation('horizontal');
    const flag = handle.setActions('double');
    expect(flag).toBeTruthy();

    const model = new Model({
      type: 'double',
      onStart: async () => {
        const spy = await jest.spyOn(model, 'calcDotPosition');

        const eventDot = async (name: string, down: number, move: number) => {
          const dot = await wrapper.getElementsByClassName(
            `${jsRsName}__${name}`,
          );
          const type = name === 'from' ? 'From' : 'To';
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
              type,
              wrapWH: 0,
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
