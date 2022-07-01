import { RANGE_SLIDER_NAME } from '@shared/constants';

import { mockPointerEvent } from '../../../../tests/jestUtils';
import { Controller, Model, View } from '../../../controller/Controller';
import Grid from '../Grid';

describe('------- Test Grid API -------', () => {
  let wrapper: HTMLElement;
  let grid: Grid;

  beforeEach(async () => {
    wrapper = document.createElement('div');
    wrapper.classList.add(`${RANGE_SLIDER_NAME}__bottom`);
    wrapper.classList.add(`js-${RANGE_SLIDER_NAME}__bottom`);
    grid = await new Grid(wrapper);
  });

  const getConfig = () => ({
    min: 10,
    max: 800,
    grid: true,
    gridRound: 0,
    gridStep: 0,
    gridNumber: 40,
  });

  const getLengthMark = async (model: Model) => {
    const gridMark = await model.calcMark();
    const elements = await grid.createMark(gridMark) as HTMLElement;
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
  test(' Change orientation ', async () => {
    expect(grid.setOrientation('vertical')).toBeTruthy();
    expect(grid.setOrientation('horizontal')).toBeFalsy();
  });

  // getOrientation
  test(' Get information about orientation change ', async () => {
    expect(grid.getOrientation()).toBeTruthy();
  });

  // createMark
  test(' Create grid DOM-elements ', async () => {
    const model = await new Model({
      ...getConfig(),
      onStart: () => {
        getLengthMark(model);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // createDomElementGrid
  test(' Add grid to the plugin interface ', async () => {
    const model = await new Model({
      ...getConfig(),
      onStart: async () => {
        expect(await getLengthMark(model)).toBe(await getLengthDom());
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // deleteGrid
  test(' Delete grid ', async () => {
    const model = await new Model({
      ...getConfig(),
      onStart: async () => {
        const lengthMark = await getLengthMark(model);
        let lengthDom = await getLengthDom();
        expect(lengthMark).toBe(lengthDom);
        const isDeleted = grid.deleteGrid();
        expect(isDeleted).toBeTruthy();
        lengthDom = await getLengthDom();
        expect(lengthDom).toBe(0);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // ClickMark
  test(' Check if click event on the grid mark is triggered ', async () => {
    const parentElement = document.createElement('div');
    const input = document.createElement('input');
    parentElement.appendChild(input);
    let controller: Controller;

    const model = new Model({
      type: 'double',
      ...getConfig(),
      onStart: async () => {
        controller.update({ bar: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'takeFromOrToOnMarkClick');

        const dot = await parentElement.getElementsByClassName(
          `js-${RANGE_SLIDER_NAME}__grid-mark`,
        );
        const element = dot[0] as HTMLElement;
        const pointer = await mockPointerEvent(element);
        await pointer('click', 0, 0);

        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith(Number(element.innerText));

        await spy.mockClear();
      },
    });
    const view = await new View(input);
    controller = await new Controller(model, view);
  });
});
