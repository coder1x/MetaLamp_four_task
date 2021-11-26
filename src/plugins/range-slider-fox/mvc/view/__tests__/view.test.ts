import { Controller, Model, View } from '../../controller/controller';

describe('------- Test View API -------', () => {

  let wrap: HTMLElement;
  let domV: HTMLInputElement;
  let view: View;

  beforeEach(() => {
    wrap = document.createElement('div');
    domV = document.createElement('input');
    wrap.appendChild(domV);
    view = new View(domV, 1);
  });

  test(' setValueInput ', () => {
    const model = new Model({
      min: 0,
      max: 100,
      from: 30,
      to: 70,
    });

    new Controller(model, view);
    const data = view.setValueInput(30, 70, 'double');
    expect(data).toBeTruthy();
    expect(data).toBe(domV.value);
  });

  test(' outDataAttr ', async () => {
    await domV.setAttribute('data-from', '45');
    await domV.setAttribute('data-to', '86');

    const model = await new Model({
      min: 0,
      max: 100,
      from: 30,
      to: 70,
      onStart: async () => {
        let obj = { from: 45, to: 86 };
        expect(view.outDataAttr()).toEqual(obj);
      },
    });

    new Controller(model, view);
  });


  test(' disabledRangeSlider ', async () => {
    const model = await new Model({
      disabled: false,
      onStart: async () => {
        let op = await view.disabledRangeSlider(true);
        const rs = domV.parentElement;
        let num = +rs.style.opacity;
        expect(+op).toBeCloseTo(num);
        op = await view.disabledRangeSlider(false);
        num = +rs.style.opacity;
        expect(+op).toBeCloseTo(num);
      }
    });

    new Controller(model, view);
  });



  // test(' getWrapWH ', async () => {


  // });


  test(' createDomBase ', async () => {
    const model = await new Model({
      disabled: false,
      onStart: async () => {
        let nodes = view.createDomBase().childNodes;
        let name: string[] = [];
        let line: HTMLElement;
        for (let item of nodes) {
          const elem = item as HTMLElement;
          const nC = elem.className;
          if (nC == 'range-slider-fox__center')
            line = elem.children[0] as HTMLElement;
          name.push(nC);
        }

        const masName = [
          'range-slider-fox__top',
          'range-slider-fox__center',
          'range-slider-fox__bottom'
        ];

        expect(name).toEqual(masName);
        expect(line.className).toBe('range-slider-fox__line');
      }
    });

    new Controller(model, view);
  });



  test(' setOrientation ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setOrientation('vertical');
        const elem = wrap.getElementsByClassName('range-slider-fox_vertical');
        expect(elem[0]).toBeDefined();
      }
    });

    new Controller(model, view);
  });


  // test(' setActions ', async () => {
  //   const model = await new Model({
  //     onStart: async () => {

  //     }
  //   });

  //   new Controller(model, view);
  // });


  test(' setTheme ', async () => {
    const model = await new Model({
      onStart: async () => {
        view.setTheme('dark');
        let elem = wrap.getElementsByClassName('rs-dark');
        expect(elem[0]).toBeDefined();
        view.setTheme('fox');
        elem = wrap.getElementsByClassName('rs-dark');
        expect(elem[0]).toBeUndefined();
        elem = wrap.getElementsByClassName('rs-fox');
        expect(elem[0]).toBeDefined();
      }
    });

    new Controller(model, view);
  });





});

