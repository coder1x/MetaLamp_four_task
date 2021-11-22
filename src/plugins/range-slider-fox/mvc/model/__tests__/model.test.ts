import { Model } from '../model';


describe('------- Test Model API -------', () => {

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


  test(' calcOnePercent ', () => {
    const max = [1200, 134.67, 800];
    const min = [-120, 23.54, 0];
    const result = [13.2, 1.1113, 8];

    const test = async (min: number, max: number, result: number) => {
      const model = await new Model({
        min,
        max
      });
      await model.onHandle();
      expect(model.calcOnePercent()).toBeCloseTo(result);
    };

    for (let i = 0; i < result.length; i++) {
      test(min[i], max[i], result[i]);
    }
  });

  test(' calcPositionDot: From & To ( in percents )', async () => {

    const model = await new Model({
      type: 'double',
      from: 30,
      to: 120,
      min: -10,
      max: 300,
      onStart: async () => {
        await model.calcOnePercent();
        const fromP = await model.calcPositionDotFrom();
        const toP = await model.calcPositionDotTo();
        expect(+fromP.toFixed(2)).toBeCloseTo(12.9);
        expect(+toP.toFixed(2)).toBeCloseTo(41.94);

        model.update({
          min: 0.5,
          max: 100.36,
          from: 40.78,
          to: 80.23,
        });
      },
      onUpdate: async () => {
        await model.calcOnePercent();
        const fromP = await model.calcPositionDotFrom();
        const toP = await model.calcPositionDotTo();
        expect(+fromP.toFixed(2)).toBeCloseTo(40.34);
        expect(+toP.toFixed(2)).toBeCloseTo(79.84);
      }
    });
    await model.onHandle();
  });


  test(' setWrapWH', async () => {
    const model = await new Model({});
    await model.onHandle();

    expect(model.setWrapWH(450)).toBeCloseTo(450);
    expect(model.setWrapWH(450.67)).toBeCloseTo(450.67);
    expect(model.setWrapWH(0)).toBeCloseTo(319);
  });


  test(' calcDotPosition', async () => {
    const model = await new Model({
      type: 'double',
      orientation: 'horizontal',
      min: -120,
      max: 800,
      to: 500,
      from: 80,
      onStart: async () => {

        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();
        type obj = { from: number; to: number; };
        const wrapWH = 1120;
        const position = 533.7142944335938;

        let data = await model.calcDotPosition({
          type: 'From',
          wrapWH,
          position,
          clientXY: 929.7144165039062,
          shiftXY: 3.580322265625
        }) as obj;

        expect(data.from).toBeCloseTo(202);
        expect(data.to).toBeUndefined();

        data = await model.calcDotPosition({
          type: 'From',
          wrapWH,
          position,
          clientXY: 100,
          shiftXY: 3.580322265625
        }) as obj;

        expect(data.from).toBeCloseTo(-120);
        expect(data.to).toBeUndefined();


        data = await model.calcDotPosition({
          type: 'From',
          wrapWH,
          position,
          clientXY: 1400,
          shiftXY: 3.580322265625
        }) as obj;

        expect(data.from).toBeCloseTo(500);
        expect(data.to).toBeCloseTo(500);

        data = await model.calcDotPosition({
          type: 'To',
          wrapWH,
          position,
          clientXY: 1500,
          shiftXY: 0.08056640625
        }) as obj;

        expect(data.from).toBeUndefined();
        expect(data.to).toBeCloseTo(674);


        data = await model.calcDotPosition({
          type: 'To',
          wrapWH,
          position,
          clientXY: 2300,
          shiftXY: 0.08056640625
        }) as obj;

        expect(data.from).toBeUndefined();
        expect(data.to).toBeCloseTo(800);

        data = await model.calcDotPosition({
          type: 'To',
          wrapWH,
          position,
          clientXY: 1200,
          shiftXY: 0.08056640625
        }) as obj;

        expect(data.from).toBeCloseTo(500);
        expect(data.to).toBeCloseTo(500);

      },
    });
    await model.onHandle();
  });


  test(' calcStep', async () => {

    let mas = await [0, 2, 4, 6, 8, 10];

    let model = await new Model({
      min: 0,
      max: 10,
      step: 2,
      onStart: () => {
        expect(model.calcStep()).toEqual(mas);
      }
    });
    await model.onHandle();

    mas = await [
      -1.45, 1.5,
      4.5, 7.5,
      10.5, 13.5,
      15.234
    ];

    model = await new Model({
      min: -1.45,
      max: 15.234,
      step: 3,
      onStart: () => {
        expect(model.calcStep()).toEqual(mas);
      }
    });
    await model.onHandle();

  });


});


test(' calcPositionTip: From, To, Single', async () => {

  let model = await new Model({
    type: 'double',
    orientation: 'horizontal',
    min: -120,
    max: 800,
    to: 500,
    from: 200,

    onStart: async () => {
      await model.setWrapWH(1120);
      await model.calcOnePercent();
      await model.calcPositionDotFrom();
      await model.calcPositionDotTo();

      const from = await model.calcPositionTipFrom(32.03);
      expect(+from.toFixed(2)).toBeCloseTo(33.53);

      const to = await model.calcPositionTipTo(32.03);
      expect(+to.toFixed(2)).toBeCloseTo(66.14);

      const single = await model.calcPositionTipSingle(72.87);
      expect(+single.toFixed(2)).toBeCloseTo(47.83);

    }
  });
  await model.onHandle();
});