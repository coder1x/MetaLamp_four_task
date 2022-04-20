import Hints from '../Hints';

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
    return new RegExp(str, 'g').test(text);
  }

  const checkDom = async (name: string) => {
    expect(searchStr(
      (await wrap.firstChild as HTMLElement).className,
      `${jsRsName}__tip-${name}`,
    )).toBeTruthy();
  };

  const checkStyle = async (value: string) => {
    expect((await wrap.firstChild as HTMLElement).style.left).toBe(value);
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
    expect(await hints.createTipMinMax()).toBeTruthy();
    const tips = await wrap.children;

    let classNameF = searchStr(tips[0].className, `${jsRsName}__tip-min`);
    expect(classNameF).toBeTruthy();
    classNameF = searchStr(tips[1].className, `${jsRsName}__tip-max`);
    expect(classNameF).toBeTruthy();
    expect(hints.createTipMinMax()).toBeFalsy();
  });

  // createTipFrom
  test(' Create From hint DOM-element ', async () => {
    expect(await hints.createTipFrom()).toBeTruthy();
    checkDom('from');
    expect(hints.createTipFrom()).toBeFalsy();
  });

  // createTipTo
  test(' Create To hint DOM-element ', async () => {
    expect(await hints.createTipTo()).toBeTruthy();
    checkDom('to');
    expect(hints.createTipTo()).toBeFalsy();
  });

  // createTipSingle
  test(' Create Single hint DOM-element ', async () => {
    expect(await hints.createTipSingle()).toBeTruthy();
    checkDom('single');
    expect(hints.createTipSingle()).toBeFalsy();
  });

  //  deleteTipMinMax
  test(' Delete Min and Max hints DOM-elements ', async () => {
    let flag = await hints.createTipMinMax();
    expect(flag).toBeTruthy();
    flag = await hints.deleteTipMinMax();
    expect(flag).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipMinMax()).toBeFalsy();
  });

  // deleteTipFrom
  test(' Delete From hint DOM-element ', async () => {
    let flag = await hints.createTipFrom();
    expect(flag).toBeTruthy();
    flag = await hints.deleteTipFrom();
    expect(flag).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipFrom()).toBeFalsy();
  });

  //  deleteTipTo
  test(' Delete To hint DOM-element ', async () => {
    let flag = await hints.createTipTo();
    expect(flag).toBeTruthy();
    flag = await hints.deleteTipTo();
    expect(flag).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipTo()).toBeFalsy();
  });

  //  deleteTipSingle
  test(' Delete Single hint DOM-element ', async () => {
    let flag = await hints.createTipSingle();
    expect(flag).toBeTruthy();
    flag = await hints.deleteTipSingle();
    expect(flag).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipSingle()).toBeFalsy();
  });

  //  checkTipTo
  test(' Check if both From and TO hints are displayed ', async () => {
    let flag = await hints.checkTipTo();
    expect(flag).toBeTruthy();
    await hints.setTipFlag(true, false);
    flag = await hints.checkTipTo();
    expect(flag).toBeFalsy();
    await hints.createTipTo();
    expect(hints.checkTipTo()).toBeTruthy();
  });

  //  setPositionFrom
  test(' Set From hint position ', async () => {
    await hints.createTipFrom();
    expect(await hints.setPositionFrom(34)).toBeTruthy();
    checkStyle('34%');
  });

  // setPositionTo
  test(' Set To hint position ', async () => {
    await hints.createTipTo();
    expect(await hints.setPositionTo(34)).toBeTruthy();
    checkStyle('34%');
  });

  // setPositionSingle
  test(' Set Single hint position ', async () => {
    await hints.createTipSingle();
    expect(await hints.setPositionSingle(34)).toBeTruthy();
    checkStyle('34%');
  });

  // setOrientation
  test(' Set hints orientation ', async () => {
    let flag = await hints.createTipFrom();
    expect(flag).toBeTruthy();
    flag = await hints.createTipTo();
    expect(flag).toBeTruthy();
    flag = await hints.createTipSingle();
    expect(flag).toBeTruthy();

    await hints.setPositionFrom(20);
    await hints.setPositionTo(34);
    await hints.setPositionSingle(27);

    flag = await hints.setOrientation('vertical');
    expect(flag).toBeTruthy();

    expect((await wrap.children[0] as HTMLElement).style.bottom).toBe('20%');
    expect((await wrap.children[1] as HTMLElement).style.bottom).toBe('34%');
    expect((await wrap.children[2] as HTMLElement).style.bottom).toBe('27%');
  });
});
