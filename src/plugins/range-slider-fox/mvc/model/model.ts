import RangeSliderOptions from '../../glob-interface';
import { CalcDotPositionOpt, Prop, PositionData } from './model.d';
import { Observer } from '../../observer';

class Model extends Observer {
  // --- data config
  private type: string;

  private orientation: string;

  private theme: string;

  private min: number;

  private max: number;

  private from: number;

  private to: number;

  private step: number;

  private keyStepOne: number;

  private keyStepHold: number;

  private bar: boolean;

  private tipPrefix: string;

  private tipPostfix: string;

  private tipMinMax: boolean;

  private tipFromTo: boolean;

  private gridSnap: boolean;

  private gridNum: number;

  private gridStep: number;

  private gridRound: number;

  private grid: boolean;

  private disabled: boolean;

  private defaultData: RangeSliderOptions;

  // --- internal data.
  private valP: number;

  private fromP: number;

  private toP: number;

  private limitFrom: number;

  private limitTo: number;

  private wrapWH: number;

  private snapNum: number[] = [];

  private stepNum: number[] = [];

  private stepGrid: number;

  private MAX_VAL = 999999999999999;

  private MIN_VAL = -999999999999999;

  private startConfFl: boolean;

  private updateConfFl: boolean;

  onHandle: Function;

  onChange: Function;

  onUpdate: Function;

  onStart: Function;

  onReset: Function;

  constructor(options: RangeSliderOptions) {
    super();
    this.createProperties(this.defaultConfig(options));
  }

  getOptions() {
    return {
      type: this.type,
      orientation: this.orientation,
      theme: this.theme,
      min: this.min,
      max: this.max,
      to: this.to,
      from: this.from,
      step: this.step,
      keyStepOne: this.keyStepOne,
      keyStepHold: this.keyStepHold,
      bar: this.bar,
      tipPrefix: this.tipPrefix,
      tipPostfix: this.tipPostfix,
      tipMinMax: this.tipMinMax,
      tipFromTo: this.tipFromTo,
      grid: this.grid,
      gridSnap: this.gridSnap,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
      gridRound: this.gridRound,
      disabled: this.disabled,
    };
  }

  reset() {
    const op = this.defaultData;
    const opKey = Object.keys(op);

    opKey.forEach((key) => {
      // использую type assertions так как не нашёл возможности передавать нужный тип
      // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
      const val = Model.getProperty(op, key as keyof RangeSliderOptions);
      Model.setProperty(this, key as keyof Model, val as this[keyof Model]);
    });

    const keysMap = [
      'RangeData',
      'Step',
      'DotData',
      'GridSnapData',
      'GridData',
      'ThemeData',
      'HintsData',
      'DisabledData',
      'BarData',
      'OrientationData',
      'Start',
    ];

    keysMap.forEach((key) => {
      this.notifyOB({
        key,
        ...op,
      });
    });

    if (this.startConfFl && typeof this.onReset === 'function') {
      this.onReset(this.defaultData);
    }
  }

  async update(options: RangeSliderOptions) {
    this.updateConfFl = true;

    await this.setCallbacks(options);
    await this.setRangeData(options);
    await this.setStep(options);
    await this.setDotData(options);
    await this.setGridData(options);
    await this.setGridSnapData(options);
    await this.setThemeData(options);
    await this.setBarData(options);
    await this.setDisabledData(options);
    await this.setHintsData(options);
    await this.setOrientationData(options);

    if (this.startConfFl && typeof this.onUpdate === 'function') {
      this.onUpdate(this.getOptions());
    }
    this.startConfFl = true;
    this.updateConfFl = false;
  }

  calcOnePercent() {
    this.valP = this.getRange() / 100;
    return this.valP;
  }

  // ---------------------------------- Handle

  calcPositionDotFrom() {
    this.fromP = (this.from - this.min) / this.valP; // left dot position (in %)
    this.limitFrom = this.fromP;
    return this.fromP;
  }

  calcPositionDotTo() {
    this.toP = (this.to - this.min) / this.valP; // right dot position (in %)
    this.limitTo = this.toP;
    return this.toP;
  }

