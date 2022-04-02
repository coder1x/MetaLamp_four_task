function mockPointerEvent(element: Element) {
  return function (eventType: string, clientX: number, clientY: number) {
    const conf = { bubbles: true, clientX, clientY, };
    const pointerEvent = new MouseEvent(eventType, conf);
    element.setPointerCapture = jest.fn(element.setPointerCapture);
    element.releasePointerCapture = jest.fn(element.releasePointerCapture);
    element.dispatchEvent(pointerEvent);
  };
}

function mockKeyboardEvent(element: Element) {
  return function (code: string, eventType = 'keydown', repeat = false) {
    const conf = { code, repeat, bubbles: true, };
    const keyboardEvent = new KeyboardEvent(eventType, conf);
    element.setPointerCapture = jest.fn(element.setPointerCapture);
    element.releasePointerCapture = jest.fn(element.releasePointerCapture);
    element.dispatchEvent(keyboardEvent);
  };
}

test('', async () => { });

export { mockPointerEvent, mockKeyboardEvent };