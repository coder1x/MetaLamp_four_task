function mockPointerEvent(element: Element) {
  return function mockPointer(
    eventType: string,
    clientX: number,
    clientY: number,
  ) {
    const conf = { bubbles: true, clientX, clientY };
    const pointerEvent = new MouseEvent(eventType, conf);
    const dom = element;
    dom.setPointerCapture = jest.fn(dom.setPointerCapture);
    dom.releasePointerCapture = jest.fn(dom.releasePointerCapture);
    dom.dispatchEvent(pointerEvent);
  };
}

function mockKeyboardEvent(element: Element) {
  return function mockKeyboard(
    code: string,
    eventType = 'keydown',
    repeat = false,
  ) {
    const conf = { code, repeat, bubbles: true };
    const keyboardEvent = new KeyboardEvent(eventType, conf);
    const dom = element;
    dom.setPointerCapture = jest.fn(dom.setPointerCapture);
    dom.releasePointerCapture = jest.fn(dom.releasePointerCapture);
    dom.dispatchEvent(keyboardEvent);
  };
}

test('', async () => { });

export { mockPointerEvent, mockKeyboardEvent };
