import { Bar } from '../bar';

describe('------- Test Bar API -------', () => {

  let rsName: string;
  let wrap: HTMLElement;
  let bar: Bar;

  const createBar = async () => {
    await bar.setVisibleBar(true);
    const domF = await bar.createDomBar();
    expect(domF).toBeTruthy();
  };

  const getElem = async () => {
    const barDom = await wrap.firstElementChild;
    const elem = await barDom as HTMLDivElement;
    return elem;
  };

  beforeEach(() => {
    rsName = 'range-slider-fox';
    wrap = document.createElement('div');
    wrap.classList.add(rsName + '__center');
    bar = new Bar(wrap, rsName);
  });

  test(' setVisibleBar ', async () => {
    expect(bar.setVisibleBar(true)).toBeTruthy();
    expect(bar.setVisibleBar(false)).toBeFalsy();
  });


  test(' createDomBar ', async () => {
    createBar();
  });


  test(' setBar ', async () => {
    await createBar();
    const sbF = await bar.setBar(12, 23);
    expect(sbF).toBeTruthy();
    const elem = await getElem();
    const left = elem.style.left;
    const width = elem.style.width;
    expect(left).toBe('12%');
    expect(width).toBe('23%');
  });


  test(' setOrientation ', async () => {
    await createBar();
    const sbF = await bar.setBar(34, 10);
    expect(sbF).toBeTruthy();
    const orF = await bar.setOrientation('vertical');
    expect(orF).toBeTruthy();
    const elem = await getElem();
    const bottom = elem.style.bottom;
    const height = elem.style.height;
    expect(bottom).toBe('34%');
    expect(height).toBe('10%');
  });

  test(' setSizeWH ', async () => {
    await createBar();
    bar.setSizeWH(25);
    const elem = await getElem();
    const height = elem.style.height;
    expect(height).toBe('25px');
  });


});