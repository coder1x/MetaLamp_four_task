import { Handle } from '../handle';

describe('------- Test Handle API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;
  let handle: Handle;

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
    const fl = handle.setActions('double');
    expect(fl).toBeTruthy();
  });


});