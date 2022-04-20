function mockPointerEvent(element: Element) {
  return function mockPointer(
    eventType: string,
    clientX: number,
    clientY: number,
  ) {
    const dom = element;
    dom.setPointerCapture = jest.fn(dom.setPointerCapture);
    dom.releasePointerCapture = jest.fn(dom.releasePointerCapture);
    dom.dispatchEvent(
      new MouseEvent(eventType, { bubbles: true, clientX, clientY }),
    );
  };
}

function mockKeyboardEvent(element: Element) {
  return function mockKeyboard(
    code: string,
    eventType = 'keydown',
    repeat = false,
  ) {
    const dom = element;
    dom.setPointerCapture = jest.fn(dom.setPointerCapture);
    dom.releasePointerCapture = jest.fn(dom.releasePointerCapture);
    dom.dispatchEvent(
      new KeyboardEvent(eventType, { code, repeat, bubbles: true }),
    );
  };
}

test('', async () => { });

export { mockPointerEvent, mockKeyboardEvent };