  setWrapWH(val: number) {
    this.wrapWH = val || 319;
    return this.wrapWH;
  }

  calcDotPosition(options: CalcDotPositionOpt) {
    let fromFl = false;
    let toFl = false;
    const typeFrom = options.type === 'From';

    this.setWrapWH(options.wrapWH);

    let percent = this.convertToPercent({
      fl: typeFrom,
      clientXY: options.clientXY,
      shiftXY: options.shiftXY,
      position: options.position,
    });

    const limitDot = !(this.limitFrom > this.limitTo);

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const typeF = this.type === 'single';

    if (typeF) { // if single dot
      this.fromP = percent;
      fromFl = true;
    } else if (limitDot) { // if double dot and FROM is less than TO
      // depending on which dot is mooving
      if (typeFrom) {
        this.fromP = percent;
        fromFl = true;
      } else {
        this.toP = percent;
        toFl = true;
      }
    } else { // if FROM is greater than TO
      // take value of another dot (which the mooving dot is approaching closely)
      if (typeFrom) { this.fromP = this.toP; } else { this.toP = this.fromP; }

      fromFl = true;
      toFl = true;
    }

    let from: number;
    let to: number;

    if (fromFl) {
      from = this.getDataDotFrom(); // get FROM value
    }

    if (toFl) {
      to = this.getDataDotTo(); //  get TO value
    }

    if (this.gridSnap && !this.step) {
      if (fromFl) {
        from = Model.getValStep(from, this.stepGrid, this.snapNum);
      }
      if (!typeF && toFl) {
        to = Model.getValStep(to, this.stepGrid, this.snapNum);
      }
    }

    let signF = '';
    if (this.from < from && fromFl) signF = 'right';
    if (this.to < to && toFl) signF = 'right';
    if (this.from > from && fromFl) signF = 'left';
    if (this.to > to && toFl) signF = 'left';
    if (signF === '') return false;

    if (this.step) {
      if (fromFl) { from = Model.getValStep(from, this.step, this.stepNum); }
      if (!typeF && toFl) {
        to = Model.getValStep(to, this.step, this.stepNum);
      }
    }

    this.setDotData({
      from,
      to,
    });
    return { from, to };
  }

  calcStep() {
    if (!this.step) return false;

    const len = Model.trimFraction(this.step);
    const mas: number[] = [];
    let kol = +(this.min + this.step).toFixed(len);
    mas.push(this.min);
    for (let i = this.min; i <= this.max;) {
      i = +(i += this.step).toFixed(len);
      if (kol === i && i < this.max) {
        mas.push(kol);
        kol = +(kol += this.step).toFixed(len);
      } else break;
    }
    mas.push(this.max);
    this.stepNum = mas;
    return this.stepNum;
  }

  calcPositionTipFrom = (tipFrom: number) => {
    const tipFromP = this.calcWidthP(tipFrom - 4);
    return this.fromP - tipFromP;
  }

  calcPositionTipTo = (tipTo: number) => {
    const tipToP = this.calcWidthP(tipTo - 4);
    return this.toP - tipToP;
  }

  calcPositionTipSingle = (singleWH: number) => {
    const line = (this.toP - this.fromP) / 2;
    const centerFromTo = this.fromP + line;
    const tipSingleP = this.calcWidthP(singleWH);
    return centerFromTo - tipSingleP;
  }

  createMark() {
    const range = this.getRange();
    const masMark: {
      val: number,
      position: number,
    }[] = [];

    const calcPositionGrid = (value: number, step: number) => {
      value += step;
      const position = ((value - this.min) * 100) / range;
      return { value, position };
    };

    const notify = (valueG: number, position: number) => {
      const val = +valueG.toFixed(this.gridRound);
      masMark.push({ val, position });
    };

    notify(this.min, 0);
    const { interval, step } = this.calcGridNumStep();
    let obj = calcPositionGrid(this.min, step);
    notify(obj.value, obj.position);

    for (let i = 1; i < interval - 1; i += 1) {
      obj = calcPositionGrid(obj.value, step);
      notify(obj.value, obj.position);
    }
    notify(this.max, 100);

    this.notifyOB({
      key: 'CreateGrid',
      valMark: masMark,
    });

    return masMark;
  }

