import Resize from '../Resize';

type Options = {
  width: number;
  height: number;
  padding?: number;
  x?: number;
  y?: number;
};

describe('------- Test Resize API -------', () => {
  function mockElementDimensions(element: HTMLElement) {
    return (options: Options): HTMLElement => {
      const {
        width,
        height,
        padding = 0,
        x = 0,
        y = 0,
      } = options;
      const mockElement = element;
      mockElement.style.width = `${width}px`;
      mockElement.style.height = `${height}px`;
      mockElement.getBoundingClientRect = jest.fn(() => {
        const rect = {
          x,
          y,
          left: x,
          top: y,
          width,
          height,
          right: x + width,
          bottom: y + height,
        };
        return { ...rect, toJSON: () => rect };
      });
      Object.defineProperties(mockElement, {
        clientWidth: { value: width + 2 * padding },
        clientHeight: { value: height + 2 * padding },
        offsetWidth: { value: width + 2 * padding },
        offsetHeight: { value: height + 2 * padding },
        width: { value: width + 2 * padding },
        height: { value: height + 2 * padding },
      });
      return mockElement;
    };
  }

  function mockCustomEvent(
    element: Window,
    { eventType }: { eventType: string },
  ): void {
    element.dispatchEvent(new CustomEvent(
      eventType,
      { bubbles: true },
    ));
  }

  // Resize
  test(' Should call a callback on window resizing after the defined timeout ', () => {
    let change = false;
    const wrapperOne = document.createElement('div');
    mockElementDimensions(wrapperOne)({
      width: 300,
      height: 100,
    });

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    const resize = new Resize(wrapperOne, 100, () => {
      change = true;
    });

    const wrapperTwo = document.createElement('div');
    mockElementDimensions(wrapperTwo)({
      width: 250,
      height: 100,
    });
    resize.wrapper = wrapperTwo;

    mockCustomEvent(window, { eventType: 'resize' });
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    expect(change).toBeTruthy();
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });
});
