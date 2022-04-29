import { boundMethod } from 'autobind-decorator';

import RangeSliderOptions from '../../glob-interface';
import { Observer } from '../../Observer';
import { CalcDotPositionOptions, Prop, PositionData } from './model.d';

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

  private gridNumber: number | null = null;

  private gridStep: number | null = null;

  private gridRound: number | null = null;

  private grid: boolean | null = null;

  private disabled: boolean | null = null;

  private defaultData: RangeSliderOptions | null = null;

  // --- internal data.
  private valuePercent: number = 0;

  private fromPercent: number = 0;

  private toPercent: number = 0;

  private limitFrom: number = 0;

  private limitTo: number = 0;

  private wrapperWidthHeight: number = 0;

  private snapNumber: number[] = [];

  private stepNumber: number[] = [];

  private stepGrid: number = 0;

  private maxValue = 999999999999999;

  private minValue = -999999999999999;

  private isStartedConfig: boolean = false;

  private isUpdatedConfig: boolean = false;

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
      gridNumber: this.gridNumber,
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

    const keys = [
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

    keys.forEach((key) => {
      this.notifyOB({
        key,
        ...options,
      });
    });

    if (this.isStartedConfig && typeof this.onReset === 'function') {
      this.onReset(this.defaultData);
    }
  }

  async update(options: RangeSliderOptions) {
    this.isUpdatedConfig = true;

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

    if (this.isStartedConfig && typeof this.onUpdate === 'function') {
      this.onUpdate(this.getOptions());
    }
    this.isStartedConfig = true;
    this.isUpdatedConfig = false;
  }

  calcOnePercent() {
    this.valuePercent = this.getRange() / 100;
    return this.valuePercent;
  }

  // ---------------------------------- Handle

  calcPositionDotFrom() {
    this.fromPercent = ((this.from ?? 0) - (this.min ?? 0)) / this.valuePercent; // left dot position (in %)
    this.limitFrom = this.fromPercent;
    return this.fromPercent;
  }

  calcPositionDotTo() {
    this.toPercent = ((this.to ?? 0) - (this.min ?? 0)) / this.valuePercent; // right dot position (in %)
    this.limitTo = this.toPercent;
    return this.toPercent;
  }

  setWrapperWidthHeight(value: number) {
    this.wrapperWidthHeight = value || 319;
    return this.wrapperWidthHeight;
  }

  calcDotPosition(options: CalcDotPositionOptions) {
    let isFrom = false;
    let isTo = false;
    const typeFrom = options.type === 'From';

    this.setWrapperWidthHeight(options.wrapperWidthHeight);

    let percent = this.convertToPercent({
      typeFrom,
      clientXY: options.clientXY,
      shiftXY: options.shiftXY,
      position: options.position,
    });

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const isSingle = this.type === 'single';

    if (isSingle) { // if single dot
      this.fromPercent = percent;
      isFrom = true;
    } else if (!(this.limitFrom > this.limitTo)) { // if double dot and FROM is less than TO
      // depending on which dot is mooving
      if (typeFrom) {
        this.fromPercent = percent;
        isFrom = true;
      } else {
        this.toPercent = percent;
        isTo = true;
      }
    } else { // if FROM is greater than TO
      // take value of another dot (which the mooving dot is approaching closely)
      if (typeFrom) {
        this.fromPercent = this.toPercent;
      } else {
        this.toPercent = this.fromPercent;
      }

      isFrom = true;
      isTo = true;
    }

    let from: number | null = null;
    let to: number | null = null;

    if (isFrom) {
      from = this.getDataDotFrom(); // get FROM value
    }

    if (isTo) {
      to = this.getDataDotTo(); //  get TO value
    }

    if (this.gridSnap && !this.step) {
      if (isFrom) {
        from = Model.getValueStep(from ?? 0, this.stepGrid, this.snapNumber);
      }
      if (!isSingle && isTo) {
        to = Model.getValueStep(to ?? 0, this.stepGrid, this.snapNumber);
      }
    }

    let signDirection = '';

    const formPosition = this.from ?? 0;
    const toPosition = this.to ?? 0;

    if (formPosition < (from ?? 0) && isFrom) signDirection = 'right';
    if (toPosition < (to ?? 0) && isTo) signDirection = 'right';
    if (formPosition > (from ?? 0) && isFrom) signDirection = 'left';
    if (toPosition > (to ?? 0) && isTo) signDirection = 'left';
    if (signDirection === '') return false;

    if (this.step) {
      if (isFrom) {
        from = Model.getValueStep(from ?? 0, this.step, this.stepNumber);
      }
      if (!isSingle && isTo) {
        to = Model.getValueStep(to ?? 0, this.step, this.stepNumber);
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
    const stepNumber: number[] = [];

    const min = this.min ?? 0;
    const max = this.max ?? 0;

    let step = +(min + this.step).toFixed(length);
    stepNumber.push(min);
    for (let i = min; i <= max;) {
      i = +(i += this.step).toFixed(length);
      if (step === i && i < max) {
        stepNumber.push(step);
        step = +(step += this.step).toFixed(length);
      } else break;
    }
    stepNumber.push(max);
    this.stepNumber = stepNumber;
    return stepNumber;
  }

  @boundMethod
  calcPositionTipFrom(tipFrom: number) {
    return this.fromPercent - this.calcWidthPercent(tipFrom - 4);
  }

  @boundMethod
  calcPositionTipTo(tipTo: number) {
    return this.toPercent - this.calcWidthPercent(tipTo - 4);
  }

  @boundMethod
  calcPositionTipSingle(singleWidthHeight: number) {
    return (
      this.fromPercent
      + ((this.toPercent - this.fromPercent) / 2)
      - this.calcWidthPercent(singleWidthHeight)
    );
  }

  createMark() {
    const marks: {
      value: number,
      position: number,
    }[] = [];

    const notify = (valueGrid: number, position: number) => {
      marks.push({
        value: +valueGrid.toFixed(this.gridRound ?? 0),
        position,
      });
    };

    notify(this.min ?? 0, 0);
    const { interval, step } = this.calcGridNumStep();
    let dataGrid = this.calcPositionGrid(this.min ?? 0, step);
    notify(dataGrid.value, dataGrid.position);

    for (let i = 1; i < interval - 1; i += 1) {
      dataGrid = this.calcPositionGrid(dataGrid.value, step);
      notify(dataGrid.value, dataGrid.position);
    }
    notify(this.max ?? 0, 100);

    this.notifyOB({
      key: 'CreateGrid',
      valueMark: marks,
    });

    return marks;
  }

  // ---------------------------------- Bar
  calcPositionBar() {
    let barXY = 0;
    let widthBar = 0;
    if (this.type === 'double') {
      barXY = this.fromPercent;
      widthBar = this.toPercent - this.fromPercent;
    } else {
      widthBar = this.fromPercent;
    }
    return { barXY, widthBar };
  }

  @boundMethod
  clickBar(pointXY: number) {
    const vertical = this.orientation === 'vertical';
    const onePercent = this.wrapperWidthHeight / 100; // one percent of the entire scale

    const calcXY = (valuePercent: number) => this.clickLine(
      ((100 - valuePercent) * onePercent) + pointXY,
    );

    if (this.type === 'single') {
      if (vertical) return calcXY(this.fromPercent);
      return this.clickLine(pointXY);
    }
    if (vertical) return calcXY(this.toPercent);
    return this.clickLine(this.fromPercent * onePercent + pointXY);
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
    let isFrom = false;
    let isTo = false;

    const onePercent = this.wrapperWidthHeight / 100; // one percent of the entire scale
    let pointPercent = 0;

    if (this.orientation === 'vertical') {
      pointPercent = 100 - (pointXY / onePercent); // total percentage in the clicked area
    } else {
      pointPercent = pointXY / onePercent; // total percentage in the clicked area
    }

    if (this.type === 'single') {
      this.fromPercent = pointPercent;
      isFrom = true;
    } else if (pointPercent > this.toPercent) { // if the value is greater than TO
      this.toPercent = pointPercent; // set on this dot
      isTo = true;
    } else if (pointPercent > this.fromPercent) { // if TO is smaller then FROM is greater
      const toPercent = this.toPercent - pointPercent; // extract VAL from TO
      const fromPercent = pointPercent - this.fromPercent; // extract FROM from VAL

      if (fromPercent > toPercent) { // that dot is closer which value is smaller
        this.toPercent = pointPercent;
      } else {
        this.fromPercent = pointPercent;
      }

      if (fromPercent > toPercent) {
        isTo = true;
      } else {
        isFrom = true;
      }
    } else { //  if VAL is smaller than FROM, then move FROM
      this.fromPercent = pointPercent;
      isFrom = true;
    }

    if (isFrom) {
      from = this.getDataDotFrom(); // get value FROM
    }

    if (isTo) {
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

    this.from = Model.getValueStep(this.from ?? 0, this.stepGrid, this.snapNumber);

    if (this.type === 'double') {
      this.to = Model.getValueStep(this.to ?? 0, this.stepGrid, this.snapNumber);
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
  calcSnap(snapNumber: number[]) {
    this.snapNumber = [];
    this.snapNumber.push(this.min ?? 0, ...snapNumber, this.max ?? 0);
    this.stepGrid = this.snapNumber[1] - this.snapNumber[0];

    return this.snapDot();
  }

  calcKeyDown(repeat: boolean, sign: string, dot: string) {
    let { from } = this;
    let { to } = this;
    const isSign = sign === '+';
    const isDot = dot === 'from';
    const type = this.type === 'double';
    const isKey = !this.keyStepOne && !this.keyStepHold;

    if (this.gridSnap && !this.step && isKey) {
      const prev = this.snapNumber[this.snapNumber.length - 2];

      const value = (i: number) => {
        const number = this.snapNumber[!isSign ? i - 2 : i];

        if (isDot) {
          from = number;
        } else {
          to = number;
        }
      };

      const moveFrom = (item: number, i: number) => {
        if ((from ?? 0) < item && isDot) {
          if (from === to && isSign && type) return false;
          value(i);
          return false;
        }
        if (from === this.min) {
          if (isSign) {
            [, from] = this.snapNumber;
            return false;
          }
        } else if (from === this.max) {
          if (!isSign) {
            from = prev;
            return false;
          }
        }
        return true;
      };

      const moveTo = (item: number, i: number) => {
        if ((to ?? 0) < item && !isDot) {
          value(i);
          return false;
        } if (to === this.max) {
          if (!isSign) {
            to = prev;
            return false;
          }
        }
        return true;
      };

      for (let i = 0; i < this.snapNumber.length; i += 1) {
        const item = this.snapNumber[i];
        if (!moveFrom(item, i)) break;
        if (!moveTo(item, i)) break;
      }
    } else {
      const value = (step: number) => {
        const length = Model.trimFraction(step);
        const fromValue = from ?? 0;
        const toValue = to ?? 0;

        if (isDot) {
          const num = !isSign ? fromValue - step : fromValue + step;
          from = +num.toFixed(length);
        } else {
          const num = !isSign ? toValue - step : toValue + step;
          to = +num.toFixed(length);
        }
        if (this.type === 'double') {
          if (fromValue > toValue && isDot) from = to;
          if (fromValue > toValue && !isDot) to = from;
        }
      };

      if (!isKey) {
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

  private static getValueStep(value: number, step: number, items: number[]) {
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
    return +((this.min ?? 0) + (this.fromPercent * this.valuePercent)).toFixed(0);
  }

  private getDataDotTo() {
    return +((this.min ?? 0) + (this.toPercent * this.valuePercent)).toFixed(0);
  }

  private static trimFraction(num: number) {
    return String(num).replace(`${Math.trunc(num)}.`, '').length;
  }

  private defaultConfig(options: RangeSliderOptions) {
    this.isStartedConfig = false;
    this.isUpdatedConfig = false;

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
      gridNumber: 0, // amount of intervals the scale is split into
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

  private static getProperty<T, K extends keyof T>(object: T, key: K) {
    return object[key];
  }

  private static setProperty<T, K extends keyof T>(
    object: T,
    key: K,
    value: T[K],
  ) {
    // eslint-disable-next-line no-param-reassign
    object[key] = value;
  }

  private static propertiesValidation(
    // eslint-disable-next-line no-use-before-define
    properties: Array<keyof typeof object>,
    object: RangeSliderOptions,
  ) {
    let isValid = false;
    for (let i = 0; i < properties.length; i += 1) {
      const dataT = object[properties[i]] ?? null;
      if (dataT !== null) {
        isValid = true;
        break;
      }
    }
    if (!isValid) return false;
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
    const isValue = (value ?? null) != null;

    if (!Model.isEmpty(data)) {
      return isValue ? value : null;
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

    if (min < this.minValue || max > this.maxValue) return false;

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
      if (this.isUpdatedConfig) {
        this.setDotData({
          from: this.from,
          to: this.to,
        });
      }
      return true;
    }
    return false;
  }

  private validValue(value: number) {
    if (value <= this.getRange()) return value;
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

    this.step = this.validValue(+step);
    this.keyStepOne = this.validValue(+keyStepOne);
    this.keyStepHold = this.validValue(+keyStepHold);

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

    if (!this.isStartedConfig && !this.isUpdatedConfig) {
      if (this.gridSnap && !this.step) {
        this.from = Model.getValueStep(
          this.from ?? 0,
          this.stepGrid,
          this.snapNumber,
        );
        if (type === 'double') {
          this.to = Model.getValueStep(
            this.to ?? 0,
            this.stepGrid,
            this.snapNumber,
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

    if (this.isStartedConfig && !this.isUpdatedConfig) {
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
      'gridNumber',
      'gridStep',
      'gridRound',
    ], options)) return false;

    let { grid } = options;
    let { gridNumber } = options;
    let { gridStep } = options;
    let gridRound: number | null = Math.trunc(options.gridRound ?? 0);

    if (Number.isNaN(gridRound)) gridRound = null;

    grid = Boolean(this.checkValue(grid, 'grid') ?? false);
    this.grid = Boolean(grid);

    if (!Model.isEmpty(this.min) || !Model.isEmpty(this.max)) return false;

    gridNumber = Number(this.checkValue(gridNumber, 'gridNumber') ?? 0);
    gridStep = Number(this.checkValue(gridStep, 'gridStep') ?? 0);
    gridRound = Number(this.checkValue(gridRound, 'gridRound') ?? 0);

    const long = (this.max ?? 0) - (this.min ?? 0);

    if (gridStep > long) {
      gridStep = long;
    }

    if (gridStep > (this.max ?? 0)) { gridStep = this.max; }

    if (!gridNumber && !gridStep) {
      gridNumber = 4;
    }

    if (gridRound < 0 || gridRound > 100) {
      gridRound = 0;
    }

    this.gridRound = Number(gridRound);
    this.gridNumber = Number(gridNumber);
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
      gridNumber: this.gridNumber,
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

  private static checkFunction(data: Function | null) {
    if (data === null) {
      return null;
    }
    if (typeof data === 'function') return data;

    return null;
  }

  private setCallbacks(options: RangeSliderOptions): boolean {
    const checkKey = [
      'onStart',
      'onChange',
      'onUpdate',
      'onReset',
    ];
    let isCallback = false;
    for (let i = 0; i < checkKey.length; i += 1) {
      if (Object.keys(options).lastIndexOf(checkKey[i]) !== -1) {
        isCallback = true;
        break;
      }
    }
    if (!isCallback) return false;

    if (options.onChange !== this.onChange) {
      if (options.onChange !== undefined) {
        this.onChange = Model.checkFunction(options.onChange);
      }
    }

    if (options.onUpdate !== this.onUpdate) {
      if (options.onUpdate !== undefined) {
        this.onUpdate = Model.checkFunction(options.onUpdate);
      }
    }

    if (options.onStart !== this.onStart) {
      if (options.onStart !== undefined) {
        this.onStart = Model.checkFunction(options.onStart);
      }
    }

    if (options.onReset !== this.onReset) {
      if (options.onReset !== undefined) {
        this.onReset = Model.checkFunction(options.onReset);
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
      typeFrom, clientXY, shiftXY, position,
    } = options;
    const dotXY = clientXY - shiftXY;
    let number = 0;

    if (this.orientation === 'vertical') {
      number = position - dotXY;
    } else {
      number = dotXY - position;
    }
    const percent = (number * 100) / this.wrapperWidthHeight;

    if (typeFrom) {
      this.limitFrom = percent;
    } else {
      this.limitTo = percent;
    }
    return percent;
  }

  private calcWidthPercent(width: number) {
    return ((width * 100) / this.wrapperWidthHeight) / 2;
  }

  private calcGridNumStep() {
    let interval = 0;
    let step = 0;

    if (this.gridStep && !this.gridNumber) { // if STEP is defined and interval is set by default
      step = this.gridStep;
      interval = this.getRange() / step; // define new interval
    } else { // calculate in line with interval
      interval = this.gridNumber ?? 0;
      step = ((this.max ?? 0) - (this.min ?? 0)) / interval; // define step
    }
    return { interval, step };
  }
}

export default Model;
