import { boundMethod } from 'autobind-decorator';
import RangeSliderOptions from '../../glob-interface';
import { CalcDotPositionOpt, Prop, PositionData } from './model.d';
import { Observer } from '../../Observer';

class Model extends Observer {
  // --- data config
  private type: string | null = null;

  private orientation: string | null = null;

  private theme: string | null = null;

  private min: number | null = null;

  private max: number | null = null;

  private from: number | null = null;

  private to: number | null = null;

  private step: number | null = null;

  private keyStepOne: number | null = null;

  private keyStepHold: number | null = null;

  private bar: boolean | null = null;

  private tipPrefix: string | null = null;

  private tipPostfix: string | null = null;

  private tipMinMax: boolean | null = null;

  private tipFromTo: boolean | null = null;

  private gridSnap: boolean | null = null;

  private gridNum: number | null = null;

  private gridStep: number | null = null;

  private gridRound: number | null = null;

  private grid: boolean | null = null;

  private disabled: boolean | null = null;

  private defaultData: RangeSliderOptions | null = null;

  // --- internal data.
  private valP: number = 0;

  private fromP: number = 0;

  private toP: number = 0;

  private limitFrom: number = 0;

  private limitTo: number = 0;

  private wrapWH: number = 0;

  private snapNum: number[] = [];

  private stepNum: number[] = [];

  private stepGrid: number = 0;

  private MAX_VAL = 999999999999999;

  private MIN_VAL = -999999999999999;

  private startConfFl: boolean = false;

  private updateConfFl: boolean = false;

  onHandle: Function | null = null;

  onChange: Function | null = null;

  onUpdate: Function | null = null;

  onStart: Function | null = null;

  onReset: Function | null = null;

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
    const options = this.defaultData ?? {};

