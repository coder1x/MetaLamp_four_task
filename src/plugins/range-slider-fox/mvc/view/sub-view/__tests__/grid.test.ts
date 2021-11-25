import { Grid } from '../grid';
import { Model } from '../../../model/model';

describe('------- Test Grid API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;

  beforeEach(() => {
    rsName = 'range-slider-fox';
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__bottom');
  });

  test(' setOrientation ', async () => {

    const grid = await new Grid(wrap, rsName);
    expect(grid.setOrientation('vertical')).toBeTruthy();
    expect(grid.setOrientation('horizontal')).toBeFalsy();
  });

  test(' getOrientation ', async () => {
    const grid = await new Grid(wrap, rsName);
    expect(grid.getOrientation()).toBeTruthy();
  });

  test(' createMark ', async () => {

    let model = await new Model({
      min: 10,
      max: 800,
      grid: true,
      gridRound: 0,
      gridStep: 0,
      gridNum: 40,
      onStart: async () => {
        const gridM = await model.createMark();
        const grid = await new Grid(wrap, rsName);
        const elements = await grid.createMark(gridM);
        const len = elements.childNodes.length;
        expect(len).toBe(gridM.length);
      }
    });
    await model.onHandle();

  });


  test(' createDomGrid ', async () => {

    let model = await new Model({
      min: 10,
      max: 800,
      grid: true,
      gridRound: 0,
      gridStep: 0,
      gridNum: 40,
      onStart: async () => {
        const gridM = await model.createMark();
        const grid = await new Grid(wrap, rsName);
        const elements = await grid.createMark(gridM);
        const len = elements.childNodes.length;
        expect(len).toBe(gridM.length);

        const rsBottom = grid.createDomGrid();
        const len2 = rsBottom.firstChild.childNodes.length;

        expect(len).toBe(len2);
      }
    });
    await model.onHandle();


  });


  test(' deleteGrid ', async () => {

    let model = await new Model({
      min: 10,
      max: 800,
      grid: true,
      gridRound: 0,
      gridStep: 0,
      gridNum: 40,
      onStart: async () => {
        const gridM = await model.createMark();
        const grid = await new Grid(wrap, rsName);
        const elements = await grid.createMark(gridM);
        const len = elements.childNodes.length;
        expect(len).toBe(gridM.length);

        const rsBottom = grid.createDomGrid();
        let len2 = rsBottom.firstChild.childNodes.length;

        expect(len).toBe(len2);

        const del = grid.deleteGrid();
        expect(del).toBeTruthy();
        len2 = rsBottom.firstChild.childNodes.length;
        expect(len2).toBe(0);

      }
    });
    await model.onHandle();
  });



});