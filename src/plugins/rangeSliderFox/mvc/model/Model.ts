import { boundMethod } from 'autobind-decorator';

import {
  checkIsEmpty,
  validateProperties,
  checkProperty,
  checkFunction,
} from '@shared/helpers/checks';
import {
  getProperty,
  setProperty,
} from '@shared/helpers/readWriteProperties';
import trimFraction from '@shared/helpers/trim';

import { RangeSliderOptions, FromTo } from '../../globInterface';

import {
  CalcFromToOptions,
} from './modelInterface';
import ModelCalc from './ModelCalc';

interface InsideOptions extends RangeSliderOptions {
  readonly fromX?: number,
  readonly toX?: number,
  readonly valuePercent?: number,
  readonly fromPercent?: number,
  readonly toPercent?: number,
  readonly limitFrom?: number,
  readonly limitTo?: number,
  readonly fromTo?: number,
  readonly valueGrid?: number,
  readonly valueMark?: {
    value: number,
    position: number,
  }[],
  readonly snapNumber?: number[],
  readonly isResized?: boolean,
  readonly dimensions?: number,
  readonly position?: number,
  readonly clientXY?: number,
  readonly shiftXY?: number,
  readonly keyRepeat?: boolean,
  readonly keySign?: string,
  readonly dot?: string,
}

interface ObserverOptions extends InsideOptions {
  key?: string,
}

class Model extends ModelCalc {
  constructor(options: RangeSliderOptions = {}) {
    super();
    this.createProperties(this.setDefaultConfiguration(options));
  }

