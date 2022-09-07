import { RANGE_SLIDER_NAME } from '@shared/constants';

import { mockPointerEvent } from '../../../../tests/jestUtils';
import { Controller, Model, View } from '../../../controller/Controller';
import Grid from '../Grid';

describe('------- Test Grid API -------', () => {
  let wrapper: HTMLElement;
  let grid: Grid;

  beforeEach(() => {
    wrapper = document.createElement('div');
    wrapper.classList.add(`${RANGE_SLIDER_NAME}__bottom`);
    wrapper.classList.add(`js-${RANGE_SLIDER_NAME}__bottom`);
    grid = new Grid(wrapper);
  });

  const getConfig = () => ({
    min: 10,
    max: 800,
    grid: true,
    gridRound: 0,
    gridStep: 0,
    gridNumber: 40,
  });

  const getLengthMark = (model: Model) => {
    const gridMark = model.calcMark();
    const elements = grid.createMark(gridMark) as HTMLElement;
    const { length } = elements.childNodes;
    expect(length).toBe(gridMark.length);
    return length;
  };

  const getLengthDom = () => {
    const domElement = (grid.createDomElementGrid() as HTMLElement).firstChild as HTMLElement;
    const { length } = domElement.childNodes;
    return length;
  };

  // setOrientation
  test(' Change orientation ', () => {
    expect(grid.setOrientation('vertical')).toBeTruthy();
    expect(grid.setOrientation('horizontal')).toBeFalsy();
  });

  // getOrientation
  test(' Get information about orientation change ', () => {
    expect(grid.getOrientation()).toBeTruthy();
  });

  // createMark
  test(' Create grid DOM-elements ', () => {
    const model = new Model({
      ...getConfig(),
      onStart: () => {
        getLengthMark(model);
      },
    });

    if (model.onHandle) {
      model.onHandle();
    }
  });

  // createDomElementGrid
  test(' Add grid to the plugin interface ', () => {
    const model = new Model({
      ...getConfig(),
      onStart: () => {
        expect(getLengthMark(model)).toBe(getLengthDom());
      },
    });

    if (model.onHandle) {
      model.onHandle();
    }
  });

  // deleteGrid
  test(' Delete grid ', () => {
    const model = new Model({
      ...getConfig(),
      onStart: () => {
        const lengthMark = getLengthMark(model);
        let lengthDom = getLengthDom();
        expect(lengthMark).toBe(lengthDom);
        const isDeleted = grid.deleteGrid();
        expect(isDeleted).toBeTruthy();
        lengthDom = getLengthDom();
        expect(lengthDom).toBe(0);
      },
    });

    if (model.onHandle) {
      model.onHandle();
    }
  });

  // ClickMark
  test(' Check if click event on the grid mark is triggered ', () => {
    const parentElement = document.createElement('div');
    const input = document.createElement('input');
    parentElement.appendChild(input);
    let controller: Controller;

    const model = new Model({
      type: 'double',
      ...getConfig(),
      onStart: () => {
        controller.update({ bar: false });
      },
      onUpdate: () => {
        const spy = jest.spyOn(model, 'takeFromOrToOnMarkClick');

        const dot = parentElement.getElementsByClassName(
          `js-${RANGE_SLIDER_NAME}__grid-mark`,
        );
        const element = dot[0] as HTMLElement;
        const pointer = mockPointerEvent(element);
        pointer('click', 0, 0);

        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith(Number(element.innerText));

        spy.mockClear();
      },
    });
    const view = new View(input);
    controller = new Controller(model, view);
  });
});
