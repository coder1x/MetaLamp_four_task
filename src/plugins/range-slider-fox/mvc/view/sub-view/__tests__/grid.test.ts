import Grid from '../Grid';
import { Controller, Model, View } from '../../../controller/Controller';
import { mockPointerEvent } from '../../../../__tests__/jestUtils';

describe('------- Test Grid API -------', () => {
  let rsName: string;
  let wrap: HTMLElement;
  let grid: Grid;
  let jsRsName: string;

  beforeEach(async () => {
    rsName = 'range-slider-fox';
    jsRsName = `js-${rsName}`;
    wrap = document.createElement('div');
    wrap.classList.add(`${rsName}__bottom`);
    wrap.classList.add(`${jsRsName}__bottom`);
    grid = await new Grid(wrap, rsName);
  });

  const getConf = () => ({
    min: 10,
    max: 800,
    grid: true,
    gridRound: 0,
    gridStep: 0,
    gridNum: 40,
  });

  const getLenMark = async (model: Model) => {
    const gridMark = await model.createMark();
    const elements = await grid.createMark(gridMark) as HTMLElement;
    const { length } = elements.childNodes;
    expect(length).toBe(gridMark.length);
    return length;
  };

  const getLenDom = () => {
    const rsBottom = grid.createDomGrid() as HTMLElement;
    const dom = rsBottom.firstChild as HTMLElement;
    const { length } = dom.childNodes;
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
      ...getConf(),
      onStart: () => {
        getLenMark(model);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // createDomGrid
  test(' Add grid to the plugin interface ', async () => {
    const model = await new Model({
      ...getConf(),
      onStart: async () => {
        const lenMark = await getLenMark(model);
        const lenDom = await getLenDom();
        expect(lenMark).toBe(lenDom);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // deleteGrid
  test(' Delete grid ', async () => {
    const model = await new Model({
      ...getConf(),
      onStart: async () => {
        const lenMark = await getLenMark(model);
        let lenDom = await getLenDom();
        expect(lenMark).toBe(lenDom);
        const del = grid.deleteGrid();
        expect(del).toBeTruthy();
        lenDom = await getLenDom();
        expect(lenDom).toBe(0);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // ClickMark
  test(' Check if click event on the grid mark is triggered ', async () => {
    const wrapper = document.createElement('div');
    const input = document.createElement('input');
    wrapper.appendChild(input);
    let objController: Controller;

    const model = new Model({
      type: 'double',
      ...getConf(),
      onStart: async () => {
        objController.update({ bar: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'clickMark');

        const dot = await wrapper.getElementsByClassName(
          `${jsRsName}__grid-mark`,
        );
        const elem = dot[0] as HTMLElement;
        const pointer = await mockPointerEvent(elem);
        await pointer('click', 0, 0);

        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith(+(elem.innerText));

        await spy.mockClear();
      },
    });
    const view = await new View(input);
    objController = await new Controller(model, view);
  });
});
