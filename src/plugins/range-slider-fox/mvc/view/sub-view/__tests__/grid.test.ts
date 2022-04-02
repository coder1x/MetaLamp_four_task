import { Grid } from '../grid';
import { Controller, Model, View } from '../../../controller/controller';
import { mockPointerEvent } from '../../../../__tests__/jestUtils';

describe('------- Test Grid API -------', () => {
  let rsName: string;
  let wrap: HTMLElement;
  let grid: Grid;
  let jsRsName: string;

  beforeEach(async () => {
    rsName = 'range-slider-fox';
    jsRsName = 'js-' + rsName;
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__bottom');
    wrap.classList.add(jsRsName + '__bottom');
    grid = await new Grid(wrap, rsName);
  });

  const getConf = () => {
    return {
      min: 10,
      max: 800,
      grid: true,
      gridRound: 0,
      gridStep: 0,
      gridNum: 40,
    };
  };

  const getLenMark = async (model: Model) => {
    const gridM = await model.createMark();
    const elements = await grid.createMark(gridM);
    const len = elements.childNodes.length;
    expect(len).toBe(gridM.length);
    return len;
  };

  const getLenDom = () => {
    const rsBottom = grid.createDomGrid();
    const len = rsBottom.firstChild.childNodes.length;
    return len;
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
      }
    });
    await model.onHandle();
  });

  // createDomGrid
  test(' Add grid to the plugin interface ', async () => {
    const model = await new Model({
      ...getConf(),
      onStart: async () => {
        const len = await getLenMark(model);
        const len2 = await getLenDom();
        expect(len).toBe(len2);
      }
    });
    await model.onHandle();
  });

  // deleteGrid
  test(' Delete grid ', async () => {
    const model = await new Model({
      ...getConf(),
      onStart: async () => {
        const len = await getLenMark(model);
        let len2 = await getLenDom();
        expect(len).toBe(len2);
        const del = grid.deleteGrid();
        expect(del).toBeTruthy();
        len2 = await getLenDom();
        expect(len2).toBe(0);
      }
    });
    await model.onHandle();
  });

  // ClickMark
  test(' Check if click event on the grid mark is triggered ', async () => {

    let wrapC: HTMLElement;
    let domC: HTMLInputElement;
    wrapC = document.createElement('div');
    domC = document.createElement('input');
    wrapC.appendChild(domC);

    let obj: Controller;

    const model = new Model({
      type: 'double',
      ...getConf(),
      onStart: async () => {
        obj.update({ bar: false });
      },
      onUpdate: async () => {
        const spy = await jest.spyOn(model, 'clickMark');

        const dot =
          await wrapC.getElementsByClassName(jsRsName + '__grid-mark');
        const elem = dot[0];
        const funP = await mockPointerEvent(elem);
        await funP('click', 0, 0);

        expect(spy).toBeCalledTimes(1);
        if (elem instanceof HTMLElement)
          expect(spy).toBeCalledWith(+(elem.innerText));
        await spy.mockClear();
      },
    });
    const view = await new View(domC);
    obj = await new Controller(model, view);
  });
});