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

  // ---------------------------------- STEP
  calcStep() {
    if (!this.step) return false;

    const length = trimFraction(this.step);
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
      this.fromPercent
      + ((this.toPercent - this.fromPercent) / 2)
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
    if (!this.gridSnap) return false;

    this.from = ModelCalc.getValueStep(this.from ?? 0, this.stepGrid, this.snapNumber);

    if (this.type === 'double') {
      this.to = ModelCalc.getValueStep(this.to ?? 0, this.stepGrid, this.snapNumber);
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

  protected calcGridNumberStep() {
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

  protected calcGridDimensions(value: number, step: number) {
    const shift = value + step;
    return {
      value: shift,
      position: ((shift - (this.min ?? 0)) * 100) / this.getRange(),
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
        this.keyStepOne = 1;
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

  protected static calcWidthPercent(width: number, dimensions: number) {
    return ((width * 100) / dimensions) / 2;
  }
}

export default ModelCalc;
