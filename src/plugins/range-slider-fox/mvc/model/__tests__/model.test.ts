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

  // getOptions
  test(' Get all configuration data from model  ', () => {
    const model = new Model({
      onStart: () => {
        expect(model.getOptions()).toStrictEqual(defaultData);
      },
    });

    model.onHandle();
  });


  // reset
  test(' Check API reset ', () => {
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

  // update
  test(' Check API update', () => {
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


  // calcOnePercent
  test(' Check what one percent of a range is equal to ', () => {
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

  //  calcPositionDot: From & To ( in percents )
  test(' Calculate From & To position ( in percents ) ', async () => {

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

  //  setWrapWH
  test(' Set wrapper width or height', async () => {
    const model = await new Model({});
    await model.onHandle();
    expect(model.setWrapWH(450)).toBeCloseTo(450);
    expect(model.setWrapWH(450.67)).toBeCloseTo(450.67);
    expect(model.setWrapWH(0)).toBeCloseTo(319);
  });


  //  calcDotPosition 
  test(' Check dots mooving along ' +
    'the grid and interaction with each other ', async () => {

      let model: Model;
      let wrapWH = 1120;
      let position = 533.7142944335938;

      const positionD = async (op: DP) => {
        let data = await model.calcDotPosition({
          type: op.fl ? 'From' : 'To',
          wrapWH,
          position,
          clientXY: op.clientXY,
          shiftXY: op.shiftXY
        });

        if (data)
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
          });
          if (data) {
            expect(data.from).toBeCloseTo(500);
            expect(data.to).toBeCloseTo(500);
          }

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
          });

          if (data) {
            expect(data.from).toBeCloseTo(500);
            expect(data.to).toBeCloseTo(500);
          }

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
        step: 5,
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

      model = await new Model({
        type: 'double',
        orientation: 'vertical',
        min: -120,
        max: 800,
        to: 500,
        from: 80,
        grid: true,
        gridSnap: true,
        gridNum: 40,
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
        }
      });
      await model.onHandle();

      model = await new Model({
        type: 'single',
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
            clientXY: 521,
            shiftXY: -1.98211669921875,
            val: 229,
            fl: true
          });
        }
      });
      await model.onHandle();

    });


  // calcStep
  test(' Calculate step relating the range ', async () => {

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


  //calcPositionTip: From, To, Single
  test(' Calculate hints position relating dots ', async () => {

    let model = await new Model({
      type: 'double',
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

  //  createMark
  test(' Calculate numeral grid' +
    ' relating range and interval or step ', async () => {

      let model = await new Model({
        min: 10,
        max: 800,
        gridRound: 0,
        gridStep: 0,
        gridNum: 40,
        onStart: async () => {
          const mas = [
            { val: 89, position: 10 },
            { val: 662, position: 82.5 },
            { val: 780, position: 97.5 }
          ];

          const grid = model.createMark();
          expect(grid[4]).toEqual(mas[0]);
          expect(grid[33]).toEqual(mas[1]);
          expect(grid[39]).toEqual(mas[2]);
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
            { val: 64.4, position: 9.243966771020782 },
            { val: 514.4, position: 64.70776739714547 },
            { val: 574.4, position: 72.10294081396209 }
          ];

          const grid = model.createMark();
          expect(grid[5]).toEqual(mas[0]);
          expect(grid[35]).toEqual(mas[1]);
          expect(grid[39]).toEqual(mas[2]);
        }
      });
      await model.onHandle();

    });

  // calcPositionBar
  test(' Calculate progress-bar position between dots', async () => {

    let model = await new Model({
      type: 'double',
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

    model = await new Model({
      type: 'single',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      onStart: async () => {
        await model.setWrapWH(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        const obj = { barX: 0, widthBar: 23.91304347826087 };
        expect(model.calcPositionBar()).toEqual(obj);
      }
    });
    await model.onHandle();

  });

  // clickLine
  test(' Check calculation of a click on a grid ', async () => {

    let model = await new Model({
      type: 'double',
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

    model = await new Model({
      type: 'single',
      orientation: 'vertical',
      min: -120,
      max: 800,
      from: 100,

      onStart: async () => {
        await model.setWrapWH(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();


        expect(model.clickLine(300).from).toBeCloseTo(554);
      }
    });
    await model.onHandle();

    model = await new Model({
      type: 'double',
      min: -120,
      max: 500,
      from: 200,
      to: 300,

      onStart: async () => {
        await model.setWrapWH(600);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();

        const to = model.clickLine(601).to;
        expect(to).toBeCloseTo(501);
        const from = model.clickLine(-1).from;
        expect(from).toBeCloseTo(-121);
      }
    });
    await model.onHandle();

  });

  // clickBar
  test(' Check calculation of a click' +
    ' on a progress-bar between dots ', async () => {

      let model = await new Model({
        type: 'double',
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

      model = await new Model({
        orientation: 'vertical',
        type: 'single',
        min: -120,
        max: 800,
        to: 600,
        from: 100,
        onStart: async () => {
          await model.setWrapWH(1120);
          await model.calcOnePercent();
          await model.calcPositionDotFrom();
          let obj = { from: 92, to: 100 };
          expect(model.clickBar(10)).toEqual(obj);
        }
      });
      await model.onHandle();

      model = await new Model({
        type: 'single',
        min: -120,
        max: 800,
        to: 600,
        from: 100,
        onStart: async () => {
          await model.setWrapWH(1120);
          await model.calcOnePercent();
          await model.calcPositionDotFrom();
          let obj = { from: -79, to: 100 };
          expect(model.clickBar(50)).toEqual(obj);
        }
      });
      await model.onHandle();

    });

  // clickMark
  test(' Check dots values changes ' +
    'on clicking on the grid element ', async () => {

      let model = await new Model({
        type: 'double',
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

  //  calcSnap & snapDot
  test(' Calculate dots positions relating ' +
    'grid mark and further moovement along the grid ', async () => {

      let model = await new Model({
        type: 'double',
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

  // calcKeyDown
  test(' Calculate dots movement when' +
    ' controlling from keyboard ', async () => {

      let model = await new Model({
        type: 'double',
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