  // ---------------------------------- Bar
  calcPositionBar() {
    let barX = 0;
    let widthBar = 0;
    if (this.type === 'double') {
      barX = this.fromP;
      widthBar = this.toP - this.fromP;
    } else {
      widthBar = this.fromP;
    }
    return { barX, widthBar };
  }

  clickBar = (pointXY: number) => {
    const vertical = this.orientation === 'vertical';
    const oneP = this.wrapWH / 100; // one percent of the entire scale

    const verticalC = (valP: number) => {
      const remainderP = 100 - valP;
      pointXY = remainderP * oneP + pointXY;
      return this.clickLine(pointXY);
    };

    if (this.type === 'single') {
      if (vertical) return verticalC(this.fromP);
      return this.clickLine(pointXY);
    }
    if (vertical) return verticalC(this.toP);
    return this.clickLine(this.fromP * oneP + pointXY);
  }

  clickMark = (value: number) => {
    let { from } = this;
    let { to } = this;

    if (this.type === 'single') {
      from = value;
    } else if (value > to) { // if the value is greater than TO
      to = value; // set on this dot
    } else if (value > from) { // if the value is greater than FROM
      const To = to - value; // extract Val from TO
      const From = value - from; // extract FROM from VAL

      if (From > To) {
        to = value;
      } else {
        from = value;
      }
    } else { // if VAL is smaller than FROM, then move FROM
      from = value;
    }

    this.setDotData({
      type: this.type,
      from,
      to,
    });
    return { from, to };
  }

  // ---------------------------------- Line
  clickLine = (pointXY: number) => {
    const vertical = this.orientation === 'vertical';
    let { from } = this;
    let { to } = this;
    let fromFl = false;
    let toFl = false;

    const oneP = this.wrapWH / 100; // one percent of the entire scale
    let pointP = 0;

    if (vertical) {
      pointP = 100 - (pointXY / oneP); // total percentage in the clicked area
    } else {
      pointP = pointXY / oneP; // total percentage in the clicked area
    }

    if (this.type === 'single') {
      this.fromP = pointP;
      fromFl = true;
    } else if (pointP > this.toP) { // if the value is greater than TO
      this.toP = pointP; // set on this dot
      toFl = true;
    } else if (pointP > this.fromP) { // if TO is smaller then FROM is greater
      const To = this.toP - pointP; // extract VAL from TO
      const From = pointP - this.fromP; // extract FROM from VAL

      if (From > To) { // that dot is closer which value is smaller
        this.toP = pointP;
      } else {
        this.fromP = pointP;
      }

      if (From > To) {
        toFl = true;
      } else {
        fromFl = true;
      }
    } else { //  if VAL is smaller than FROM, then move FROM
      this.fromP = pointP;
      fromFl = true;
    }

    if (fromFl) {
      from = this.getDataDotFrom(); // get value FROM
    }

    if (toFl) {
      to = this.getDataDotTo(); // get value TO
    }

    this.setDotData({
      type: this.type,
      from,
      to,
    });

    return { from, to };
  }

  snapDot() {
    if (!this.gridSnap) return false;

    this.from = Model.getValStep(this.from, this.stepGrid, this.snapNum);

    if (this.type === 'double') {
      this.to = Model.getValStep(this.to, this.stepGrid, this.snapNum);
    }

    this.notifyOB({
      key: 'DotData',
      type: this.type,
      from: this.from,
      to: this.to,
    });

    if (typeof this.onChange === 'function') {
      this.onChange(this.getOptions());
    }
    return { from: this.from, to: this.to };
  }

  calcSnap = (snapNum: number[]) => {
    this.snapNum = [];
    this.snapNum.push(this.min, ...snapNum, this.max);
    this.stepGrid = this.snapNum[1] - this.snapNum[0];

    return this.snapDot();
  }

