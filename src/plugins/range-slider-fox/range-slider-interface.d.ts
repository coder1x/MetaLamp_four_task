
interface RangeSliderOptions {
  type?: string;
  orientation?: string;
  theme?: string;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number,
  keyStepOne?: number,
  keyStepHold?: number,
  bar?: boolean;
  grid?: boolean;
  gridSnap?: boolean;
  tipPrefix?: string;
  tipPostfix?: string;
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  gridNum?: number;
  gridStep?: number;
  gridRound?: number;
  disabled?: boolean;
  onStart?: Function;
  onChange?: Function;
  onUpdate?: Function;
  onReset?: Function;
}

interface RangeSliderFoxFunction {
  // eslint-disable-next-line no-unused-vars
  (options: RangeSliderOptions): JQuery;
}


interface RangeSliderFox extends
  RangeSliderFoxFunction { }


// eslint-disable-next-line no-unused-vars
interface JQuery {
  RangeSliderFox: RangeSliderFox;
}


