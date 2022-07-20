import { boundMethod } from 'autobind-decorator';

import trimFraction from '@shared/helpers/trim';

import {
  KeyDownSnap,
  KeyDownStep,
  DirectionData,
} from './modelInterface';
import ModelData from './ModelData';

class ModelCalc extends ModelData {
  calcOnePercent() {
    const HUNDRED_PERCENT = 100;
    this.valuePercent = this.getRange() / HUNDRED_PERCENT;
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

  // ---------------------------------- Hints
  @boundMethod
  calcHintFrom(tipFrom: number, dimensions: number) {
    return this.fromPercent - ModelCalc.calcWidthPercent(tipFrom - 4, dimensions);
  }

  @boundMethod
  calcHintTo(tipTo: number, dimensions: number) {
    return this.toPercent - ModelCalc.calcWidthPercent(tipTo - 4, dimensions);
  }

  @boundMethod
  calcHintSingle(tipSingle: number, dimensions: number) {
    return (
      this.fromPercent + ((this.toPercent - this.fromPercent) / 2)
      - ModelCalc.calcWidthPercent(tipSingle, dimensions)
    );
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

  // ---------------------------------- Snap
  toggleSnapMode() {
    if (!this.gridSnap || this.step) { return false; }

    this.from = ModelCalc.getSnap(this.from ?? 0, this.stepGrid, this.snapNumber);

    if (this.type === 'double') {
      this.to = ModelCalc.getSnap(this.to ?? 0, this.stepGrid, this.snapNumber);
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

  // ---------------------------------- Grid
  calcMark() {
    const marks: {
      value: number,
      position: number,
    }[] = [];

    const HUNDRED_PERCENT = 100;

    const notify = (valueGrid: number, position: number) => {
      marks.push({
        value: Number(valueGrid.toFixed(this.gridRound ?? 0)),
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
    notify(this.max ?? 0, HUNDRED_PERCENT);

    this.notifyObserver({
      key: 'CreateGrid',
      valueMark: marks,
    });

    return marks;
  }

  protected calcGridNumberStep() {
    let interval = 0;
    let step = 0;
    const gridNumber = this.gridNumber ?? 0;
    const MAX_VALUE = 500;
    const range = (this.max ?? 0) - (this.min ?? 0);

    const gridStep = !this.gridStep && !gridNumber ? this.step : this.gridStep;

    if (gridStep && !gridNumber) { // if STEP is defined and interval is set by default
      const MIN_VALUE = range / MAX_VALUE;
      step = gridStep > MIN_VALUE ? gridStep : MIN_VALUE;
      interval = this.getRange() / step; // define new interval
    } else { // calculate in line with interval
      interval = gridNumber < MAX_VALUE ? gridNumber : MAX_VALUE;
      step = range / interval; // define step
    }
    return { interval, step };
  }

  protected calcGridDimensions(value: number, step: number) {
    const shift = value + step;
    const HUNDRED_PERCENT = 100;
    return {
      value: shift,
      position: ((shift - (this.min ?? 0)) * HUNDRED_PERCENT) / this.getRange(),
    };
  }

  // ---------------------------------- Direction
  protected defineDirection(options: DirectionData) {
    const {
      from = 0,
      to = 0,
      isFrom = false,
      isTo = false,
    } = options;

    let signDirection = '';

    const fromValue = this.from ?? 0;
    const toValue = this.to ?? 0;

    const isRightFrom = fromValue < (from ?? 0) && isFrom;
    const isRightTo = toValue < (to ?? 0) && isTo;

    if (isRightFrom || isRightTo) signDirection = 'right';

    const isLeftFrom = fromValue > (from ?? 0) && isFrom;
    const isLeftTo = toValue > (to ?? 0) && isTo;

    if (isLeftFrom || isLeftTo) signDirection = 'left';

    if (signDirection === '') { return false; }

    return signDirection;
  }

  // ---------------------------------- KeyDown
  protected moveFromToOnKeyDownSnap(options: KeyDownSnap) {
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

        if (isEqual && isSign && type) { return false; }
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

  protected moveFromToOnKeyDownStep(options: KeyDownStep) {
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
      const length = trimFraction(step);
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
        const DEFAULT_KEY_STEP = 1;
        this.keyStepOne = DEFAULT_KEY_STEP;
      }

      if (!this.keyStepHold && this.keyStepOne) {
        this.keyStepHold = Number(this.keyStepOne.toFixed(
          trimFraction(this.keyStepOne),
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

  protected getStep(newValue: number) {
    const step = this.step ?? 0;
    const quotient = newValue / step;
    const isMultiple = quotient % step === 0;

    const trimNumber = (result: number) => Number(result.toFixed(trimFraction(step)));

    if (isMultiple) {
      return trimNumber(newValue);
    }

    const rangeFrom = Math.trunc(quotient) * step;
    const differenceFrom = newValue - rangeFrom;
    const halfStep = step / 2;

    return trimNumber(differenceFrom > halfStep ? rangeFrom + step : rangeFrom);
  }

  protected static calcWidthPercent(width: number, dimensions: number) {
    const HUNDRED_PERCENT = 100;
    return ((width * HUNDRED_PERCENT) / dimensions) / 2;
  }
}

export default ModelCalc;
