import { Hints } from '../../sub-view/hints';

describe('------- Test Hints API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;
  let hints: Hints;
  let jsRsName: string;

  beforeEach(() => {
    rsName = 'range-slider-fox';
    jsRsName = 'js-' + rsName;
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__top');
    wrap.classList.add(jsRsName + '__top');
    hints = new Hints(wrap, rsName);
  });

  function searchStr(text: string, str: string) {
    const regexp = new RegExp(str, 'g');
    return regexp.test(text);
  }

  const checkDom = async (name: string) => {
    const dom = await wrap.firstChild as HTMLElement;
    const fl = searchStr(dom.className, jsRsName + '__tip-' + name);
    expect(fl).toBeTruthy();
  };

  const checkStyle = async (val: string) => {
    const dom = await wrap.firstChild as HTMLElement;
    expect(dom.style.left).toBe(val);
  };

  test(' setTipFlag ', async () => {
    const { tipFromTo, tipMinMax } = hints.setTipFlag(true, true);
    expect(tipFromTo).toBeTruthy();
    expect(tipMinMax).toBeTruthy();
  });

  test(' setAdditionalText ', async () => {
    const { tipPrefix, tipPostfix } =
      hints.setAdditionalText('%', '$');
    expect(tipPrefix).toBe('%');
    expect(tipPostfix).toBe('$');
  });


  test(' createTipMinMax ', async () => {
    const fl = await hints.createTipMinMax();
    expect(fl).toBeTruthy();
    const tips = await wrap.children;

    let classNameF = searchStr(tips[0].className,
      jsRsName + '__tip-min');
    expect(classNameF).toBeTruthy();
    classNameF = searchStr(tips[1].className,
      jsRsName + '__tip-max');
    expect(classNameF).toBeTruthy();
    expect(hints.createTipMinMax()).toBeFalsy();
  });

  test(' createTipFrom ', async () => {
    const fl = await hints.createTipFrom();
    expect(fl).toBeTruthy();
    checkDom('from');
    expect(hints.createTipFrom()).toBeFalsy();
  });

  test(' createTipTo ', async () => {
    const fl = await hints.createTipTo();
    expect(fl).toBeTruthy();
    checkDom('to');
    expect(hints.createTipTo()).toBeFalsy();
  });

  test(' createTipSingle ', async () => {
    const fl = await hints.createTipSingle();
    expect(fl).toBeTruthy();
    checkDom('single');
    expect(hints.createTipSingle()).toBeFalsy();
  });


  test(' deleteTipMinMax ', async () => {
    let fl = await hints.createTipMinMax();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipMinMax();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipMinMax()).toBeFalsy();
  });

  test(' deleteTipFrom ', async () => {
    let fl = await hints.createTipFrom();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipFrom();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipFrom()).toBeFalsy();
  });


  test(' deleteTipTo ', async () => {
    let fl = await hints.createTipTo();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipTo();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipTo()).toBeFalsy();
  });


  test(' deleteTipSingle ', async () => {
    let fl = await hints.createTipSingle();
    expect(fl).toBeTruthy();
    fl = await hints.deleteTipSingle();
    expect(fl).toBeTruthy();
    expect(wrap.children).toHaveLength(0);
    expect(hints.deleteTipSingle()).toBeFalsy();
  });


  test(' checkTipTo ', async () => {
    let fl = await hints.checkTipTo();
    expect(fl).toBeTruthy();
    await hints.setTipFlag(true, false);
    fl = await hints.checkTipTo();
    expect(fl).toBeFalsy();
    await hints.createTipTo();
    expect(hints.checkTipTo()).toBeTruthy();
  });


  test(' setPositionFrom ', async () => {
    await hints.createTipFrom();
    let fl = await hints.setPositionFrom(34);
    expect(fl).toBeTruthy();
    checkStyle('34%');
  });

  test(' setPositionTo ', async () => {
    await hints.createTipTo();
    let fl = await hints.setPositionTo(34);
    expect(fl).toBeTruthy();
    checkStyle('34%');
  });

  test(' setPositionSingle ', async () => {
    await hints.createTipSingle();
    let fl = await hints.setPositionSingle(34);
    expect(fl).toBeTruthy();
    checkStyle('34%');
  });


  test(' setOrientation ', async () => {
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