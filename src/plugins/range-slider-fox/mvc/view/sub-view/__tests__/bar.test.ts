import { Bar } from '../bar';

describe('------- Test Bar API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;

  beforeEach(() => {
    rsName = 'range-slider-fox';
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__center');
  });

  test(' setVisibleBar ', async () => {

    const bar = await new Bar(wrap, rsName);
    expect(bar.setVisibleBar(true)).toBeTruthy();
    expect(bar.setVisibleBar(false)).toBeFalsy();
  });


  test(' createDomBar ', async () => {

    const bar = await new Bar(wrap, rsName);
    await bar.setVisibleBar(true);
    const domF = await bar.createDomBar();
    expect(domF).toBeTruthy();

  });


  test(' setBar ', async () => {

    const bar = await new Bar(wrap, rsName);
    await bar.setVisibleBar(true);
    const domF = await bar.createDomBar();
    expect(domF).toBeTruthy();
    const sbF = await bar.setBar(12, 23);
    expect(sbF).toBeTruthy();
    const barDom = await wrap.firstElementChild;
    const elem = await barDom as HTMLDivElement;
    const left = elem.style.left;
    const width = elem.style.width;
    expect(left).toBe('12%');
    expect(width).toBe('23%');
  });


  test(' setOrientation ', async () => {

    const bar = await new Bar(wrap, rsName);
    await bar.setVisibleBar(true);
    const domF = await bar.createDomBar();
    expect(domF).toBeTruthy();
    const sbF = await bar.setBar(34, 10);
    expect(sbF).toBeTruthy();
    const orF = await bar.setOrientation('vertical');
    expect(orF).toBeTruthy();
    const barDom = await wrap.firstElementChild;
    const elem = await barDom as HTMLDivElement;
    const bottom = elem.style.bottom;
    const height = elem.style.height;
    expect(bottom).toBe('34%');
    expect(height).toBe('10%');

  });

  test(' setSizeWH ', async () => {

    const bar = await new Bar(wrap, rsName);
    await bar.setVisibleBar(true);
    const domF = await bar.createDomBar();
    expect(domF).toBeTruthy();
    bar.setSizeWH(25);
    const barDom = await wrap.firstElementChild;
    const elem = await barDom as HTMLDivElement;
    const height = elem.style.height;
    expect(height).toBe('25px');
  });


});