import Model from '../Model';

interface PositionData {
  clientXY: number,
  shiftXY: number,
  value: number,
  type: boolean
}

describe('------- Test Model API -------', () => {
  const defaultData = {
    type: 'single',
    orientation: 'horizontal',
    theme: 'base',
    min: 0,
    max: 10,
    to: 2,
    from: 1,
    step: 0,
    keyStepOne: 0,
    keyStepHold: 0,
    bar: false,
    tipPrefix: '',
    tipPostfix: '',
    tipMinMax: true,
    tipFromTo: true,
    grid: false,
    gridSnap: false,
    gridNumber: 4,
    gridStep: 0,
    gridRound: 0,
    disabled: false,
  };

  // getOptions
  test(' Get all configuration data from model  ', () => {
    const model = new Model({
      onStart: () => {
        expect(model.getOptions()).toStrictEqual(defaultData);
      },
    });

    if (model.onHandle) { model.onHandle(); }
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

    if (model.onHandle) { model.onHandle(); }
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
        const config = model.getOptions();
        expect(config.type).toBe('double');
        expect(config.from).toBeCloseTo(5);
        expect(config.to).toBeCloseTo(9);
      },
    });

    if (model.onHandle) { model.onHandle(); }
  });

  // calcOnePercent
  test(' Check what one percent of a range is equal to ', () => {
    const maxValue = [1200, 134.67, 800];
    const minValue = [-120, 23.54, 0];
    const resultValue = [13.2, 1.1113, 8];

    const test = async (min: number, max: number, result: number) => {
      const model = await new Model({
        min,
        max,
      });

      if (model.onHandle) { await model.onHandle(); }
      expect(model.calcOnePercent()).toBeCloseTo(result);
    };

    for (let i = 0; i < resultValue.length; i += 1) {
      test(minValue[i], maxValue[i], resultValue[i]);
    }
  });

  //  calcPositionDot: From & To ( in percents )
  test(' Calculate From & To position ( in percents ) ', async () => {
    let model: Model;

    const position = async (from: number, to: number) => {
      await model.calcOnePercent();
      const fromPosition = await model.calcPositionDotFrom();
      const toPosition = await model.calcPositionDotTo();
      expect(+fromPosition.toFixed(2)).toBeCloseTo(from);
      expect(+toPosition.toFixed(2)).toBeCloseTo(to);
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
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  //  setWrapWH
  test(' Set wrapper width or height', async () => {
    const model = await new Model({});

    if (model.onHandle) { await model.onHandle(); }
    expect(model.setWrapperWidthHeight(450)).toBeCloseTo(450);
    expect(model.setWrapperWidthHeight(450.67)).toBeCloseTo(450.67);
    expect(model.setWrapperWidthHeight(0)).toBeCloseTo(319);
  });

  const testName1 = ' Check dots mooving along '
    + 'the grid and interaction with each other ';
  //  calcDotPosition
  test(testName1, async () => {
    let model: Model;
    let wrapperWidthHeight = 1120;
    let position = 533.7142944335938;

    const positionData = async (options: PositionData) => {
      const data = await model.calcDotPosition({
        type: options.type ? 'From' : 'To',
        wrapperWidthHeight,
        position,
        clientXY: options.clientXY,
        shiftXY: options.shiftXY,
      });

      if (!data) return;

      if (options.type) {
        expect(data.from).toBeCloseTo(options.value);
        expect(data.to).toBeNull();
      } else {
        expect(data.to).toBeCloseTo(options.value);
        expect(data.from).toBeNull();
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

        positionData({
          clientXY: 929.7144165039062,
          shiftXY: 3.580322265625,
          value: 202,
          type: true,
        });

        positionData({
          clientXY: 100,
          shiftXY: 3.580322265625,
          value: -120,
          type: true,
        });

        let data = await model.calcDotPosition({
          type: 'From',
          wrapperWidthHeight,
          position,
          clientXY: 1400,
          shiftXY: 3.580322265625,
        });
        if (data) {
          expect(data.from).toBeCloseTo(500);
          expect(data.to).toBeCloseTo(500);
        }

        positionData({
          clientXY: 1500,
          shiftXY: 0.08056640625,
          value: 674,
          type: false,
        });

        positionData({
          clientXY: 2300,
          shiftXY: 0.08056640625,
          value: 800,
          type: false,
        });

        data = await model.calcDotPosition({
          type: 'To',
          wrapperWidthHeight,
          position,
          clientXY: 1200,
          shiftXY: 0.08056640625,
        });

        if (data) {
          expect(data.from).toBeCloseTo(500);
          expect(data.to).toBeCloseTo(500);
        }
      },
    });

    if (model.onHandle) { await model.onHandle(); }

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
        wrapperWidthHeight = 522;
        position = 721.1786041259766;

        positionData({
          clientXY: 369.00006103515625,
          shiftXY: -2.5625,
          value: 496,
          type: false,
        });

        positionData({
          clientXY: 521,
          shiftXY: -1.98211669921875,
          value: 229,
          type: true,
        });
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      type: 'double',
      orientation: 'vertical',
      min: -120,
      max: 800,
      to: 500,
      from: 80,
      grid: true,
      gridSnap: true,
      gridNumber: 40,
      onStart: async () => {
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();
        wrapperWidthHeight = 522;
        position = 721.1786041259766;

        positionData({
          clientXY: 369.00006103515625,
          shiftXY: -2.5625,
          value: 496,
          type: false,
        });
      },
    });

    if (model.onHandle) { await model.onHandle(); }

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
        wrapperWidthHeight = 522;
        position = 721.1786041259766;

        positionData({
          clientXY: 521,
          shiftXY: -1.98211669921875,
          value: 229,
          type: true,
        });
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // calcStep
  test(' Calculate step relating the range ', async () => {
    let values = await [0, 2, 4, 6, 8, 10];

    let model = await new Model({
      min: 0,
      max: 10,
      step: 2,
      onStart: () => {
        expect(model.calcStep()).toEqual(values);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    values = await [
      -1.45, 1.6,
      4.6, 7.6,
      10.6, 13.6,
      15.234,
    ];

    model = await new Model({
      min: -1.45,
      max: 15.234,
      step: 3,
      onStart: () => {
        expect(model.calcStep()).toEqual(values);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  // calcPositionTip: From, To, Single
  test(' Calculate hints position relating dots ', async () => {
    const model = await new Model({
      type: 'double',
      min: -120,
      max: 800,
      to: 500,
      from: 200,

      onStart: async () => {
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();

        const from = await model.calcPositionTipFrom(32.03);
        expect(+from.toFixed(2)).toBeCloseTo(33.53);

        const to = await model.calcPositionTipTo(32.03);
        expect(+to.toFixed(2)).toBeCloseTo(66.14);

        const single = await model.calcPositionTipSingle(72.87);
        expect(+single.toFixed(2)).toBeCloseTo(47.83);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  const testName2 = ' Calculate numeral grid'
    + ' relating range and interval or step ';
  //  createMark
  test(testName2, async () => {
    let model = await new Model({
      min: 10,
      max: 800,
      gridRound: 0,
      gridStep: 0,
      gridNumber: 40,
      onStart: async () => {
        const values = [
          { value: 89, position: 10 },
          { value: 662, position: 82.5 },
          { value: 780, position: 97.5 },
        ];

        const grid = model.createMark();
        expect(grid[4]).toEqual(values[0]);
        expect(grid[33]).toEqual(values[1]);
        expect(grid[39]).toEqual(values[2]);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      min: -10.56,
      max: 800.78,
      gridRound: 1,
      gridStep: 15,
      gridNumber: 0,
      onStart: async () => {
        const valuesGrid = [
          { value: 64.4, position: 9.243966771020782 },
          { value: 514.4, position: 64.70776739714547 },
          { value: 574.4, position: 72.10294081396209 },
        ];

        const grid = model.createMark();
        expect(grid[5]).toEqual(valuesGrid[0]);
        expect(grid[35]).toEqual(valuesGrid[1]);
        expect(grid[39]).toEqual(valuesGrid[2]);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
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
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();
        const positionBar = { barXY: 23.91304347826087, widthBar: 54.347826086956516 };
        expect(model.calcPositionBar()).toEqual(positionBar);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      type: 'single',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      onStart: async () => {
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        const positionBar = { barXY: 0, widthBar: 23.91304347826087 };
        expect(model.calcPositionBar()).toEqual(positionBar);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
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
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();

        let pointerLine = { from: 126, to: 600 };
        expect(model.clickLine(300)).toEqual(pointerLine);
        pointerLine = { from: 250, to: 600 };
        expect(model.clickLine(450)).toEqual(pointerLine);
        pointerLine = { from: 250, to: 537 };
        expect(model.clickLine(800)).toEqual(pointerLine);
        pointerLine = { from: 250, to: 784 };
        expect(model.clickLine(1100)).toEqual(pointerLine);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      type: 'single',
      orientation: 'vertical',
      min: -120,
      max: 800,
      from: 100,

      onStart: async () => {
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();

        expect(model.clickLine(300).from).toBeCloseTo(554);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      type: 'double',
      min: -120,
      max: 500,
      from: 200,
      to: 300,

      onStart: async () => {
        await model.setWrapperWidthHeight(600);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();

        const { to } = model.clickLine(601);
        expect(to).toBeCloseTo(501);
        const { from } = model.clickLine(-1);
        expect(from).toBeCloseTo(-121);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  const testName3 = ' Check calculation of a click'
    + ' on a progress-bar between dots ';
  // clickBar
  test(testName3, async () => {
    let model = await new Model({
      type: 'double',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      onStart: async () => {
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        await model.calcPositionDotTo();
        let pointerBar = { from: 344, to: 600 };
        expect(model.clickBar(297)).toEqual(pointerBar);
        pointerBar = { from: 344, to: 582 };
        expect(model.clickBar(290)).toEqual(pointerBar);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      orientation: 'vertical',
      type: 'single',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      onStart: async () => {
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        const pointerBar = { from: 92, to: 100 };
        expect(model.clickBar(10)).toEqual(pointerBar);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      type: 'single',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      onStart: async () => {
        await model.setWrapperWidthHeight(1120);
        await model.calcOnePercent();
        await model.calcPositionDotFrom();
        const pointerBar = { from: -79, to: 100 };
        expect(model.clickBar(50)).toEqual(pointerBar);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  const testName4 = ' Check dots values changes '
    + 'on clicking on the grid element ';
  // clickMark
  test(testName4, async () => {
    let model = await new Model({
      type: 'double',
      min: -120,
      max: 800,
      to: 600,
      from: 100,

      onStart: async () => {
        let pointerGrid = { from: 150, to: 600 };
        expect(model.clickMark(150)).toEqual(pointerGrid);

        pointerGrid = { from: 150, to: 700 };
        expect(model.clickMark(700)).toEqual(pointerGrid);

        pointerGrid = { from: 10, to: 700 };
        expect(model.clickMark(10)).toEqual(pointerGrid);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      type: 'single',
      min: -120,
      max: 800,
      to: 600,
      from: 100,

      onStart: async () => {
        let pointerGrid = { from: 150, to: 100 };
        expect(model.clickMark(150)).toEqual(pointerGrid);

        pointerGrid = { from: 700, to: 100 };
        expect(model.clickMark(700)).toEqual(pointerGrid);

        pointerGrid = { from: 10, to: 100 };
        expect(model.clickMark(10)).toEqual(pointerGrid);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  const testName5 = ' Calculate dots positions relating '
    + 'grid mark and further moovement along the grid ';
  //  calcSnap & snapDot
  test(testName5, async () => {
    const model = await new Model({
      type: 'double',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      grid: true,
      gridSnap: true,
      gridNumber: 20,

      onStart: async () => {
        const snap: number[] = [];

        model.createMark().forEach((item) => {
          snap.push(item.value);
        });

        snap.shift();
        snap.pop();

        const data = { from: 110, to: 616 };
        expect(model.calcSnap(snap)).toEqual(data);
        expect(model.snapDot()).toEqual(data);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });

  const testName6 = ' Calculate dots movement when'
    + ' controlling from keyboard ';
  // calcKeyDown
  test(testName6, async () => {
    let model = await new Model({
      type: 'double',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      keyStepOne: 5,
      keyStepHold: 10,
      onStart: async () => {
        let data = { from: 105, to: 600 };
        expect(model.calcKeyDown(false, '+', 'from')).toEqual(data);
        data = { from: 100, to: 600 };
        expect(model.calcKeyDown(false, '-', 'from')).toEqual(data);
        data = { from: 100, to: 605 };
        expect(model.calcKeyDown(false, '+', 'to')).toEqual(data);
        data = { from: 100, to: 600 };
        expect(model.calcKeyDown(false, '-', 'to')).toEqual(data);
        data = { from: 110, to: 600 };
        expect(model.calcKeyDown(true, '+', 'from')).toEqual(data);
        data = { from: 100, to: 600 };
        expect(model.calcKeyDown(true, '-', 'from')).toEqual(data);
        data = { from: 100, to: 610 };
        expect(model.calcKeyDown(true, '+', 'to')).toEqual(data);
        data = { from: 100, to: 600 };
        expect(model.calcKeyDown(true, '-', 'to')).toEqual(data);
      },
    });

    if (model.onHandle) { await model.onHandle(); }

    model = await new Model({
      type: 'double',
      min: -120,
      max: 800,
      to: 600,
      from: 100,
      grid: true,
      gridSnap: true,
      gridNumber: 40,
      keyStepOne: 0,
      keyStepHold: 0,
      onStart: async () => {
        const snap: number[] = [];

        model.createMark().forEach((item) => {
          snap.push(item.value);
        });

        snap.shift();
        snap.pop();

        let data = { from: 110, to: 593 };
        expect(model.calcSnap(snap)).toEqual(data);
        expect(model.snapDot()).toEqual(data);

        data = { from: 133, to: 593 };
        expect(model.calcKeyDown(false, '+', 'from')).toEqual(data);
        data = { from: 110, to: 593 };
        expect(model.calcKeyDown(false, '-', 'from')).toEqual(data);
        data = { from: 110, to: 616 };
        expect(model.calcKeyDown(false, '+', 'to')).toEqual(data);
      },
    });

    if (model.onHandle) { await model.onHandle(); }
  });
});