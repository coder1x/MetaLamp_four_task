import { Model } from '../model';

interface DP {
  clientXY: number,
  shiftXY: number,
  val: number,
  fl: boolean
}

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

    let model: Model;

    const position = async (from: number, to: number) => {
      await model.calcOnePercent();
      const fromP = await model.calcPositionDotFrom();
      const toP = await model.calcPositionDotTo();
      expect(+fromP.toFixed(2)).toBeCloseTo(from);
      expect(+toP.toFixed(2)).toBeCloseTo(to);
    };

    model = await new Model({
      type: 'double',
      from: 30,
      to: 120,
      min: -10,
      max: 300,
      onStart: async () => {
        await position(12.9, 41.94);

        model.update({
          min: 0.5,
          max: 100.36,
          from: 40.78,
          to: 80.23,
        });
      },
      onUpdate: async () => {
        await position(40.34, 79.84);
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

    let model: Model;
    let wrapWH = 1120;
    let position = 533.7142944335938;

    const positionD = async (op: DP) => {
      type obj = { from: number; to: number; };
      let data = await model.calcDotPosition({
        type: op.fl ? 'From' : 'To',
        wrapWH,
        position,
        clientXY: op.clientXY,
        shiftXY: op.shiftXY
      }) as obj;

      if (op.fl) {
        expect(data.from).toBeCloseTo(op.val);
        expect(data.to).toBeUndefined();
      }
      else {
        expect(data.to).toBeCloseTo(op.val);
        expect(data.from).toBeUndefined();
      }
    };

    model = await new Model({
      type: 'double',
      min: -120,
      max: 800,
      to: 500,
      from: 80,
      onStart: async () => {
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();
        type obj = { from: number; to: number; };

        positionD({
          clientXY: 929.7144165039062,
          shiftXY: 3.580322265625,
          val: 202,
          fl: true
        });

        positionD({
          clientXY: 100,
          shiftXY: 3.580322265625,
          val: -120,
          fl: true
        });

        let data = await model.calcDotPosition({
          type: 'From',
          wrapWH,
          position,
          clientXY: 1400,
          shiftXY: 3.580322265625
        }) as obj;

        expect(data.from).toBeCloseTo(500);
        expect(data.to).toBeCloseTo(500);

        positionD({
          clientXY: 1500,
          shiftXY: 0.08056640625,
          val: 674,
          fl: false
        });

        positionD({
          clientXY: 2300,
          shiftXY: 0.08056640625,
          val: 800,
          fl: false
        });

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


    model = await new Model({
      type: 'double',
      orientation: 'vertical',
      min: -120,
      max: 800,
      to: 500,
      from: 80,
      onStart: async () => {
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();
        wrapWH = 522;
        position = 721.1786041259766;

        positionD({
          clientXY: 369.00006103515625,
          shiftXY: -2.5625,
          val: 496,
          fl: false
        });

        positionD({
          clientXY: 521,
          shiftXY: -1.98211669921875,
          val: 229,
          fl: true
        });
      }
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


  test(' createMark', async () => {

    let model = await new Model({
      min: 10,
      max: 800,
      gridRound: 0,
      gridStep: 0,
      gridNum: 40,
      onStart: async () => {
        const mas = [
          { val: 10, position: 0 },
          { val: 30, position: 2.5 },
          { val: 50, position: 5 },
          { val: 69, position: 7.5 },
          { val: 89, position: 10 },
          { val: 109, position: 12.5 },
          { val: 129, position: 15 },
          { val: 148, position: 17.5 },
          { val: 168, position: 20 },
          { val: 188, position: 22.5 },
          { val: 208, position: 25 },
          { val: 227, position: 27.5 },
          { val: 247, position: 30 },
          { val: 267, position: 32.5 },
          { val: 287, position: 35 },
          { val: 306, position: 37.5 },
          { val: 326, position: 40 },
          { val: 346, position: 42.5 },
          { val: 366, position: 45 },
          { val: 385, position: 47.5 },
          { val: 405, position: 50 },
          { val: 425, position: 52.5 },
          { val: 445, position: 55 },
          { val: 464, position: 57.5 },
          { val: 484, position: 60 },
          { val: 504, position: 62.5 },
          { val: 524, position: 65 },
          { val: 543, position: 67.5 },
          { val: 563, position: 70 },
          { val: 583, position: 72.5 },
          { val: 603, position: 75 },
          { val: 622, position: 77.5 },
          { val: 642, position: 80 },
          { val: 662, position: 82.5 },
          { val: 682, position: 85 },
          { val: 701, position: 87.5 },
          { val: 721, position: 90 },
          { val: 741, position: 92.5 },
          { val: 761, position: 95 },
          { val: 780, position: 97.5 },
          { val: 800, position: 100 }
        ];

        expect(model.createMark()).toEqual(mas);

      }
    });
    await model.onHandle();

    model = await new Model({
      min: -10.56,
      max: 800.78,
      gridRound: 1,
      gridStep: 15,
      gridNum: 0,
      onStart: async () => {

        const mas = [
          { val: -10.6, position: 0 },
          { val: 4.4, position: 1.8487933542041564 },
          { val: 19.4, position: 3.6975867084083127 },
          { val: 34.4, position: 5.546380062612469 },
          { val: 49.4, position: 7.395173416816625 },
          { val: 64.4, position: 9.243966771020782 },
          { val: 79.4, position: 11.092760125224938 },
          { val: 94.4, position: 12.941553479429095 },
          { val: 109.4, position: 14.79034683363325 },
          { val: 124.4, position: 16.639140187837405 },
          { val: 139.4, position: 18.487933542041564 },
          { val: 154.4, position: 20.336726896245718 },
          { val: 169.4, position: 22.185520250449876 },
          { val: 184.4, position: 24.03431360465403 },
          { val: 199.4, position: 25.88310695885819 },
          { val: 214.4, position: 27.731900313062344 },
          { val: 229.4, position: 29.5806936672665 },
          { val: 244.4, position: 31.429487021470656 },
          { val: 259.4, position: 33.27828037567481 },
          { val: 274.4, position: 35.12707372987897 },
          { val: 289.4, position: 36.97586708408313 },
          { val: 304.4, position: 38.82466043828728 },
          { val: 319.4, position: 40.673453792491436 },
          { val: 334.4, position: 42.52224714669559 },
          { val: 349.4, position: 44.37104050089975 },
          { val: 364.4, position: 46.21983385510391 },
          { val: 379.4, position: 48.06862720930806 },
          { val: 394.4, position: 49.917420563512216 },
          { val: 409.4, position: 51.76621391771638 },
          { val: 424.4, position: 53.61500727192053 },
          { val: 439.4, position: 55.46380062612469 },
          { val: 454.4, position: 57.31259398032884 },
          { val: 469.4, position: 59.161387334533 },
          { val: 484.4, position: 61.01018068873716 },
          { val: 499.4, position: 62.85897404294131 },
          { val: 514.4, position: 64.70776739714547 },
          { val: 529.4, position: 66.55656075134962 },
          { val: 544.4, position: 68.40535410555378 },
          { val: 559.4, position: 70.25414745975795 },
          { val: 574.4, position: 72.10294081396209 },
          { val: 589.4, position: 73.95173416816625 },
          { val: 604.4, position: 75.8005275223704 },
          { val: 619.4, position: 77.64932087657456 },
          { val: 634.4, position: 79.49811423077873 },
          { val: 649.4, position: 81.34690758498287 },
          { val: 664.4, position: 83.19570093918703 },
          { val: 679.4, position: 85.04449429339118 },
          { val: 694.4, position: 86.89328764759534 },
          { val: 709.4, position: 88.7420810017995 },
          { val: 724.4, position: 90.59087435600365 },
          { val: 739.4, position: 92.43966771020781 },
          { val: 754.4, position: 94.28846106441198 },
          { val: 769.4, position: 96.13725441861612 },
          { val: 784.4, position: 97.98604777282029 },
          { val: 799.4, position: 99.83484112702443 },
          { val: 800.8, position: 100 }
        ];

        expect(model.createMark()).toEqual(mas);

      }
    });
    await model.onHandle();

  });


  test(' calcPositionBar', async () => {

    let model = await new Model({
      type: 'double',
      orientation: 'horizontal',
      min: -120,
      max: 800,
      to: 600,
      from: 100,

      onStart: async () => {
        await model.setWrapWH(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();

        const obj = { barX: 23.91304347826087, widthBar: 54.347826086956516 };
        expect(model.calcPositionBar()).toEqual(obj);
      }
    });
    await model.onHandle();
  });


  test(' clickLine', async () => {

    let model = await new Model({
      type: 'double',
      orientation: 'horizontal',
      min: -120,
      max: 800,
      to: 600,
      from: 100,

      onStart: async () => {
        await model.setWrapWH(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();

        let obj = { from: 126, to: 600 };
        expect(model.clickLine(300)).toEqual(obj);
        obj = { from: 250, to: 600 };
        expect(model.clickLine(450)).toEqual(obj);
        obj = { from: 250, to: 537 };
        expect(model.clickLine(800)).toEqual(obj);
        obj = { from: 250, to: 784 };
        expect(model.clickLine(1100)).toEqual(obj);

      }
    });
    await model.onHandle();
  });


  test(' clickBar', async () => {

    let model = await new Model({
      type: 'double',
      orientation: 'horizontal',
      min: -120,
      max: 800,
      to: 600,
      from: 100,

      onStart: async () => {
        await model.setWrapWH(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();

        let obj = { from: 344, to: 600 };
        expect(model.clickBar(297)).toEqual(obj);


        obj = { from: 344, to: 582 };
        expect(model.clickBar(290)).toEqual(obj);

      }
    });
    await model.onHandle();
  });


  test(' clickMark', async () => {

    let model = await new Model({
      type: 'double',
      orientation: 'horizontal',
      min: -120,
      max: 800,
      to: 600,
      from: 100,

      onStart: async () => {
        let obj = { from: 150, to: 600 };
        expect(model.clickMark(150)).toEqual(obj);

        obj = { from: 150, to: 700 };
        expect(model.clickMark(700)).toEqual(obj);
      }
    });
    await model.onHandle();
  });


  test(' calcSnap & snapDot', async () => {

    let model = await new Model({
      type: 'double',
      orientation: 'horizontal',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      grid: true,
      gridSnap: true,
      gridNum: 20,

      onStart: async () => {
        let mas: number[] = [];

        for (let item of model.createMark()) {
          mas.push(item.val);
        }
        mas.shift();
        mas.pop();

        let obj = { from: 110, to: 616 };
        expect(model.calcSnap(mas)).toEqual(obj);
        expect(model.snapDot()).toEqual(obj);
      }
    });
    await model.onHandle();
  });


  test(' calcKeyDown', async () => {

    let model = await new Model({
      type: 'double',
      orientation: 'horizontal',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      keyStepOne: 5,
      keyStepHold: 10,

      onStart: async () => {

        let obj = { from: 105, to: 600 };
        expect(model.calcKeyDown(false, '+', 'from')).toEqual(obj);

        obj = { from: 100, to: 600 };
        expect(model.calcKeyDown(false, '-', 'from')).toEqual(obj);

        obj = { from: 100, to: 605 };
        expect(model.calcKeyDown(false, '+', 'to')).toEqual(obj);

        obj = { from: 100, to: 600 };
        expect(model.calcKeyDown(false, '-', 'to')).toEqual(obj);

        obj = { from: 110, to: 600 };
        expect(model.calcKeyDown(true, '+', 'from')).toEqual(obj);

        obj = { from: 100, to: 600 };
        expect(model.calcKeyDown(true, '-', 'from')).toEqual(obj);

        obj = { from: 100, to: 610 };
        expect(model.calcKeyDown(true, '+', 'to')).toEqual(obj);

        obj = { from: 100, to: 600 };
        expect(model.calcKeyDown(true, '-', 'to')).toEqual(obj);
      }
    });
    await model.onHandle();
  });

});