  calcKeyDown(repeat: boolean, sign: string, dot: string) {
    let { from } = this;
    let { to } = this;
    const signF = sign === '+';
    const dotF = dot === 'from';
    const typeF = this.type === 'double';
    const keyF = !this.keyStepOne && !this.keyStepHold;

    if (this.gridSnap && !this.step && keyF) {
      const prev = this.snapNum[this.snapNum.length - 2];

      const value = (i: number) => {
        const val = this.snapNum[!signF ? i - 2 : i];

        if (dotF) {
          from = val;
        } else {
          to = val;
        }
      };

      const moveFrom = (item: number, i: number) => {
        if (from < item && dotF) {
          if (from === to && signF && typeF) return false;
          value(i);
          return false;
        }
        if (from === this.min) {
          if (signF) {
            [, from] = this.snapNum;
            return false;
          }
        } else if (from === this.max) {
          if (!signF) {
            from = prev;
            return false;
          }
        }
        return true;
      };

      const moveTo = (item: number, i: number) => {
        if (to < item && !dotF) {
          value(i);
          return false;
        } if (to === this.max) {
          if (!signF) {
            to = prev;
            return false;
          }
        }
        return true;
      };

      for (let i = 0; i < this.snapNum.length; i += 1) {
        const item = this.snapNum[i];
        if (!moveFrom(item, i)) break;
        if (!moveTo(item, i)) break;
      }
    } else {
      const value = (step: number) => {
        const len = Model.trimFraction(step);

        if (dotF) {
          const num = !signF ? from - step : from + step;
          from = +num.toFixed(len);
        } else {
          const num = !signF ? to - step : to + step;
          to = +num.toFixed(len);
        }
        if (this.type === 'double') {
          if (from > to && dotF) from = to;
          if (from > to && !dotF) to = from;
        }
      };

      if (!keyF) {
        if (!this.keyStepOne && this.keyStepHold) {
          this.keyStepOne = 1;
        }
        if (!this.keyStepHold && this.keyStepOne) {
          const len = Model.trimFraction(this.keyStepOne);
          this.keyStepHold = +this.keyStepOne.toFixed(len);
        }

        if (repeat) {
          value(this.keyStepHold);
        } else {
          value(this.keyStepOne);
        }
      } else if (this.step) {
        value(this.step);
      } else {
        value(1);
      }
    }

    this.setDotData({
      from,
      to,
    });

    return { from, to };
  }

  private static getValStep(val: number, step: number, mas: number[]) {
    for (let i = 0; i < mas.length; i += 1) {
      const item = mas[i];
      if (val < item) {
        const ost = step - (item - val);
        return ost < step / 2
          ? mas[i ? i - 1 : i] : item;
      }
    }
    return val;
  }

  private getDataDotFrom() {
    return +(this.min + (this.fromP * this.valP)).toFixed(0);
  }

  private getDataDotTo() {
    return +(this.min + (this.toP * this.valP)).toFixed(0);
  }

  private static trimFraction(num: number) {
    const integer = Math.trunc(num);
    const str = String(num).replace(`${integer}.`, '');
    const len = str.length;
    return len;
  }

  private defaultConfig(options: RangeSliderOptions) {
    this.startConfFl = false;
    this.updateConfFl = false;

    return {
      type: 'single', // type - single or double dot
      orientation: 'horizontal', // slider orientation
      theme: 'base', // slider theme
      min: 0, // minimal value on the scale
      max: 10, // maximal value on the scale
      from: 1, // first dot position
      to: 2, // second dot position
      step: 0, // step of the dot mooving
      keyStepOne: 0, // step of the dot mooving on keyboard key single pressing
      keyStepHold: 0, // step of the dot mooving on keyboard key holding
      bar: false, // show or hide a bar
      tipPrefix: '', // prefix for hints (15 characters maximum)
      tipPostfix: '', // postfix for hints (15 characters maximum)
      tipMinMax: true, // hints are on
      tipFromTo: true, // hints are off
      grid: false, // scale is off
      gridSnap: false, // dot can't stop between scale marks
      gridNum: 0, // amount of intervals the scale is split into
      gridStep: 0, // amount of steps in the interval
      gridRound: 0, // fractional rounding
      disabled: false, // slider enabled or disabled
      ...options,
    };
  }