    Object.keys(options).forEach((key) => {
      // использую type assertions так как не нашёл возможности передавать нужный тип
      // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
      const value = Model.getProperty(options, key as keyof RangeSliderOptions);
      Model.setProperty(this, key as keyof Model, value as this[keyof Model]);
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
        ...options,
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
    this.fromP = ((this.from ?? 0) - (this.min ?? 0)) / this.valP; // left dot position (in %)
    this.limitFrom = this.fromP;
    return this.fromP;
  }

  calcPositionDotTo() {
    this.toP = ((this.to ?? 0) - (this.min ?? 0)) / this.valP; // right dot position (in %)
    this.limitTo = this.toP;
    return this.toP;
  }

  setWrapWH(value: number) {
    this.wrapWH = value || 319;
    return this.wrapWH;
  }

  calcDotPosition(options: CalcDotPositionOpt) {
    let fromFlag = false;
    let toFlag = false;
    const typeFrom = options.type === 'From';

    this.setWrapWH(options.wrapWH);

    let percent = this.convertToPercent({
      fl: typeFrom,
      clientXY: options.clientXY,
      shiftXY: options.shiftXY,
      position: options.position,
    });

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const typeFlag = this.type === 'single';

    if (typeFlag) { // if single dot
      this.fromP = percent;
      fromFlag = true;
    } else if (!(this.limitFrom > this.limitTo)) { // if double dot and FROM is less than TO
      // depending on which dot is mooving
      if (typeFrom) {
        this.fromP = percent;
        fromFlag = true;
      } else {
        this.toP = percent;
        toFlag = true;
      }
    } else { // if FROM is greater than TO
      // take value of another dot (which the mooving dot is approaching closely)
      if (typeFrom) { this.fromP = this.toP; } else { this.toP = this.fromP; }

      fromFlag = true;
      toFlag = true;
    }

    let from: number | null = null;
    let to: number | null = null;

    if (fromFlag) {
      from = this.getDataDotFrom(); // get FROM value
    }

    if (toFlag) {
      to = this.getDataDotTo(); //  get TO value
    }

    if (this.gridSnap && !this.step) {
      if (fromFlag) {
        from = Model.getValStep(from ?? 0, this.stepGrid, this.snapNum);
      }
      if (!typeFlag && toFlag) {
        to = Model.getValStep(to ?? 0, this.stepGrid, this.snapNum);
      }
    }

    let signDirection = '';

    const formPosition = this.from ?? 0;
    const toPosition = this.to ?? 0;

    if (formPosition < (from ?? 0) && fromFlag) signDirection = 'right';
    if (toPosition < (to ?? 0) && toFlag) signDirection = 'right';
    if (formPosition > (from ?? 0) && fromFlag) signDirection = 'left';
    if (toPosition > (to ?? 0) && toFlag) signDirection = 'left';
    if (signDirection === '') return false;

    if (this.step) {
      if (fromFlag) {
        from = Model.getValStep(from ?? 0, this.step, this.stepNum);
      }
      if (!typeFlag && toFlag) {
        to = Model.getValStep(to ?? 0, this.step, this.stepNum);
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

    const length = Model.trimFraction(this.step);
    const stepNum: number[] = [];

    const min = this.min ?? 0;
    const max = this.max ?? 0;

    let step = +(min + this.step).toFixed(length);
    stepNum.push(min);
    for (let i = min; i <= max;) {
      i = +(i += this.step).toFixed(length);
      if (step === i && i < max) {
        stepNum.push(step);
        step = +(step += this.step).toFixed(length);
      } else break;
    }
    stepNum.push(max);
    this.stepNum = stepNum;
    return stepNum;
  }

  @boundMethod
  calcPositionTipFrom(tipFrom: number) {
    return this.fromP - this.calcWidthP(tipFrom - 4);
  }

  @boundMethod
  calcPositionTipTo(tipTo: number) {
    return this.toP - this.calcWidthP(tipTo - 4);
  }

  @boundMethod
  calcPositionTipSingle(singleWH: number) {
    return (
      this.fromP
      + ((this.toP - this.fromP) / 2)
      - this.calcWidthP(singleWH)
    );
  }

  createMark() {
    const masMark: {
      val: number,
      position: number,
    }[] = [];

    const notify = (valueG: number, position: number) => {
      masMark.push({
        val: +valueG.toFixed(this.gridRound ?? 0),
        position,
      });
    };

    notify(this.min ?? 0, 0);
    const { interval, step } = this.calcGridNumStep();
    let obj = this.calcPositionGrid(this.min ?? 0, step);
    notify(obj.value, obj.position);

    for (let i = 1; i < interval - 1; i += 1) {
      obj = this.calcPositionGrid(obj.value, step);
      notify(obj.value, obj.position);
    }
    notify(this.max ?? 0, 100);

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

  @boundMethod
  clickBar(pointXY: number) {
    const vertical = this.orientation === 'vertical';
    const onePercent = this.wrapWH / 100; // one percent of the entire scale

    const verticalC = (valPercent: number) => this.clickLine(
      ((100 - valPercent) * onePercent) + pointXY,
    );

    if (this.type === 'single') {
      if (vertical) return verticalC(this.fromP);
      return this.clickLine(pointXY);
    }
    if (vertical) return verticalC(this.toP);
    return this.clickLine(this.fromP * onePercent + pointXY);
  }

  @boundMethod
  clickMark(value: number) {
    let { from } = this;
    let { to } = this;

    if (this.type === 'single') {
      from = value;
    } else if (value > (to ?? 0)) { // if the value is greater than TO
      to = value; // set on this dot
    } else if (value > (from ?? 0)) { // if the value is greater than FROM
      const To = (to ?? 0) - value; // extract Val from TO
      const From = value - (from ?? 0); // extract FROM from VAL

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
  @boundMethod
  clickLine(pointXY: number) {
    let { from } = this;
    let { to } = this;
    let fromFlag = false;
    let toFlag = false;

    const onePercent = this.wrapWH / 100; // one percent of the entire scale
    let pointPercent = 0;

    if (this.orientation === 'vertical') {
      pointPercent = 100 - (pointXY / onePercent); // total percentage in the clicked area
    } else {
      pointPercent = pointXY / onePercent; // total percentage in the clicked area
    }

    if (this.type === 'single') {
      this.fromP = pointPercent;
      fromFlag = true;
    } else if (pointPercent > this.toP) { // if the value is greater than TO
      this.toP = pointPercent; // set on this dot
      toFlag = true;
    } else if (pointPercent > this.fromP) { // if TO is smaller then FROM is greater
      const To = this.toP - pointPercent; // extract VAL from TO
      const From = pointPercent - this.fromP; // extract FROM from VAL

      if (From > To) { // that dot is closer which value is smaller
        this.toP = pointPercent;
      } else {
        this.fromP = pointPercent;
      }

      if (From > To) {
        toFlag = true;
      } else {
        fromFlag = true;
      }
    } else { //  if VAL is smaller than FROM, then move FROM
      this.fromP = pointPercent;
      fromFlag = true;
    }

    if (fromFlag) {
      from = this.getDataDotFrom(); // get value FROM
    }

    if (toFlag) {
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

    this.from = Model.getValStep(this.from ?? 0, this.stepGrid, this.snapNum);

    if (this.type === 'double') {
      this.to = Model.getValStep(this.to ?? 0, this.stepGrid, this.snapNum);
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

  @boundMethod
  calcSnap(snapNum: number[]) {
    this.snapNum = [];
    this.snapNum.push(this.min ?? 0, ...snapNum, this.max ?? 0);
    this.stepGrid = this.snapNum[1] - this.snapNum[0];

    return this.snapDot();
  }

  calcKeyDown(repeat: boolean, sign: string, dot: string) {
    let { from } = this;
    let { to } = this;
    const signFlag = sign === '+';
    const dotFlag = dot === 'from';
    const typeFlag = this.type === 'double';
    const keyFlag = !this.keyStepOne && !this.keyStepHold;

    if (this.gridSnap && !this.step && keyFlag) {
      const prev = this.snapNum[this.snapNum.length - 2];

      const value = (i: number) => {
        const number = this.snapNum[!signFlag ? i - 2 : i];

        if (dotFlag) {
          from = number;
        } else {
          to = number;
        }
      };

      const moveFrom = (item: number, i: number) => {
        if ((from ?? 0) < item && dotFlag) {
          if (from === to && signFlag && typeFlag) return false;
          value(i);
          return false;
        }
        if (from === this.min) {
          if (signFlag) {
            [, from] = this.snapNum;
            return false;
          }
        } else if (from === this.max) {
          if (!signFlag) {
            from = prev;
            return false;
          }
        }
        return true;
      };

      const moveTo = (item: number, i: number) => {
        if ((to ?? 0) < item && !dotFlag) {
          value(i);
          return false;
        } if (to === this.max) {
          if (!signFlag) {
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
        const length = Model.trimFraction(step);
        const fromVal = from ?? 0;
        const toVal = to ?? 0;

        if (dotFlag) {
          const num = !signFlag ? fromVal - step : fromVal + step;
          from = +num.toFixed(length);
        } else {
          const num = !signFlag ? toVal - step : toVal + step;
          to = +num.toFixed(length);
        }
        if (this.type === 'double') {
          if (fromVal > toVal && dotFlag) from = to;
          if (fromVal > toVal && !dotFlag) to = from;
        }
      };

      if (!keyFlag) {
        if (!this.keyStepOne && this.keyStepHold) {
          this.keyStepOne = 1;
        }
        if (!this.keyStepHold && this.keyStepOne) {
          this.keyStepHold = +this.keyStepOne.toFixed(
            Model.trimFraction(this.keyStepOne),
          );
        }

        if (repeat) {
          value(this.keyStepHold ?? 0);
        } else {
          value(this.keyStepOne ?? 0);
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

  private calcPositionGrid(value: number, step: number) {
    const shift = value + step;
    return {
      value: shift,
      position: ((shift - (this.min ?? 0)) * 100) / this.getRange(),
    };
  }

  private static getValStep(value: number, step: number, items: number[]) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (value < item) {
        return (step - (item - value)) < step / 2
          ? items[i ? i - 1 : i] : item;
      }
    }
    return value;
  }

  private getDataDotFrom() {
    return +((this.min ?? 0) + (this.fromP * this.valP)).toFixed(0);
  }

  private getDataDotTo() {
    return +((this.min ?? 0) + (this.toP * this.valP)).toFixed(0);
  }

  private static trimFraction(num: number) {
    return String(num).replace(`${Math.trunc(num)}.`, '').length;
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
    // eslint-disable-next-line no-param-reassign
    obj[key] = value;
  }

  private static propertiesValidation(
    // eslint-disable-next-line no-use-before-define
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
    // eslint-disable-next-line no-underscore-dangle
    const _this = this;
    // использую type assertions так как не нашёл возможности передавать нужный тип
    // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
    const key = str as keyof typeof _this;
    const value = this[key];
    const valFlag = (value ?? null) != null;

    if (!Model.isEmpty(data)) {
      return valFlag ? value : null;
    }
    return data;
  }

  private setRangeData(options: RangeSliderOptions): boolean {
    if (!Model.propertiesValidation(['min', 'max'], options)) return false;

    let { min } = options;
    let { max } = options;

    min = Number(this.checkValue(min, 'min'));
    if (min == null) return false;

    max = Number(this.checkValue(max, 'max'));
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

      const to = this.to ?? 0;
      const from = this.from ?? 0;

      if (this.max < to) { this.to = this.max; }

      if (this.max < from) { this.from = this.max; }

      if (this.min > to) { this.to = this.min; }

      if (this.min > from) { this.from = this.min; }

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

  private validVal(val: number) {
    if (val <= this.getRange()) return val;
    return this.getRange();
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

    step = Number(this.checkValue(step, 'step'));
    if (step == null) { step = 0; }

    keyStepOne = Number(this.checkValue(keyStepOne, 'keyStepOne'));
    if (keyStepOne == null) { keyStepOne = 0; }

    keyStepHold = Number(this.checkValue(keyStepHold, 'keyStepHold'));
    if (keyStepHold == null) { keyStepHold = 0; }

    this.step = this.validVal(+step);
    this.keyStepOne = this.validVal(+keyStepOne);
    this.keyStepHold = this.validVal(+keyStepHold);

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

    from = Number(this.checkValue(from, 'from'));
    if (from == null) return false;

    const min = this.min ?? 0;
    const max = this.max ?? 0;

    if (from >= min && from <= max) {
      this.from = +from;
    } else {
      if (from < min) { this.from = this.min; }

      if (from > max) { this.from = max; }
    }

    if (type === 'double') { // check FROM and TO
      to = Number(this.checkValue(to, 'to'));
      if (to == null) return false;

      if (from > to) {
        const temp = from;
        from = to;
        to = temp;
      }

      if (to <= max) {
        this.to = to;
      } else {
        this.to = max;
      }
    } else if (max >= 2 && (this.from ?? 0) <= 2) {
      this.to = this.to ?? 2;
    } else {
      this.to = this.to ?? this.from;
    }

    if (!this.startConfFl && !this.updateConfFl) {
      if (this.gridSnap && !this.step) {
        this.from = Model.getValStep(
          this.from ?? 0,
          this.stepGrid,
          this.snapNum,
        );
        if (type === 'double') {
          this.to = Model.getValStep(
            this.to ?? 0,
            this.stepGrid,
            this.snapNum,
          );
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
      this.gridSnap = options.gridSnap ?? false;
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
    let gridRound: number | null = Math.trunc(options.gridRound ?? 0);

    if (Number.isNaN(gridRound)) gridRound = null;

    grid = Boolean(this.checkValue(grid, 'grid') ?? false);
    this.grid = Boolean(grid);

    if (!Model.isEmpty(this.min) || !Model.isEmpty(this.max)) return false;

    gridNum = Number(this.checkValue(gridNum, 'gridNum') ?? 0);
    gridStep = Number(this.checkValue(gridStep, 'gridStep') ?? 0);
    gridRound = Number(this.checkValue(gridRound, 'gridRound') ?? 0);

    const long = (this.max ?? 0) - (this.min ?? 0);

    if (gridStep > long) {
      gridStep = long;
    }

    if (gridStep > (this.max ?? 0)) { gridStep = this.max; }

    if (!gridNum && !gridStep) {
      gridNum = 4;
    }

    if (gridRound < 0 || gridRound > 100) {
      gridRound = 0;
    }

    this.gridRound = Number(gridRound);
    this.gridNum = Number(gridNum);
    this.gridStep = Number(gridStep);

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

    const orientation = options.orientation ?? ''.replace(/\s/g, '');

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

    const theme = options.theme ?? ''.replace(/\s/g, '');

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

  private static checkData(fun: Function | null) {
    if (fun === null) {
      return null;
    }
    if (typeof fun === 'function') return fun;

    return null;
  }

  private setCallbacks(options: RangeSliderOptions): boolean {
    const checkKey = [
      'onStart',
      'onChange',
      'onUpdate',
      'onReset',
    ];
    let flag = false;
    for (let i = 0; i < checkKey.length; i += 1) {
      if (Object.keys(options).lastIndexOf(checkKey[i]) !== -1) {
        flag = true;
        break;
      }
    }
    if (!flag) return false;

    if (options.onChange !== this.onChange) {
      if (options.onChange !== undefined) {
        this.onChange = Model.checkData(options.onChange);
      }
    }

    if (options.onUpdate !== this.onUpdate) {
      if (options.onUpdate !== undefined) {
        this.onUpdate = Model.checkData(options.onUpdate);
      }
    }

    if (options.onStart !== this.onStart) {
      if (options.onStart !== undefined) {
        this.onStart = Model.checkData(options.onStart);
      }
    }

    if (options.onReset !== this.onReset) {
      if (options.onReset !== undefined) {
        this.onReset = Model.checkData(options.onReset);
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
      this.tipPostfix = String(tipPostfix).replace(/\s/g, '').substring(0, 15);
    } else {
      this.tipPostfix = '';
    }

    tipPrefix = String(this.checkValue(tipPrefix, 'tipPrefix'));
    if (tipPrefix != null) {
      this.tipPrefix = String(tipPrefix).replace(/\s/g, '').substring(0, 15);
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

    this.disabled = options.disabled ?? false;

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

    this.bar = options.bar ?? false;

    this.notifyOB({
      key: 'BarData',
      bar: this.bar,
    });
    return true;
  }

  private getRange() {
    return (this.max ?? 0) - (this.min ?? 0);
  }

  private convertToPercent(options: PositionData) {
    const {
      fl, clientXY, shiftXY, position,
    } = options;
    const dotXY = clientXY - shiftXY;
    let number = 0;

    if (this.orientation === 'vertical') {
      number = position - dotXY;
    } else {
      number = dotXY - position;
    }
    const percent = (number * 100) / this.wrapWH;

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
      interval = this.gridNum ?? 0;
      step = ((this.max ?? 0) - (this.min ?? 0)) / interval; // define step
    }
    return { interval, step };
  }
}

export default Model;
