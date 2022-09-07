import { RANGE_SLIDER_NAME } from '@shared/constants';

import Hints from '../Hints';

describe('------- Test Hints API -------', () => {
  let wrapper: HTMLElement;
  let hints: Hints;

  beforeEach(() => {
    wrapper = document.createElement('div');
    wrapper.classList.add(`${RANGE_SLIDER_NAME}__top`);
    wrapper.classList.add(`js-${RANGE_SLIDER_NAME}__top`);
    hints = new Hints(wrapper);
  });

  function searchString(text: string, substring: string) {
    return new RegExp(substring, 'g').test(text);
  }

  const checkDomElement = (name: string) => {
    expect(searchString(
      (wrapper.firstChild as HTMLElement).className,
      `js-${RANGE_SLIDER_NAME}__tip-${name}`,
    )).toBeTruthy();
  };

  const checkStyle = (value: string) => {
    expect((wrapper.firstChild as HTMLElement).style.left).toBe(value);
  };

  // setTipFlag
  test(' Check toggles for hints are working ', () => {
    const { tipFromTo, tipMinMax } = hints.setTipVisible(true, true);
    expect(tipFromTo).toBeTruthy();
    expect(tipMinMax).toBeTruthy();
  });

  // setAdditionalText
  test(' Check postfix and prefix for hints are working ', () => {
    const { tipPrefix, tipPostfix } = hints.setAdditionalText('%', '$');
    expect(tipPrefix).toBe('%');
    expect(tipPostfix).toBe('$');
  });

  // createTipMinMax
  test(' Create Min and Max hints DOM-elements ', () => {
    expect(hints.createTipMinMax()).toBeTruthy();
    const tips = wrapper.children;

    let isValid = searchString(tips[0].className, `js-${RANGE_SLIDER_NAME}__tip-min`);
    expect(isValid).toBeTruthy();
    isValid = searchString(tips[1].className, `js-${RANGE_SLIDER_NAME}__tip-max`);
    expect(isValid).toBeTruthy();
    expect(hints.createTipMinMax()).toBeFalsy();
  });

  // createTipFrom
  test(' Create From hint DOM-element ', () => {
    expect(hints.createTipFrom()).toBeTruthy();
    checkDomElement('from');
    expect(hints.createTipFrom()).toBeFalsy();
  });

  // createTipTo
  test(' Create To hint DOM-element ', () => {
    expect(hints.createTipTo()).toBeTruthy();
    checkDomElement('to');
    expect(hints.createTipTo()).toBeFalsy();
  });

  // createTipSingle
  test(' Create Single hint DOM-element ', () => {
    expect(hints.createTipSingle()).toBeTruthy();
    checkDomElement('single');
    expect(hints.createTipSingle()).toBeFalsy();
  });

  //  deleteTipMinMax
  test(' Delete Min and Max hints DOM-elements ', () => {
    let isMinMax = hints.createTipMinMax();
    expect(isMinMax).toBeTruthy();
    isMinMax = hints.deleteTipMinMax();
    expect(isMinMax).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipMinMax()).toBeFalsy();
  });

  // deleteTipFrom
  test(' Delete From hint DOM-element ', () => {
    let isFrom = hints.createTipFrom();
    expect(isFrom).toBeTruthy();
    isFrom = hints.deleteTipFrom();
    expect(isFrom).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipFrom()).toBeFalsy();
  });

  //  deleteTipTo
  test(' Delete To hint DOM-element ', () => {
    let isTo = hints.createTipTo();
    expect(isTo).toBeTruthy();
    isTo = hints.deleteTipTo();
    expect(isTo).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipTo()).toBeFalsy();
  });

  //  deleteTipSingle
  test(' Delete Single hint DOM-element ', () => {
    let isSingle = hints.createTipSingle();
    expect(isSingle).toBeTruthy();
    isSingle = hints.deleteTipSingle();
    expect(isSingle).toBeTruthy();
    expect(wrapper.children).toHaveLength(0);
    expect(hints.deleteTipSingle()).toBeFalsy();
  });

  //  checkTipTo
  test(' Check if both From and TO hints are displayed ', () => {
    let isCheckTipTo = hints.checkTipTo();
    expect(isCheckTipTo).toBeTruthy();
    hints.setTipVisible(true, false);
    isCheckTipTo = hints.checkTipTo();
    expect(isCheckTipTo).toBeFalsy();
    hints.createTipTo();
    expect(hints.checkTipTo()).toBeTruthy();
  });

  //  setPositionFrom
  test(' Set From hint position ', () => {
    hints.createTipFrom();
    expect(hints.setPositionFrom(34)).toBeTruthy();
    checkStyle('34%');
  });

  // setPositionTo
  test(' Set To hint position ', () => {
    hints.createTipTo();
    expect(hints.setPositionTo(34)).toBeTruthy();
    checkStyle('34%');
  });

  // setPositionSingle
  test(' Set Single hint position ', () => {
    hints.createTipSingle();
    expect(hints.setPositionSingle(34)).toBeTruthy();
    checkStyle('34%');
  });

  // setOrientation
  test(' Set hints orientation ', () => {
    let isCreateFrom = hints.createTipFrom();
    expect(isCreateFrom).toBeTruthy();
    isCreateFrom = hints.createTipTo();
    expect(isCreateFrom).toBeTruthy();
    isCreateFrom = hints.createTipSingle();
    expect(isCreateFrom).toBeTruthy();

    hints.setPositionFrom(20);
    hints.setPositionTo(34);
    hints.setPositionSingle(27);

    isCreateFrom = hints.setOrientation('vertical');
    expect(isCreateFrom).toBeTruthy();

    expect((wrapper.children[0] as HTMLElement).style.bottom).toBe('20%');
    expect((wrapper.children[1] as HTMLElement).style.bottom).toBe('34%');
    expect((wrapper.children[2] as HTMLElement).style.bottom).toBe('27%');
  });
});
