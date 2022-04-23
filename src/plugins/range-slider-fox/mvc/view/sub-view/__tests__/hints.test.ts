import Hints from '../Hints';

describe('------- Test Hints API -------', () => {
  let rangeSliderName: string;
  let wrapper: HTMLElement;
  let hints: Hints;
  let jsRangeSliderName: string;

  beforeEach(() => {
    rangeSliderName = 'range-slider-fox';
    jsRangeSliderName = `js-${rangeSliderName}`;
    wrapper = document.createElement('div');
    wrapper.classList.add(`${rangeSliderName}__top`);
    wrapper.classList.add(`${jsRangeSliderName}__top`);
    hints = new Hints(wrapper, rangeSliderName);
  });

  function searchString(text: string, string: string) {
    return new RegExp(string, 'g').test(text);
  }

  const checkDomElement = async (name: string) => {
    expect(searchString(
      (await wrapper.firstChild as HTMLElement).className,
      `${jsRangeSliderName}__tip-${name}`,
    )).toBeTruthy();
  };

  const checkStyle = async (value: string) => {
    expect((await wrapper.firstChild as HTMLElement).style.left).toBe(value);
  };

  // setTipFlag
  test(' Check toggles for hints are working ', async () => {
    const { tipFromTo, tipMinMax } = hints.setTipVisible(true, true);
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
    const tips = await wrapper.children;

    let isValid = searchString(tips[0].className, `${jsRangeSliderName}__tip-min`);
    expect(isValid).toBeTruthy();
    isValid = searchString(tips[1].className, `${jsRangeSliderName}__tip-max`);
    expect(isValid).toBeTruthy();
    expect(hints.createTipMinMax()).toBeFalsy();
  });

  // createTipFrom
  test(' Create From hint DOM-element ', async () => {
    expect(await hints.createTipFrom()).toBeTruthy();
    checkDomElement('from');
    expect(hints.createTipFrom()).toBeFalsy();
  });

  // createTipTo
  test(' Create To hint DOM-element ', async () => {
    expect(await hints.createTipTo()).toBeTruthy();
    checkDomElement('to');
    expect(hints.createTipTo()).toBeFalsy();
  });

  // createTipSingle
  test(' Create Single hint DOM-element ', async () => {
    expect(await hints.createTipSingle()).toBeTruthy();
    checkDomElement('single');
    expect(hints.createTipSingle()).toBeFalsy();
  });

  //  deleteTipMinMax
  test(' Delete Min and Max hints DOM-elements ', async () => {
    let isMinMax = await hints.createTipMinMax();
    expect(isMinMax).toBeTruthy();
    isMinMax = await hints.deleteTipMinMax();
    expect(isMinMax).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipMinMax()).toBeFalsy();
  });

  // deleteTipFrom
  test(' Delete From hint DOM-element ', async () => {
    let isFrom = await hints.createTipFrom();
    expect(isFrom).toBeTruthy();
    isFrom = await hints.deleteTipFrom();
    expect(isFrom).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipFrom()).toBeFalsy();
  });

  //  deleteTipTo
  test(' Delete To hint DOM-element ', async () => {
    let isTo = await hints.createTipTo();
    expect(isTo).toBeTruthy();
    isTo = await hints.deleteTipTo();
    expect(isTo).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipTo()).toBeFalsy();
  });

  //  deleteTipSingle
  test(' Delete Single hint DOM-element ', async () => {
    let isSingle = await hints.createTipSingle();
    expect(isSingle).toBeTruthy();
    isSingle = await hints.deleteTipSingle();
    expect(isSingle).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipSingle()).toBeFalsy();
  });

  //  checkTipTo
  test(' Check if both From and TO hints are displayed ', async () => {
    let isCheckTipTo = await hints.checkTipTo();
    expect(isCheckTipTo).toBeTruthy();
    await hints.setTipVisible(true, false);
    isCheckTipTo = await hints.checkTipTo();
    expect(isCheckTipTo).toBeFalsy();
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
    let isCreateFrom = await hints.createTipFrom();
    expect(isCreateFrom).toBeTruthy();
    isCreateFrom = await hints.createTipTo();
    expect(isCreateFrom).toBeTruthy();
    isCreateFrom = await hints.createTipSingle();
    expect(isCreateFrom).toBeTruthy();

    await hints.setPositionFrom(20);
    await hints.setPositionTo(34);
    await hints.setPositionSingle(27);

    isCreateFrom = await hints.setOrientation('vertical');
    expect(isCreateFrom).toBeTruthy();

    expect((await wrapper.children[0] as HTMLElement).style.bottom).toBe('20%');
    expect((await wrapper.children[1] as HTMLElement).style.bottom).toBe('34%');
    expect((await wrapper.children[2] as HTMLElement).style.bottom).toBe('27%');
  });
});