  private createProperties(options: RangeSliderOptions) {
    this.onHandle = async () => {
      this.onChange = options.onChange ?? null;
      this.onUpdate = options.onUpdate ?? null;
      this.onStart = options.onStart ?? null;
      this.onReset = options.onReset ?? null;

      await this.update(options);

      this.defaultData = await this.getOptions();
      await this.notifyOB({
        key: 'Start',
        ...this.defaultData,
      });

      if (typeof this.onStart === 'function') {
        await this.onStart(this.defaultData);
      }
    };
  }

  private static getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
  }

  private static setProperty<T, K extends keyof T>(
    obj: T,
    key: K,
    value: T[K],
  ) {
    obj[key] = value;
  }

  private static propertiesValidation(
    properties: Array<keyof typeof obj>,
    obj: RangeSliderOptions,
  ) {
    let flag = false;
    for (let i = 0; i < properties.length; i += 1) {
      const dataT = obj[properties[i]] ?? null;
      if (dataT !== null) {
        flag = true;
        break;
      }
    }
    if (!flag) return false;
    return true;
  }

  private static isEmpty(data: Prop) {
    return (data ?? null) != null;
  }

  private checkValue(data: Prop, str: string) {
    const _this = this;
    // использую type assertions так как не нашёл возможности передавать нужный тип
    // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
    const key = str as keyof typeof _this;
    const value = this[key];
    const valF = (value ?? null) != null;

    if (!Model.isEmpty(data)) {
      return valF ? value : null;
    }
    return data;
  }

  private setRangeData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(['min', 'max'], options)) return false;

    let { min } = options;
    let { max } = options;

    min = +this.checkValue(min, 'min');
    if (min == null) return false;

    max = +this.checkValue(max, 'max');
    if (max == null) return false;

    if (min < this.MIN_VAL || max > this.MAX_VAL) return false;

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    // need to check if new data is differ from the existing data in model
    if (min !== this.min || max !== this.max) {
      this.min = +min;
      this.max = +max;

      if (this.max < this.to) { this.to = this.max; }

      if (this.max < this.from) { this.from = this.max; }

      if (this.min > this.to) { this.to = this.min; }

      if (this.min > this.from) { this.from = this.min; }

      this.notifyOB({
        key: 'RangeData',
        min: this.min,
        max: this.max,
      });

      // if range is renewed, then recalculate all related data
      if (this.updateConfFl) {
        this.setDotData({
          from: this.from,
          to: this.to,
        });
      }
      return true;
    }
    return false;
  }

  private setStep(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation([
      'step',
      'keyStepOne',
      'keyStepHold',
    ], options)) return false;

    let { step } = options;
    let { keyStepOne } = options;
    let { keyStepHold } = options;

    step = +this.checkValue(step, 'step');
    if (step == null) { step = 0; }

    keyStepOne = +this.checkValue(keyStepOne, 'keyStepOne');
    if (keyStepOne == null) { keyStepOne = 0; }

    keyStepHold = +this.checkValue(keyStepHold, 'keyStepHold');
    if (keyStepHold == null) { keyStepHold = 0; }

    const validVal = (val: number) => {
      if (val <= this.getRange()) return val;
      return this.getRange();
    };

    this.step = validVal(+step);
    this.keyStepOne = validVal(+keyStepOne);
    this.keyStepHold = validVal(+keyStepHold);

    this.notifyOB({
      key: 'Step',
      step: this.step,
      keyStepOne: this.keyStepOne,
      keyStepHold: this.keyStepHold,
    });

    return false;
  }

  private setDotData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(
      ['type', 'from', 'to'],
      options,
    )) return false;

    let { type } = options;
    let { from } = options;
    let { to } = options;

    // check if all necessary data exists
    if (!Model.isEmpty(this.min)) return false;
    if (!Model.isEmpty(this.max)) return false;

    if (type === 'single' || type === 'double') {
      this.type = type;
    } else if (Model.isEmpty(this.type)) {
      type = this.type;
    } else return false;

    from = +this.checkValue(from, 'from');
    if (from == null) return false;

    if (from >= this.min && from <= this.max) {
      this.from = +from;
    } else {
      if (from < this.min) { this.from = this.min; }

      if (from > this.max) { this.from = this.max; }
    }

    if (type === 'double') // check FROM and TO
    {
      to = +this.checkValue(to, 'to');
      if (to == null) return false;

      if (from > to) {
        const temp = from;
        from = to;
        to = temp;
      }

      if (to <= this.max) {
        this.to = to;
      } else {
        this.to = this.max;
      }
    } else if (this.max >= 2 && this.from <= 2) {
      this.to = this.to ?? 2;
    } else {
      this.to = this.to ?? this.from;
    }

    if (!this.startConfFl && !this.updateConfFl) {
      if (this.gridSnap && !this.step) {
        this.from = Model.getValStep(this.from, this.stepGrid, this.snapNum);
        if (type === 'double') {
          this.to = Model.getValStep(this.to, this.stepGrid, this.snapNum);
        }
      }
    }

    this.notifyOB({
      key: 'DotData',
      type: this.type,
      from: this.from,
      to: this.to,
    });

    if (this.startConfFl && !this.updateConfFl) {
      if (typeof this.onChange === 'function') this.onChange(this.getOptions());
    }

    return true;
  }

  private setGridSnapData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(['gridSnap'], options)) {
      if (this.gridSnap === undefined) { this.gridSnap = false; }
      return false;
    }

    if (!this.grid) {
      this.gridSnap = false;
    } else {
      this.gridSnap = options.gridSnap;
    }

    this.notifyOB({
      key: 'GridSnapData',
      gridSnap: this.gridSnap,
    });
    return true;
  }

  private setGridData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation([
      'grid',
      'gridNum',
      'gridStep',
      'gridRound',
    ], options)) return false;

    let { grid } = options;
    let { gridNum } = options;
    let { gridStep } = options;
    let gridRound: number = Math.trunc(options.gridRound);

    if (Number.isNaN(gridRound)) gridRound = null;

    grid = Boolean(this.checkValue(grid, 'grid') ?? false);
    this.grid = Boolean(grid);

    if (!Model.isEmpty(this.min) || !Model.isEmpty(this.max)) return false;

    gridNum = +this.checkValue(gridNum, 'gridNum') ?? 0;
    gridStep = +this.checkValue(gridStep, 'gridStep') ?? 0;
    gridRound = +this.checkValue(gridRound, 'gridRound') ?? 0;

    const long = this.max - this.min;

    if (gridStep > long) {
      gridStep = long;
    }

    if (gridStep > this.max) { gridStep = this.max; }

    if (!gridNum && !gridStep) {
      gridNum = 4;
    }

    if (gridRound < 0 || gridRound > 100) {
      gridRound = 0;
    }

    this.gridRound = +gridRound;
    this.gridNum = +gridNum;
    this.gridStep = +gridStep;

    if (!this.grid) {
      if (this.gridSnap) {
        this.gridSnap = false;
        this.notifyOB({
          key: 'GridSnapData',
          gridSnap: this.gridSnap,
        });
      }
    }

    this.notifyOB({
      key: 'GridData',
      grid: this.grid,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
      gridRound: this.gridRound,
    });

    return true;
  }

  private setOrientationData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(['orientation'], options)) return false;

    const orientation = options.orientation.replace(/\s/g, '');

    if (orientation === 'horizontal' || orientation === 'vertical') {
      this.orientation = orientation;
    } else return false;

    this.notifyOB({
      key: 'OrientationData',
      orientation: this.orientation,
    });

    return true;
  }

  private setThemeData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(['theme'], options)) return false;

    const theme = options.theme.replace(/\s/g, '');

    if (theme.length <= 20) {
      this.theme = theme;
    } else {
      console.log('параметр theme - превышает допустимое '
        + 'количество символов (макс - 20)');
    }

    this.notifyOB({
      key: 'ThemeData',
      theme: this.theme,
    });
    return true;
  }

  private setCallbacks(options: RangeSliderOptions): boolean {
    const keyC = Object.keys(options);
    const checkKey = [
      'onStart',
      'onChange',
      'onUpdate',
      'onReset',
    ];
    let fl = false;
    for (let i = 0; i < checkKey.length; i += 1) {
      if (keyC.lastIndexOf(checkKey[i]) !== -1) {
        fl = true;
        break;
      }
    }
    if (!fl) return false;

    const checkData = (fun: Function) => {
      if (fun === null) {
        return null;
      }
      if (typeof fun === 'function') return fun;

      return null;
    };

    if (options.onChange !== this.onChange) {
      if (options.onChange !== undefined) {
        this.onChange = checkData(options.onChange);
      }
    }

    if (options.onUpdate !== this.onUpdate) {
      if (options.onUpdate !== undefined) {
        this.onUpdate = checkData(options.onUpdate);
      }
    }

    if (options.onStart !== this.onStart) {
      if (options.onStart !== undefined) {
        this.onStart = checkData(options.onStart);
      }
    }

    if (options.onReset !== this.onReset) {
      if (options.onReset !== undefined) {
        this.onReset = checkData(options.onReset);
      }
    }

    return true;
  }

  private setHintsData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation([
      'tipPrefix',
      'tipPostfix',
      'tipMinMax',
      'tipFromTo',
    ], options)) return false;

    let { tipPrefix } = options;
    let { tipPostfix } = options;
    let { tipMinMax } = options;
    let { tipFromTo } = options;

    tipPostfix = String(this.checkValue(tipPostfix, 'tipPostfix'));
    if (tipPostfix != null) {
      this.tipPostfix = String(tipPostfix).replace(/\s/g, '').substr(0, 15);
    } else {
      this.tipPostfix = '';
    }

    tipPrefix = String(this.checkValue(tipPrefix, 'tipPrefix'));
    if (tipPrefix != null) {
      this.tipPrefix = String(tipPrefix).replace(/\s/g, '').substr(0, 15);
    } else {
      this.tipPrefix = '';
    }

    tipMinMax = Boolean(this.checkValue(tipMinMax, 'tipMinMax'));
    if (tipMinMax != null) {
      this.tipMinMax = tipMinMax;
    } else {
      this.tipMinMax = true;
    }

    tipFromTo = Boolean(this.checkValue(tipFromTo, 'tipFromTo'));
    if (tipFromTo != null) {
      this.tipFromTo = tipFromTo;
    } else {
      this.tipFromTo = true;
    }

    this.notifyOB({
      key: 'HintsData',
      tipPrefix: this.tipPrefix,
      tipPostfix: this.tipPostfix,
      tipMinMax: this.tipMinMax,
      tipFromTo: this.tipFromTo,
      min: this.min,
      max: this.max,
      from: this.from,
      to: this.to,
      type: this.type,
    });
    return true;
  }

  private setDisabledData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(['disabled'], options)) {
      if (this.disabled === undefined) { this.disabled = false; }
      return false;
    }

    this.disabled = options.disabled;

    this.notifyOB({
      key: 'DisabledData',
      disabled: this.disabled,
    });

    return true;
  }

  private setBarData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(['bar'], options)) {
      if (this.bar === undefined) { this.bar = false; }
      return false;
    }

    this.bar = options.bar;

    this.notifyOB({
      key: 'BarData',
      bar: this.bar,
    });
    return true;
  }

  private getRange() {
    return this.max - this.min;
  }

  private convertToPercent(options: PositionData) {
    const {
      fl, clientXY, shiftXY, position,
    } = options;
    const vertical = this.orientation === 'vertical';
    const dotXY = clientXY - shiftXY;
    let num = 0;

    if (vertical) {
      num = position - dotXY;
    } else {
      num = dotXY - position;
    }
    const percent = (num * 100) / this.wrapWH;

    if (fl) {
      this.limitFrom = percent;
    } else {
      this.limitTo = percent;
    }
    return percent;
  }

  private calcWidthP(width: number) {
    return ((width * 100) / this.wrapWH) / 2;
  }

  private calcGridNumStep() {
    let interval = 0;
    let step = 0;

    if (this.gridStep && !this.gridNum) { // if STEP is defined and interval is set by default
      step = this.gridStep;
      interval = this.getRange() / step; // define new interval
    } else { // calculate in line with interval
      interval = this.gridNum;
      step = (this.max - this.min) / interval; // define step
    }
    return { interval, step };
  }
}

export default Model;
