import { Handle } from '../handle';
import { Controller, Model, View } from '../../../controller/controller';
import {
  mockPointerEvent,
  mockKeyboardEvent
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
    const wrapH = await handle.createDomBase('double');
    expect(wrapH).toBeDefined();
    const from = await handle.setFrom(34);
    const to = await handle.setTo(56);
    return { from, to };
  };

  // createDomBase
  test(' Create basic DOM-elements ', async () => {
    let wrapH = handle.createDomBase('double');
    expect(wrapH).toBeDefined();

    let child: HTMLCollection;
    if (typeof wrapH != 'boolean')
      child = wrapH.children;

    searchStr(child[0].className, `${jsRsName}__from`);
    searchStr(child[1].className, `${jsRsName}__to`);

    wrapH = await handle.createDomBase('double');
    expect(wrapH).toBeFalsy();
    await delElem(wrap);
    handle = await new Handle(wrap, rsName);
    wrapH = await handle.createDomBase('single');
    expect(wrapH).toBeDefined();

    if (typeof wrapH != 'boolean')
      child = wrapH.children;

    searchStr(child[0].className, `${jsRsName}__from`);
    expect(child[1]).toBeUndefined();
    wrapH = handle.createDomBase('single');
    expect(wrapH).toBeFalsy();
  });

  // setFrom & setTo
  test(' Check if dots got their positioning proprties ', async () => {
    const { from, to } = await createFromTo();
    let leftF: string;
    if (typeof from != 'boolean')
      leftF = from.left;
    let leftT: string;
    if (typeof to != 'boolean')
      leftT = to.left;
    expect(leftF).toBe('34%');
    expect(leftT).toBe('56%');
  });

  // setOrientation
  test(' Check if orientation is changed ', async () => {
    await createFromTo();
    let fl = handle.setOrientation('vertical');
    expect(fl).toBeTruthy();
    fl = handle.setOrientation('horizontal');
    expect(fl).toBeTruthy();
  });

  // setActions
  test(' Check if an event of dots' +
    ' movement along the track is triggered ', async () => {
      let wrapC: HTMLElement;
      let domC: HTMLInputElement;
      wrapC = document.createElement('div');
      domC = document.createElement('input');
      wrapC.appendChild(domC);

      await createFromTo();
      handle.setOrientation('horizontal');
      const fl = handle.setActions('double');
      expect(fl).toBeTruthy();

      const model = new Model({
        type: 'double',
        onStart: async () => {
          const spy = await jest.spyOn(model, 'calcDotPosition');

          const eventDot = async (name: string, val1: number, val2: number) => {
            const dot =
              await wrapC.getElementsByClassName(jsRsName + '__' + name);
            const type = name == 'from' ? 'From' : 'To';
            const funP = await mockPointerEvent(dot[0]);
            const funK = await mockKeyboardEvent(dot[0]);
            await funP('pointerdown', val1, 0);
            await funP('pointermove', val2, 0);
            await funP('pointerup', 0, 0);
            await funK('ArrowRight');
            await funK('ArrowLeft');

            expect(spy).toBeCalledWith(
              {
                "clientXY": val2,
                "position": 0,
                "shiftXY": val1,
                "type": type,
                "wrapWH": 0
              }
            );
            expect(spy).toBeCalledTimes(1);
            await spy.mockClear();
          };

          await eventDot('from', 85, 82);
          await eventDot('to', 87, 83);
        }
      });
      const view = await new View(domC);
      await new Controller(model, view);
    });
});