import { Hints } from '../../sub-view/hints';

describe('------- Test Hints API -------', () => {
  let rsName: string;
  let wrap: HTMLElement;
  let hints: Hints;
  let jsRsName: string;

  beforeEach(() => {
    rsName = 'range-slider-fox';
    jsRsName = `js-${rsName}`;
    wrap = document.createElement('div');
    wrap.classList.add(`${rsName}__top`);
    wrap.classList.add(`${jsRsName}__top`);
    hints = new Hints(wrap, rsName);
  });

  function searchStr(text: string, str: string) {
    const regexp = new RegExp(str, 'g');
    return regexp.test(text);
  }

  const checkDom = async (name: string) => {
    const dom = await wrap.firstChild as HTMLElement;
    const fl = searchStr(dom.className, `${jsRsName}__tip-${name}`);
    expect(fl).toBeTruthy();
  };

  const checkStyle = async (val: string) => {
    const dom = await wrap.firstChild as HTMLElement;
    expect(dom.style.left).toBe(val);
  };

  // setTipFlag
  test(' Check toggles for hints are working ', async () => {
    const { tipFromTo, tipMinMax } = hints.setTipFlag(true, true);
    expect(tipFromTo).toBeTruthy();
    expect(tipMinMax).toBeTruthy();
  });

  // setAdditionalText
  test(' Check postfix and prefix for hints are working ', async () => {
    const { tipPrefix, tipPostfix } = hints.setAdditionalText('%', '$');
    expect(tipPrefix).toBe('%');
    expect(tipPostfix).toBe('$');
  });

  // createTipMinMax
  test(' Create Min and Max hints DOM-elements ', async () => {
    const fl = await hints.createTipMinMax();
    expect(fl).toBeTruthy();
    const tips = await wrap.children;

    let classNameF = searchStr(tips[0].className, `${jsRsName}__tip-min`);
    expect(classNameF).toBeTruthy();
    classNameF = searchStr(tips[1].className, `${jsRsName}__tip-max`);
    expect(classNameF).toBeTruthy();
    expect(hints.createTipMinMax()).toBeFalsy();
  });

  // createTipFrom
  test(' Create From hint DOM-element ', async () => {
    const fl = await hints.createTipFrom();
    expect(fl).toBeTruthy();
    checkDom('from');
    expect(hints.createTipFrom()).toBeFalsy();
  });

  // createTipTo
  test(' Create To hint DOM-element ', async () => {
    const fl = await hints.createTipTo();
    expect(fl).toBeTruthy();
    checkDom('to');
    expect(hints.createTipTo()).toBeFalsy();
  });

  // createTipSingle
  test(' Create Single hint DOM-element ', async () => {
    const fl = await hints.createTipSingle();
    expect(fl).toBeTruthy();
    checkDom('single');
    expect(hints.createTipSingle()).toBeFalsy();
  });

  //  deleteTipMinMax 
  test(' Delete Min and Max hints DOM-elements ', async () => {
    let fl = await hints.createTipMinMax();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipMinMax();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipMinMax()).toBeFalsy();
  });

  // deleteTipFrom 
  test(' Delete From hint DOM-element ', async () => {
    let fl = await hints.createTipFrom();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipFrom();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipFrom()).toBeFalsy();
  });

  //  deleteTipTo 
  test(' Delete To hint DOM-element ', async () => {
    let fl = await hints.createTipTo();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipTo();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipTo()).toBeFalsy();
  });

  //  deleteTipSingle 
  test(' Delete Single hint DOM-element ', async () => {
    let fl = await hints.createTipSingle();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipSingle();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipSingle()).toBeFalsy();
  });

  //  checkTipTo 
  test(' Check if both From and TO hints are displayed ', async () => {
    let fl = await hints.checkTipTo();
    expect(fl).toBeTruthy();
    await hints.setTipFlag(true, false);
    fl = await hints.checkTipTo();
    expect(fl).toBeFalsy();
    await hints.createTipTo();
    expect(hints.checkTipTo()).toBeTruthy();
  });

  //  setPositionFrom
  test(' Set From hint position ', async () => {
    await hints.createTipFrom();
    const fl = await hints.setPositionFrom(34);
    expect(fl).toBeTruthy();
    checkStyle('34%');
  });

  // setPositionTo
  test(' Set To hint position ', async () => {
    await hints.createTipTo();
    const fl = await hints.setPositionTo(34);
    expect(fl).toBeTruthy();
    checkStyle('34%');
  });

  // setPositionSingle
  test(' Set Single hint position ', async () => {
    await hints.createTipSingle();
    const fl = await hints.setPositionSingle(34);
    expect(fl).toBeTruthy();
    checkStyle('34%');
  });

  // setOrientation
  test(' Set hints orientation ', async () => {
    let fl = await hints.createTipFrom();
    expect(fl).toBeTruthy();
    fl = await hints.createTipTo();
    expect(fl).toBeTruthy();
    fl = await hints.createTipSingle();
    expect(fl).toBeTruthy();

    await hints.setPositionFrom(20);
    await hints.setPositionTo(34);
    await hints.setPositionSingle(27);

    fl = await hints.setOrientation('vertical');
    expect(fl).toBeTruthy();

    const from = await wrap.children[0] as HTMLElement;
    expect(from.style.bottom).toBe('20%');

    const to = await wrap.children[1] as HTMLElement;
    expect(to.style.bottom).toBe('34%');

    const single = await wrap.children[2] as HTMLElement;
    expect(single.style.bottom).toBe('27%');
  });
});