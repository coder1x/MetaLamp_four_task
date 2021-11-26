import { Handle } from '../handle';
import { Controller, Model, View } from '../../../controller/controller';


describe('------- Test Handle API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;
  let handle: Handle;

  let wrapC: HTMLElement;
  let domC: HTMLInputElement;
  wrapC = document.createElement('div');
  domC = document.createElement('input');
  wrapC.appendChild(domC);


  function mockPointerEvent(element: HTMLElement) {
    return function (eventType: string, clientX: number, clientY: number) {
      const conf = {
        bubbles: true,
        clientX,
        clientY,
      };
      const pointerEvent = new MouseEvent(eventType, conf);
      element.setPointerCapture = jest.fn(element.setPointerCapture);
      element.releasePointerCapture = jest.fn(element.releasePointerCapture);
      element.dispatchEvent(pointerEvent);
    };
  }


  function mockKeyboardEvent(element: HTMLElement) {
    return function (key: string, eventType = 'keydown', repeat = false) {
      const conf = {
        code: key,
        repeat: repeat,
        bubbles: true,
      };
      const keyboardEvent = new KeyboardEvent(eventType, conf);
      element.setPointerCapture = jest.fn(element.setPointerCapture);
      element.releasePointerCapture = jest.fn(element.releasePointerCapture);
      element.dispatchEvent(keyboardEvent);
    };
  }


  beforeEach(async () => {
    rsName = 'range-slider-fox';
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__center');
    handle = await new Handle(wrap, rsName);
  });

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


  test(' createDomBase ', async () => {
    let wrapH = handle.createDomBase('double');
    expect(wrapH).toBeDefined();
    let child = (wrapH as HTMLElement).children;
    expect(child[0].className).toBe(rsName + '__from');
    expect(child[1].className).toBe(rsName + '__to');
    wrapH = await handle.createDomBase('double');
    expect(wrapH).toBeFalsy();
    await delElem(wrap);
    handle = await new Handle(wrap, rsName);
    wrapH = await handle.createDomBase('single');
    expect(wrapH).toBeDefined();
    child = (wrapH as HTMLElement).children;
    expect(child[0].className).toBe(rsName + '__from');
    expect(child[1]).toBeUndefined();
    wrapH = handle.createDomBase('single');
    expect(wrapH).toBeFalsy();
  });


  test(' setFrom & setTo ', async () => {
    const { from, to } = await createFromTo();
    const leftF = (from as CSSStyleDeclaration).left;
    const leftT = (to as CSSStyleDeclaration).left;
    expect(leftF).toBe('34%');
    expect(leftT).toBe('56%');
  });



  test(' setOrientation ', async () => {
    await createFromTo();
    let fl = handle.setOrientation('vertical');
    expect(fl).toBeTruthy();
    fl = handle.setOrientation('horizontal');
    expect(fl).toBeTruthy();
  });


  test(' setActions ', async () => {
    await createFromTo();
    handle.setOrientation('horizontal');
    const fl = handle.setActions('double');
    expect(fl).toBeTruthy();

    const model = new Model({
      type: 'double',
      onStart: async () => {

        const spy = await jest.spyOn(model, 'calcDotPosition');

        const eventDot = async (name: string, val1: number, val2: number) => {
          const dot = await wrapC.getElementsByClassName(rsName + '__' + name);
          let elem = dot[0] as HTMLElement;
          const type = name == 'from' ? 'From' : 'To';
          await mockPointerEvent(elem)('pointerdown', val1, 0);
          await mockPointerEvent(elem)('pointermove', val2, 0);
          await mockPointerEvent(elem)('pointerup', 0, 0);
          await mockKeyboardEvent(elem)('ArrowRight');
          await mockKeyboardEvent(elem)('ArrowLeft');

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
    const view = await new View(domC, 1);
    await new Controller(model, view);


  });



});