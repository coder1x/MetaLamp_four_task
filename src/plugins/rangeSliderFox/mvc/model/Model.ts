import { boundMethod } from 'autobind-decorator';

import RangeSliderOptions from '../../globInterface';
import { Observer, ObserverOptions } from '../../Observer';
import {
  CalcFromToOptions,
  Prop,
  PositionData,
  DirectionData,
  KeyDownSnap,
  KeyDownStep,
} from './modelInterface';

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

  private snapNumber: number[] = [];

  private stepNumber: number[] = [];

  private stepGrid: number = 0;

  private maxValue = 999999999999999;

  private minValue = -999999999999999;

  private isStartedConfiguration: boolean = false;

  private isUpdatedConfiguration: boolean = false;

  onHandle: (() => void) | null = null;

  // eslint-disable-next-line no-unused-vars
  onChange: ((data: RangeSliderOptions) => void) | null = null;

  // eslint-disable-next-line no-unused-vars
  onUpdate: ((data: RangeSliderOptions) => void) | null = null;

  // eslint-disable-next-line no-unused-vars
  onStart: ((data: RangeSliderOptions) => void) | null = null;

  // eslint-disable-next-line no-unused-vars
  onReset: ((data: RangeSliderOptions) => void) | null = null;

  constructor(options: RangeSliderOptions | void = {}) {
    super();
    this.createProperties(this.setDefaultConfiguration(options));
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
    if (!this.defaultData) return false;

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
      this.notifyObserver({
        key,
        ...options,
      });
    });

    if (this.isStartedConfiguration && typeof this.onReset === 'function') {
      this.onReset(this.defaultData);
    }
    return true;
  }

  async update(options: RangeSliderOptions) {
    this.isUpdatedConfiguration = true;

    await this.setCallbacks(options);
    await this.setRangeData(options);
    await this.setStep(options);
    await this.setFromTo(options);
    await this.setGridData(options);
    await this.setGridSnapData(options);
    await this.setThemeData(options);
    await this.setBarData(options);
    await this.setDisabledData(options);
    await this.setHintsData(options);
    await this.setOrientationData(options);

    if (this.isStartedConfiguration && typeof this.onUpdate === 'function') {
      this.onUpdate(this.getOptions());
    }
    this.isStartedConfiguration = true;
    this.isUpdatedConfiguration = false;
  }

  calcOnePercent() {
    this.valuePercent = this.getRange() / 100;
    return this.valuePercent;
  }

  // ---------------------------------- Handle

  calcPercentFrom() {
    this.fromPercent = ((this.from ?? 0) - (this.min ?? 0)) / this.valuePercent; // left dot position (in %)
    this.limitFrom = this.fromPercent;
    return this.fromPercent;
  }

  calcPercentTo() {
    this.toPercent = ((this.to ?? 0) - (this.min ?? 0)) / this.valuePercent; // right dot position (in %)
    this.limitTo = this.toPercent;
    return this.toPercent;
  }

  calcFromTo(options: CalcFromToOptions) {
    const typeFrom = options.type === 'From';

    let percent = this.convertToPercent({
      typeFrom,
      clientXY: options.clientXY,
      shiftXY: options.shiftXY,
      position: options.position,
      dimensions: options.dimensions,
    });

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const {
      isFrom,
      isTo,
      isSingle,
    } = this.checkIsFromToValid(typeFrom, percent);

    let from: number | null = null;
    let to: number | null = null;

    const accuracy = Model.trimFraction(this.step ?? 0);

    if (isFrom) {
      from = this.getValueFrom(accuracy); // get FROM value
    }

    if (isTo) {
      to = this.getValueTo(accuracy); //  get TO value
    }

    const applySnapForFromTo = () => {
      if (!(this.gridSnap && !this.step)) return { from, to };

      if (isFrom) {
        from = Model.getValueStep(from ?? 0, this.stepGrid, this.snapNumber);
      }
      if (!isSingle && isTo) {
        to = Model.getValueStep(to ?? 0, this.stepGrid, this.snapNumber);
      }

      return { from, to };
    };

    const dataSnap = applySnapForFromTo();
    from = dataSnap.from;
    to = dataSnap.to;

    const direction = this.defineDirection({
      from,
      to,
      isFrom,
      isTo,
    });

    if (!direction) return false;

    const applyStepForFromTo = () => {
      if (!this.step) return { from, to };

      if (isFrom) {
        from = Model.getValueStep(from ?? 0, this.step, this.stepNumber);
      }

      if (!isSingle && isTo) {
        to = Model.getValueStep(to ?? 0, this.step, this.stepNumber);
      }

      return { from, to };
    };

    const dataStep = applyStepForFromTo();

    this.setFromTo(dataStep);

    return dataStep;
  }

  calcStep() {
    if (!this.step) return false;

    const length = Model.trimFraction(this.step);
    const stepNumber: number[] = [];

    const min = this.min ?? 0;
    const max = this.max ?? 0;

    let step = Number((min + this.step).toFixed(length));
    stepNumber.push(min);
    for (let i = min; i <= max;) {
      i = Number((i += this.step).toFixed(length));
      const isStep = step === i;
      const isMax = i < max;

      if (isStep && isMax) {
        stepNumber.push(step);
        step = Number((step += this.step).toFixed(length));
      } else break;
    }
    stepNumber.push(max);
    this.stepNumber = stepNumber;

    return stepNumber;
  }

  @boundMethod
  calcHintFrom(tipFrom: number, dimensions: number) {
    return this.fromPercent - Model.calcWidthPercent(tipFrom - 4, dimensions);
  }

  @boundMethod
  calcHintTo(tipTo: number, dimensions: number) {
    return this.toPercent - Model.calcWidthPercent(tipTo - 4, dimensions);
  }

  @boundMethod
  calcHintSingle(singleWidthHeight: number, dimensions: number) {
    return (
      this.fromPercent
      + ((this.toPercent - this.fromPercent) / 2)
      - Model.calcWidthPercent(singleWidthHeight, dimensions)
    );
  }

  calcMark() {
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
    const { interval, step } = this.calcGridNumberStep();
    let dataGrid = this.calcGridDimensions(this.min ?? 0, step);
    notify(dataGrid.value, dataGrid.position);

    for (let i = 1; i < interval - 1; i += 1) {
      dataGrid = this.calcGridDimensions(dataGrid.value, step);
      notify(dataGrid.value, dataGrid.position);
    }
    notify(this.max ?? 0, 100);

    this.notifyObserver({
      key: 'CreateGrid',
      valueMark: marks,
    });

    return marks;
  }

  // ---------------------------------- Bar
  calcBarDimensions() {
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
  calcBarCoordinates(pointXY: number, dimensions: number) {
    const vertical = this.orientation === 'vertical';
    const onePercent = dimensions / 100; // one percent of the entire scale

    const calcXY = (valuePercent: number) => this.takeFromOrToOnLineClick(
      ((100 - valuePercent) * onePercent) + pointXY,
      dimensions,
    );

    if (this.type === 'single') {
      if (vertical) return calcXY(this.fromPercent);

      return this.takeFromOrToOnLineClick(pointXY, dimensions);
    }

    if (vertical) return calcXY(this.toPercent);

    return this.takeFromOrToOnLineClick(
      this.fromPercent * onePercent + pointXY,
      dimensions,
    );
  }

  @boundMethod
  takeFromOrToOnMarkClick(value: number) {
    let {
      from,
      to,
    } = this;

    const chooseAmongFromAndTo = () => {
      if (this.type === 'single') {
        from = value;
        return { from, to };
      }

      if (value > (to ?? 0)) { // if the value is greater than TO
        to = value; // set on this dot
        return { from, to };
      }

      if (value > (from ?? 0)) { // if the value is greater than FROM
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

      return { from, to };
    };

    const data = chooseAmongFromAndTo();

    this.setFromTo({
      type: this.type,
      ...data,
    });
    return data;
  }

  // ---------------------------------- Line
  @boundMethod
  takeFromOrToOnLineClick(pointXY: number, dimensions: number) {
    let {
      from,
      to,
    } = this;

    let isFrom = false;
    let isTo = false;

    const onePercent = dimensions / 100; // one percent of the entire scale
    let pointPercent = 0;

    if (this.orientation === 'vertical') {
      pointPercent = 100 - (pointXY / onePercent); // total percentage in the clicked area
    } else {
      pointPercent = pointXY / onePercent; // total percentage in the clicked area
    }

    const chooseBetweenFromTo = () => {
      if (this.type === 'single') {
        this.fromPercent = pointPercent;
        isFrom = true;
        return { isFrom, isTo };
      }

      if (pointPercent > this.toPercent) { // if the value is greater than TO
        this.toPercent = pointPercent; // set on this dot
        isTo = true;
        return { isFrom, isTo };
      }

      if (pointPercent > this.fromPercent) { // if TO is smaller then FROM is greater
        const toPercent = this.toPercent - pointPercent; // extract VAL from TO
        const fromPercent = pointPercent - this.fromPercent; // extract FROM from VAL

        if (fromPercent > toPercent) { // that dot is closer which value is smaller
          this.toPercent = pointPercent;
          isTo = true;
        } else {
          this.fromPercent = pointPercent;
          isFrom = true;
        }
      } else { //  if VAL is smaller than FROM, then move FROM
        this.fromPercent = pointPercent;
        isFrom = true;
      }

      return { isFrom, isTo };
    };

    const data = chooseBetweenFromTo();
    isFrom = data.isFrom;
    isTo = data.isTo;

    if (isFrom) {
      from = this.getValueFrom();
    }

    if (isTo) {
      to = this.getValueTo();
    }

    this.setFromTo({
      type: this.type,
      from,
      to,
    });

    return { from, to };
  }

  toggleSnapMode() {
    if (!this.gridSnap) return false;

    this.from = Model.getValueStep(this.from ?? 0, this.stepGrid, this.snapNumber);

    if (this.type === 'double') {
      this.to = Model.getValueStep(this.to ?? 0, this.stepGrid, this.snapNumber);
    }

    this.notifyObserver({
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
  setSnapFromTo(snapNumber: number[]) {
    this.snapNumber = [];
    this.snapNumber.push(this.min ?? 0, ...snapNumber, this.max ?? 0);
    this.stepGrid = this.snapNumber[1] - this.snapNumber[0];

    return this.toggleSnapMode();
  }

  calcFromToOnKeyDown(repeat: boolean, sign: string, dot: string) {
    const {
      from,
      to,
    } = this;

    const isSign = sign === '+';
    const isDot = dot === 'from';
    const type = this.type === 'double';
    const isKey = !this.keyStepOne && !this.keyStepHold;
    const isStep = !this.step && isKey;

    let data = { from, to };
    if (this.gridSnap && isStep) {
      data = this.moveFromToOnKeyDownSnap({
        type,
        isSign,
        isDot,
        from,
        to,
      });
    } else {
      data = this.moveFromToOnKeyDownStep({
        isSign,
        isDot,
        isKey,
        repeat,
        from,
        to,
      });
    }

    this.setFromTo(data);

    return data;
  }

  private moveFromToOnKeyDownStep(options: KeyDownStep) {
    const {
      isDot = false,
      isSign = false,
      isKey = false,
      repeat = false,
    } = options;

    let {
      from = 0,
      to = 0,
    } = options;

    const value = (step: number) => {
      const length = Model.trimFraction(step);
      const fromValue = from ?? 0;
      const toValue = to ?? 0;

      if (isDot) {
        const num = !isSign ? fromValue - step : fromValue + step;
        from = Number(num.toFixed(length));
      } else {
        const num = !isSign ? toValue - step : toValue + step;
        to = Number(num.toFixed(length));
      }

      if (this.type === 'double') {
        const isValue = (from ?? 0) > (to ?? 0);
        if (isValue && isDot) from = to;
        if (isValue && !isDot) to = from;
      }
    };

    if (!isKey) {
      if (!this.keyStepOne && this.keyStepHold) {
        this.keyStepOne = 1;
      }

      if (!this.keyStepHold && this.keyStepOne) {
        this.keyStepHold = Number(this.keyStepOne.toFixed(
          Model.trimFraction(this.keyStepOne),
        ));
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

    return { from, to };
  }

  private moveFromToOnKeyDownSnap(options: KeyDownSnap) {
    const {
      type = false,
      isSign = false,
      isDot = false,
    } = options;

    let {
      from = 0,
      to = 0,
    } = options;

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
        const isEqual = from === to;

        if (isEqual && isSign && type) return false;
        value(i);
        return false;
      }

      const isFromMin = from === this.min;
      if (isFromMin && isSign) {
        [, from] = this.snapNumber;
        return false;
      }

      const isFromMax = from === this.max;
      if (isFromMax && !isSign) {
        from = prev;
        return false;
      }
      return true;
    };

    const moveTo = (item: number, i: number) => {
      if ((to ?? 0) < item && !isDot) {
        value(i);
        return false;
      }

      if (to === this.max && !isSign) {
        to = prev;
        return false;
      }
      return true;
    };

    for (let i = 0; i < this.snapNumber.length; i += 1) {
      const item = this.snapNumber[i];
      if (!moveFrom(item, i)) break;
      if (!moveTo(item, i)) break;
    }

    return { from, to };
  }

  private checkIsFromToValid(typeFrom = false, percent = 0) {
    let isFrom = false;
    let isTo = false;

    const isSingle = this.type === 'single';

    if (isSingle) { // if single dot
      this.fromPercent = percent;
      return { isFrom: true, isTo, isSingle };
    }

    if (!(this.limitFrom > this.limitTo)) { // if double dot and FROM is less than TO
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

    return { isFrom, isTo, isSingle };
  }

  private defineDirection(options: DirectionData) {
    const {
      from = 0,
      to = 0,
      isFrom = false,
      isTo = false,
    } = options;

    let signDirection = '';

    const formPosition = this.from ?? 0;
    const toPosition = this.to ?? 0;

    const isRightFrom = formPosition < (from ?? 0) && isFrom;
    const isRightTo = toPosition < (to ?? 0) && isTo;

    if (isRightFrom || isRightTo) signDirection = 'right';

    const isLeftFrom = formPosition > (from ?? 0) && isFrom;
    const isLeftTo = toPosition > (to ?? 0) && isTo;

    if (isLeftFrom || isLeftTo) signDirection = 'left';

    if (signDirection === '') return false;

    return signDirection;
  }

  private calcGridDimensions(value: number, step: number) {
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

  private getValueFrom(accuracy = 0) {
    return Number(((this.min ?? 0) + (this.fromPercent * this.valuePercent)).toFixed(accuracy));
  }

  private getValueTo(accuracy = 0) {
    return Number(((this.min ?? 0) + (this.toPercent * this.valuePercent)).toFixed(accuracy));
  }

  private static trimFraction(number = 0) {
    if (!number) return 0;

    if (!/\./gi.test(String(number))) return 0;

    return String(number).replace(`${Math.trunc(number)}.`, '').length;
  }

  private setDefaultConfiguration(options: RangeSliderOptions | void) {
    this.isStartedConfiguration = false;
    this.isUpdatedConfiguration = false;

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
      await this.notifyObserver({
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

  private static validateProperties(
    // eslint-disable-next-line no-use-before-define
    properties: Array<keyof typeof object>,
    object: RangeSliderOptions,
  ) {
    let isValid = false;
    for (let i = 0; i < properties.length; i += 1) {
      const data = object[properties[i]] ?? null;

      if (data !== null) {
        isValid = true;
        break;
      }
    }

    if (!isValid) return false;
    return true;
  }

  private static checkIsEmpty(data: Prop) {
    return (data ?? null) != null;
  }

  private checkProperty(data: Prop, string: string) {
    // eslint-disable-next-line no-underscore-dangle
    const _this = this;
    // использую type assertions так как не нашёл возможности передавать нужный тип
    // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
    const key = string as keyof typeof _this;
    const value = this[key];
    const isValue = (value ?? null) != null;

    if (!Model.checkIsEmpty(data)) {
      return isValue ? value : null;
    }
    return data;
  }

  private setRangeData(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties(['min', 'max'], options)) return false;

    let {
      min,
      max,
    } = options;

    min = Number(this.checkProperty(min, 'min'));
    if (min == null) return false;

    max = Number(this.checkProperty(max, 'max'));
    if (max == null) return false;

    const isMin = min < this.minValue;
    const isMax = max > this.maxValue;

    if (isMin || isMax) return false;

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    const isNotMin = min !== this.min;
    const isNotMax = max !== this.max;
    // need to check if new data is differ from the existing data in model
    if (isNotMin || isNotMax) {
      this.min = +min;
      this.max = +max;

      const to = this.to ?? 0;
      const from = this.from ?? 0;

      if (this.max < to) { this.to = this.max; }

      if (this.max < from) { this.from = this.max; }

      if (this.min > to) { this.to = this.min; }

      if (this.min > from) { this.from = this.min; }

      this.notifyObserver({
        key: 'RangeData',
        min: this.min,
        max: this.max,
      });

      // if range is renewed, then recalculate all related data
      if (this.isUpdatedConfiguration) {
        this.setFromTo({
          from: this.from,
          to: this.to,
        });
      }
      return true;
    }
    return false;
  }

  private checkIsValueInRange(value: number) {
    if (value <= this.getRange()) return value;
    return this.getRange();
  }

  private setStep(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties([
      'step',
      'keyStepOne',
      'keyStepHold',
    ], options)) return false;

    let {
      step,
      keyStepOne,
      keyStepHold,
    } = options;

    step = Number(this.checkProperty(step, 'step'));
    if (step == null) { step = 0; }

    keyStepOne = Number(this.checkProperty(keyStepOne, 'keyStepOne'));
    if (keyStepOne == null) { keyStepOne = 0; }

    keyStepHold = Number(this.checkProperty(keyStepHold, 'keyStepHold'));
    if (keyStepHold == null) { keyStepHold = 0; }

    this.step = this.checkIsValueInRange(+step);
    this.keyStepOne = this.checkIsValueInRange(+keyStepOne);
    this.keyStepHold = this.checkIsValueInRange(+keyStepHold);

    this.notifyObserver({
      key: 'Step',
      step: this.step,
      keyStepOne: this.keyStepOne,
      keyStepHold: this.keyStepHold,
    });

    return false;
  }

  private setFromTo(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties(
      ['type', 'from', 'to'],
      options,
    )) return false;

    let {
      type,
      from,
      to,
    } = options;

    // check if all necessary data exists
    if (!Model.checkIsEmpty(this.min)) return false;
    if (!Model.checkIsEmpty(this.max)) return false;

    const getType = () => {
      const isSingle = type === 'single';
      const isDouble = type === 'double';

      if (isSingle || isDouble) {
        this.type = String(type);
        return this.type;
      }

      if (Model.checkIsEmpty(this.type)) {
        return this.type;
      }

      return false;
    };

    const dataType = getType();
    if (!dataType) return false;

    type = dataType;

    from = Number(this.checkProperty(from, 'from'));

    const min = this.min ?? 0;
    const max = this.max ?? 0;

    const setFrom = () => {
      if (from == null) return false;
      const isAboveMin = from >= min;
      const isBelowMax = from <= max;

      if (isAboveMin && isBelowMax) {
        this.from = from;
        return null;
      }

      if (from < min) { this.from = min; }

      if (from > max) { this.from = max; }

      return null;
    };

    setFrom();

    const setTo = () => {
      if (from == null) return false;

      if (type === 'double') { // check FROM and TO
        to = Number(this.checkProperty(to, 'to'));
        if (to == null) return false;

        if (from > to) {
          const temp = from;
          from = to;
          to = temp;
        }

        this.to = to <= max ? to : max;

        return null;
      }

      const isValidMax = max >= 2;
      const isValidFrom = (this.from ?? 0) <= 2;

      this.to = isValidMax && isValidFrom ? this.to ?? 2 : this.to ?? this.from;

      return null;
    };

    setTo();

    const isConfigurationNotExist = !this.isStartedConfiguration && !this.isUpdatedConfiguration;
    const isSnap = this.gridSnap && !this.step;

    if (isConfigurationNotExist && isSnap) {
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

    this.notifyObserver({
      key: 'DotData',
      type: this.type,
      from: this.from,
      to: this.to,
    });

    if (this.isStartedConfiguration && !this.isUpdatedConfiguration) {
      if (typeof this.onChange === 'function') this.onChange(this.getOptions());
    }

    return true;
  }

  private setGridSnapData(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties(['gridSnap'], options)) {
      if (this.gridSnap === undefined) { this.gridSnap = false; }
      return false;
    }

    if (!this.grid) {
      this.gridSnap = false;
    } else {
      this.gridSnap = options.gridSnap ?? false;
    }

    this.notifyObserver({
      key: 'GridSnapData',
      gridSnap: this.gridSnap,
    });
    return true;
  }

  private setGridData(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties([
      'grid',
      'gridNumber',
      'gridStep',
      'gridRound',
    ], options)) return false;

    let {
      grid,
      gridNumber,
      gridStep,
    } = options;

    let gridRound: number | null = Math.trunc(options.gridRound ?? 0);

    if (Number.isNaN(gridRound)) gridRound = null;

    grid = Boolean(this.checkProperty(grid, 'grid') ?? false);
    this.grid = Boolean(grid);

    if (!Model.checkIsEmpty(this.min) || !Model.checkIsEmpty(this.max)) return false;

    gridNumber = Number(this.checkProperty(gridNumber, 'gridNumber') ?? 0);
    gridStep = Number(this.checkProperty(gridStep, 'gridStep') ?? 0);
    gridRound = Number(this.checkProperty(gridRound, 'gridRound') ?? 0);

    const long = (this.max ?? 0) - (this.min ?? 0);

    if (gridStep > long) {
      gridStep = long;
    }

    if (gridStep > (this.max ?? 0)) { gridStep = this.max; }

    if (!gridNumber && !gridStep) {
      gridNumber = 4;
    }

    const isGridRoundBelowLimit = gridRound < 0;
    const isGridRoundAboveLimit = gridRound > 100;
    if (isGridRoundBelowLimit || isGridRoundAboveLimit) {
      gridRound = 0;
    }

    this.gridRound = Number(gridRound);
    this.gridNumber = Number(gridNumber);
    this.gridStep = Number(gridStep);

    if (this.gridSnap && !this.grid) {
      this.gridSnap = false;
      this.notifyObserver({
        key: 'GridSnapData',
        gridSnap: this.gridSnap,
      });
    }

    this.notifyObserver({
      key: 'GridData',
      grid: this.grid,
      gridNumber: this.gridNumber,
      gridStep: this.gridStep,
      gridRound: this.gridRound,
    });

    return true;
  }

  private setOrientationData(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties(['orientation'], options)) return false;

    const orientation = options.orientation ?? ''.replace(/\s/g, '');
    const isHorizontal = orientation === 'horizontal';
    const isVertical = orientation === 'vertical';

    if (isHorizontal || isVertical) {
      this.orientation = orientation;
    } else return false;

    this.notifyObserver({
      key: 'OrientationData',
      orientation: this.orientation,
    });

    return true;
  }

  private setThemeData(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties(['theme'], options)) return false;

    const theme = options.theme ?? ''.replace(/\s/g, '');

    if (theme.length <= 20) {
      this.theme = theme;
    } else {
      console.log('параметр theme - превышает допустимое '
        + 'количество символов (макс - 20)');
    }

    this.notifyObserver({
      key: 'ThemeData',
      theme: this.theme,
    });
    return true;
  }

  // eslint-disable-next-line no-unused-vars
  private static checkFunction(data: ((options: RangeSliderOptions) => void) | null) {
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

    const isChange = options.onChange !== undefined;
    let isEqual = options.onChange !== this.onChange;

    if (isChange && isEqual) {
      this.onChange = Model.checkFunction(options.onChange);
    }

    const isUpdate = options.onUpdate !== undefined;
    isEqual = options.onUpdate !== this.onUpdate;

    if (isUpdate && isEqual) {
      this.onUpdate = Model.checkFunction(options.onUpdate);
    }

    const isStart = options.onStart !== undefined;
    isEqual = options.onStart !== this.onStart;

    if (isStart && isEqual) {
      this.onStart = Model.checkFunction(options.onStart);
    }

    const isReset = options.onReset !== undefined;
    isEqual = options.onReset !== this.onReset;

    if (isReset && isEqual) {
      this.onReset = Model.checkFunction(options.onReset);
    }

    return true;
  }

  private setHintsData(options: ObserverOptions): boolean {
    const isParameters = !Model.validateProperties([
      'tipPrefix',
      'tipPostfix',
      'tipMinMax',
      'tipFromTo',
    ], options);

    const isAttributes = options.key !== 'DataAttributes';

    if (isParameters && isAttributes) return false;

    let {
      tipPrefix,
      tipPostfix,
      tipMinMax,
      tipFromTo,
    } = options;

    tipPostfix = String(this.checkProperty(tipPostfix, 'tipPostfix'));
    if (tipPostfix != null) {
      this.tipPostfix = String(tipPostfix).replace(/\s/g, '').substring(0, 15);
    } else {
      this.tipPostfix = '';
    }

    tipPrefix = String(this.checkProperty(tipPrefix, 'tipPrefix'));
    if (tipPrefix != null) {
      this.tipPrefix = String(tipPrefix).replace(/\s/g, '').substring(0, 15);
    } else {
      this.tipPrefix = '';
    }

    tipMinMax = Boolean(this.checkProperty(tipMinMax, 'tipMinMax'));
    if (tipMinMax != null) {
      this.tipMinMax = tipMinMax;
    } else {
      this.tipMinMax = true;
    }

    tipFromTo = Boolean(this.checkProperty(tipFromTo, 'tipFromTo'));
    if (tipFromTo != null) {
      this.tipFromTo = tipFromTo;
    } else {
      this.tipFromTo = true;
    }

    this.notifyObserver({
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
    if (!Model.validateProperties(['disabled'], options)) {
      if (this.disabled === undefined) { this.disabled = false; }
      return false;
    }

    this.disabled = options.disabled ?? false;

    this.notifyObserver({
      key: 'DisabledData',
      disabled: this.disabled,
    });

    return true;
  }

  private setBarData(options: RangeSliderOptions): boolean {
    if (!Model.validateProperties(['bar'], options)) {
      if (this.bar === undefined) { this.bar = false; }
      return false;
    }

    this.bar = options.bar ?? false;

    this.notifyObserver({
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
      typeFrom,
      clientXY,
      shiftXY,
      position,
      dimensions,
    } = options;

    const dotXY = clientXY - shiftXY;
    let number = 0;

    if (this.orientation === 'vertical') {
      number = position - dotXY;
    } else {
      number = dotXY - position;
    }
    const percent = (number * 100) / dimensions;

    if (typeFrom) {
      this.limitFrom = percent;
    } else {
      this.limitTo = percent;
    }
    return percent;
  }

  private static calcWidthPercent(width: number, dimensions: number) {
    return ((width * 100) / dimensions) / 2;
  }

  private calcGridNumberStep() {
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
