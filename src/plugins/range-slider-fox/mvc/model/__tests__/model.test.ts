import { Model } from '../model';
//import { RangeSliderOptions } from '../../../glob-interface';


describe('Test Model API', () => {

  const defaultData = {
    type: 'single', orientation: 'horizontal',
    theme: 'base', min: 0,
    max: 10, to: 2,
    from: 1, step: 0,
    keyStepOne: 0, keyStepHold: 0,
    bar: false, tipPrefix: '',
    tipPostfix: '', tipMinMax: true,
    tipFromTo: true, grid: false,
    gridSnap: false, gridNum: 4,
    gridStep: 0, gridRound: 0,
    disabled: false
  };


  test(' getOptions ', () => {

    const model = new Model({
      onStart: () => {
        expect(model.getOptions()).toStrictEqual(defaultData);
      },
    });

    model.onHandle();

  });


  test(' reset ', () => {

    const model = new Model({
      onStart: () => {
        model.update({
          type: 'double',
          from: 5,
          to: 9,
        });
      },
      onUpdate: () => {
        model.reset();
      },
      onReset: () => {
        expect(model.getOptions()).toStrictEqual(defaultData);
      },
    });

    model.onHandle();

  });


  test(' update ', () => {

    const model = new Model({
      onStart: () => {
        model.update({
          type: 'double',
          from: 5,
          to: 9,
        });
      },
      onUpdate: () => {
        const conf = model.getOptions();
        expect(conf.type).toBe('double');
        expect(conf.from).toBeCloseTo(5);
        expect(conf.to).toBeCloseTo(9);
      },
    });

    model.onHandle();

  });


  test(' calcOnePercent ', async () => {

    const model = await new Model({});
    await model.onHandle();

    const conf = await model.getOptions();

    console.log(conf.max);


  });







});
