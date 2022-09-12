import { RangeSliderOptions } from '../../globInterface';
import Observer from '../../Observer';

import {
  PositionData,
} from './modelInterface';

interface insideOptions extends RangeSliderOptions {
  readonly valueMark?: {
    value: number;
    position: number;
  }[];
}

interface ObserverOptions extends insideOptions {
  readonly key: 'DotData' |
  'CreateGrid' |
  'Start' |
  'Step' |
  'RangeData' |
  'GridSnapData' |
  'GridData' |
  'OrientationData' |
  'ThemeData' |
  'HintsData' |
  'DisabledData' |
  'BarData';
}

class ModelData extends Observer<ObserverOptions> {
  // --- data config
  protected type: string | null = null;

  protected orientation: string | null = null;

  protected theme: string | null = null;

  min: number | null = null;

  max: number | null = null;

  from: number | null = null;

  to: number | null = null;

  step: number | null = null;

  keyStepOne: number | null = null;

  keyStepHold: number | null = null;

  protected bar: boolean | null = null;

  tipPrefix: string | null = null;

  tipPostfix: string | null = null;

  tipMinMax: boolean | null = null;

  tipFromTo: boolean | null = null;

  protected gridSnap: boolean | null = null;

  gridNumber: number | null = null;

  gridStep: number | null = null;

  gridRound: number | null = null;

  grid: boolean | null = null;

  protected disabled: boolean | null = null;

  protected defaultData: RangeSliderOptions | null = null;

  // --- internal data.
  protected valuePercent: number = 0;

  protected fromPercent: number = 0;

  protected toPercent: number = 0;

  protected limitFrom: number = 0;

  protected limitTo: number = 0;

  protected snapNumber: number[] = [];

  protected stepNumber: number[] = [];

  protected stepGrid: number = 0;

  protected maxValue = 999999999999999;

  protected minValue = -999999999999999;

  protected isStartedConfiguration: boolean = false;

  protected isUpdatedConfiguration: boolean = false;

  onHandle: (() => void) | null = null;

  onChange: ((data: RangeSliderOptions) => void) | null = null;

  onUpdate: ((data: RangeSliderOptions) => void) | null = null;

  onStart: ((data: RangeSliderOptions) => void) | null = null;

  onReset: ((data: RangeSliderOptions) => void) | null = null;

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

  protected setDefaultConfiguration(options: RangeSliderOptions) {
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

  protected checkIsValueInRange(value: number) {
    if (value <= this.getRange()) {
      return value;
    }
    return this.getRange();
  }

  protected static getSnap(value: number, step: number, items: number[]) {
    const index = items.findIndex((item) => value < item);

    if (index === -1) {
      return value;
    }
    const item = items[index];

    return (step - (item - value)) < step / 2
      ? items[index ? index - 1 : index] : item;
  }

  protected convertToPercent(options: PositionData) {
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
    const HUNDRED_PERCENT = 100;
    const percent = (number * HUNDRED_PERCENT) / dimensions;

    if (typeFrom) {
      this.limitFrom = percent;
    } else {
      this.limitTo = percent;
    }
    return percent;
  }

  protected getRange() {
    return (this.max ?? 0) - (this.min ?? 0);
  }

  protected getValueFrom(accuracy = 0) {
    return Number(((this.min ?? 0) + (this.fromPercent * this.valuePercent)).toFixed(accuracy));
  }

  protected getValueTo(accuracy = 0) {
    return Number(((this.min ?? 0) + (this.toPercent * this.valuePercent)).toFixed(accuracy));
  }

  protected checkIsFromToValid(typeFrom = false, percent = 0) {
    let isFrom = false;
    let isTo = false;

    if (this.type === 'single') { // if single dot
      this.fromPercent = percent;
      return { isFrom: true, isTo };
    }

    const setFromToPercent = (value: number) => {
      if (typeFrom) {
        this.fromPercent = value;
        isFrom = true;
      } else {
        this.toPercent = value;
        isTo = true;
      }
      return { isFrom, isTo };
    };

    if (this.limitFrom < this.limitTo) { // if double dot and FROM is less than TO
      return setFromToPercent(percent);
    }

    return setFromToPercent(typeFrom ? this.toPercent : this.fromPercent);
  }
}

export default ModelData;
