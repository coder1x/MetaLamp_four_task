import { Grid } from '../grid';
import { Model } from '../../../model/model';

describe('------- Test Grid API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;
  let grid: Grid;

  beforeEach(async () => {
    rsName = 'range-slider-fox';
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__bottom');
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


  test(' setOrientation ', async () => {
    expect(grid.setOrientation('vertical')).toBeTruthy();
    expect(grid.setOrientation('horizontal')).toBeFalsy();
  });


  test(' getOrientation ', async () => {
    expect(grid.getOrientation()).toBeTruthy();
  });


  test(' createMark ', async () => {
    let model = await new Model({
      ...getConf(),
      onStart: () => {
        getLenMark(model);
      }
    });
    await model.onHandle();

  });


  test(' createDomGrid ', async () => {
    let model = await new Model({
      ...getConf(),
      onStart: async () => {
        const len = await getLenMark(model);
        const len2 = await getLenDom();
        expect(len).toBe(len2);
      }
    });
    await model.onHandle();
  });


  test(' deleteGrid ', async () => {
    let model = await new Model({
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



});