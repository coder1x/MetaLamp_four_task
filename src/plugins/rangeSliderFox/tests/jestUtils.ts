function mockPointerEvent(element: Element) {
  return function mockPointer(
    eventType: string,
    clientX: number,
    clientY: number,
  ) {
    const domElement = element;
    domElement.setPointerCapture = jest.fn(domElement.setPointerCapture);
    domElement.releasePointerCapture = jest.fn(domElement.releasePointerCapture);
    domElement.dispatchEvent(
      new MouseEvent(eventType, { bubbles: true, clientX, clientY }),
    );
  };
}

function mockKeyboardEvent(element: Element) {
  return function mockKeyboard(
    code: string,
    eventType = 'keydown',
    isRepeat = false,
  ) {
    const domElement = element;
    domElement.setPointerCapture = jest.fn(domElement.setPointerCapture);
    domElement.releasePointerCapture = jest.fn(domElement.releasePointerCapture);
    domElement.dispatchEvent(
      new KeyboardEvent(eventType, { code, repeat: isRepeat, bubbles: true }),
    );
  };
}

test('', () => { });

export { mockPointerEvent, mockKeyboardEvent };