  reset() {
    const options = this.defaultData ?? {};
    if (!this.defaultData) {
      return false;
    }

    Object.keys(options).forEach((key) => {
      // использую type assertions так как не нашёл возможности передавать нужный тип
      // не могу отказаться от данной конструкции кода, так как это сильно уменьшает копипаст
      const value = getProperty(options, key as keyof RangeSliderOptions);
      setProperty(this, key as keyof Model, value as this[keyof Model]);
    });

    const KEYS = [
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

    KEYS.forEach((key) => {
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

  update(options: RangeSliderOptions) {
    this.isUpdatedConfiguration = true;

    this.setCallbacks(options);
    this.setRangeData(options);
    this.setStep(options);
    this.setFromTo(options);
    this.setGridData(options);
    this.setGridSnapData(options);
    this.setThemeData(options);
    this.setBarData(options);
    this.setDisabledData(options);
    this.setHintsData(options);
    this.setOrientationData(options);

    if (this.isStartedConfiguration && typeof this.onUpdate === 'function') {
      this.onUpdate(this.getOptions());
    }
    this.isStartedConfiguration = true;
    this.isUpdatedConfiguration = false;
  }

  // ---------------------------------- Handle

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
    } = this.checkIsFromToValid(typeFrom, percent);

    let from: number | null = null;
    let to: number | null = null;

    const accuracy = trimFraction(this.step ?? 0);

    if (isFrom) {
      from = this.getValueFrom(accuracy); // get FROM value
    }

    if (isTo) {
      to = this.getValueTo(accuracy); //  get TO value
    }

    const direction = this.defineDirection({
      from,
      to,
      isFrom,
      isTo,
    });

    if (!direction) {
      return false;
    }

    const dataStep = this.getStepSnap({
      from,
      to,
      isTo,
      isFrom,
    });

    this.setFromTo(dataStep);

    return dataStep;
  }

  // ---------------------------------- Bar

  @boundMethod
  calcBarCoordinates(pointXY: number, dimensions: number) {
    const vertical = this.orientation === 'vertical';
    const HUNDRED_PERCENT = 100;
    const onePercent = dimensions / HUNDRED_PERCENT; // one percent of the entire scale

    const calcXY = (valuePercent: number) => this.takeFromOrToOnLineClick(
      ((HUNDRED_PERCENT - valuePercent) * onePercent) + pointXY,
      dimensions,
    );

    if (this.type === 'single') {
      if (vertical) {
        return calcXY(this.fromPercent);
      }

      return this.takeFromOrToOnLineClick(pointXY, dimensions);
    }

    if (vertical) {
      return calcXY(this.toPercent);
    }

    return this.takeFromOrToOnLineClick(
      this.fromPercent * onePercent + pointXY,
      dimensions,
    );
  }

  // ---------------------------------- KeyDown
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

  // ---------------------------------- Grid

  @boundMethod
  takeFromOrToOnMarkClick(value: number) {
    const data = this.chooseAmongFromAndTo(value);

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

    const HUNDRED_PERCENT = 100;
    const onePercent = dimensions / HUNDRED_PERCENT; // one percent of the entire scale
    let pointPercent = 0;

    if (this.orientation === 'vertical') {
      pointPercent = HUNDRED_PERCENT - (pointXY / onePercent); // total percentage in the clicked area
    } else {
      pointPercent = pointXY / onePercent; // total percentage in the clicked area
    }

    const {
      isFrom = false,
      isTo = false,
    } = this.chooseBetweenFromTo(pointPercent);

    if (isFrom) {
      from = this.getValueFrom();
    }

    if (isTo) {
      to = this.getValueTo();
    }

    const dataStep = this.getStepSnap({
      from,
      to,
      isTo,
      isFrom,
    });

    this.setFromTo({
      type: this.type,
      ...dataStep,
    });

    return dataStep;
  }

  // ---------------------------------- Snap
  @boundMethod
  setSnapFromTo(snapNumber: number[]) {
    this.snapNumber = [];
    this.snapNumber.push(this.min ?? 0, ...snapNumber, this.max ?? 0);
    this.stepGrid = this.snapNumber[1] - this.snapNumber[0];

    return this.toggleSnapMode();
  }

  private applySnapForFromTo(options: FromTo) {
    const isSingle = this.type === 'single';
    let {
      from,
      to,
    } = options;

    const {
      isTo,
      isFrom,
    } = options;

    if (!(this.gridSnap && !this.step)) {
      return { from, to };
    }

    if (isFrom) {
      from = Model.getSnap(from ?? 0, this.stepGrid, this.snapNumber);
    }
    if (!isSingle && isTo) {
      to = Model.getSnap(to ?? 0, this.stepGrid, this.snapNumber);
    }

    return { from, to };
  }

  private applyStepForFromTo(options: FromTo) {
    let {
      from,
      to,
    } = options;

    const {
      isTo,
      isFrom,
    } = options;

    if (!this.step) {
      return { from, to };
    }

    const isSingle = this.type === 'single';
    const isMinFrom = from === this.min;
    const isMaxTo = to === this.max;

    if (isFrom && isMinFrom) {
      return { from, to };
    }
    if (isTo && isMaxTo) {
      return { from, to };
    }

    if (isFrom && !isSingle) {
      from = from !== this.to ? this.getStep(from ?? 0) : from;
    }

    if (isFrom && isSingle) {
      from = this.getStep(from ?? 0);
    }

    if (isTo && to !== this.from) {
      to = this.getStep(to ?? 0);
    }

    return { from, to };
  }

  private getStepSnap(options: FromTo) {
    const data = options;

    const dataSnap = this.applySnapForFromTo(data);
    data.from = dataSnap.from;
    data.to = dataSnap.to;

    return this.applyStepForFromTo(data);
  }

  // ---------------------------------- Start Model
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

  private setRangeData(options: RangeSliderOptions): boolean {
    if (!validateProperties(options, ['min', 'max'])) {
      return false;
    }

    let {
      min,
      max,
    } = options;

    min = Number(checkProperty(this, min, 'min' as keyof Model));
    if (min == null) {
      return false;
    }

    max = Number(checkProperty(this, max, 'max' as keyof Model));
    if (max == null) {
      return false;
    }

    const isMin = min < this.minValue;
    const isMax = max > this.maxValue;

    if (isMin || isMax) {
      return false;
    }

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    const isNotMin = min !== this.min;
    const isNotMax = max !== this.max;
    // need to check if new data is differ from the existing data in model
    if (isNotMin || isNotMax) {
      this.min = Number(min);
      this.max = Number(max);

      const to = this.to ?? 0;
      const from = this.from ?? 0;

      if (this.max < to) {
        this.to = this.max;
      }

      if (this.max < from) {
        this.from = this.max;
      }

      if (this.min > to) {
        this.to = this.min;
      }

      if (this.min > from) {
        this.from = this.min;
      }

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

  private setStep(options: RangeSliderOptions): boolean {
    if (!validateProperties(
      options,
      [
        'step',
        'keyStepOne',
        'keyStepHold',
      ],
    )) {
      return false;
    }

    let {
      step,
      keyStepOne,
      keyStepHold,
    } = options;

    step = Number(checkProperty(this, step, 'step' as keyof Model));
    if (step == null) {
      step = 0;
    }

    keyStepOne = Number(checkProperty(this, keyStepOne, 'keyStepOne' as keyof Model));
    if (keyStepOne == null) {
      keyStepOne = 0;
    }

    keyStepHold = Number(checkProperty(this, keyStepHold, 'keyStepHold' as keyof Model));
    if (keyStepHold == null) {
      keyStepHold = 0;
    }

    this.step = this.checkIsValueInRange(Number(step));
    this.keyStepOne = this.checkIsValueInRange(Number(keyStepOne));
    this.keyStepHold = this.checkIsValueInRange(Number(keyStepHold));

    this.setFromTo({
      from: this.from,
      to: this.to,
      type: this.type,
    });

    return true;
  }

  private getType(type: string) {
    const isSingle = type === 'single';
    const isDouble = type === 'double';

    if (isSingle || isDouble) {
      this.type = String(type);
      return this.type;
    }

    if (checkIsEmpty(this.type)) {
      return this.type;
    }

    return false;
  }

  private setFrom(from: number) {
    if (from == null) {
      return false;
    }
    const max = this.max ?? 0;
    const min = this.min ?? 0;
    const isAboveMin = from >= min;
    const isBelowMax = from <= max;

    if (isAboveMin && isBelowMax) {
      this.from = from;
      return null;
    }

    if (from < min) {
      this.from = min;
    }

    if (from > max) {
      this.from = max;
    }

    return null;
  }

  private setTo(from: number, to: number | null | undefined, type: string) {
    if (from == null) {
      return null;
    }
    const max = this.max ?? 0;
    const isConfigurationNotExist = !this.isStartedConfiguration || this.isUpdatedConfiguration;
    const isDouble = type === 'double';

    if (isDouble || isConfigurationNotExist) { // check FROM and TO
      to = Number(checkProperty(this, to, 'to' as keyof Model));
      if (to == null) {
        return null;
      }

      if (from > to) {
        to = from;
      }

      this.to = to <= max ? to : max;

      return to;
    }

    return null;
  }

  private setFromTo(options: RangeSliderOptions): boolean {
    if (!validateProperties(
      options,
      ['type', 'from', 'to'],
    )) {
      return false;
    }

    let {
      from,
    } = options;

    // check if all necessary data exists
    if (!checkIsEmpty(this.min)) {
      return false;
    }
    if (!checkIsEmpty(this.max)) {
      return false;
    }

    const dataType = this.getType(options.type ?? '');
    if (!dataType) {
      return false;
    }

    from = Number(checkProperty(this, from, 'from' as keyof Model));

    this.setFrom(from);
    this.setTo(from, options.to, dataType);

    const dataStep = this.getStepSnap({
      from: this.from,
      to: this.to,
      isTo: true,
      isFrom: true,
    });

    this.from = dataStep.from;
    this.to = dataStep.to;

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

  private chooseAmongFromAndTo(value: number) {
    let {
      from,
      to,
    } = this;

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
  }

  private chooseBetweenFromTo(pointPercent: number) {
    let isFrom = false;
    let isTo = false;

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
  }

  private setGridSnapData(options: RangeSliderOptions): boolean {
    if (!validateProperties(options, ['gridSnap'])) {
      if (this.gridSnap === undefined) {
        this.gridSnap = false;
      }
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
    if (!validateProperties(
      options,
      [
        'grid',
        'gridNumber',
        'gridStep',
        'gridRound',
      ],
    )) {
      return false;
    }

    let {
      grid,
      gridNumber,
      gridStep,
    } = options;

    let gridRound: number | null = Math.trunc(options.gridRound ?? 0);

    if (Number.isNaN(gridRound)) gridRound = null;

    grid = Boolean(checkProperty(this, grid, 'grid' as keyof Model) ?? false);
    this.grid = Boolean(grid);

    if (!checkIsEmpty(this.min) || !checkIsEmpty(this.max)) {
      return false;
    }

    gridNumber = Number(checkProperty(this, gridNumber, 'gridNumber' as keyof Model) ?? 0);
    gridStep = Number(checkProperty(this, gridStep, 'gridStep' as keyof Model) ?? 0);
    gridRound = Number(checkProperty(this, gridRound, 'gridRound' as keyof Model) ?? 0);

    const long = (this.max ?? 0) - (this.min ?? 0);

    if (gridStep > long) {
      gridStep = long;
    }

    if (gridStep > (this.max ?? 0)) {
      gridStep = this.max;
    }

    if (!gridNumber && !gridStep) {
      const DEFAULT_GRID_NUMBER = 4;
      gridNumber = this.step ? 0 : DEFAULT_GRID_NUMBER;
    }

    const MIN_GRID_ROUND = 0;
    const MAX_GRID_ROUND = 100;
    const isGridRoundBelowLimit = gridRound < MIN_GRID_ROUND;
    const isGridRoundAboveLimit = gridRound > MAX_GRID_ROUND;
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
    if (!validateProperties(options, ['orientation'])) {
      return false;
    }

    const orientation = options.orientation ?? ''.replace(/\s/g, '');
    const isHorizontal = orientation === 'horizontal';
    const isVertical = orientation === 'vertical';

    if (isHorizontal || isVertical) {
      this.orientation = orientation;
    } else { return false; }

    this.notifyObserver({
      key: 'OrientationData',
      orientation: this.orientation,
    });

    return true;
  }

  private setThemeData(options: RangeSliderOptions): boolean {
    if (!validateProperties(options, ['theme'])) {
      return false;
    }

    const theme = options.theme ?? ''.replace(/\s/g, '');
    const MAX_LENGTH_NAME = 20;

    if (theme.length <= MAX_LENGTH_NAME) {
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

  private setCallbacks(options: RangeSliderOptions): boolean {
    const CHECK_KEY = [
      'onStart',
      'onChange',
      'onUpdate',
      'onReset',
    ];
    let isCallback = false;
    for (let i = 0; i < CHECK_KEY.length; i += 1) {
      if (Object.keys(options).lastIndexOf(CHECK_KEY[i]) !== -1) {
        isCallback = true;
        break;
      }
    }
    if (!isCallback) {
      return false;
    }

    const isChange = options.onChange !== undefined;
    let isEqual = options.onChange !== this.onChange;

    if (isChange && isEqual) {
      this.onChange = checkFunction(options.onChange);
    }

    const isUpdate = options.onUpdate !== undefined;
    isEqual = options.onUpdate !== this.onUpdate;

    if (isUpdate && isEqual) {
      this.onUpdate = checkFunction(options.onUpdate);
    }

    const isStart = options.onStart !== undefined;
    isEqual = options.onStart !== this.onStart;

    if (isStart && isEqual) {
      this.onStart = checkFunction(options.onStart);
    }

    const isReset = options.onReset !== undefined;
    isEqual = options.onReset !== this.onReset;

    if (isReset && isEqual) {
      this.onReset = checkFunction(options.onReset);
    }

    return true;
  }

  private setHintsData(options: ObserverOptions): boolean {
    const isParameters = !validateProperties(
      options,
      [
        'tipPrefix',
        'tipPostfix',
        'tipMinMax',
        'tipFromTo',
      ],
    );

    const isAttributes = options.key !== 'DataAttributes';

    if (isParameters && isAttributes) {
      return false;
    }

    const {
      tipPrefix,
      tipPostfix,
      tipMinMax,
      tipFromTo,
    } = options;

    const MAX_LENGTH_STRING = 15;
    const tipPostfixValue = checkProperty(this, tipPostfix, 'tipPostfix' as keyof Model);
    if (typeof tipPostfixValue === 'string') {
      this.tipPostfix = String(tipPostfixValue).replace(/\s/g, '').substring(0, MAX_LENGTH_STRING);
    } else {
      this.tipPostfix = '';
    }

    const tipPrefixValue = checkProperty(this, tipPrefix, 'tipPrefix' as keyof Model);
    if (typeof tipPrefixValue === 'string') {
      this.tipPrefix = String(tipPrefixValue).replace(/\s/g, '').substring(0, MAX_LENGTH_STRING);
    } else {
      this.tipPrefix = '';
    }

    const tipMinMaxValue = checkProperty(this, tipMinMax, 'tipMinMax' as keyof Model);
    if (typeof tipMinMaxValue === 'boolean') {
      this.tipMinMax = tipMinMaxValue;
    } else {
      this.tipMinMax = true;
    }

    const tipFromToValue = checkProperty(this, tipFromTo, 'tipFromTo' as keyof Model);
    if (typeof tipFromToValue === 'boolean') {
      this.tipFromTo = tipFromToValue;
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
    if (!validateProperties(options, ['disabled'])) {
      if (this.disabled === undefined) {
        this.disabled = false;
      }
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
    if (!validateProperties(options, ['bar'])) {
      if (this.bar === undefined) {
        this.bar = false;
      }
      return false;
    }

    this.bar = options.bar ?? false;

    this.notifyObserver({
      key: 'BarData',
      bar: this.bar,
    });
    return true;
  }
}

export default Model;
